### 基本情報

**タイトル**: supabase-setup の実装
**優先度**: P0

### 概要

Supabase プロジェクトを新規作成し、クライアント SDK（@supabase/supabase-js）接続と初期設定（Auth/Database/RLS 有効）を行う。アプリから安全に Supabase へ接続できる土台を整え、以降の認証・DB 実装（ステップ 2）にスムーズに移行できる状態を作る。

### 要件

- [ ] Supabase プロジェクトを新規作成し、URL と anon key を取得する
- [ ] クライアント SDK（@supabase/supabase-js）を導入し、接続クライアントを作成する
- [ ] RLS を「有効のまま」に保ち、Auth/Database の初期設定方針をチームで共有する

### 技術仕様

**技術スタック**: Expo (React Native), TypeScript, @supabase/supabase-js, Expo Router
**ファイル**:

- 提案: `src/services/supabaseClient.ts`（Supabase クライアント生成）
- 提案: `src/config/supabase.ts` または `app.json` の `extra` に Supabase 設定を格納し、`expo-constants` から参照
  **API**:
- Supabase Auth（将来実装で使用）: `signUp`, `signInWithPassword`, `signOut`

### 実装手順

1. Supabase プロジェクトを作成し、`Project URL` と `anon public key` を取得する
2. パッケージを導入（例: `bun add @supabase/supabase-js` または `npm i @supabase/supabase-js`）
3. `src/services/supabaseClient.ts` を作成し、URL/KEY からクライアントを生成
4. 機密情報は `app.json` の `extra` もしくは EAS Secrets（ビルド時）で管理する方針を明記
5. 開発環境で接続確認（例: `auth.getUser()` がエラーなく呼べる）

### テスト項目

- [ ] アプリ起動時に Supabase へ接続できる（最低限の呼び出しが成功）
- [ ] RLS が有効であることを確認（無効化していないこと）
- [ ] ビルド/型チェックが通る（型エラー・リンターエラーなし）

### 完了条件

- [ ] `src/services/supabaseClient.ts` が存在し、アプリどこからでも参照可能
- [ ] 機密情報の取り扱い方針（開発/本番）が README もしくはチームノートに記載
- [ ] 以降の認証実装（ステップ 2）に着手できる下準備が整っている

### 注意事項

- 機密情報（URL/キー）の取り扱いに注意。リポジトリへ直接コミットしない運用（EAS Secrets or `app.json` の除外）を徹底
- 将来の Edge Functions/DB 拡張を見据え、クライアント生成は 1 箇所に集約

### 関連チケット

- P1-002-onboarding-auth-route（オンボーディング後の遷移）
- 予定: ステップ 2（認証/DB 実装）一連のチケット
