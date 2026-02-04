# Product Spec — Subscriptions Spend Visualizer（節約サブスク可視化アプリ）

このドキュメントは「何を作るか」の一次情報（Source of Truth）。
技術/実装方針は `docs/tech/INDEX.md`、実行手順は `docs/execution/INDEX.md`、AI/運用ルールは `docs/agent/INDEX.md` を参照。

---

## Goal
ユーザーが契約している他社サブスクリプションを登録し、
「毎月いくら」「年間いくら」支払っているかをスマホで即座に把握できるWebアプリを作る。
課金（Stripe等）は一切不要。

**コンセプト**: サブスクリプション管理に特化した「煽り系」節約アプリ  
**ターゲット**: サブスクの見直しをしたい人、無駄遣いに気づきたい人  
**特徴**: 真面目な名前と可愛いマスコットによる辛辣なツッコミのギャップを楽しむ

### マスコットキャラ（名前未定/AI生成）
- **ビジュアル**: 魔法少女についてくるタイプの可愛らしいマスコット
- **性格**: 見た目は可愛いが口が悪い、節約の鬼神
- **口調**: 「～だよ」「～じゃん」など親しみやすいが辛辣
- **立ち位置**: ユーザーの金銭感覚を叩き直す厳しくも愛のある相棒
---

## Non-Goals（MVPではやらない）
- 銀行/カード/メールからの自動取り込み
- 通知・リマインド
- CSVエクスポート
- 共有（家族/チーム）
- マルチ通貨
- 複雑な課金周期（週次・隔月の自由入力など）※12の約数に制限

---

## 機能要件

### 2.1 Authentication
- Email+Password login/register
- Google login（OAuth）
- Password reset（email）
- Account deletion
  - ユーザー削除時に、そのユーザーのSubscriptionは全削除されること（体験として保証）

### 2.2 Currency / Locale
- JPY固定
- 金額は整数円のみ
- Timezone: Asia/Tokyo 固定

### 2.3 Subscription（ユーザーが登録するデータ）
1ユーザーが複数のサブスクを登録できる。

#### Fields（MVP）
- name: string（required）
- amount_yen: integer（required）
- interval_months: integer（required）※ allowed: 1,2,3,4,6,12
- started_on: date（required）
- next_billing_on: date（required）※ default auto-calc, editable
- category: fixed choices（required）
- memo: text（optional）
- status: 'active' | 'canceled'（required, default active）

### 2.4 Calculation Rules（最重要）
すべて整数円で表示・集計し、ブレを作らない。

- monthly_equiv_yen = round(amount_yen / interval_months)
- yearly_equiv_yen  = amount_yen * (12 / interval_months)

集計対象:
- status = 'active' のみ

Dashboard totals:
- monthly_total_yen = sum(monthly_equiv_yen for active subscriptions)
- yearly_total_yen  = sum(yearly_equiv_yen  for active subscriptions)

### 2.5 Next billing date logic
- default auto-calc: started_on から interval_months を加算して next_billing_on を設定
- next_billing_on は編集可能（サービスごとの請求日ズレに対応）
- 追加・編集時に next_billing_on が空なら自動計算して保存
- 月末ズレが破綻しない加算ルールを採用する（例：月末処理で日付が溢れない）

---

3.2 煽り機能（核心機能）

#### A. 全体メッセージ（エッセイ形式）

**特徴**:
- 150〜400文字程度の長文
- ストーリー性・共感性のある文章
- 具体例を交えた説得力
- 最後にツッコミを入れる構成

**生成ロジック**:

```
【テンプレート構造】
[導入: 日常のシチュエーション] →
[具体例: 金額換算での衝撃] →
[共感: 心理描写] →
[結論: 辛辣な締め]

変数:
- {monthlyTotal} = 月額合計
- {yearlyTotal} = 年額合計
- {totalPaid} = 累計支払額
```

**比較対象ライブラリ**（ランダム選択）:
- 食事系: スタバラテ、昼ごはん、寿司、ラーメン、高級肉
- 娯楽系: 映画、漫画、ゲーム、旅行、コンサート
- 実用品: 服、家電、家具、スマホ
- 貯蓄系: 貯金、投資、保険
- 体験系: マッサージ、美容院、ジム

**メッセージデータ**: `resources/js/features/roast/data/globalMessages.json` を参照（50件）

#### B. 個別メッセージ（各サブスクカード）

- **表示場所**: 各サブスクアイテム内
- **内容**: そのサービスに対する具体的な煽り（短め）
- **パターン**: ランダム選択、変数埋め込み

```
変数:
- {name} = サブスク名
- {amount} = 月額換算金額
- {yearlyAmount} = 年額換算金額
- {dailyAmount} = 日額換算金額
```

**メッセージデータ**: `resources/js/features/roast/data/subscriptionMessages.json` を参照（46件）

### 3.3 SNSシェア機能

#### OGイメージ生成
- **トリガー**: 「シェア」ボタン押下
- **生成内容**:
  - マスコットキャラのイラスト
  - 表示中の煽りメッセージ全文
  - アプリ名「サブスク棚卸し」
  - サブスク合計金額（任意）
- **仕様**: 1200×630px（Twitter/X, Facebook対応）
- **テキスト**: 煽りメッセージ＋「#サブスク棚卸し」

## 3. Screens（Mobile-first）
- /login
- /register
- /forgot-password, /reset-password

- /dashboard（メイン画面、サブスク一覧も統合）
  - KPI：月額合計 / 年額合計
  - グラフ：サービス別内訳（棒グラフ優先）
  - サブスク一覧（カードUI）
    - active / canceled フィルタ（segmented control）
    - 追加/編集/削除
  - 解約済みは集計対象外である注記

- /subscriptions/create（モーダル or 専用ページ）
- /subscriptions/{id}/edit（モーダル or 専用ページ）

- /settings/account
  - アカウント削除（確認ダイアログ、再認証 or パスワード確認）

### 3.1 UI Design Guidelines（プロダクト要件としての見た目）
- Mobile-first
- デスクトップでも美しく見えるレスポンシブ対応
- ジェネリックなテンプレ感を避け、独自性のあるビジュアルを目指す

---

## 4. Routing / Access Control（機能要件）
- すべて auth 必須（ログイン後のみ利用）
- Subscription CRUD は常に user_id でスコープ
- Account deletion は現在ユーザーのみ実行可能

---

## 5. Acceptance Criteria（MVP）
- ユーザーがメール/Googleで登録・ログインできる
- パスワードリセットが動作する
- サブスクを追加/編集/削除できる
- interval_months が 1,2,3,4,6,12 のみ登録できる
- ダッシュボードに monthly_total_yen / yearly_total_yen が表示される（activeのみ）
- サービス別内訳グラフが表示される
- 解約済みフラグをONにすると集計から外れ、ダッシュボードの一覧でcanceled側に出る
- アカウント削除でユーザーとサブスクが完全に消える
