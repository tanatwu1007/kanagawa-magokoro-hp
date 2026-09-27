"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Case } from "@/data/cases";

function formatPrice(n: number) {
  return n.toLocaleString("ja-JP");
}

const services = ["すべて", "不用品回収", "遺品整理", "残置物撤去", "出張買取"] as const;

export function CaseFilter({ cases }: { cases: Case[] }) {
  const [filter, setFilter] = useState<string>("すべて");
  const filtered = filter === "すべて" ? cases : cases.filter((c) => c.service === filter);

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
          <CaseCard key={c.id} c={c} />
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

function CaseCard({ c }: { c: Case }) {
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
      {/* ビフォー・アフター写真 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ position: "relative", aspectRatio: "4/3" }}>
          <Image
            src={c.beforeImage}
            alt={`${c.title} Before`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 50vw, 200px"
          />
          <span
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              fontSize: "0.72rem",
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            Before
          </span>
        </div>
        <div style={{ position: "relative", aspectRatio: "4/3" }}>
          <Image
            src={c.afterImage}
            alt={`${c.title} After`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 50vw, 200px"
          />
          <span
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: "var(--orange)",
              color: "#fff",
              fontSize: "0.72rem",
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            After
          </span>
        </div>
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
