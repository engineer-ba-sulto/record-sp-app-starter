### 基本情報

**タイトル**: auth-implementation の実装
**優先度**: P2

### 概要

Supabase Auth を用いた `signUp` / `signInWithPassword` / `signOut` の実装と、フォーム送信ハンドラ/バリデーション（zod）の結線を行う。成功/失敗のメッセージ表示も含む。

### 要件

- [ ] `src/hooks/auth/useAuthForm.ts` を実装し、zod スキーマ/Resolver/送信ハンドラを定義
- [ ] 新規登録/ログインを同一フォームで切替可能にする
- [ ] Supabase エラーをフォーム全体のエラーにマップ
- [ ] 成功時のメッセージ（例: 登録直後の確認メール案内）を表示
- [ ] ログアウトの実装（ヘッダ/設定画面などから呼び出し可能）

### 技術仕様

**技術スタック**: @supabase/supabase-js, react-hook-form, zod, TypeScript
**ファイル**:

- `src/hooks/auth/useAuthForm.ts`
- 既存: `src/services/supabaseClient.ts`
- 既存: `src/app/auth/index.tsx`

**API**:

- `auth.signUp`, `auth.signInWithPassword`, `auth.signOut`

### 実装手順

1. zod スキーマ（email, password 最小長など）と resolver を作成
2. 送信ハンドラで Supabase Auth を呼び出し、成功/失敗を UI に反映
3. フォーム切替（サインアップ/サインイン）ロジックを追加
4. ログアウト関数を `services` or `hooks` に用意し、画面から呼べるようにする

### テスト項目

- [ ] 正常系: 新規登録に成功し、案内が表示される
- [ ] 正常系: 正しい資格情報でログインできる
- [ ] 正常系: ログアウトで未ログイン状態になる
- [ ] 異常系: 認証失敗時にエラーメッセージが表示される

### 完了条件

- [ ] 認証 API 呼び出しが UI と結線され、成功/失敗の挙動が確認できる

### 注意事項

- 連打防止や二重送信対策（`isSubmitting`）を徹底

### 関連チケット

- P2-002-auth-setup
- P2-003-auth-ui
- P2-005-auth-access-control
- P2-001-auth-supabase（親チケット）
