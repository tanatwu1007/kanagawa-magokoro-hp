#!/bin/bash
# =====================================================
# まごころ整理センター｜週次ブログ自動生成スクリプト
# 使い方：bash weekly.sh
# =====================================================

set -e
REPO="/Users/itsuki/Desktop/lp-team"
cd "$REPO"

# ── 次の未着手キーワードを取得 ─────────────────────
KEYWORD=$(grep -E "^[0-9]+\." keyword-queue.md \
  | grep -v "\[済" \
  | head -1 \
  | sed 's/^[0-9]*\. //' \
  | sed 's/ *\[済.*$//')

if [ -z "$KEYWORD" ]; then
  echo "❌ 未着手のキーワードがありません。keyword-queue.md を確認してください。"
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔑 今週のキーワード：$KEYWORD"
echo "📁 リポジトリ：$REPO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── Claude Codeへの指示を組み立て ───────────────────
PROMPT="/Users/itsuki/Desktop/lp-team で以下の作業をすべて自動で行ってください。

【ターゲットキーワード】：${KEYWORD}

作業開始前に必ず以下のファイルを読んでください：
- magokoro-knowledge.md（会社情報・サービス・実績）
- article-prompt.md（記事生成ルール・HTML構造）
- review-rubric.md（品質採点ルーブリック）

════════════════════════════════
■ フェーズ1：記事を生成する
════════════════════════════════

以下をすべて満たす記事HTMLを作成してください。

- ターゲットキーワードに最適なファイル名（英数字ハイフンのみ）とカテゴリを決定する
- blog/[ファイル名].html を blog/fuyo-cost.html と完全に同じHTML構造で作成
- article-prompt.md の記事構成テンプレート・SEOルール・AI臭排除ルールをすべて適用
- 文字数2,000字以上・ですます調
- ターゲットキーワードを title・h1・h2・メタディスクリプションに必ず含める
- 料金表（price-table）と比較表または情報ボックスを各1つ以上入れる
- 関連記事リンク3本（blog/fuyo-cost.html・blog/gomiyashiki.html・blog/ihin-timing.htmlから選ぶ）
- CTA：電話 0120-437-599 と LINE https://lin.ee/Gf8Or5r を記事中とarticle-ctaブロックに入れる
- エリアが特定できる記事なら /area/[エリア名].html への内部リンクを入れる

════════════════════════════════
■ フェーズ2：チームによる品質レビュー（80点以上まで繰り返す）
════════════════════════════════

CLAUDE.mdに定義された世界No.1チームの各専門家として、review-rubric.md の採点基準に従い記事を採点してください。

【採点担当】
- 🚀 SEO/MEO/LLMエキスパート → 【A】SEO基本品質（20点）
- ✍️ コピーライター → 【B】コンテンツ品質（20点）
- 📈 CROスペシャリスト → 【C】CRO/CV設計（15点）
- 📍 ローカルSEO専門家 → 【D】ローカルSEO（15点）
- 💻 エンジニア＋♿ アクセシビリティ担当 → 【E】HTML構造（15点）
- 🤖 LLMOスペシャリスト → 【F】LLMO/AI検索対策（10点）
- 📋 ディレクター＋👑 CMO → 【G】総合評価（5点）

【採点後の判定】
- 合計80点以上 → フェーズ3へ進む
- 合計80点未満 → 低スコアのカテゴリを具体的に改善してから再採点。80点以上になるまでこのループを繰り返す

採点結果は review-rubric.md に定義された形式で必ず出力してください。

════════════════════════════════
■ フェーズ3：80点以上が確認できたら公開作業
════════════════════════════════

1. blog/index.html の記事一覧の末尾に新記事カードを追加
   （形式：blog-card > blog-card-body > blog-tag + blog-title + blog-desc + blog-meta + blog-more）

2. keyword-queue.md の「${KEYWORD}」の行末に [済 $(date +%Y-%m-%d)] を追記する
   済み記事一覧テーブルに今回の記事タイトル・ファイル名・日付を追加する

3. git add → git commit（「[記事タイトル]をブログに追加」）→ git push origin main"

# ── Claude Codeを起動 ────────────────────────────────
echo "🚀 Claude Code を起動中..."
echo ""
claude "$PROMPT"
