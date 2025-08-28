import { AdBanner } from "@/components/ads";
import { Text, View } from "react-native";

export default function RecordPage() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-900">記録ページ</Text>
        <Text className="text-gray-500 mt-2">ここに記録機能が実装されます</Text>
      </View>
      <AdBanner />
    </View>
  );
}
