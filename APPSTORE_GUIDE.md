# 浮世絵アート - App Store 公開手順

## アプリ概要
- **アプリ名**: 浮世絵アート
- **Bundle ID**: com.ukiyoe.artapp
- **カテゴリ**: エンターテインメント / 写真・ビデオ
- **対応**: iOS 14.0+

## 技術スタック
- React 19 + TypeScript + Vite (PWA)
- Capacitor 6 (iOS ネイティブ変換)
- Stability AI / Replicate API (AI画像変換)

---

## 開発ワークフロー

### 1. Webアプリのビルド
```bash
cd app
npm run build
```

### 2. iOSプロジェクトの同期
```bash
npx cap sync ios
```

### 3. Xcodeで開く
```bash
npx cap open ios
```

---

## App Store 公開手順

### 前提条件
- Apple Developer Program メンバーシップ ($99/年)
- Mac + Xcode 15+
- App Store Connect アカウント

### 手順

1. **Xcodeで Bundle ID を設定**
   - `App > Signing & Capabilities` を開く
   - Team を選択
   - Bundle Identifier: `com.ukiyoe.artapp`

2. **アプリアイコン設定**
   - `App/App/Assets.xcassets/AppIcon.appiconset` にアイコンを配置
   - 必要サイズ: 1024×1024px (App Store用), 各種iOSサイズ

3. **スプラッシュスクリーン**
   - `ios/App/App/Assets.xcassets/Splash.imageset` を設定

4. **バージョン設定**
   - Marketing Version: 1.0.0
   - Build Number: 1

5. **Archive & Upload**
   - `Product > Archive`
   - `Distribute App > App Store Connect`

6. **App Store Connect で申請**
   - スクリーンショット (iPhone 6.7", 6.5", 5.5")
   - アプリ説明文、キーワード設定
   - プライバシーポリシーURL
   - 審査提出

---

## APIキー設定 (ユーザー向け)

アプリ内の設定画面でAPIキーを入力:

### Stability AI (推奨)
1. https://platform.stability.ai でアカウント作成
2. API Keys ページでキーを生成
3. アプリ設定画面に入力

### Replicate
1. https://replicate.com でアカウント作成
2. Account Settings > API Tokens
3. アプリ設定画面に入力

---

## プライバシーポリシー必須項目 (App Store審査)
- カメラ使用目的
- フォトライブラリ使用目的
- AI APIへの画像送信について
- データの保存・削除について
