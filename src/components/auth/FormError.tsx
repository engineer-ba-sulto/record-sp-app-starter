import React from "react";
import { Text } from "react-native";

type FormErrorProps = {
  message?: string;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return (
    <Text className="text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs">
      {message}
    </Text>
  );
}
