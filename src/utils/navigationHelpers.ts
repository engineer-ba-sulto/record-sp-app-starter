import { router } from "expo-router";

/**
 * 認証画面へのナビゲーション補助関数
 * オンボーディング完了後やスキップ時に使用
 */
export const navigateToAuth = (): void => {
  try {
    router.replace("/auth");
  } catch (error) {
    console.error("認証画面への遷移に失敗しました:", error);
    // フォールバックとしてホーム画面へ
    router.replace("/");
  }
};

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
