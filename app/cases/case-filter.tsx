"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Case } from "@/data/cases";

function formatPrice(n: number) {
  return n.toLocaleString("ja-JP");
}

const services = ["すべて", "不用品回収", "遺品整理", "残置物撤去", "出張買取"] as const;

type IgPost = {
  media_url: string;
  thumbnail_url?: string;
  media_type: string;
};

export function CaseFilter({ cases }: { cases: Case[] }) {
  const [filter, setFilter] = useState<string>("すべて");
  const [igPosts, setIgPosts] = useState<IgPost[]>([]);
  const filtered = filter === "すべて" ? cases : cases.filter((c) => c.service === filter);

  useEffect(() => {
    fetch("/api/instagram/feed")
      .then((r) => (r.ok ? r.json() : []))
      .then((posts: IgPost[]) => setIgPosts(posts))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* フィルターボタン */}
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 40,
        }}
      >
        {services.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "2px solid var(--navy)",
              background: filter === s ? "var(--navy)" : "#fff",
              color: filter === s ? "#fff" : "var(--navy)",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* カード一覧 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 28,
        }}
      >
        {filtered.map((c) => (
          <CaseCard key={c.id} c={c} igPosts={igPosts} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--gray)", marginTop: 40 }}>
          該当する事例はまだありません。
        </p>
      )}
    </>
  );
}

function getImageUrl(c: Case, igPosts: IgPost[]): string {
  const post = igPosts[c.instagramIndex];
  if (post) {
    return post.media_type === "VIDEO" && post.thumbnail_url
      ? post.thumbnail_url
      : post.media_url;
  }
  return c.fallbackImage;
}

function CaseCard({ c, igPosts }: { c: Case; igPosts: IgPost[] }) {
  const imgUrl = getImageUrl(c, igPosts);

  return (
    <Link
      href={`/cases/${c.slug}`}
      style={{
        display: "block",
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
    >
      {/* 写真 */}
      <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
        <img
          src={imgUrl}
          alt={c.title}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* 情報 */}
      <div style={{ padding: "16px 20px 20px" }}>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--orange)",
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          {c.service}
        </p>
        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: 900,
            color: "var(--navy)",
            marginBottom: 12,
          }}
        >
          {c.title}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px 16px",
            fontSize: "0.82rem",
            color: "#555",
          }}
        >
          <span>📍 {c.area}</span>
          <span>🏠 {c.layout}</span>
          <span>👷 {c.staff}名</span>
          <span>⏱ {c.duration}</span>
        </div>
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span style={{ fontSize: "0.82rem", color: "var(--gray)" }}>
            お支払い総額
          </span>
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: 900,
              color: "var(--orange)",
            }}
          >
            {formatPrice(c.priceTotal)}
            <span style={{ fontSize: "0.82rem" }}>円</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
