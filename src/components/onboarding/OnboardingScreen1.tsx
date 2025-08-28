import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface OnboardingScreen1Props {
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  iconColor: string;
  backgroundColor: string;
  textColor: string;
  onNext?: () => void;
  onSkip?: () => void;
}

export const OnboardingScreen1: React.FC<OnboardingScreen1Props> = ({
  title,
  subtitle,
  description,
  iconName,
  iconColor,
  backgroundColor,
  textColor,
  onNext,
  onSkip,
}) => {
  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <View
      className="flex-1 justify-center items-center px-8"
      style={{ backgroundColor }}
      accessibilityRole="tab"
      accessibilityLabel="オンボーディング画面1"
    >
      {/* スキップボタン */}
      <TouchableOpacity
        className="absolute top-16 right-6 z-10"
        onPress={handleSkip}
        accessibilityRole="button"
        accessibilityLabel="スキップ"
      >
        <Text className="text-gray-500 text-base font-medium">スキップ</Text>
      </TouchableOpacity>

      {/* メインコンテンツ */}
      <View className="flex-1 justify-center items-center">
        {/* アイコン */}
        <View className="mb-8">
          <MaterialIcons
            name={iconName as any}
            size={120}
            color={iconColor}
            accessibilityLabel="アプリアイコン"
          />
        </View>

        {/* タイトル */}
        <View className="mb-4">
          <Text
            className="text-3xl font-bold text-center"
            style={{ color: textColor }}
            accessibilityRole="header"
          >
            {title}
          </Text>
        </View>

        {/* サブタイトル */}
        <View className="mb-6">
          <Text
            className="text-xl font-semibold text-center"
            style={{ color: textColor }}
          >
            {subtitle}
          </Text>
        </View>

        {/* 説明文 */}
        <View className="mb-12">
          <Text
            className="text-base text-center leading-6 px-4"
            style={{ color: textColor }}
          >
            {description}
          </Text>
        </View>

        {/* 次へボタン */}
        <View className="opacity-100">
          <TouchableOpacity
            className="bg-blue-600 px-8 py-4 rounded-full"
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="次へ"
          >
            <Text className="text-white text-lg font-semibold">次へ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
