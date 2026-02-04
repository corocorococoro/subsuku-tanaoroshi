# Execution — Subscriptions Spend Visualizer

このドキュメントは「どう回すか（手順・コマンド・品質ゲート・デプロイ先固有情報）」の一次情報（Source of Truth）。
設計・技術選定・DB構成は `docs/tech/INDEX.md`。

---

## 1. Local Development（Laravel Sail）

### Prerequisites
- Docker Desktop installed and running

### Setup（標準）
- cp .env.example .env
- ./vendor/bin/sail up -d
- ./vendor/bin/sail composer install
- ./vendor/bin/sail artisan key:generate
- ./vendor/bin/sail artisan migrate

Node deps / dev server（どちらかに統一）
- Sailで実行する場合（推奨：環境差を減らす）
  - ./vendor/bin/sail npm install（または npm ci）
  - ./vendor/bin/sail npm run dev
- ホストで実行する場合
  - npm ci
  - npm run dev

---

## 2. Tests（必須）
- ./vendor/bin/sail artisan test
  - 何かが終わったら必ずSail経由で実行し、オールグリーンであること

---

## 3. PR Before Checklist（必須）
> `npm run dev` は型エラーを見逃すことがある前提で運用する。

1) Test（MUST via Sail）
- ./vendor/bin/sail artisan test

2) Typecheck（MUST）
- Sail: ./vendor/bin/sail npm run typecheck
- Host: npm run typecheck

3) Build（MUST）
- Sail: ./vendor/bin/sail npm run build
- Host: npm run build

4) Lint（存在するなら必須化）
- Sail: ./vendor/bin/sail npm run lint
- Host: npm run lint

### Notes
- `npm run build` だけでは型チェックにならない構成があり得るため、typecheck を必須化する。

---

## 4. Required scripts（package.json）
最低限:
- "typecheck": "tsc --noEmit"
- "build": （例: "vite build"）
- "dev": （例: "vite"）
推奨:
- "lint": ...
- "test": ...

---

## 5. Environment variables（運用）
- ローカルは .env
- デプロイ先は環境変数として設定する（値は秘密）
  - APP_KEY / APP_ENV / APP_DEBUG
  - DB接続（DB_* もしくは DATABASE_URL）
  - OAuth client id/secret 等

---

## 6. Deployment — :contentReference[oaicite:0]{index=0}（デプロイ先固有）
※ベンダー固有の情報はここにのみ書く。

- MySQL をプラットフォーム上で用意し、DB接続情報を環境変数に設定する
- APP_KEY を設定する
- Queue はMVP不要（非同期処理なし）
- ファイルアップロードなし（永続ストレージ前提なし）
- 可能なら Dockerfile でデプロイ（ローカルのDocker前提と整合）

（ここは実際の運用手順が固まり次第、具体手順に更新する）
