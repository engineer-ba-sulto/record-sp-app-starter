import { useCallback, useEffect, useState } from "react";
import adsService from "../services/ads";

/**
 * インタースティシャル広告の状態管理と操作を行うカスタムフック
 */
export const useAdInterstitial = () => {
  // 広告の状態管理
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 広告の読み込み状態をチェックして更新
   */
  const checkAdStatus = useCallback(() => {
    setIsLoaded(adsService.isInterstitialAdReady());
    setIsShowing(adsService.isInterstitialAdShowing());
  }, []);

  /**
   * インタースティシャル広告を読み込む
   */
  const loadAd = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await adsService.loadInterstitialAd();

      // 少し待ってから状態を確認（イベントリスナーの処理時間を考慮）
      setTimeout(() => {
        checkAdStatus();
        setIsLoading(false);
      }, 500);

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load interstitial ad";
      setError(errorMessage);
      setIsLoading(false);
      console.error("useAdInterstitial loadAd error:", err);
      return false;
    }
  }, [checkAdStatus]);

  /**
   * インタースティシャル広告を表示
   */
  const showAd = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);

      // 現在の状態を確認
      checkAdStatus();

      if (!isLoaded) {
        setError("Ad is not loaded yet");
        return false;
      }

      if (isShowing) {
        setError("Ad is already showing");
        return false;
      }

      const result = await adsService.showInterstitialAd();

      if (result) {
        setIsLoaded(false); // 表示後は読み込み状態をリセット
        setIsShowing(true);
        // 広告クローズ後の状態更新はAdsServiceのイベントリスナーで行われる
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to show interstitial ad";
      setError(errorMessage);
      console.error("useAdInterstitial showAd error:", err);
      return false;
    }
  }, [isLoaded, isShowing, checkAdStatus]);

  /**
   * エラーをクリア
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 状態をリセット
   */
  const reset = useCallback(() => {
    setIsLoaded(false);
    setIsLoading(false);
    setIsShowing(false);
    setError(null);
  }, []);

  // コンポーネントマウント時に初期状態を確認
  useEffect(() => {
    checkAdStatus();
  }, [checkAdStatus]);

  // 定期的に広告状態を確認（ポーリング）
  useEffect(() => {
    const interval = setInterval(() => {
      checkAdStatus();
    }, 1000); // 1秒ごとに確認

    return () => {
      clearInterval(interval);
    };
  }, [checkAdStatus]);

  // コンポーネントアンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      // 必要に応じてクリーンアップ処理
      reset();
    };
  }, [reset]);

  return {
    // 状態
    isLoaded,
    isLoading,
    isShowing,
    error,

    // メソッド
    loadAd,
    showAd,
    clearError,
    reset,
    checkAdStatus,
  };
};

export default useAdInterstitial;
