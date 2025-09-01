import { router } from "expo-router";

/**
 * ナビゲーションエラーハンドリング補助関数
 */
export const handleNavigationError = (
  error: unknown,
  fallbackPath: string = "/"
): void => {
  console.error("ナビゲーションエラーが発生しました:", error);
  try {
    router.replace(fallbackPath);
  } catch (fallbackError) {
    console.error("フォールバックナビゲーションも失敗しました:", fallbackError);
  }
};
