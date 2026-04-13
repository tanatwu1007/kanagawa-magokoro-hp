# 毎週Claude Codeに貼るコマンドテンプレート

## 使い方
1. 下の「コマンドテンプレート」をコピーする
2. `【キーワード】` を今週書く記事のキーワードに書き換える
3. `【ファイル名】` を英数字ハイフンのファイル名に書き換える（例：`yamato-fuyo-sokuji`）
4. `【カテゴリ】` を記事に合ったカテゴリに書き換える（例：`不用品回収`、`遺品整理`、`片付け`）
5. Claude Codeに貼り付けて送信する

---

## コマンドテンプレート

```
以下の作業をしてください。

【ターゲットキーワード】：【キーワード】
【HTMLファイル名】：blog/【ファイル名】.html
【カテゴリ】：【カテゴリ】

1. blog/【ファイル名】.html を新規作成
   - magokoro-knowledge.md の会社情報・サービス情報を参照する
   - article-prompt.md の記事生成ルールに従って作成する
   - blog/fuyo-cost.html と完全に同じHTML構造・デザインにする
   - ターゲットキーワードを title・h1・h2・メタディスクリプションに含める
   - 文字数2,000字以上、ですます調
   - 関連記事リンク（blog/fuyo-cost.html, blog/gomiyashiki.html, blog/ihin-timing.html から適切なものを3本）
   - CTA：電話 0120-437-599 と LINE https://lin.ee/Gf8Or5r を記事中とarticle-cta内に入れる
   - エリア記事の場合は /area/[エリア名].html への内部リンクも入れる

2. blog/index.html の記事一覧に新記事カードを追加
   - 既存カードと完全に同じ形式（blog-card > blog-card-body > blog-tag + blog-title + blog-desc + blog-meta + blog-more リンク）
   - カードは既存カードの最後（</div></div>の直前）に追加する

3. git add → git commit → git push
   - コミットメッセージ：「[記事タイトル]をブログに追加」
```

---

## 記入例（大和市 不用品回収 即日の場合）

```
以下の作業をしてください。

【ターゲットキーワード】：大和市 不用品回収 即日
【HTMLファイル名】：blog/yamato-fuyo-sokuji.html
【カテゴリ】：不用品回収

1. blog/yamato-fuyo-sokuji.html を新規作成
   ...（以下同じ）
```

---

## キーワード別ファイル名変換例

| キーワード | ファイル名 |
|------------|-----------|
| 横浜市 不用品回収 費用 | `yokohama-fuyo-cost.html` |
| 川崎市 遺品整理 | `kawasaki-ihin.html` |
| 神奈川 ゴミ屋敷 | `kanagawa-gomiyashiki.html` |
| 冷蔵庫 処分 大和市 | `yamato-reizoko.html` |
| 不用品回収 当日 | `fuyo-toujitsu.html` |
| 遺品整理 費用 相場 | `ihin-cost.html` |
| 単身引越し 不用品 | `tansin-fuyo.html` |

---

## カテゴリ一覧

- `不用品回収`
- `遺品整理`
- `片付け`
- `残置物撤去`
- `買取`
- `ルームクリーニング`

---

## よくあるミス

- `【ファイル名】` に `.html` を忘れる → 2か所あるので両方確認
- `blog/index.html` の更新を指示し忘れる → テンプレートに含まれているので消さない
- git push の指示を消してしまう → 必ず3のステップを残す
