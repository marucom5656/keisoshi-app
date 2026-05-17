import type { UkiyoeStyle, ApiSettings } from '../types';
import { UKIYOE_STYLES } from './styles';

function getStylePrompt(style: UkiyoeStyle): string {
  return UKIYOE_STYLES.find(s => s.id === style)?.prompt ?? UKIYOE_STYLES[0].prompt;
}

export async function convertToUkiyoe(
  imageBase64: string,
  style: UkiyoeStyle,
  settings: ApiSettings
): Promise<string> {
  if (!settings.apiKey) {
    throw new Error('APIキーが設定されていません。設定画面でAPIキーを入力してください。');
  }

  if (settings.provider === 'stability') {
    return convertWithStability(imageBase64, style, settings);
  }
  return convertWithReplicate(imageBase64, style, settings);
}

async function convertWithStability(
  imageBase64: string,
  style: UkiyoeStyle,
  settings: ApiSettings
): Promise<string> {
  const blob = base64ToBlob(imageBase64, 'image/png');
  const prompt = getStylePrompt(style);

  const formData = new FormData();
  formData.append('image', blob, 'input.png');
  formData.append('prompt', prompt);
  formData.append('mode', 'image-to-image');
  formData.append('strength', String(settings.strength));
  formData.append('output_format', 'jpeg');
  formData.append('negative_prompt', 'photorealistic, modern, western art, photography, 3d render, blurry');

  const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/sd3', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      Accept: 'image/*',
    },
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Stability AI エラー (${response.status}): ${errText}`);
  }

  const resultBlob = await response.blob();
  return blobToBase64(resultBlob);
}

async function convertWithReplicate(
  imageBase64: string,
  style: UkiyoeStyle,
  settings: ApiSettings
): Promise<string> {
  const prompt = getStylePrompt(style);

  const startResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${settings.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      input: {
        image: `data:image/png;base64,${imageBase64}`,
        prompt,
        prompt_strength: settings.strength,
        negative_prompt: 'photorealistic, modern, western art, photography, 3d render',
        num_inference_steps: 30,
      },
    }),
  });

  if (!startResponse.ok) {
    throw new Error(`Replicate エラー (${startResponse.status})`);
  }

  const prediction = await startResponse.json() as { id: string; status: string; output?: string[] };

  // Poll for result
  for (let i = 0; i < 60; i++) {
    await delay(2000);
    const pollResponse = await fetch(
      `https://api.replicate.com/v1/predictions/${prediction.id}`,
      { headers: { Authorization: `Token ${settings.apiKey}` } }
    );
    const result = await pollResponse.json() as { status: string; output?: string[]; error?: string };

    if (result.status === 'succeeded' && result.output?.[0]) {
      const imgResponse = await fetch(result.output[0]);
      const blob = await imgResponse.blob();
      return blobToBase64(blob);
    }
    if (result.status === 'failed') {
      throw new Error(`Replicate 変換失敗: ${result.error ?? '不明なエラー'}`);
    }
  }

  throw new Error('変換タイムアウト。もう一度お試しください。');
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const cleanB64 = base64.replace(/^data:[^;]+;base64,/, '');
  const bytes = atob(cleanB64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mimeType });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
