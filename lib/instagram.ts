export type InstagramPost = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url: string;
  permalink: string;
  timestamp: string;
};

const BEHOLD_FEED_ID = "nBbNqUxj2w7NJqU2HLSj";

/**
 * Behold 経由で Instagram 投稿を取得する。
 * Instagram CDN の URL は期限切れになるため、
 * Behold 独自 CDN (behold.pictures) のリサイズ済み URL を使用する。
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
    const posts = (json.posts ?? []) as Array<Record<string, unknown>>;

    return posts.slice(0, limit).map((p) => {
      // Behold CDN の medium サイズ画像を優先（700x700、期限切れなし）
      const sizes = (p.sizes as Record<string, Record<string, unknown>>) ?? {};
      const medium = sizes.medium ?? sizes.small ?? {};
      const beholdUrl = medium.mediaUrl as string | undefined;

      return {
        id: p.id as string,
        caption: p.prunedCaption as string | undefined,
        media_type: p.mediaType as string | undefined,
        media_url: beholdUrl || (p.mediaUrl as string),
        permalink: p.permalink as string,
        timestamp: p.timestamp as string,
      };
    });
  } catch (err) {
    console.error("[Instagram/Behold] fetch failed:", err);
    return [];
  }
}

/**
 * 表示用の URL を返す。
 */
export function getDisplayUrl(post: InstagramPost): string {
  return post.media_url;
}
