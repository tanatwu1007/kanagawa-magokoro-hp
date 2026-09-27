import { NextResponse } from "next/server";
import { fetchInstagramPosts } from "@/lib/instagram";

export const revalidate = 3600; // 1時間キャッシュ

export async function GET() {
  const posts = await fetchInstagramPosts(12);
  return NextResponse.json(posts);
}
