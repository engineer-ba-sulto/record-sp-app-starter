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

1. `public.profiles` の DDL を適用（PK/参照/タイムスタンプ）
2. `updated_at` 自動更新トリガーを作成
3. 既存ユーザーに対して初期レコードを作成（必要ならバックフィル）
4. 簡易動作確認（テーブル作成・トリガーが機能）

### テスト項目

- [ ] ユーザー削除時にプロフィールが自動削除される

### 完了条件

- [ ] `public.profiles` が作成済みかつトリガーが有効
- [ ] 初期レコードの整合性が取れている
- [ ] RLS/ポリシーは P3-004 で一括適用予定である旨が明記されている

### 注意事項

- `profiles.id` は `auth.users.id` と同じ UUID を使用します。アプリ側からの insert では `id` を明示的に設定してください。
- サービスロールキーでのバックフィルは RLS の影響外です。誤用防止のため取り扱いに注意してください。

### 関連チケット

- P0-001-supabase-setup
- P3-001-drizzle-setup
- P3-004-db-rls-policy
- P3-003-db-schema-initialization
