import { useRef, useState, useCallback, useEffect } from 'react';
import type { DrawingTool } from '../types';

const MAX_HISTORY = 30;

export function useDrawing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef(-1);

  const [tool, setTool] = useState<DrawingTool>({
    type: 'pen',
    size: 8,
    color: '#1a1a1a',
    opacity: 1,
  });
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d', { willReadFrequently: true });
  }, []);

  const saveHistory = useCallback(() => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const idx = historyIndexRef.current + 1;
    historyRef.current = historyRef.current.slice(0, idx);
    historyRef.current.push(imageData);
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current.shift();
    } else {
      historyIndexRef.current = historyRef.current.length - 1;
    }
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, [getCtx]);

  const initCanvas = useCallback(() => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#f5f0e8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  }, [getCtx, saveHistory]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const getCanvasPoint = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const startDrawing = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;

    isDrawingRef.current = true;
    const point = getCanvasPoint(e);
    lastPointRef.current = point;

    ctx.globalAlpha = tool.type === 'eraser' ? 1 : tool.opacity;
    ctx.globalCompositeOperation = tool.type === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = tool.color;
    ctx.lineWidth = tool.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.arc(point.x, point.y, tool.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool.type === 'eraser' ? 'rgba(0,0,0,1)' : tool.color;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  }, [getCtx, getCanvasPoint, tool]);

  const draw = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawingRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;

    const point = getCanvasPoint(e);
    const last = lastPointRef.current;
    if (!last) return;

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }, [getCtx, getCanvasPoint]);

  const stopDrawing = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    const ctx = getCtx();
    if (ctx) {
      ctx.closePath();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    saveHistory();
  }, [getCtx, saveHistory]);

  const undo = useCallback(() => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas || historyIndexRef.current <= 0) return;

    historyIndexRef.current -= 1;
    ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
  }, [getCtx]);

  const redo = useCallback(() => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas || historyIndexRef.current >= historyRef.current.length - 1) return;

    historyIndexRef.current += 1;
    ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, [getCtx]);

  const clear = useCallback(() => {
    initCanvas();
    historyRef.current = [];
    historyIndexRef.current = -1;
    setCanUndo(false);
    setCanRedo(false);
    setTimeout(saveHistory, 0);
  }, [initCanvas, saveHistory]);

  const getImageBase64 = useCallback((): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL('image/png');
  }, []);

  return {
    canvasRef,
    tool,
    setTool,
    canUndo,
    canRedo,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    clear,
    getImageBase64,
  };
}
