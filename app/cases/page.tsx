import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cases } from "@/data/cases";
import { LINE_URL, TEL_HREF, INSTAGRAM_URL } from "@/lib/constants";
import { CaseFilter } from "./case-filter";

export const metadata: Metadata = {
  title: "作業事例一覧｜神奈川まごころ整理センター",
  description:
    "神奈川まごころ整理センターの実際の作業事例を写真付きで紹介。不用品回収・遺品整理・残置物撤去のビフォーアフター、料金、作業時間がわかります。",
};

function formatPrice(n: number) {
  return n.toLocaleString("ja-JP");
}

export default function CasesPage() {
  return (
    <>
      {/* ヘッダー */}
      <header
        style={{
          background: "var(--navy)",
          color: "#fff",
          padding: "14px 0",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            style={{ color: "#fff", fontWeight: 900, fontSize: "1rem" }}
          >
            神奈川まごころ整理センター
          </Link>
          <a
            href={TEL_HREF}
            style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}
          >
            0120-437-599
          </a>
        </div>
      </header>

      {/* パンくず */}
      <div className="container" style={{ padding: "16px 20px 0" }}>
        <nav style={{ fontSize: "0.82rem", color: "var(--gray)" }}>
          <Link href="/" style={{ color: "var(--navy)" }}>
            トップ
          </Link>
          {" > "}作業事例一覧
        </nav>
      </div>

      {/* メインコンテンツ */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container">
          <p className="tag">施工事例</p>
          <h1 className="section-title">作業事例一覧</h1>
          <p className="section-sub">
            実際の現場のビフォーアフター・料金・作業時間をご覧いただけます
          </p>

          <CaseFilter cases={cases} />
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "var(--navy)",
          padding: "48px 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2
            style={{
              color: "#fff",
              fontSize: "1.3rem",
              fontWeight: 900,
              marginBottom: 20,
            }}
          >
            お見積もり・ご相談は無料です
          </h2>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={TEL_HREF}
              style={{
                background: "var(--orange)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              0120-437-599
            </a>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener"
              style={{
                background: "#06C755",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              LINEで無料相談
            </a>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer>
        <div className="container">
          <p
            style={{
              fontSize: "1rem",
              color: "#ccc",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            神奈川まごころ整理センター
          </p>
          <p>〒242-0002 神奈川県大和市福田5丁目4-11</p>
          <p style={{ marginTop: 12 }}>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener"
              style={{ color: "#ccc", marginRight: 16 }}
            >
              Instagram
            </a>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener"
              style={{ color: "#ccc", marginRight: 16 }}
            >
              LINE
            </a>
            <a href="/privacy.html" style={{ color: "#888", textDecoration: "underline" }}>
              プライバシーポリシー
            </a>
          </p>
          <p style={{ marginTop: 10 }}>
            &copy; 2026 神奈川まごころ整理センター All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
