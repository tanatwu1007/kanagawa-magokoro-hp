import { NextResponse } from "next/server";

const BEHOLD_FEED_ID = "nBbNqUxj2w7NJqU2HLSj";

// フィードデータをメモリキャッシュ（サーバーレス関数の寿命内で再利用）
let feedCache: { data: Record<string, unknown>[]; ts: number } | null = null;
const CACHE_TTL = 3600_000; // 1時間

async function getFeed(): Promise<Record<string, unknown>[]> {
  if (feedCache && Date.now() - feedCache.ts < CACHE_TTL) {
    return feedCache.data;
  }
  const res = await fetch(`https://feeds.behold.so/${BEHOLD_FEED_ID}`);
  if (!res.ok) return [];
  const json = await res.json();
  const posts = (json.posts ?? []) as Record<string, unknown>[];
  feedCache = { data: posts, ts: Date.now() };
  return posts;
}

/**
 * Instagram画像プロキシ
 * /api/instagram/image/0 → フィードの1番目の投稿画像をプロキシ配信
 *
 * Behold CDN (behold.pictures) の画像をVercelサーバー経由で取得し、
 * クライアントに配信する。CDN Edge Cache (s-maxage) で24時間キャッシュ。
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ index: string }> }
) {
  const { index } = await params;
  const idx = parseInt(index, 10);
  if (isNaN(idx) || idx < 0 || idx > 20) {
    return NextResponse.json({ error: "Invalid index" }, { status: 400 });
  }

  const posts = await getFeed();
  const post = posts[idx];
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Behold CDN の medium サイズ画像 URL を取得
  const sizes = (post.sizes as Record<string, Record<string, unknown>>) ?? {};
  const medium = sizes.medium ?? sizes.small ?? {};
  const imageUrl = (medium.mediaUrl as string) || (post.mediaUrl as string);

  if (!imageUrl) {
    return NextResponse.json({ error: "No image URL" }, { status: 404 });
  }

  try {
    const imgRes = await fetch(imageUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(15000),
    });

    if (!imgRes.ok) {
      return NextResponse.json(
        { error: `Upstream ${imgRes.status}` },
        { status: 502 }
      );
    }

    const buffer = await imgRes.arrayBuffer();
    const contentType = imgRes.headers.get("content-type") || "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
  }
}
