import React from "react";
import { Text } from "react-native";

type FieldErrorMessageProps = {
  message?: string;
};

export function FieldErrorMessage({ message }: FieldErrorMessageProps) {
  if (!message) return null;
  return <Text className="text-red-600 text-xs mt-1">{message}</Text>;
}
