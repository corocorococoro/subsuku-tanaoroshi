# 節約サブスク可視化アプリ (Subsuku Tanaoroshi)

ユーザーが契約している他社サブスクリプションを登録し、「毎月いくら」「年間いくら」支払っているかをスマホで即座に把握できるWebアプリです。

## 概要

### 目的 (Goal)
契約しているサブスクリプションを一元管理し、固定費（毎月・毎年の支払い総額）を可視化することで、家計の見直しや節約を支援します。
課金連携（銀行APIやクレジットカード明細取得など）は行わず、手入力によるシンプルな管理を目指しています。

### 主な機能
- **ダッシュボード**: 月額および年額の支払い合計を表示。
- **グラフ可視化**: サービスカテゴリーごとのコスト内訳をグラフで確認可能。
- **サブスク管理**: サブスクリプションの追加・編集・削除・解約ステータスの切り替え。
- **Googleログイン**: Googleアカウントを使用した簡単な登録・ログイン。

## 技術スタック (Tech Stack)

- **Backend**: Laravel 12
- **Frontend**: React + TypeScript (Inertia.js)
- **Authentication**: Laravel Breeze + customized Google OAuth (Socialite)
- **Database**: MySQL
- **Styling**: Tailwind CSS
- **Local Development**: Docker (Laravel Sail)
- **Deployment**: Railway

## 環境構築 (Local Development)

Mac / Docker環境での開発手順です。

### 前提条件
- Docker Desktop がインストールされ、起動していること

### セットアップ

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd subsuku-tanaoroshi
   ```

2. **環境変数の設定**
   ```bash
   cp .env.example .env
   ```
   `.env` ファイル内のDB設定などは、Laravel Sailを使用する場合はデフォルトのままで動作します。
   Google認証を使用する場合は、`GOOGLE_CLIENT_ID` 等の設定が必要です。

3. **Dockerコンテナの起動**
   ```bash
   ./vendor/bin/sail up -d
   ```
   ※ エイリアス `sail` を設定している場合は `sail up -d` で可能です。

4. **アプリケーションキーの生成**
   ```bash
   ./vendor/bin/sail artisan key:generate
   ```

5. **データベースのマイグレーション**
   ```bash
   ./vendor/bin/sail artisan migrate
   ```

6. **依存パッケージのインストールとビルド**
   ```bash
   ./vendor/bin/sail npm install
   ./vendor/bin/sail npm run dev
   ```

7. **ブラウザでアクセス**
   [http://localhost](http://localhost) にアクセスしてください。

## デプロイ

本番環境は Railway を使用しています。
Mainブランチへのプッシュで自動デプロイされる構成（またはCLIによるデプロイ）を想定しています。

## ライセンス

This software is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
