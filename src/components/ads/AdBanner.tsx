import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { getAdUnitId } from "../../config/ads";

// コンポーネントのProps型定義
export interface AdBannerProps {
  /**
   * 広告読み込み時のコールバック
   */
  onAdLoaded?: () => void;

  /**
   * 広告読み込み失敗時のコールバック
   */
  onAdFailedToLoad?: (error: any) => void;

  /**
   * 広告クリック時のコールバック
   */
  onAdOpened?: () => void;

  /**
   * 広告クローズ時のコールバック
   */
  onAdClosed?: () => void;

  /**
   * 遅延読み込みを有効にするかどうか
   * @default true
   */
  enableLazyLoad?: boolean;
}

/**
 * バナー広告コンポーネント
 * AdMob SDKを使用してバナー広告を表示する再利用可能なコンポーネント
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  onAdLoaded,
  onAdFailedToLoad,
  onAdOpened,
  onAdClosed,
  enableLazyLoad = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(!enableLazyLoad);

  // 広告ユニットIDを取得
  const adUnitId = getAdUnitId("banner");

  // 遅延読み込み用のIntersection Observer風の処理
  useEffect(() => {
    if (!enableLazyLoad || isVisible) {
      return;
    }

    // 簡易的な遅延読み込み（実際のアプリではIntersection Observerを使用）
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [enableLazyLoad, isVisible]);

  // 広告読み込み成功時の処理
  const handleAdLoaded = useCallback(async () => {
    setIsLoaded(true);
    setHasError(false);
    onAdLoaded?.();
  }, [onAdLoaded, adUnitId]);

  // 広告読み込み失敗時の処理
  const handleAdFailedToLoad = useCallback(
    async (error: any) => {
      console.error("Banner ad failed to load:", error);
      setHasError(true);
      setIsLoaded(false);
      onAdFailedToLoad?.(error);
    },
    [onAdFailedToLoad, adUnitId]
  );

  // 広告クリック時の処理
  const handleAdOpened = useCallback(() => {
    onAdOpened?.();
  }, [onAdOpened]);

  // 広告クローズ時の処理
  const handleAdClosed = useCallback(() => {
    onAdClosed?.();
  }, [onAdClosed]);

  // エラー状態または未表示の場合は何も表示しない
  if (hasError || !isVisible) {
    return null;
  }

  return (
    <View>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
        onAdOpened={handleAdOpened}
        onAdClosed={handleAdClosed}
      />
    </View>
  );
};

export default AdBanner;
