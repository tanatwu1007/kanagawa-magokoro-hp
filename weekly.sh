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

事前に magokoro-knowledge.md（会社情報・サービス・実績）と article-prompt.md（記事生成ルール・HTML構造）を読んでから作業を開始してください。

■ 作業1：記事HTMLを新規作成
- ターゲットキーワードに最適なファイル名を決定（英数字ハイフンのみ。例：yokohama-fuyo-cost）
- blog/[ファイル名].html を blog/fuyo-cost.html と完全に同じHTML構造・デザインで作成
- article-prompt.md の記事構成テンプレート・SEOルール・AI臭排除ルールをすべて適用
- 文字数2,000字以上・ですます調
- ターゲットキーワードを title・h1・h2・メタディスクリプションに必ず含める
- 料金表と比較表を各1つ以上入れる
- 関連記事リンク3本（blog/fuyo-cost.html・blog/gomiyashiki.html・blog/ihin-timing.htmlから適切なものを選ぶ）
- CTA：電話 0120-437-599 と LINE https://lin.ee/Gf8Or5r を記事中とarticle-ctaブロックに入れる
- エリアが特定できる記事なら /area/[エリア名].html への内部リンクを入れる

■ 作業2：ブログ一覧ページを更新
- blog/index.html の記事一覧の末尾に新記事カードを追加
- 形式は既存カードと完全に同じ（blog-card > blog-card-body > blog-tag + blog-title + blog-desc + blog-meta + blog-more）

■ 作業3：キーワード管理ファイルを更新
- keyword-queue.md の「${KEYWORD}」の行末に [済 $(date +%Y-%m-%d)] を追記する
- 済み記事一覧テーブルに今回の記事タイトル・ファイル名・日付を追加する

■ 作業4：コミット＆プッシュ
- git add で変更したファイルをすべてステージング
- git commit（メッセージ例：「[記事タイトル]をブログに追加」）
- git push origin main"

# ── Claude Codeを起動 ────────────────────────────────
echo "🚀 Claude Code を起動中..."
echo ""
claude "$PROMPT"
