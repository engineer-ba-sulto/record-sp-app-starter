import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingContainer } from "../../components/onboarding";
import { useOnboarding } from "../../hooks/useOnboarding";

export default function SettingsPage() {
  const { completeOnboarding } = useOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // プレビュー用のオンボーディング画面データ
  const previewScreens = [
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

  // オンボーディング表示
  const handleShowOnboarding = () => {
    setShowOnboarding(true);
  };

  // オンボーディング完了（プレビュー用）
  const handleOnboardingComplete = async () => {
    try {
      await completeOnboarding();
      setShowOnboarding(false);
      Alert.alert("完了", "オンボーディングを完了しました");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      Alert.alert("エラー", "完了処理に失敗しました");
    }
  };

  // オンボーディングスキップ（プレビュー用）
  const handleOnboardingSkip = async () => {
    try {
      await completeOnboarding();
      setShowOnboarding(false);
      Alert.alert("スキップ", "オンボーディングをスキップしました");
    } catch (error) {
      console.error("Failed to skip onboarding:", error);
      Alert.alert("エラー", "スキップ処理に失敗しました");
    }
  };

  // オンボーディングを表示中の場合
  if (showOnboarding) {
    return (
      <OnboardingContainer
        screens={previewScreens}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center p-8">
        <Text className="text-2xl font-bold text-gray-900 mb-2">設定</Text>
        <Text className="text-gray-500 mb-8 text-center">
          オンボーディングを確認できます
        </Text>

        <TouchableOpacity
          className="bg-green-600 px-8 py-4 rounded-lg w-full max-w-xs"
          onPress={handleShowOnboarding}
        >
          <Text className="text-white text-center font-semibold text-lg">
            オンボーディングを表示
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
