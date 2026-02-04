# Project Map — Subscriptions Spend Visualizer

このファイルは「どのドキュメントが何の正か」を示す地図だけを持つ。
ルール・手順・仕様の本文は各 INDEX にのみ存在する。

## Read order (Source of Truth)
1) docs/product/INDEX.md
- 何を作るか：ユースケース、画面/フロー、受け入れ条件、スコープ/非スコープ

2) docs/tech/INDEX.md
- どう作るか（コードに現れる前提）：設計、DB構成、計算/日付ルール、認可方針、ベンダー非依存の実行環境契約

3) docs/agent/INDEX.md
- どう振る舞うか：作業規律、ドキュメント整理/更新義務などの“振る舞い制約”

4) docs/execution/INDEX.md
- どう動かす/検証/運用するか：ローカル手順、検証コマンド、デプロイ先固有の手順

## Where to update (edit policy)
- 要件/画面/受け入れ条件の変更 → docs/product/INDEX.md
- 設計/DB/計算/認可などコード前提の変更 → docs/tech/INDEX.md
- 作業ルール/ドキュメント整理義務など振る舞いの変更 → docs/agent/INDEX.md
- 手順/コマンド/検証/デプロイ先手順の変更 → docs/execution/INDEX.md