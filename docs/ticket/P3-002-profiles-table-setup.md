### 基本情報

**タイトル**: profiles-table-setup の実装
**優先度**: P3

### 概要

`public.profiles` テーブルを作成し、`auth.users` と 1:1 で関連付けます。外部参照は ON DELETE CASCADE を設定し、ユーザー削除時に関連プロフィールを自動削除します。RLS の有効化とポリシー適用は後続のチケット（`P3-004-db-rls-policy`）で一括実施します。

### 要件

- [ ] `public.profiles` テーブルを作成（主キーは `id uuid`、`auth.users` 参照）
- [ ] ON DELETE CASCADE による整合性を確保
- [ ] 監査用の `created_at`/`updated_at` を保持（`updated_at` は更新時に自動更新）

### 技術仕様

**技術スタック**: Supabase (Postgres), SQL, トリガー

**ファイル**:

- `docs/ticket/P3-002-profiles-table-setup.md`（本チケット）
- （任意）`docs/sql/profiles/*.sql` に DDL/ポリシー/トリガーを保存

**API**: N/A（DB スキーマ設定）

Drizzle スキーマ定義（TypeScript 例）:

```ts
// src/drizzle/schema/profiles.ts
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // auth.users(id) を参照（外部キーはマイグレーションで付与）
  username: text("username").unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 注意: Drizzle-Kit の差分生成対象にするため、テーブルは必ず export してください。
```

参考 SQL（雛形例）:

```sql
-- 1) テーブル作成
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) updated_at 自動更新（トリガー）
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_updated_at on public.profiles;
create trigger trg_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- RLS とポリシーは後続チケット（P3-004）で一括適用
```

### 実装手順

1. Drizzle スキーマを `src/drizzle/schema/profiles.ts` に作成し export
2. `npx drizzle-kit generate` で `src/drizzle/migrations/` に SQL を生成
3. 生成 SQL を Supabase に適用（推奨: SQL エディタで順次実行 / 代替: `npx drizzle-kit push:pg`）
4. `public.profiles` に ON DELETE CASCADE の外部キーと `updated_at` トリガーを含める
5. 既存ユーザーのバックフィルを必要に応じて実施
6. 簡易動作確認（作成/更新で `updated_at` が更新される・ユーザー削除で CASCADE）

### テスト項目

- [ ] `drizzle-kit generate` が成功し、`src/drizzle/migrations/` に SQL が出力される
- [ ] 生成 SQL の適用が Supabase で成功する
- [ ] ユーザー削除時にプロフィールが自動削除される（ON DELETE CASCADE）
- [ ] `profiles` の更新時に `updated_at` が自動更新される（トリガー動作）

### 完了条件

- [ ] `public.profiles` が作成済みかつトリガーが有効
- [ ] 初期レコードの整合性が取れている
- [ ] RLS/ポリシーは P3-004 で一括適用予定である旨が明記されている

### 注意事項

- `profiles.id` は `auth.users.id` と同じ UUID を使用します。アプリ側からの insert では `id` を明示的に設定してください。
- サービスロールキーでのバックフィルは RLS の影響外です。誤用防止のため取り扱いに注意してください。
- Drizzle の `$onUpdate` はアプリ経由更新に依存するため、更新時刻は DB トリガーで統一管理することを推奨します。
- Drizzle-Kit は schema の export が必須です。未 export のテーブルは差分に含まれません。
- RLS/ポリシーは P3-004 で適用します。ポリシーでは `TO authenticated` と `(select auth.uid())` の形を推奨し、対象列にインデックスを付与してください。

### 関連チケット

- P0-001-supabase-setup
- P3-001-drizzle-setup
- P3-004-db-rls-policy
- P3-003-db-schema-initialization
