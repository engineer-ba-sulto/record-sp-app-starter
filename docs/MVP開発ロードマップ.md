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

## **ステップ 2：認証・データベース（Supabase）**

- **2-1. Supabase 設定**: Supabase Authentication を有効化します（まずはメールアドレス＆パスワード認証から）。
- **2-2. UI 作成**: 新規登録画面とログイン画面の共通 UI コンポーネントを作成します。
- **2-3. 機能実装**: `@supabase/supabase-js` を利用して、ユーザーの新規登録（`signUp`）、ログイン（`signInWithPassword`）、ログアウト（`signOut`）機能を実装します。
- **2-4. アクセス制御**: Expo Router にて Supabase のセッションを監視し、非ログインユーザーはログイン画面へ、**ログイン済みユーザーは仮のホーム画面（`(tabs)/index.tsx` など）へ自動的に振り分ける共通ロジック**を構築します。
- **2-5. セキュリティ設定**: Supabase の Row Level Security（RLS）で「ユーザーは自身のデータしか読み書きできない」という基本ポリシーを設定します（対象テーブルは各アプリで追記）。
- **2-6. 既存 Firebase からの移行（任意）**: 既存プロジェクトから移行する場合は、Supabase の公式ツール（firebase-to-supabase）を用いて Auth ユーザーおよび Firestore データを移行します。

## **ステップ 3：ペイウォールの実装**

- **3-1. RevenueCat 導入**: RevenueCat を課金基盤として採用します。プロジェクト/App を作成し、ストア製品（App Store/Google Play）と Offerings/Packages を設定します。クライアントには `react-native-purchases`（Expo の場合は Config Plugin）を導入します。
- **3-2. UI 作成**: タイトル、特典リスト、価格表示、CTA（購入・復元・利用規約/プライバシー）を含む再利用可能なペイウォールコンポーネントを作成します。RevenueCat の `Offerings` から取得したプラン/価格を表示します。
- **3-3. 表示タイミング**: オンボーディング完了 → 認証完了の直後に初回表示。以降は機能到達時/制限到達時のトリガーで適宜表示します。
- **3-4. 購入/復元フロー**: `Purchases.purchasePackage` による購入、`Purchases.restorePurchases` による復元を実装し、完了後に `CustomerInfo` を取得して状態を反映します（エラー/キャンセル時のハンドリングを含む）。
- **3-5. エンタイトルメント判定と機能ガード**: `CustomerInfo.entitlements.active` の有無（例: `premium`）でプレミアム状態を判定し、未購読時はペイウォールへ誘導します。起動時/復帰時に最新状態をフェッチして反映します。
- **3-6. サーバ連携（任意）**: RevenueCat Webhooks → Supabase Edge Functions 経由で購入/解約イベントを記録し、必要に応じて Supabase 上に購読状態を保持します（アナリティクスは対象外）。
