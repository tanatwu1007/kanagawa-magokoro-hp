import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cases } from "@/data/cases";
import { CaseImage } from "./case-image";
import { LINE_URL, TEL_HREF, INSTAGRAM_URL } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = cases.find((c) => c.slug === slug);
  if (!c) return {};
  return {
    title: `${c.title}の作業事例｜神奈川まごころ整理センター`,
    description: `${c.area}の${c.layout}で${c.service}を行った事例。${c.volume}、作業時間${c.duration}、お支払い${c.priceTotal.toLocaleString()}円。ビフォーアフター写真あり。`,
  };
}

function formatPrice(n: number) {
  return n.toLocaleString("ja-JP");
}

export default async function CaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const c = cases.find((c) => c.slug === slug);
  if (!c) notFound();

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
          {" > "}
          <Link href="/cases" style={{ color: "var(--navy)" }}>
            作業事例
          </Link>
          {" > "}
          {c.title}
        </nav>
      </div>

      <article className="section" style={{ background: "#fff" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          {/* タイトル */}
          <p
            className="tag"
            style={{ marginBottom: 8 }}
          >
            {c.service}
          </p>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "var(--navy)",
              marginBottom: 8,
              lineHeight: 1.4,
            }}
          >
            {c.title}
          </h1>
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--gray)",
              marginBottom: 32,
            }}
          >
            作業日：{c.date}
          </p>

          {/* 作業写真（Instagramから自動取得） */}
          <CaseImage
            igIndex={c.instagramIndex}
            fallback={c.fallbackImage}
            alt={`${c.title} 作業写真`}
          />

          {/* 基本情報 */}
          <h2
            style={{
              fontSize: "1.15rem",
              fontWeight: 900,
              color: "var(--navy)",
              marginBottom: 16,
              borderLeft: "4px solid var(--orange)",
              paddingLeft: 12,
            }}
          >
            作業概要
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 32,
              fontSize: "0.92rem",
            }}
          >
            <tbody>
              {[
                ["エリア", c.area],
                ["間取り", c.layout],
                ["荷物量", c.volume],
                ["作業人数", `${c.staff}名`],
                ["作業時間", c.duration],
              ].map(([label, value]) => (
                <tr key={label}>
                  <th
                    style={{
                      background: "var(--beige)",
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 700,
                      color: "var(--navy)",
                      width: "35%",
                      borderBottom: "1px solid #e0d8d0",
                    }}
                  >
                    {label}
                  </th>
                  <td
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 料金内訳 */}
          <h2
            style={{
              fontSize: "1.15rem",
              fontWeight: 900,
              color: "var(--navy)",
              marginBottom: 16,
              borderLeft: "4px solid var(--orange)",
              paddingLeft: 12,
            }}
          >
            料金内訳
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 12,
              fontSize: "0.92rem",
            }}
          >
            <tbody>
              <tr>
                <th
                  style={{
                    background: "var(--beige)",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "var(--navy)",
                    width: "35%",
                    borderBottom: "1px solid #e0d8d0",
                  }}
                >
                  作業料金（税込）
                </th>
                <td
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {formatPrice(c.priceWork)}円
                </td>
              </tr>
              <tr>
                <th
                  style={{
                    background: "var(--beige)",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "var(--navy)",
                    width: "35%",
                    borderBottom: "1px solid #e0d8d0",
                  }}
                >
                  買取額
                </th>
                <td
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #eee",
                    color: c.priceBuyback > 0 ? "var(--green)" : "var(--gray)",
                  }}
                >
                  {c.priceBuyback > 0
                    ? `−${formatPrice(c.priceBuyback)}円`
                    : "なし"}
                </td>
              </tr>
              <tr>
                <th
                  style={{
                    background: "var(--navy)",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 900,
                    color: "#fff",
                    width: "35%",
                  }}
                >
                  お支払い総額
                </th>
                <td
                  style={{
                    padding: "12px 16px",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    color: "var(--orange)",
                    borderBottom: "2px solid var(--navy)",
                  }}
                >
                  {formatPrice(c.priceTotal)}円
                </td>
              </tr>
            </tbody>
          </table>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--gray)",
              marginBottom: 40,
            }}
          >
            ※料金は作業当時のものです。荷物量や作業内容により変動します。
          </p>

          {/* 依頼の背景 */}
          <h2
            style={{
              fontSize: "1.15rem",
              fontWeight: 900,
              color: "var(--navy)",
              marginBottom: 16,
              borderLeft: "4px solid var(--orange)",
              paddingLeft: 12,
            }}
          >
            ご依頼の背景
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.85,
              color: "#444",
              marginBottom: 32,
            }}
          >
            {c.background}
          </p>

          {/* 対応した工夫 */}
          <h2
            style={{
              fontSize: "1.15rem",
              fontWeight: 900,
              color: "var(--navy)",
              marginBottom: 16,
              borderLeft: "4px solid var(--orange)",
              paddingLeft: 12,
            }}
          >
            対応した工夫
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.85,
              color: "#444",
              marginBottom: 48,
            }}
          >
            {c.effort}
          </p>

          {/* 一覧に戻る */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <Link
              href="/cases"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                border: "2px solid var(--navy)",
                borderRadius: 10,
                color: "var(--navy)",
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              作業事例一覧に戻る
            </Link>
          </div>
        </div>
      </article>

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
              fontSize: "1.2rem",
              fontWeight: 900,
              marginBottom: 8,
            }}
          >
            同じような状況でお困りですか？
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.88rem",
              marginBottom: 24,
            }}
          >
            お見積もり・ご相談は無料です。お気軽にお問い合わせください。
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
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
            <a
              href="/privacy.html"
              style={{ color: "#888", textDecoration: "underline" }}
            >
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
