### 基本情報

**タイトル**: onboarding-auth-route の実装
**優先度**: P1

### 概要

オンボーディング完了/スキップ時に `/auth` へ遷移させ、認証導線を確立する。最小構成のログイン UI を `src/app/auth/index.tsx` に実装し、ステップ 2（Supabase 認証実装）への橋渡しを行う。

### 要件

- [ ] `src/app/auth/index.tsx` を新規作成し、`/auth` ルートを有効化
- [ ] オンボーディング完了/スキップ時に `completeOnboardingWithNavigation` 経由で `/auth` へ遷移
- [ ] 既存の `(tabs)/index.tsx` などホーム画面への遷移ロジックと競合しないこと

### 技術仕様

**技術スタック**: Expo Router, React Native, TypeScript, NativeWind/Tailwind (既存スタイル準拠)
**ファイル**:

- `src/app/auth/index.tsx`（簡易ログイン UI の仮実装）
- `src/hooks/useOnboarding.ts`（必要に応じて呼び出し位置の確認）
- `src/utils/navigationHelpers.ts`（遷移ヘルパーがある場合は活用）
  **API**:
- 今回は外部 API なし（将来 Supabase Auth を接続）

### 実装手順

1. `src/app/auth/index.tsx` を作成し、シンプルなログイン導線 UI（ボタン/入力のダミー）を配置
2. オンボーディング画面の完了/スキップのハンドラで `completeOnboardingWithNavigation('/auth')` を呼び出す
3. 最小ルーティング動作をローカルで確認し、ホーム画面への自動遷移と干渉しないかを検証

### テスト項目

- [ ] オンボーディング完了時に `/auth` へ確実に遷移する
- [ ] `/auth` 画面が正しく表示され、戻る操作でもクラッシュしない
- [ ] 既存タブナビゲーションと競合せず、ビルド/型チェックが通る

### 完了条件

- [ ] `/auth` ルートが存在し、オンボーディングからの遷移が機能
- [ ] 将来の Supabase 認証実装がこの画面に容易に追加可能
- [ ] 既存のナビゲーションフローが破壊されていない（回帰なし）

### 注意事項

- ペイウォール導線（ステップ 3）を後で差し込めるよう、画面遷移は一箇所に集約
- UI は最小限でよいが、クラッシュ防止のためエラーバウンダリ/ガードを意識

### 関連チケット

- P0-001-supabase-setup
- 予定: ステップ 2（Supabase 認証 UI/機能）
