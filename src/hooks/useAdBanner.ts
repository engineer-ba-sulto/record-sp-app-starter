import { useCallback, useEffect, useState } from "react";
import { getAdUnitId } from "../config/ads";

export interface AdBannerLogicProps {
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

export interface AdBannerState {
  isLoaded: boolean;
  hasError: boolean;
  isVisible: boolean;
  adUnitId: string;
}

export interface AdBannerHandlers {
  handleAdLoaded: () => void;
  handleAdFailedToLoad: (error: any) => void;
  handleAdOpened: () => void;
  handleAdClosed: () => void;
}

/**
 * AdBannerコンポーネントのロジックを管理するカスタムフック
 */
export const useAdBanner = ({
  onAdLoaded,
  onAdFailedToLoad,
  onAdOpened,
  onAdClosed,
  enableLazyLoad = true,
}: AdBannerLogicProps) => {
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

  const state: AdBannerState = {
    isLoaded,
    hasError,
    isVisible,
    adUnitId,
  };

  const handlers: AdBannerHandlers = {
    handleAdLoaded,
    handleAdFailedToLoad,
    handleAdOpened,
    handleAdClosed,
  };

  return {
    state,
    handlers,
  };
};
