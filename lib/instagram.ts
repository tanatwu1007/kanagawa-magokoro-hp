export type InstagramPost = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

/**
 * Instagram Graph API から最新投稿を取得する。
 * 環境変数が未設定・APIエラー時は空配列を返し、ビルドを壊さない。
 */
export async function fetchInstagramPosts(
  limit = 12
): Promise<InstagramPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    console.log(
      "[Instagram] INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID not set — skipping"
    );
    return [];
  }

  const fields =
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`[Instagram] API error: ${res.status} ${res.statusText}`);
      return [];
    }
    const json = await res.json();
    return (json.data ?? []) as InstagramPost[];
  } catch (err) {
    console.error("[Instagram] fetch failed:", err);
    return [];
  }
}

/**
 * 表示用のURL を返す。動画はサムネイル、カルーセルは1枚目。
 */
export function getDisplayUrl(post: InstagramPost): string {
  if (post.media_type === "VIDEO" && post.thumbnail_url) {
    return post.thumbnail_url;
  }
  return post.media_url;
}
