import { Stack } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { OnboardingContainer } from "../components/onboarding";
import "../global.css";
import { useOnboarding } from "../hooks/useOnboarding";
import { adsService } from "../services";

export default function Layout() {
  const { isLoading, hasSeenOnboarding } = useOnboarding();

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

  // 2回目以降の起動時は通常のタブナビゲーション
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
