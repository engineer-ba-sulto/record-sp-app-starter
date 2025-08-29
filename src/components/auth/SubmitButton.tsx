import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

type SubmitButtonProps = {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export function SubmitButton({
  title,
  loading,
  disabled,
  onPress,
}: SubmitButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      className={`mt-2 rounded-md px-4 py-3 items-center ${
        disabled || loading ? "bg-blue-400" : "bg-blue-600"
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white font-semibold">{title}</Text>
      )}
    </Pressable>
  );
}
