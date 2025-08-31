# **【超共通版】アプリ開発の基盤となる MVP 開発ロードマップ**

このロードマップは、フィットネスアプリと禁煙アプリの両方に共通する**技術的な土台と、再利用可能なコンポーネント/ロジック**の実装のみを対象とします。これを完了させることで、各アプリ固有の機能開発にスムーズに着手できます。
なお、アプリ内アナリティクスは本ロードマップでは実装しません（Supabase 標準外のため）。必要に応じて別途導入してください。

## **ステップ 0：プロジェクト基盤の構築**

- **0-1. Supabase 連携**: Supabase プロジェクトを作成し、`@supabase/supabase-js` を導入。Auth（メール/パスワード）と Postgres の初期設定を完了させます（RLS は有効のまま）。

## **ステップ 1：アプリオンボーディングの実装**

- **1-1. オンボーディング完了後に認証画面へ誘導（最小修正）**:
  - 完了/スキップ時に `/auth` へ遷移する（`completeOnboardingWithNavigation` を使用）
  - `src/app/auth/index.tsx` を作成して `/auth` ルートを有効化（簡易ログイン UI で可）
  - 上記完了後、ステップ 2（Supabase 認証）へ進む

## **ステップ 2：認証（Supabase Auth）**

- **2-1. 認証設定**: Supabase Authentication を有効化（メール/パスワードから開始）。
- **2-2. UI 作成**: 新規登録・ログインの共通 UI コンポーネントを作成。
  - フォーム基盤に React Hook Form を採用し、`@hookform/resolvers/zod` + `zod` でスキーマバリデーションを実装。
  - React Native の入力は `Controller` 経由で `TextInput` を接続し、再レンダリングを最小化。
  - 入力エラー表示はコンポーネント化して再利用（フィールド単位のエラーメッセージ、フォーム全体のエラー）。
  - コンポーネント分割: Presentational コンポーネント（表示専用）と Container/Screen（状態・ハンドラ保持）を分離。
  - ロジック分離: Supabase 呼び出し、フォーム送信、ルーティングは `src/hooks/auth/*` や `src/services/*` に集約し、UI からは props で受け渡し。
  - ディレクトリ例: `src/components/auth/*`（入力/ボタン/エラー表示）、`src/hooks/auth/useAuthForm.ts`、画面は `src/app/auth/index.tsx`。
- **2-3. 機能実装**: `@supabase/supabase-js` で `signUp` / `signInWithPassword` / `signOut` を実装。
- **2-4. アクセス制御**: Expo Router でセッション監視し、未ログインは `/auth`、ログイン済みは仮ホーム（`(tabs)/index.tsx` 等）へ自動振り分け。

## **ステップ 3：データベース（Supabase/Postgres）**

- **3-1. Drizzle 導入**: `drizzle-orm` と `drizzle-kit` を導入し、`drizzle.config.ts` と `src/db/schema/*` を作成。`drizzle-kit generate` で SQL マイグレーションを生成し、Supabase に適用（Supabase CLI もしくは SQL エディタ）。実行時の DB アクセスは引き続き `@supabase/supabase-js` を使用。
- **3-2. プロフィールテーブル作成（Drizzle スキーマ → マイグレーション適用、auth.users 連携）**: `src/db/schema/profiles.ts` に `public.profiles` を定義し、ON DELETE CASCADE を設定。`drizzle-kit generate` で生成した SQL を Supabase に適用。
- **3-3. スキーマ初期化（Drizzle）**: 各アプリの要件に応じてテーブル/インデックス/制約を Drizzle スキーマに定義し、マイグレーションを生成・適用（このロードマップでは雛形レベルに留める）。
- **3-4. セキュリティ設定（RLS）**: すべてのアプリ用テーブルで RLS を有効化し、「ユーザーは自身のデータのみ」ポリシー（select/insert/update を自己行のみに制限）を適用。RLS は SQL マイグレーション（`migrations/*.sql` など）として管理・適用。

## **ステップ 4：ペイウォールの実装**

- **4-1. RevenueCat 導入**: RevenueCat を課金基盤として採用。ストア製品と Offerings/Packages を設定。クライアントに `react-native-purchases` を導入。
- **4-2. UI 作成**: タイトル/特典/価格/CTA（購入・復元・規約/プライバシー）を含む再利用可能コンポーネントを作成。`Offerings` からプラン/価格を表示。
  - コンポーネント分割/ロジック分離はステップ 2 の方針に準拠（`src/components/paywall/*`, `src/hooks/paywall/*` など）。
- **4-3. 表示タイミング**: オンボーディング完了 → 認証完了直後に初回表示。以降は機能到達/制限到達時に表示。
- **4-4. 購入/復元フロー**: `Purchases.purchasePackage` と `Purchases.restorePurchases` を実装し、完了後 `CustomerInfo` を反映（エラー/キャンセルハンドリング含む）。
- **4-5. エンタイトルメント判定/機能ガード**: `CustomerInfo.entitlements.active`（例: `premium`）でプレミアム判定。未購読時はペイウォールへ誘導。起動時/復帰時に最新状態をフェッチ。
- **4-6. サーバ連携（任意）**: RevenueCat Webhooks → Supabase Edge Functions で購入/解約イベントを記録し、必要に応じて購読状態を Supabase に保持（アナリティクスは対象外）。
