import mobileAds, {
  AdEventType,
  BannerAdSize,
  InterstitialAd,
  MaxAdContentRating,
} from "react-native-google-mobile-ads";
import { getAdUnitId } from "../config/ads";

class AdsService {
  private isInitialized = false;

  // インタースティシャル広告関連
  private interstitialAd: InterstitialAd | null = null;
  private isInterstitialLoaded = false;
  private isInterstitialShowing = false;

  /**
   * AdMobの初期化
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // 広告リクエストの設定
      await mobileAds().setRequestConfiguration({
        // すべての広告リクエストに適したコンテンツ評価を設定
        maxAdContentRating: MaxAdContentRating.PG,
        // COPPAの目的でコンテンツを児童向けとして扱うことを示す
        tagForChildDirectedTreatment: false,
        // 同意年齢未満のユーザーに適した方法で広告リクエストを処理することを示す
        tagForUnderAgeOfConsent: false,
        // テストデバイスIDを設定
        testDeviceIdentifiers: ["EMULATOR"],
      });
      // AdMob SDKの初期化
      await mobileAds().initialize();
      this.isInitialized = true;
      console.log("AdMob initialized successfully");
    } catch (error) {
      console.error("Failed to initialize AdMob:", error);
      throw error;
    }
  }

  /**
   * インタースティシャル広告の読み込み
   */
  async loadInterstitialAd(): Promise<void> {
    try {
      // すでに読み込み済みまたは読み込み中の場合は何もしない
      if (this.isInterstitialLoaded || this.interstitialAd) {
        console.log("Interstitial ad is already loaded or loading");
        return;
      }

      // 広告ユニットIDを取得
      const adUnitId = getAdUnitId("interstitial");

      // InterstitialAdインスタンスを作成
      this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId);

      // イベントリスナーを設定
      this.setupInterstitialEventListeners();

      // 広告を読み込む
      await this.interstitialAd.load();
      console.log("Interstitial ad loading started");
    } catch (error) {
      console.error("Failed to load interstitial ad:", error);
      this.cleanupInterstitialAd();
      throw error;
    }
  }

  /**
   * インタースティシャル広告の表示
   */
  async showInterstitialAd(): Promise<boolean> {
    try {
      // 広告が読み込み済みかチェック
      if (!this.isInterstitialLoaded || !this.interstitialAd) {
        console.warn("Interstitial ad is not loaded");
        return false;
      }

      // すでに表示中かチェック
      if (this.isInterstitialShowing) {
        console.warn("Interstitial ad is already showing");
        return false;
      }

      // 広告を表示
      await this.interstitialAd.show();
      console.log("Interstitial ad shown successfully");
      return true;
    } catch (error) {
      console.error("Failed to show interstitial ad:", error);
      this.cleanupInterstitialAd();
      return false;
    }
  }

  /**
   * リワード広告の読み込み（一時的に無効化）
   */
  async loadRewardedAd(): Promise<void> {
    console.log("Rewarded ad loading will be implemented later");
  }

  /**
   * リワード広告の表示（一時的に無効化）
   */
  async showRewardedAd(): Promise<boolean> {
    console.log("Rewarded ad showing will be implemented later");
    return false;
  }

  /**
   * バナー広告のサイズを取得
   */
  getBannerAdSize(type: "standard" | "large" = "standard"): BannerAdSize {
    switch (type) {
      case "standard":
        return BannerAdSize.BANNER;
      case "large":
        return BannerAdSize.LARGE_BANNER;
      default:
        return BannerAdSize.BANNER;
    }
  }

  /**
   * バナー広告のユニットIDを取得
   */
  getBannerAdUnitId(): string {
    return getAdUnitId("banner");
  }

  /**
   * バナー広告が利用可能かどうかをチェック
   */
  isBannerAdReady(): boolean {
    return this.isInitialized;
  }

  /**
   * インタースティシャル広告のイベントリスナーを設定
   */
  private setupInterstitialEventListeners(): void {
    if (!this.interstitialAd) {
      return;
    }

    // 広告読み込み成功時の処理
    this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log("Interstitial ad loaded successfully");
      this.isInterstitialLoaded = true;
    });

    // 広告読み込み失敗時の処理
    this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error("Interstitial ad failed to load:", error);
      this.cleanupInterstitialAd();
    });

    // 広告表示開始時の処理
    this.interstitialAd.addAdEventListener(AdEventType.OPENED, () => {
      console.log("Interstitial ad opened");
      this.isInterstitialShowing = true;
    });

    // 広告クローズ時の処理
    this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log("Interstitial ad closed");
      this.isInterstitialShowing = false;
      this.isInterstitialLoaded = false;
      this.cleanupInterstitialAd();
    });
  }

  /**
   * インタースティシャル広告のクリーンアップ
   */
  private cleanupInterstitialAd(): void {
    if (this.interstitialAd) {
      // イベントリスナーを削除
      this.interstitialAd.removeAllListeners();
      this.interstitialAd = null;
    }
    this.isInterstitialLoaded = false;
    this.isInterstitialShowing = false;
  }

  /**
   * インタースティシャル広告が読み込み済みかどうかをチェック
   */
  isInterstitialAdReady(): boolean {
    return this.isInterstitialLoaded && !this.isInterstitialShowing;
  }

  /**
   * インタースティシャル広告が表示中かどうかをチェック
   */
  isInterstitialAdShowing(): boolean {
    return this.isInterstitialShowing;
  }

  /**
   * 現在の環境がテスト環境かどうかを取得
   */
  isTestMode(): boolean {
    return __DEV__;
  }

  /**
   * 広告の状態をリセット
   */
  reset(): void {
    this.isInitialized = false;
    this.cleanupInterstitialAd();
  }
}

export default new AdsService();
