import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "hasSeenOnboarding";

/**
 * オンボーディング表示状態を管理するユーティリティ
 */
export const onboardingStorage = {
  /**
   * オンボーディングを既に見たかどうかを確認
   */
  async hasSeenOnboarding(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === "true";
    } catch (error) {
      console.error("Failed to get onboarding status:", error);
      // エラー時は安全のためfalseを返す（オンボーディングを表示）
      return false;
    }
  },

  /**
   * オンボーディング完了フラグを設定
   */
  async setOnboardingComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    } catch (error) {
      console.error("Failed to set onboarding status:", error);
      throw error;
    }
  },

  /**
   * オンボーディング状態をリセット（デバッグ用）
   */
  async resetOnboardingStatus(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
      console.error("Failed to reset onboarding status:", error);
      throw error;
    }
  },
};
