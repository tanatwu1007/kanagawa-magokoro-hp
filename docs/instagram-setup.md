# Instagram ギャラリー セットアップ手順

## 概要
トップページの「現場の様子」セクションは、Instagram Graph API から最新12件の投稿を取得して表示します。
トークンが未設定の場合はセクション自体が非表示になり、サイトの動作に影響しません。

---

## 1. Instagram ビジネスアカウントの準備

1. Instagram アカウント（@kanagawa.magokoro）を **ビジネスアカウント** または **クリエイターアカウント** に切り替える
2. Facebook ページと連携する（Instagram の設定 > アカウント > リンク済みアカウント）

## 2. Meta 開発者アカウントの作成

1. [Meta for Developers](https://developers.facebook.com/) にアクセス
2. Facebook アカウントでログインし、開発者登録する
3. 「マイアプリ」から新しいアプリを作成
   - タイプ：**ビジネス**
   - アプリ名：例「まごころHP Instagram連携」

## 3. Instagram Graph API のセットアップ

1. アプリダッシュボード → 「製品を追加」→ **Instagram Graph API** を追加
2. 左メニュー「ツール」→ **Graph API エクスプローラー** を開く
3. 以下の権限を選択：
   - `instagram_basic`
   - `pages_show_list`
   - `pages_read_engagement`
4. 「Generate Access Token」をクリックし、短期トークンを取得

## 4. 長期トークンへの変換

短期トークン（有効期限1時間）を長期トークン（60日）に変換します。

```bash
# App ID と App Secret はアプリダッシュボードの「設定 > 基本」から確認
curl -s "https://graph.facebook.com/v21.0/oauth/access_token?\
grant_type=fb_exchange_token&\
client_id=YOUR_APP_ID&\
client_secret=YOUR_APP_SECRET&\
fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
```

レスポンスの `access_token` が長期トークンです。

## 5. Instagram ユーザーIDの取得

```bash
curl -s "https://graph.instagram.com/me?fields=id,username&access_token=YOUR_LONG_LIVED_TOKEN"
```

レスポンスの `id` がユーザーIDです。

## 6. Vercel 環境変数の登録

Vercel ダッシュボード → プロジェクト → Settings → Environment Variables に以下を追加：

| 変数名 | 値 | 環境 |
|--------|------|------|
| `INSTAGRAM_ACCESS_TOKEN` | 取得した長期トークン | Production, Preview |
| `INSTAGRAM_USER_ID` | 取得したユーザーID | Production, Preview |
| `CRON_SECRET` | 任意のランダム文字列（Cron認証用） | Production |

```bash
# CLIで登録する場合
npx vercel env add INSTAGRAM_ACCESS_TOKEN production preview
npx vercel env add INSTAGRAM_USER_ID production preview
npx vercel env add CRON_SECRET production
```

## 7. 動作確認

1. Vercel にデプロイ
2. トップページの「現場の様子」セクションに写真が表示されることを確認
3. 写真をクリックしてモーダルが開くことを確認

## 8. トークン自動更新

- `vercel.json` に月1回（毎月1日 AM3:00 UTC）のCronジョブを設定済み
- `/api/instagram/refresh` がトークンを自動更新
- 更新結果は Vercel の Function Logs で確認可能
- **注意**: 現在の実装ではトークンをログ出力するのみ。本格運用では Vercel KV や環境変数 API での自動保存を推奨（route.ts のコメント参照）

## トラブルシューティング

| 症状 | 原因 | 対処 |
|------|------|------|
| ギャラリーが表示されない | トークン未設定 or 失効 | 環境変数を確認、再発行 |
| 一部の投稿が表示されない | リール動画のサムネイル取得失敗 | Instagram側の問題、待機 |
| モーダルが開かない | JS エラー | ブラウザのコンソールを確認 |
