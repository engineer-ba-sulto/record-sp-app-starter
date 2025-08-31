### 基本情報

**タイトル**: db-schema-initialization の実装
**優先度**: P3

### 概要

各アプリ固有の要件に発展可能なスキーマ雛形を整備します。本段階では最小限の共通要素と命名規約、インデックス方針、RLS の基本原則を文書化し、将来のテーブル追加を円滑化します。スキーマは Drizzle で定義し、`drizzle-kit generate` により SQL を生成し Supabase に適用します。

### 要件

- [ ] テーブル/列の命名規約（スネークケース）を定義
- [ ] 外部キー/インデックス/ユニーク制約の基本方針を定義
- [ ] RLS 原則（自己行のみ、deny-by-default）を再確認し雛形化
- [ ] 初期スキーマの雛形 SQL を保存（必要に応じて placeholder テーブル）
- [ ] Drizzle スキーマは export 済みで、`drizzle-kit generate` による差分生成が可能
- [ ] マイグレーション適用方法（SQL エディタ適用 or `push:pg`）の運用決定と記載

### 技術仕様

**技術スタック**: Drizzle ORM, Drizzle Kit, Supabase (Postgres), SQL

**ファイル**:

- `docs/ticket/P3-003-db-schema-initialization.md`（本チケット）
- `src/drizzle/schema/*`（Drizzle スキーマ定義）
- `src/drizzle/migrations/*`（生成 SQL）

**API**: N/A

注記: RLS の有効化とポリシー適用は後続チケット（`P3-004-db-rls-policy`）で一括実施します。本チケットではテーブル/制約/インデックスなどスキーマ定義の雛形整備に専念します。

Drizzle 生成/適用のポイント（context7 に基づく）:

- `npx drizzle-kit generate` で TypeScript スキーマから SQL を生成
- 適用は安全性重視なら Supabase SQL エディタへ貼付、効率重視なら `npx drizzle-kit push:pg`
- Postgres のマイグレーションメタ表はデフォルト `drizzle` スキーマに作成されるため、`public` に置きたい場合は `migrations.schema: "public"` を設定
- 参照されない（未 export）のテーブルは差分対象にならないため、必ず export

雛形 SQL（例）:

```sql
-- 命名規約: テーブル/列ともにスネークケース、PK は "id"、FK は "<table>_id"

-- placeholder テーブル（必要に応じて）
create table if not exists public.app_meta (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS 原則に従い、アプリ用テーブルでは所有者カラム（例: user_id）を必ず用意
-- alter table public.some_table enable row level security;
-- create policy ... using (auth.uid() = user_id);

-- RLS パフォーマンス最適化（ポリシー適用前提の索引）:
-- create index if not exists some_table_user_id_idx on public.some_table using btree(user_id);
```

### 実装手順

1. 命名規約・制約方針・RLS 原則を文書化
2. Drizzle スキーマを `src/drizzle/schema/` に雛形作成
3. `drizzle-kit generate` で SQL 生成（出力先: `src/drizzle/migrations/`）
4. Supabase に生成 SQL を適用（SQL エディタ or `push:pg`）
5. 新規テーブル追加時のレビュー観点（RLS/インデックス/リレーション）をチェックリスト化

### テスト項目

- [ ] 雛形 DDL が Postgres で実行可能
- [ ] 命名規約・制約方針がチームに共有されている
- [ ] 新規テーブル作成時にチェックリストが活用されている

### 完了条件

- [ ] 雛形 SQL・ドキュメントがリポジトリに存在
- [ ] RLS 原則・方針が確認できる
- [ ] 将来のテーブル追加に必要な最小限の雛形が揃っている

### 注意事項

- 現段階では雛形レベルに留め、アプリ固有の詳細設計は別チケットで扱います。
- 高頻度クエリには適切なインデックス設計を行い、過剰な複合インデックスは避けてください。
- RLS はセキュリティ目的に限定し、クライアント側でも明示フィルタを併用してください（ベストプラクティス）。
- RLS の TO 句（`to authenticated` など）と `(select auth.uid())` 形式を推奨します（optimizer 最適化）。

### 関連チケット

- P0-001-supabase-setup
- P3-001-drizzle-setup
- P3-004-db-rls-policy
- P3-002-profiles-table-setup
