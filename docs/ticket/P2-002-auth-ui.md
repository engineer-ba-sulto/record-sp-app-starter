### 基本情報

**タイトル**: auth-ui の実装
**優先度**: P2

### 概要

React Hook Form + zod を用いた「新規登録/ログイン」共通 UI コンポーネントを作成する。入力/ボタン/エラー表示を分割し、フォームの再レンダリングを最小化する。

### 要件

- [ ] `react-hook-form`, `zod`, `@hookform/resolvers` を導入
- [ ] 入力コンポーネント（`TextField`, `PasswordField`）を作成
- [ ] エラー表示（フィールド単位 `FieldErrorMessage` / フォーム全体 `FormError`）を作成
- [ ] 送信ボタン（ローディング/disabled 状態対応）を作成
- [ ] `src/app/auth/index.tsx` から再利用できる構成にする

### 技術仕様

**技術スタック**: React Native, TypeScript, react-hook-form, zod, @hookform/resolvers, NativeWind/Tailwind
**ファイル**:

- `src/components/auth/TextField.tsx`
- `src/components/auth/PasswordField.tsx`
- `src/components/auth/FieldErrorMessage.tsx`
- `src/components/auth/FormError.tsx`
- `src/components/auth/SubmitButton.tsx`
- 既存: `src/app/auth/index.tsx`

**API**:

- なし（UI コンポーネントのみ）

### 実装手順

1. 依存を導入
2. 入力コンポーネントを実装し、Controller 経由で `TextInput` を接続
3. エラー表示コンポーネントを追加（フィールド/フォーム全体）
4. 送信ボタンを追加し、`isSubmitting` と連動
5. 最低限のスタイル（既存 Tailwind に準拠）を適用

### テスト項目

- [ ] フィールドエラーが適切に表示/非表示される
- [ ] `isSubmitting` 中はボタンが無効化されスピナー/状態が反映される
- [ ] 型/ビルドが通る

### 完了条件

- [ ] `/auth` 画面が UI コンポーネントで構成され、再利用可能
- [ ] 不要な再レンダリングがなく、操作感が良好

### 注意事項

- コンポーネントは表示責務に限定し、ビジネスロジックは持たない

### 関連チケット

- P2-002-auth-setup
- P2-004-auth-implementation
- P2-001-auth-supabase（親チケット）
