import { Stack, router, usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus, Text, View } from "react-native";
import { OnboardingContainer } from "../components/onboarding";
import "../global.css";
import { useOnboarding } from "../hooks/useOnboarding";
import { adsService } from "../services";
import supabase from "../services/supabaseClient";

export default function Layout() {
  const { isLoading, hasSeenOnboarding } = useOnboarding();
  const pathname = usePathname();
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState<boolean>(false);

  useEffect(() => {
    // AdsServiceを使用してAdMobを初期化
    adsService
      .initialize()
      .then(() => {
        console.log("AdMob initialized successfully");
      })
      .catch((error) => {
        console.error("Failed to initialize AdMob:", error);
      });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkInitialSession = async (): Promise<void> => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("getSession error:", error);
        }

        if (isMounted) {
          setIsAuthenticated(!!data?.session);
          setIsAuthInitialized(true);
        }
      } catch (e) {
        console.error("Failed to get initial session:", e);
        if (isMounted) {
          setIsAuthenticated(false);
          setIsAuthInitialized(true);
        }
      }
    };

    void checkInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, !!session);
        if (isMounted) {
          setIsAuthenticated(!!session);
        }
      }
    );

    const handleAppStateChange = (nextAppState: AppStateStatus): void => {
      const prevState = appStateRef.current;
      appStateRef.current = nextAppState;
      // 復帰時のみ最新セッションを再取得
      if (prevState.match(/inactive|background/) && nextAppState === "active") {
        supabase.auth
          .getSession()
          .then(({ data }) => {
            if (isMounted) {
              setIsAuthenticated(!!data.session);
            }
          })
          .catch((e) => {
            console.error("AppState getSession error:", e);
          });
      }
    };

    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
      appStateSubscription.remove();
    };
  }, []);

  // 初期化完了時の画面遷移処理
  useEffect(() => {
    if (!isAuthInitialized || isLoading || !hasSeenOnboarding) return;

    // 初期化完了後、適切な画面に遷移
    setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else {
        router.replace("/auth");
      }
    }, 100);
  }, [isAuthInitialized, isLoading, hasSeenOnboarding, isAuthenticated]);

  // 認証状態が変更された時のナビゲーション処理
  useEffect(() => {
    if (!isAuthInitialized || isLoading || !hasSeenOnboarding) return;

    const currentPath = pathname;

    if (isAuthenticated) {
      // ログイン済みで認証画面にいる場合はタブへ
      if (currentPath?.startsWith("/auth") || currentPath === "/") {
        router.replace("/(tabs)");
      }
    } else {
      // 未ログインでタブにいる場合は認証画面へ
      if (currentPath?.startsWith("/(tabs)") || currentPath === "/") {
        router.replace("/auth");
      }
    }
  }, [
    isAuthenticated,
    isAuthInitialized,
    pathname,
    isLoading,
    hasSeenOnboarding,
  ]);

  // 初回起動判定中はローディング表示
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">読み込み中...</Text>
      </View>
    );
  }

  // 初回起動時はオンボーディング画面に遷移
  if (!hasSeenOnboarding) {
    const onboardingScreens = [
      {
        title: "アプリへようこそ",
        subtitle: "簡単に記録を始めましょう",
        description: "このアプリで、あなたの日常を簡単に記録できます。",
        iconName: "add-circle",
        iconColor: "#2563eb",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      },
      {
        title: "簡単操作",
        subtitle: "直感的なインターフェース",
        description: "シンプルで分かりやすい操作で、誰でも簡単に使えます。",
        iconName: "touch-app",
        iconColor: "#10b981",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      },
      {
        title: "準備完了",
        subtitle: "さあ、始めましょう",
        description: "これで準備は完了です。あなたの記録を始めてみましょう。",
        iconName: "check-circle",
        iconColor: "#f59e0b",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      },
    ];

    return (
      <OnboardingContainer
        screens={onboardingScreens}
        // 完了/スキップ時のコールバックはnavigationHelpersで処理されるため不要
      />
    );
  }

  // 認証チェック中はローディング表示
  if (!isAuthInitialized) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">読み込み中...</Text>
      </View>
    );
  }

  // 認証状態に関係なくすべてのルートを定義
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
