export type Case = {
  id: string;
  slug: string;
  title: string;
  service: "不用品回収" | "遺品整理" | "残置物撤去" | "出張買取";
  area: string;
  layout: string;
  volume: string;
  staff: number;
  duration: string;
  priceWork: number;
  priceBuyback: number;
  priceTotal: number;
  background: string;
  effort: string;
  /** Instagram投稿のインデックス（フィードの何番目を使うか。0始まり） */
  instagramIndex: number;
  /** Instagram APIが使えない場合のフォールバック画像 */
  fallbackImage: string;
  date: string;
};

/**
 * 作業事例データ
 *
 * 画像はInstagram投稿から自動取得されます。
 * instagramIndex でフィードの何番目の投稿画像を使うかを指定します。
 * Instagram APIが未設定の場合は fallbackImage が表示されます。
 *
 * 実データに差し替える際の編集項目：
 * - title, area, layout, volume, staff, duration
 * - priceWork（作業料金）, priceBuyback（買取額）, priceTotal（支払総額 = 作業料金 - 買取額）
 * - background（依頼の背景）, effort（対応した工夫）
 * - instagramIndex（フィードの何番目の投稿を使うか）
 * - date（作業年月: YYYY-MM 形式）
 */
export const cases: Case[] = [
  {
    id: "1",
    slug: "yamato-2ldk-ihin",
    title: "大和市・2LDK・遺品整理",
    service: "遺品整理",
    area: "大和市",
    layout: "2LDK",
    volume: "2tトラック1台分",
    staff: 3,
    duration: "約5時間",
    priceWork: 120000,
    priceBuyback: 35000,
    priceTotal: 85000,
    background:
      "お父様が亡くなられ、賃貸物件の退去期限が迫っていました。ご家族は遠方にお住まいで、立ち会いが1日しか取れないとのご相談でした。",
    effort:
      "事前にLINEで室内の写真を送っていただき、当日の作業計画を綿密に立てました。貴重品（通帳・印鑑・写真アルバム）は作業前にご家族と一緒に確認。家電・家具の一部は買取でき、費用を抑えることができました。",
    instagramIndex: 0,
    fallbackImage: "/images/cases/case1-before.svg",
    date: "2026-08",
  },
  {
    id: "2",
    slug: "yokohama-1k-fuyo",
    title: "横浜市・1K・不用品回収",
    service: "不用品回収",
    area: "横浜市港北区",
    layout: "1K",
    volume: "軽トラック1台分",
    staff: 2,
    duration: "約1.5時間",
    priceWork: 9800,
    priceBuyback: 0,
    priceTotal: 9800,
    background:
      "引越しが3日後に迫り、粗大ゴミの申込みが間に合わなかったとのこと。ベッド・冷蔵庫・洗濯機・棚など一人暮らしの家財一式の回収をご依頼いただきました。",
    effort:
      "当日のお電話で翌日午前に対応。エレベーターなしの3階でしたが、養生をして搬出。冷蔵庫はリサイクル料金を含め、すべて込みの金額でご提示しました。",
    instagramIndex: 1,
    fallbackImage: "/images/cases/case2-before.svg",
    date: "2026-07",
  },
  {
    id: "3",
    slug: "kawasaki-3ldk-zanchi",
    title: "川崎市・3LDK・残置物撤去",
    service: "残置物撤去",
    area: "川崎市高津区",
    layout: "3LDK",
    volume: "2tトラック2台分",
    staff: 4,
    duration: "約7時間",
    priceWork: 180000,
    priceBuyback: 42000,
    priceTotal: 138000,
    background:
      "不動産管理会社様からのご依頼。前入居者が残していった家財一式の撤去で、次の入居者の入居日まで10日間しかありませんでした。",
    effort:
      "現地確認の翌日に作業を実施。大型家具の解体・搬出、家電リサイクル品の適正処理、残った生活ゴミの分別まで対応。ブランド家具と家電の一部を買取し、費用を軽減しました。",
    instagramIndex: 2,
    fallbackImage: "/images/cases/case3-before.svg",
    date: "2026-09",
  },
];
