import { AdBanner } from "@/components/ads";
import { useAdInterstitial } from "@/hooks";
import React, { useEffect } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { isLoaded, isLoading, error, loadAd, showAd, clearError } =
    useAdInterstitial();

  // 画面表示時に広告を読み込む
  useEffect(() => {
    loadAd();
  }, [loadAd]);

  // エラーが発生した場合のアラート表示
  useEffect(() => {
    if (error) {
      Alert.alert("広告エラー", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  const handleShowAd = async () => {
    const success = await showAd();
    if (!success) {
      Alert.alert(
        "広告表示失敗",
        "広告が準備できていません。再度お試しください。",
        [{ text: "OK" }]
      );
    }
  };

  const handleReloadAd = async () => {
    const success = await loadAd();
    if (success) {
      Alert.alert("成功", "広告を再読み込みしました");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center gap-6">
          <Text className="text-2xl font-bold text-center text-gray-900">
            AdMob 広告サンプル
          </Text>
          <Text className="text-base text-center text-gray-600 max-w-[280px]">
            このアプリはAdMob広告の実装サンプルです
          </Text>
        </View>

        {/* インタースティシャル広告コントロール */}
        <View className="items-center gap-4 w-full max-w-[300px]">
          <Text className="text-lg font-semibold text-gray-800">
            インタースティシャル広告
          </Text>

          <View className="items-center gap-2">
            <Text className="text-sm text-gray-600">
              状態:{" "}
              {isLoading ? "読み込み中..." : isLoaded ? "準備完了" : "未準備"}
            </Text>

            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-lg w-full items-center"
              onPress={handleShowAd}
              disabled={!isLoaded || isLoading}
            >
              <Text className="text-white font-semibold">
                {isLoading ? "読み込み中..." : "広告を表示"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-green-500 px-6 py-3 rounded-lg w-full items-center"
              onPress={handleReloadAd}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold">広告を再読み込み</Text>
            </TouchableOpacity>
          </View>

          {/* シミュレーション例 */}
          <View className="items-center gap-2 mt-4">
            <Text className="text-sm font-semibold text-gray-700">
              シミュレーション例
            </Text>

            <TouchableOpacity
              className="bg-purple-500 px-6 py-3 rounded-lg w-full items-center"
              onPress={() => {
                Alert.alert("レベルクリア！", "次のレベルに進みます", [
                  {
                    text: "キャンセル",
                    style: "cancel",
                  },
                  {
                    text: "広告を見て進む",
                    onPress: async () => {
                      const success = await showAd();
                      if (success) {
                        Alert.alert("次のレベルへ！");
                      } else {
                        Alert.alert("次のレベルへ！", "（広告なし）");
                      }
                    },
                  },
                ]);
              }}
            >
              <Text className="text-white font-semibold">
                レベルクリアをシミュレート
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* バナー広告 */}
        <View className="flex-1 justify-end items-center w-full max-w-[320px] mb-4">
          <AdBanner />
        </View>
      </View>
    </SafeAreaView>
  );
}
