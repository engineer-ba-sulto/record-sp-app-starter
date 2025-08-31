import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { OnboardingContainer } from "../../components/onboarding";
import { useOnboarding } from "../../hooks/useOnboarding";
import supabase from "../../services/supabaseClient";

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

  // Supabase接続テスト
  const handleTestSupabase = async () => {
    try {
      // 接続確認用のクエリを実行（auth.getSession()でセッション確認）
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        // プロジェクトが存在しない場合のエラー
        if (
          sessionError.message?.includes("404") ||
          sessionError.message?.includes("Project not found") ||
          sessionError.status === 404
        ) {
          Alert.alert(
            "プロジェクトエラー",
            "指定されたSupabaseプロジェクトが見つかりません。\nURLまたはプロジェクトIDを確認してください。"
          );
          console.error("Supabase project not found:", sessionError);
          return;
        }

        // APIキーエラー
        if (
          sessionError.message?.includes("401") ||
          sessionError.message?.includes("Unauthorized") ||
          sessionError.message?.includes("invalid_api_key") ||
          sessionError.status === 401
        ) {
          Alert.alert(
            "認証エラー",
            "Supabase APIキーが無効です。\nanon_keyを確認してください。"
          );
          console.error("Supabase auth error:", sessionError);
          return;
        }

        // ネットワークエラーや設定ミスの場合
        if (
          sessionError.message?.includes("fetch") ||
          sessionError.message?.includes("network") ||
          sessionError.message?.includes("Failed to fetch") ||
          sessionError.message?.includes("Invalid URL") ||
          sessionError.message?.includes("ENOTFOUND") ||
          sessionError.message?.includes("ECONNREFUSED")
        ) {
          Alert.alert(
            "接続エラー",
            `ネットワークエラー: ${sessionError.message}`
          );
          console.error("Supabase network error:", sessionError);
          return;
        }

        // その他の予期せぬエラー
        Alert.alert(
          "接続エラー",
          `予期せぬエラーが発生しました: ${sessionError.message}`
        );
        console.error("Supabase unexpected error:", sessionError);
        return;
      }

      // ここまで到達したら接続成功
      Alert.alert(
        "接続成功",
        sessionData?.session
          ? "Supabaseに接続できました（ログイン済み）"
          : "Supabaseに接続できました（未ログイン状態）"
      );

      console.log("Supabase connection test successful:", {
        hasSession: !!sessionData?.session,
        sessionData: sessionData,
      });
    } catch (err) {
      // ネットワークエラーなどの重大なエラーの場合
      Alert.alert("接続エラー", `重大なエラーが発生しました: ${err}`);
      console.error("Supabase critical error:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert("エラー", error.message ?? "ログアウトに失敗しました");
        return;
      }
      Alert.alert("ログアウト", "ログアウトしました");
    } catch (err) {
      Alert.alert("エラー", `ログアウト処理でエラーが発生しました: ${err}`);
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

        <TouchableOpacity
          className="bg-blue-600 px-8 py-4 rounded-lg w-full max-w-xs mt-4"
          onPress={handleTestSupabase}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Supabase接続テスト
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-700 px-8 py-4 rounded-lg w-full max-w-xs mt-4"
          onPress={handleSignOut}
        >
          <Text className="text-white text-center font-semibold text-lg">
            ログアウト
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
