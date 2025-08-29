### 基本情報

**タイトル**: auth-access-control の実装
**優先度**: P2

### 概要

セッション監視に基づくルーティング制御を実装する。未ログインは `/auth`、ログイン済みは `(tabs)/index` へ自動振分けし、起動時/復帰時にも状態を正しく反映する。

### 要件

- [ ] `auth.getSession` による起動時セッション取得
- [ ] `auth.onAuthStateChange` によるセッション変化の購読
- [ ] Expo Router でのガード（レイアウト/ガード用フック）実装
- [ ] 未ログインは `/auth`、ログイン済みは `(tabs)/index` へ自動振分け
- [ ] 復帰時（AppState 変更）にもセッション再取得（必要なら）

### 技術仕様

**技術スタック**: @supabase/supabase-js, Expo Router, React Native, TypeScript
**ファイル**:

- 既存/更新: `src/app/_layout.tsx`（またはガードレイアウト/フック）
- 既存: `src/services/supabaseClient.ts`

**API**:

- `auth.getSession`, `auth.onAuthStateChange`

### 実装手順

1. ルートレイアウト（またはガードコンポーネント）にセッション取得/購読を実装
2. セッション状態に応じて `router.replace('/auth')` or `router.replace('(tabs)')` を実行
3. 復帰時の再取得（必要に応じて `AppState` 連携）を実装
4. 回帰がないかナビゲーション全体を確認

### テスト項目

- [ ] 未ログインで起動 → `/auth` 表示
- [ ] ログイン成功 → `(tabs)/index` へ遷移
- [ ] ログアウト → `/auth` に戻る
- [ ] 復帰時も最新セッションに同期

### 完了条件

- [ ] セッション状態に基づくルーティング制御が安定し、回帰がない

### 注意事項

- ルーティングループやチラつきを最小化（条件分岐は早期 return）

### 関連チケット

- P2-002-auth-setup
- P2-003-auth-ui
- P2-004-auth-implementation
- P2-001-auth-supabase（親チケット）
