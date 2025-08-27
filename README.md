# AdMob 広告コンポーネント サンプル

このプロジェクトは、React Native で AdMob 広告を実装するためのサンプルアプリケーションです。
Expo Router と NativeWind を使用して構築されています。
この README に記載されていない不明な点や、トラブルシューティングが必要な場合は、このファイルを参照しながら AI アシスタントに質問してください。

## インストール

```sh
# 必要な依存関係のインストール
npm install react-native-google-mobile-ads
```

## 既存プロジェクトへの追加方法

この AdMob 広告機能を既存の React Native プロジェクトに追加する方法を説明します。

### 必要なパッケージのインストール

```sh
cd your-existing-project

# AdMobパッケージのインストール
npm install react-native-google-mobile-ads

# またはyarnを使用する場合
yarn add react-native-google-mobile-ads
```

### Expo 設定の確認

`app.json`または`app.json`に AdMob プラグインが設定されていることを確認してください：

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXX~XXXXXXXXXX",
          "iosAppId": "ca-app-pub-XXXXXXXXXX~XXXXXXXXXX"
        }
      ]
    ]
  }
}
```

### AdMob SDK の共通部分のファイルのコピーと設定

#### 設定ファイルの作成

プロジェクトの`src/config/`ディレクトリを作成し、`ads.ts`ファイルをコピーしてください。

バナー、インタースティシャル、報酬型広告のユニット ID を設定は空文字列のままにしておきます。

```typescript:src/config/ads.ts
productionAdUnitIds: {
  banner: "",
  interstitial: "",
  rewarded: "",
},
```

#### AdMob SDK の初期化

`src/services/ads.ts`ファイルをプロジェクトにコピーし、アプリのエントリーポイントで初期化してください。

##### 初期化の実装例

```typescript:src/app/_layout.tsx
// src/app/_layout.tsx
import { Slot } from "expo-router";
import { useEffect } from "react";
import adsService from "../services/ads";
import "../global.css";

export default function Layout() {
  useEffect(() => {
    // AdMob SDKの初期化
    adsService
      .initialize()
      .then(() => {
        console.log("AdMob initialized successfully");
      })
      .catch((error) => {
        console.error("Failed to initialize AdMob:", error);
      });
  }, []);

  return <Slot />;
}
```

**AdsService の利点:**

- 一度だけ初期化されるよう管理されている
- 将来的な拡張性が高い（インタースティシャル、リワード広告の準備済み）
- 広告ユニット ID の管理が容易
- テスト/本番環境の判定機能付き

### バナー広告に必要なファイルのコピーと設定

#### バナー広告コンポーネントの作成

`src/components/ads/`ディレクトリを作成し、以下のファイルをコピーしてください：

- AdBanner.tsx
- index.ts

#### バナー広告の使用例

広告コンポーネントを画面で使用します：

```tsx:src/app/HomeScreen.tsx
// src/app/HomeScreen.tsx
import React from "react";
import { View, Text } from "react-native";
import { AdBanner } from "../components/ads";

export default function HomeScreen() {
  return (
    <View className="flex-1">
      <View className="flex-1 justify-center items-center">
        <Text>メインコンテンツ</Text>
      </View>
      <AdBanner
        onAdLoaded={() => console.log("広告が読み込まれました")}
        onAdFailedToLoad={(error) => console.error("広告読み込み失敗:", error)}
      />
    </View>
  );
}
```

### インタースティシャル広告に必要なファイルのコピーと設定

#### インタースティシャル広告フックの作成

`src/hooks/`ディレクトリを作成し、以下のファイルをコピーしてください：

- useAdInterstitial.ts
- index.ts

#### インタースティシャル広告の使用例

```tsx:src/app/HomeScreen.tsx
import { useAdInterstitial } from "@/hooks";

const MyComponent = () => {
  const { isLoaded, showAd } = useAdInterstitial();

  const handleShowAd = async () => {
    const success = await showAd();
    if (success) {
      console.log("広告表示成功");
    }
  };

  return (
    <TouchableOpacity onPress={handleShowAd} disabled={!isLoaded}>
      <Text>{isLoaded ? "広告を表示" : "準備中..."}</Text>
    </TouchableOpacity>
  );
};
```

### テストと確認

#### テスト

各広告タイプが正しく動作するかテストしてください：

##### iOS の確認方法

```sh
# iOS 用にネイティブプロジェクトを生成
npx expo prebuild --platform ios

# iOS アプリを実行して広告が正しく表示されることを確認
npx expo run:ios
```

##### Android の確認方法

```sh
# Android 用にネイティブプロジェクトを生成
npx expo prebuild --platform android

# Android SDK のパスを設定（必要に応じて）
export ANDROID_HOME=/Users/$(whoami)/Library/Android/sdk

# Android アプリを実行して広告が正しく表示されることを確認
npx expo run:android
```

**注意:** Android ビルドを行う場合、Android Studio がインストールされており、ANDROID_HOME 環境変数が正しく設定されていることを確認してください。Android SDK の標準的なインストール先は `/Users/$(whoami)/Library/Android/sdk` です。

**テスト時に確認すること:**

- バナー広告が正しく表示されるか
- インタースティシャル広告が読み込まれて表示されるか
- エラーが発生しないか

### 本番環境の設定

#### 本番用広告ユニット ID の設定

`src/config/ads.ts`の`productionAdUnitIds`に実際の広告ユニット ID を設定してください：

```typescript:src/config/ads.ts
productionAdUnitIds: {
  banner: "ca-app-pub-XXXXXXXXXX/XXXXXXXXXX",        // 実際のバナー広告ユニットID
  interstitial: "ca-app-pub-XXXXXXXXXX/XXXXXXXXXX",  // 実際のインタースティシャル広告ユニットID
  rewarded: "ca-app-pub-XXXXXXXXXX/XXXXXXXXXX",      // 実際の報酬型広告ユニットID
},
```

#### 環境変数を使用した設定（オプション）

より安全な設定のために、環境変数を使用することができます：

```typescript:src/config/ads.ts
productionAdUnitIds: {
  banner: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || "",
  interstitial: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID || "",
  rewarded: process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID || "",
},
```

環境変数は`.env`ファイルまたは Expo のビルド設定で定義してください：

```bash
# .env ファイル
EXPO_PUBLIC_ADMOB_BANNER_ID=ca-app-pub-XXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_ADMOB_REWARDED_ID=ca-app-pub-XXXXXXXXXX/XXXXXXXXXX
```

#### Expo ビルド時の設定確認

本番ビルド前に以下の設定を確認してください：

1. **app.json/app.config.js の確認**

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXX~XXXXXXXXXX",
          "iosAppId": "ca-app-pub-XXXXXXXXXX~XXXXXXXXXX"
        }
      ]
    ]
  }
}
```

2. **ビルドコマンド**

```sh
# 開発ビルド
npx expo run:android --variant release
npx expo run:ios --configuration Release

# または EAS Build を使用
npx eas build --platform ios --profile production
npx eas build --platform android --profile production
```

#### 本番環境でのテスト広告表示の無効化

`getAdUnitId`関数は`__DEV__`フラグを使用して自動的に環境を判定しますが、本番ビルドでもテスト広告を確認したい場合は、以下の方法で一時的にテストモードを有効化できます：

```typescript
// 一時的なテストモード有効化（本番確認用）
const FORCE_TEST_MODE = false; // trueにすると本番環境でもテスト広告を表示

export const getAdUnitId = (type: "banner" | "interstitial" | "rewarded") => {
  const isTestMode = __DEV__ || FORCE_TEST_MODE;

  if (isTestMode) {
    return ADMOB_CONFIG.testAdUnitIds[type];
  }

  return (
    ADMOB_CONFIG.productionAdUnitIds[type] || ADMOB_CONFIG.testAdUnitIds[type]
  );
};
```

#### リリース前の確認事項

- ✅ 本番用の広告ユニット ID が正しく設定されている
- ✅ iOS/Android のアプリ ID が AdMob コンソールで作成したものと一致する
- ✅ テストビルドで広告が正しく表示されることを確認
- ✅ エラーハンドリングが適切に実装されている
- ✅ 広告表示によるアプリのパフォーマンス影響を確認

## 注意事項

### 1. アプリ ID の設定

- 必ず実際の AdMob アプリ ID を設定してください
- iOS と Android で異なる ID を使用します

### 2. 広告ユニット ID

- 各広告タイプごとにユニット ID を作成してください
- 開発時は自動的にテスト広告が表示されます

### 3. テストモード

- 開発中は自動的にテスト広告が表示されます
- 本番環境では設定した広告ユニット ID が使用されます

### 4. パフォーマンス

- バナー広告は遅延読み込みがデフォルトで有効になっています
- インタースティシャル広告は事前に読み込んでおくことを推奨します

### 5. エラーハンドリング

- 広告表示が失敗してもアプリの機能が停止しないように実装してください

## 参考資料

- [AdMob 公式ドキュメント](https://admob.google.com/)
- [React Native Google Mobile Ads](https://github.com/invertase/react-native-google-mobile-ads)
- [Expo ドキュメント](https://docs.expo.dev/)

## 完了！

AdMob 広告機能を 3 つのパートに分けて実装しました：

### AdMob SDK の共通部分

- ✅ パッケージインストール
- ✅ Expo 設定
- ✅ 設定ファイル（`src/config/ads.ts`）
- ✅ AdMob SDK 初期化（`src/services/ads.ts`）

### バナー広告

- ✅ AdBanner コンポーネント（`src/components/ads/`）
- ✅ 基本的な使用方法

### インタースティシャル広告

- ✅ useAdInterstitial フック（`src/hooks/`）
- ✅ 広告読み込み・表示機能

各パートのファイルをコピーして、AdMob 設定を実際の値に変更してください。

## 免責事項

- **このプロジェクトを使用した結果生じた問題や損害について、一切の責任を負いません**
- AdMob 広告の実装および運用はユーザーの責任で行ってください
- 広告収入に関する保証はできません
- 使用するライブラリの更新による互換性の問題についてはサポートできません
- 法的・倫理的な問題が発生した場合、ユーザーの責任で対処してください
