# The AGE — プロトタイプ

過去の自分や、ある時代の誰かと対話できる日記アプリのプロトタイプです。

## ローカルで動かす

```bash
npm install
npm run dev
```

チャット機能をローカルで試す場合は Netlify CLI を使います（サーバー関数を動かすため）:

```bash
npm install -g netlify-cli
netlify dev
```

## Netlify に公開する（審査員が QR で体験できる形）

1. このフォルダを GitHub にアップロードする（または Netlify に直接ドラッグ＆ドロップ）。
2. Netlify でこのリポジトリ／フォルダから新しいサイトを作成する。
   - Build command: `npm run build`
   - Publish directory: `dist`
   - （netlify.toml に設定済みなので自動で読み込まれます）
3. 環境変数を 1 つだけ設定する:
   - Site settings -> Environment variables -> Add a variable
   - Key: ANTHROPIC_API_KEY
   - Value: 取得した API キー
4. デプロイすると https://<あなたのサイト名>.netlify.app が発行されます。
   この URL を QR コードにしてコンセプトシートに貼れば、審査員はブラウザで体験できます。

## 仕組み（裏側）

チャットの応答生成はサーバー側の関数（netlify/functions/chat.js）で処理しているため、
API キーはブラウザに一切出ません。審査員の画面には外部サービス名も表示されません。
