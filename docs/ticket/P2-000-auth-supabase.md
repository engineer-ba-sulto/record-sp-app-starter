### 基本情報

**タイトル**: auth-supabase の実装
**優先度**: P2

### 概要

Supabase Authentication（メール/パスワード）を用いた新規登録・ログイン・ログアウトの最小実装を行い、セッション状態に応じてルーティングを自動振り分ける。フォームは React Hook Form + zod で実装し、UI とロジックは責務分離する。

### 要件

- [ ] `@supabase/supabase-js` を用いて `signUp` / `signInWithPassword` / `signOut` を実装
- [ ] React Hook Form + zod バリデーションで「新規登録/ログイン」フォームを実装
- [ ] フォーム UI は再利用可能なコンポーネント構成（入力/ボタン/エラー表示）に分割
- [ ] セッション監視（`auth.getSession` + `onAuthStateChange`）で未ログインは `/auth`、ログイン済みは `(tabs)/index` へ自動振り分け
- [ ] エラー表示（フィールド単位/フォーム全体）とローディング状態を実装

### 技術仕様

**技術スタック**: Expo (React Native), TypeScript, Expo Router, @supabase/supabase-js, react-hook-form, @hookform/resolvers, zod, NativeWind/Tailwind（既存準拠）
**ファイル**:

- `src/app/auth/index.tsx`（サインイン/サインアップ UI／切替）
- `src/hooks/auth/useAuthForm.ts`（フォーム送信/バリデーション/状態管理）
- `src/components/auth/*`（`TextField`, `PasswordField`, `FormError`, `SubmitButton` など）
- 既存: `src/services/supabaseClient.ts`（Supabase クライアント）
- 既存: `src/app/_layout.tsx`（またはガード用レイアウト）にセッション監視/振分けを追加

**API**:

- Supabase Auth: `auth.signUp`, `auth.signInWithPassword`, `auth.signOut`, `auth.getSession`, `auth.onAuthStateChange`

### 実装手順

1. 依存関係導入（未導入なら）: `react-hook-form` / `zod` / `@hookform/resolvers`
2. `src/components/auth/*` を作成し、入力/ボタン/エラー表示を分割して実装
3. `src/hooks/auth/useAuthForm.ts` を作成し、zod スキーマ/Resolver/送信ハンドラを定義（新規登録/ログインを両対応）
4. `src/app/auth/index.tsx` にフォーム画面を実装し、ログイン/登録の切替、送信、エラー表示を接続
5. セッション取得/監視をルートレイアウトに追加し、未ログインは `/auth`、ログイン済みは `(tabs)/index` へ自動振分け
6. 成功/失敗時のトーストやメッセージ（例: 確認メール送信案内）を実装
7. 型/ビルド確認と実機/シミュレータでフロー動作確認

### テスト項目

- [ ] 正常系: 新規登録成功時に「確認メール送信（必要時）」の案内が表示される
- [ ] 正常系: 正しい資格情報でログインでき、タブホームへ遷移する
- [ ] 正常系: ログアウト実行で `/auth` に戻る
- [ ] 異常系: 無効なメール/短いパスワードなどで zod がフィールド単位にエラー表示する
- [ ] 異常系: Supabase エラー（認証失敗/レート制限など）のメッセージがフォーム全体に表示される
- [ ] ルーティング: 起動時/復帰時にセッションを反映し、未ログインは `/auth`、ログイン済みは `(tabs)/index` へ自動振分け
- [ ] 型/ビルド: TypeScript/ESLint のチェックが通る

### 完了条件

- [ ] `/auth` 画面でサインイン/サインアップが実行可能
- [ ] セッション監視とルート振分けが機能し、回帰がない
- [ ] UI/ロジック/サービスが分離され、再利用可能な構成になっている

### 注意事項

- 認証情報（メール/パスワード）をログ出力しない。PII 取り扱いに注意
- RLS は有効のまま（DB 側の実装は別チケット）。サーバデータアクセス前提のガードを徹底
- ネットワーク不安定時の失敗ハンドリング（再試行/ユーザ通知）を実装
- 将来の OAuth/Magic Link 拡張を見据え、ロジックは `useAuthForm` に集約

### 関連チケット

- P0-001-supabase-setup
- P2-002-auth-setup
- P2-003-auth-ui
- P2-004-auth-implementation
- P2-005-auth-access-control
