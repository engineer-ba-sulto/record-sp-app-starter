import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

// AdMob設定
export const ADMOB_CONFIG = {
  // テスト用広告ユニットID
  testAdUnitIds: {
    banner: Platform.select({
      ios: TestIds.BANNER,
      android: TestIds.BANNER,
      default: TestIds.BANNER,
    }),
    interstitial: Platform.select({
      ios: TestIds.INTERSTITIAL,
      android: TestIds.INTERSTITIAL,
      default: TestIds.INTERSTITIAL,
    }),
    rewarded: Platform.select({
      ios: TestIds.REWARDED,
      android: TestIds.REWARDED,
      default: TestIds.REWARDED,
    }),
  },

  // 本番用広告ユニットID（後で設定）
  productionAdUnitIds: {
    banner: "",
    interstitial: "",
    rewarded: "",
  },
};

// 現在の環境に応じた広告ユニットIDを取得
export const getAdUnitId = (type: "banner" | "interstitial" | "rewarded") => {
  const isTestMode = __DEV__; // 開発環境ではテスト用広告を使用

  if (isTestMode) {
    return ADMOB_CONFIG.testAdUnitIds[type];
  }

  return (
    ADMOB_CONFIG.productionAdUnitIds[type] || ADMOB_CONFIG.testAdUnitIds[type]
  );
};
