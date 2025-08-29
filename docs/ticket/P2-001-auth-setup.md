### 基本情報

**タイトル**: auth-setup の実装
**優先度**: P2

### 概要

Supabase Authentication をメール/パスワードで有効化し、クライアント SDK から呼び出すための下準備（設定確認・依存導入・環境値の参照方法）を整備する。

### 要件

- [ ] Supabase ダッシュボードで Email/Password を有効化
- [ ] `@supabase/supabase-js` の導入確認（未導入なら追加）
- [ ] 環境値（`SUPABASE_URL`/`SUPABASE_ANON_KEY`）の取得・定義方法を README に明記
- [ ] `src/services/supabaseClient.ts` でクライアント生成済みであることを再確認

### 技術仕様

**技術スタック**: Supabase, @supabase/supabase-js, Expo, TypeScript
**ファイル**:

- 既存: `src/services/supabaseClient.ts`
- 既存/更新: `README.md`（環境値の設定手順）
- 既存/候補: `src/config/supabase.ts` or `app.json` の `extra`

**API**:

- Supabase Auth 機能有効化手順（ダッシュボード）

### 実装手順

1. Supabase プロジェクトの Auth 設定で Email/Password を有効化
2. SDK の導入状況を確認し、未導入なら追加
3. `app.json` の `extra` or EAS Secrets のどちらで管理するかを決定し、README に記載
4. `src/services/supabaseClient.ts` で URL/KEY を参照しているか確認

### テスト項目

- [ ] ダッシュボードで Email/Password が有効になっている
- [ ] `supabaseClient` の初期化がエラーなく成功する
- [ ] 環境値の参照手順が README に明確

### 完了条件

- [ ] 認証フロー実装（後続チケット）に着手できる下準備が完了
- [ ] セキュアなキー管理方針が共有済み

### 注意事項

- 認証キーはリポジトリに含めない
- 環境間（開発/本番）でキーを取り違えないように手順を明確化

### 関連チケット

- P0-001-supabase-setup
- P2-001-auth-supabase（親チケット）
