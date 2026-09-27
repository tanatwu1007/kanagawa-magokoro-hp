export type InstagramPost = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

const BEHOLD_FEED_ID = "nBbNqUxj2w7NJqU2HLSj";

/**
 * Behold 経由で Instagram 投稿を取得する。
 * Behold は既存の Instagram 連携サービスで、認証トークン不要で使える。
 * API エラー時は空配列を返し、ビルドとページ表示を壊さない。
 */
export async function fetchInstagramPosts(
  limit = 12
): Promise<InstagramPost[]> {
  try {
    const res = await fetch(
      `https://feeds.behold.so/${BEHOLD_FEED_ID}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      console.error(`[Instagram/Behold] API error: ${res.status}`);
      return [];
    }
    const json = await res.json();
    const posts = (json.posts ?? []) as Array<{
      id: string;
      prunedCaption?: string;
      mediaUrl: string;
      thumbnailUrl?: string;
      permalink: string;
      timestamp: string;
      mediaType?: string;
    }>;

    return posts.slice(0, limit).map((p) => ({
      id: p.id,
      caption: p.prunedCaption,
      media_type: p.mediaType,
      media_url: p.mediaUrl,
      thumbnail_url: p.thumbnailUrl,
      permalink: p.permalink,
      timestamp: p.timestamp,
    }));
  } catch (err) {
    console.error("[Instagram/Behold] fetch failed:", err);
    return [];
  }
}

/**
 * 表示用の URL を返す。動画はサムネイル、それ以外は media_url。
 */
export function getDisplayUrl(post: InstagramPost): string {
  if (post.media_type === "VIDEO" && post.thumbnail_url) {
    return post.thumbnail_url;
  }
  return post.media_url;
}
