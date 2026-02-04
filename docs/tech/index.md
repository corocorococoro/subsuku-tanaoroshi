# Tech Spec — Subscriptions Spend Visualizer

このドキュメントは「どう作るか（設計・技術選定・コードに現れる前提）」の一次情報（Source of Truth）。
デプロイ先固有の手順/設定は `docs/execution/INDEX.md` にのみ書く（ベンダー名は禁止）。

---

## 1. Tech Stack
- Backend: Laravel 12
- Frontend: React + TypeScript（Inertia.js）
- Auth: Laravel Breeze（Inertia React）
- Social Login: Google OAuth（laravel/socialite）
- Database: MySQL
- Charts: Recharts
- Styling: Tailwind CSS
- Local Dev: Docker（Laravel Sail）

---

## 2. Architecture / Code Organization（実装方針）
- Laravel monolith + Inertia（React）
- 責務分離（必須）
  - Controller：I/O中心で薄く保つ
  - Validation：FormRequestに集約
  - 集計/計算：Serviceに集約（例：DashboardService）
- データアクセス
  - Eloquentを基本
  - N+1回避（必要箇所のみ eager loading）

---

## 3. Data Model（DB構成）
※「DBをどう作るか」の設計。実行コマンドは execution にのみ書く。

### 3.1 Tables
#### users
- Breeze default

#### subscriptions
- id
- user_id（FK）
- name: string
- amount_yen: unsigned integer
- interval_months: tinyint（allowed: 1,2,3,4,6,12）
- started_on: date
- next_billing_on: date
- category: string（固定選択肢）
- memo: text nullable
- status: enum/string（active/canceled, default active）
- timestamps

### 3.2 Constraints / Indexes
- FK: subscriptions.user_id -> users.id（on delete cascade）
- index: (user_id, status)
- index: (user_id, next_billing_on)

---

## 4. Validation（Backend）
Subscription:
- name: required, max 100
- amount_yen: required, integer, min 0, max reasonable（例: 10,000,000）
- interval_months: required, in [1,2,3,4,6,12]
- started_on: required, date
- next_billing_on: required, date
- category: required, in fixed list
- status: required, in ['active','canceled']

---

## 5. Calculation / Date rules（実装前提）
- 金額は整数で統一（小数をDBに持たない）
- monthly_equiv_yen = round(amount_yen / interval_months)
- yearly_equiv_yen  = amount_yen * (12 / interval_months)
- 集計対象は status='active' のみ
- started_on -> next_billing_on の加算は「月末ズレを破綻させない」方式を採用する

---

## 6. Access Control（実装方針）
- 全ルート auth 必須
- Subscription CRUD は常に user_id でスコープ（Policy or Query Scope のどちらかに統一）
- Account deletion は current user のみ

---

## 7. Deployment Contract（ベンダー非依存）
ここには「実行環境に求める契約（コードに影響する前提）」のみを書く。デプロイ先の固有情報は execution に置く。

- App is stateless（MVPではユーザーアップロードなし、ローカル永続ストレージに依存しない）
- Configuration via environment variables（.env相当）
  - APP_KEY / APP_ENV / APP_DEBUG
  - DB接続（DB_* または DATABASE_URL のどちらを採用するかは execution の環境設定で統一）
  - OAuth client id/secret など
- HTTP serving
  - PORT環境変数が与えられる環境でも動作する
- DB requirements
  - MySQL互換
  - スキーマ変更は migrations による
- Background jobs
  - MVPでは不要（キュー無しで成立）

---

## 8. Security（技術前提）
- Secrets をGitにコミットしない（OAuth client secret含む）
- OAuth callback / state の検証を崩さない
- ログにトークン/PIIを出さない
