# データベーススキーマ設計ガイドライン

## 命名規約

### テーブル名

- スネークケース（例: `user_profiles`, `app_meta`）
- 複数形を使用（例: `profiles` ではなく `user_profiles`）

### 列名

- スネークケース（例: `user_id`, `created_at`, `updated_at`）
- 主キーは `id` を使用
- 外部キーは `<table>_id` 形式（例: `user_id`, `profile_id`）

### インデックス名

- `<table>_<column>_idx` 形式（例: `profiles_user_id_idx`）
- 複合インデックスの場合は `<table>_<column1>_<column2>_idx`

## 制約方針

### 主キー

- すべてのテーブルに `id` カラム（UUID）を主キーとして設定
- `gen_random_uuid()` をデフォルト値として使用

### 外部キー

- 参照整合性を保つため、適切な外部キー制約を設定
- カスケード削除は慎重に検討（通常は `NO ACTION` を推奨）

### ユニーク制約

- ビジネスロジック上重複を許容しないカラムに設定
- 複合ユニーク制約は必要最小限に

### インデックス

- 高頻度クエリの WHERE 句に使用されるカラムに設定
- RLS ポリシーで使用される `user_id` カラムには必ずインデックスを設定
- 過剰な複合インデックスは避ける

## RLS（Row Level Security）原則

### 基本方針

- **Deny by default**: デフォルトではすべてのアクセスを拒否
- **自己行のみアクセス**: ユーザーは自分のデータのみアクセス可能
- **明示的なポリシー**: 必要なアクセス権限のみを明示的に許可

### ポリシー設計

- `auth.uid() = user_id` 形式を使用（optimizer 最適化）
- `TO authenticated` 句を使用して認証済みユーザーのみに適用
- クライアント側でも明示的なフィルタを併用（ベストプラクティス）

### パフォーマンス最適化

- RLS ポリシーで使用される `user_id` カラムには必ずインデックスを設定
- 複雑なポリシーは避け、シンプルな条件を推奨

## 共通カラム

### 必須カラム

```sql
id uuid primary key default gen_random_uuid(),
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

### 所有者カラム（RLS 用）

```sql
user_id uuid references auth.users(id) not null
```

## 新規テーブル追加時のチェックリスト

- [ ] 命名規約に従っているか（スネークケース）
- [ ] 主キー `id` が設定されているか
- [ ] `created_at`, `updated_at` が設定されているか
- [ ] RLS 用の `user_id` カラムが設定されているか
- [ ] 必要な外部キー制約が設定されているか
- [ ] 適切なインデックスが設定されているか（特に `user_id`）
- [ ] ユニーク制約が必要なカラムに設定されているか
- [ ] Drizzle スキーマで export されているか
- [ ] RLS ポリシーが後続チケットで実装予定か

## マイグレーション適用方法

### 開発環境

- `npx drizzle-kit push:pg` を使用（効率重視）

### 本番環境

- Supabase SQL エディタに生成された SQL を貼付（安全性重視）
- マイグレーション履歴を確認してから適用

### 注意事項

- マイグレーションメタ表は `drizzle` スキーマに作成される
- `public` スキーマに置きたい場合は `migrations.schema: "public"` を設定
- 未 export のテーブルは差分対象にならないため、必ず export する
