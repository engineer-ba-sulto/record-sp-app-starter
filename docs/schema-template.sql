-- データベーススキーマ雛形
-- 命名規約: テーブル/列ともにスネークケース、PK は "id"、FK は "<table>_id"
-- placeholder テーブル（必要に応じて）
create table
	if not exists public.app_meta (
		id uuid primary key default gen_random_uuid (),
		key text not null unique,
		value jsonb,
		created_at timestamptz not null default now (),
		updated_at timestamptz not null default now ()
	);

-- ユーザープロファイルテーブル（例）
create table
	if not exists public.profiles (
		id uuid primary key default gen_random_uuid (),
		user_id uuid not null,
		username text unique,
		avatar_url text,
		created_at timestamptz not null default now (),
		updated_at timestamptz not null default now ()
	);

-- RLS 原則に従い、アプリ用テーブルでは所有者カラム（例: user_id）を必ず用意
-- alter table public.profiles enable row level security;
-- create policy "Users can view own profile" on public.profiles
--   for select using (auth.uid() = user_id);
-- create policy "Users can update own profile" on public.profiles
--   for update using (auth.uid() = user_id);
-- create policy "Users can insert own profile" on public.profiles
--   for insert with check (auth.uid() = user_id);
-- RLS パフォーマンス最適化（ポリシー適用前提の索引）:
-- create index if not exists profiles_user_id_idx on public.profiles using btree(user_id);
-- create index if not exists app_meta_key_idx on public.app_meta using btree(key);
-- 外部キー制約の例（必要に応じて）
-- alter table public.profiles add constraint profiles_user_id_fkey
--   foreign key (user_id) references auth.users(id) on delete cascade;