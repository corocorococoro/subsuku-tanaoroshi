# Agent Instructions — Subscriptions Spend Visualizer

このドキュメントは「AI/開発者が守る振る舞い制約」の一次情報（Source of Truth）。
実装方針・設計・DB構成は `docs/tech/INDEX.md` にのみ書く。
手順・コマンド・品質ゲートは `docs/execution/INDEX.md` にのみ書く。

---

## 1. Safety（破壊的操作の禁止）
- 破壊的操作は禁止。必要なら先に提案し、明示的な確認を取る。
  - rm -rf / DROP / TRUNCATE
  - 本番DBへの直接書き込み
  - シークレットのローテ/上書き
  - データ消失につながるマイグレーション

---

## 2. Change Discipline（差分粒度）
- 変更は小さく分割し、無関係な差分を混ぜない
- リファクタは挙動変更と同PRに混ぜない（必要なら分離）

---

## 3. Source of Truth（ドキュメント更新義務）
- 挙動・要件・設計・手順を変更した場合、該当する一次情報を同PRで更新する
  - 要件/画面/受け入れ条件 → docs/product/INDEX.md
  - 設計/実装方針/DB → docs/tech/INDEX.md
  - 手順/コマンド/品質ゲート/デプロイ先固有情報 → docs/execution/INDEX.md
- “便利そう”な要件を勝手に追加しない（提案として分離）

---

## 4. Work Style（進め方の制約）
- 不確定事項がある場合：
  - 実装前に「前提」「影響範囲」「代替案」を明示してから進める
- 仕様や設計に書かれていない挙動は仮決めで実装しない（提案→合意→実装）

---

## 5. Output Format（出力の制約）
- 提案・実装計画はファイルパス単位で提示し、差分が追える形にする
- 実装結果の報告は「変更点」「影響点」「検証方法（execution参照）」を短く列挙する
