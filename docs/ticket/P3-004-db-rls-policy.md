### 基本情報

**タイトル**: db-rls-policy の実装
**優先度**: P3

### 概要

アプリで扱う全テーブル（例: `public.profiles` を含む）に対して、Row Level Security (RLS) を有効化し、「ユーザーは自身のデータのみアクセス可能」という原則を徹底します。Supabase/Postgres の標準機能で実現し、後続のテーブル追加時にも再利用できるポリシー方針・雛形を整備します。

### 要件

- [ ] すべてのアプリ用テーブルで RLS を有効化
- [ ] 既定は拒否 (deny-by-default) を徹底
- [ ] 認可の基準は `auth.uid()` と対象行の所有者カラム（例: `user_id`）の一致
- [ ] select/insert/update の自己行のみ許可ポリシーを定義（delete は任意）
- [ ] サービスロールキー（バックエンド用）は RLS の影響外であることを明記

### 技術仕様

**技術スタック**: Supabase (Postgres), SQL

**ファイル**:

- `docs/ticket/P3-004-db-rls-policy.md`（本チケット）
- （任意）`docs/sql/rls/*.sql` にポリシー雛形を保存

**API**: N/A（DB ポリシー設定のみ）

前提・実行順序:

1. 対象テーブル（例: `public.profiles`）が作成済みであること（`P3-001`/`P3-002`/`P3-003`）
2. 本チケットで RLS を有効化し、select/insert/update（必要に応じて delete）の自己行ポリシーを適用
3. 以後、新規テーブル追加時は本方針に従い同様のポリシーを適用

参考 SQL（雛形例）:

```sql
alter table public.some_table enable row level security;

create policy "allow select own rows" on public.some_table
  for select
  using (auth.uid() = user_id);

create policy "allow insert as self" on public.some_table
  for insert
  with check (auth.uid() = user_id);

create policy "allow update own rows" on public.some_table
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "allow delete own rows" on public.some_table
  for delete
  using (auth.uid() = user_id);
```

### 実装手順

1. RLS 方針を確認（deny-by-default、所有者一致が原則）
2. 対象テーブルに対して `enable row level security` を適用
3. select/insert/update（必要に応じて delete）の自己行ポリシーを作成
4. 実データでユーザー A/B によるアクセス検証（A は B の行にアクセスできない）
5. ポリシー雛形 SQL を `docs/sql/rls/` に保存（任意）

### テスト項目

- [ ] 自分の行は select できるが、他人の行は拒否される
- [ ] 自分の `user_id` 以外で insert しようとすると拒否される
- [ ] 他人の行の update は拒否される
- [ ] （任意）他人の行の delete は拒否される

### 完了条件

- [ ] 対象テーブルで RLS が有効化されている
- [ ] 自己行のみアクセス可能なポリシーが定義済み
- [ ] 簡易テストで期待どおり拒否/許可が動作
- [ ] 雛形 SQL（または手順）が共有済み

### 注意事項

- `auth.uid()` は認証済みユーザーの ID を返します。未認証セッションでは null のため操作は拒否されます。
- サービスロールキー（サーバー側処理）は RLS の影響を受けません。誤用を避けるためクライアントでは絶対に使用しないでください。
- 監査や運用要件に応じて delete 許可の要否を検討してください。

### 関連チケット

- P0-001-supabase-setup
- P3-002-profiles-table-setup
- P3-003-db-schema-initialization
