### 基本情報

**タイトル**: drizzle-setup の実装
**優先度**: P3

### 概要

Drizzle（`drizzle-orm`）と Drizzle Kit（`drizzle-kit`）を導入し、Postgres（Supabase）向けに TypeScript でスキーマを定義できる基盤を整備します。スキーマから SQL マイグレーションを生成し、Supabase に適用できる状態にします。実行時のデータアクセスは引き続き `@supabase/supabase-js` を利用します（React Native クライアントで Drizzle の DB 接続は行いません）。

### 要件

- [ ] 依存関係の導入：`drizzle-orm`、`drizzle-kit`、`pg`（生成時のみ）
- [ ] `drizzle.config.ts` を作成し、Supabase 用の設定を定義
- [ ] `src/drizzle/schema/` を作成して初期スキーマ用のディレクトリを用意
- [ ] マイグレーション出力先（`src/drizzle/migrations/`）を用意
- [ ] `package.json` に生成・適用スクリプトを追加（例：`drizzle-kit generate`）
- [ ] 生成された SQL を Supabase に適用（Supabase CLI または SQL エディタ）
  - Supabase CLI を用いる場合：`supabase db push --local` ではなく、本番/開発いずれも SQL を Supabase プロジェクトの SQL エディタに貼り付けて適用する想定。
  - 生成先は `src/drizzle/migrations/`。出力ファイルを順に適用する。

### 技術仕様

**技術スタック**: Drizzle ORM, Drizzle Kit, Supabase (Postgres), TypeScript

**ファイル**:

- `docs/ticket/P3-001-drizzle-setup.md`（本チケット）
- `drizzle.config.ts`（ルート）
- `src/drizzle/schema/*`（スキーマ定義）
- `src/drizzle/migrations/*`（生成 SQL）

**API**: N/A（スキーマ・マイグレーション基盤の整備）

### 実装手順

1. `drizzle-orm`、`drizzle-kit` をインストール
2. ルートに `drizzle.config.ts` を作成（`schema: "src/drizzle/schema"`、`out: "src/drizzle/migrations"`）
3. `src/drizzle/schema/` を作成し、空のスキーマファイル群を配置（実体は後続チケットで定義）
4. `package.json` に `generate` スクリプトを追加（例：`drizzle-kit generate`）
5. 生成を実行し、空マイグレーションが出力されることを確認
6. Supabase にマイグレーションを適用（SQL エディタで `src/drizzle/migrations/` の SQL を順次実行）

### テスト項目

- [ ] `drizzle-kit generate` が成功し、指定ディレクトリに SQL が出力される
- [ ] 出力された SQL が Supabase で実行可能
- [ ] マイグレーションの再生成・再適用が安定して行える

### 完了条件

- [ ] Drizzle の設定ファイルとスキーマディレクトリが整備
- [ ] 生成・適用のフローがドキュメント化され、手元で再現可能
- [ ] 後続チケットでスキーマを追加できる状態

### 注意事項

- React Native クライアントでは Drizzle による DB 直接接続は行わず、`@supabase/supabase-js` を用います。
- RLS やポリシーは SQL で管理し、マイグレーションに含めて適用します。

### 関連チケット

- P0-001-supabase-setup
- P3-002-profiles-table-setup
- P3-003-db-schema-initialization
- P3-004-db-rls-policy
