import { useEffect, useState } from "react";
import { handleNavigationError } from "../utils/navigationHelpers";
import { onboardingStorage } from "../utils/onboardingStorage";

/**
 * オンボーディング状態を管理するカスタムフック
 */
export const useOnboarding = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  /**
   * 初回起動判定を実行
   */
  const checkOnboardingStatus = async () => {
    try {
      setIsLoading(true);

      // 開発中は強制的にオンボーディングを表示（必要に応じてコメントアウト）
      // const seen = false; // 開発中は常にオンボーディングを表示
      const seen = await onboardingStorage.hasSeenOnboarding();

      setHasSeenOnboarding(seen);
    } catch (error) {
      console.error("Failed to check onboarding status:", error);
      // エラー時は安全のためfalseを設定（オンボーディングを表示）
      setHasSeenOnboarding(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * オンボーディング完了処理
   */
  const completeOnboarding = async () => {
    try {
      await onboardingStorage.setOnboardingComplete();
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      throw error;
    }
  };

  /**
   * オンボーディング完了処理（ナビゲーションは自動的に処理される）
   */
  const completeOnboardingWithNavigation = async () => {
    try {
      await completeOnboarding();
      // ナビゲーションは_layout.tsxの認証チェックロジックが自動的に処理する
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      handleNavigationError(error);
      throw error;
    }
  };

  /**
   * オンボーディング状態をリセット（デバッグ用）
   */
  const resetOnboarding = async () => {
    try {
      await onboardingStorage.resetOnboardingStatus();
      setHasSeenOnboarding(false);
    } catch (error) {
      console.error("Failed to reset onboarding:", error);
      throw error;
    }
  };

  // コンポーネントマウント時に初回起動判定を実行
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  return {
    isLoading,
    hasSeenOnboarding,
    completeOnboarding,
    completeOnboardingWithNavigation,
    resetOnboarding,
    checkOnboardingStatus,
  };
};
