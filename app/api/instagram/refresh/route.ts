import { NextResponse } from "next/server";

/**
 * Instagram 長期トークンの更新 Route Handler
 *
 * Instagram Graph API の長期トークンは60日で失効するため、
 * Vercel Cron で月1回このエンドポイントを叩いてトークンを更新する。
 *
 * --- トークン保存先の方針（提案） ---
 * 現在の実装では環境変数から読み取り、更新後のトークンをログ出力します。
 * 本格運用では以下のいずれかを推奨：
 *
 * 1. Vercel KV / Redis に保存
 *    - fetch時にKVから取得、refresh時にKVに書き込み
 *    - 環境変数の手動更新が不要
 *
 * 2. Vercel API で環境変数を自動更新
 *    - VERCEL_TOKEN + VERCEL_PROJECT_ID を使って
 *      PATCH /v10/projects/:id/env/:envId で上書き
 *    - 再デプロイが必要（Redeploy Hookと組み合わせ）
 *
 * 3. 手動更新（最小構成）
 *    - このエンドポイントが新トークンをログ出力
 *    - Vercel Dashboard から手動で環境変数を差し替え
 * ---
 */
export async function GET(request: Request) {
  // Cron認証: Vercel CronはAuthorization headerにBearerトークンを送る
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!currentToken) {
    return NextResponse.json(
      { error: "INSTAGRAM_ACCESS_TOKEN not set" },
      { status: 500 }
    );
  }

  try {
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;
    const res = await fetch(url);

    if (!res.ok) {
      const body = await res.text();
      console.error("[Instagram Refresh] API error:", res.status, body);
      return NextResponse.json(
        { error: "Token refresh failed", detail: body },
        { status: 502 }
      );
    }

    const data = await res.json();
    const newToken: string = data.access_token;
    const expiresIn: number = data.expires_in; // 秒

    console.log(
      `[Instagram Refresh] Token refreshed. Expires in ${Math.round(expiresIn / 86400)} days.`
    );
    // 本格運用時はここでKVや環境変数APIに保存する
    console.log(
      `[Instagram Refresh] New token (先頭20文字): ${newToken.slice(0, 20)}...`
    );

    return NextResponse.json({
      ok: true,
      expires_in_days: Math.round(expiresIn / 86400),
    });
  } catch (err) {
    console.error("[Instagram Refresh] Error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
