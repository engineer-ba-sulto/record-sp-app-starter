import React from "react";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";

export default function AuthPage() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8 gap-6">
        <View className="mt-8">
          <Text className="text-2xl font-bold text-gray-900">ログイン</Text>
          <Text className="text-gray-600 mt-2">
            メールアドレスでログイン（ダミーUI）
          </Text>
        </View>

        <View className="gap-4 mt-4">
          <TextInput
            placeholder="メールアドレス"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border border-gray-300 rounded-md px-4 py-3 text-gray-900"
          />
          <TextInput
            placeholder="パスワード"
            secureTextEntry
            className="border border-gray-300 rounded-md px-4 py-3 text-gray-900"
          />
        </View>

        <Pressable
          onPress={() => {
            console.log("ログインボタンが押されました");
          }}
          className="mt-2 bg-blue-600 rounded-md px-4 py-3 items-center"
        >
          <Text className="text-white font-semibold">ログイン（ダミー）</Text>
        </Pressable>

        <View className="mt-auto">
          <Text className="text-center text-gray-400 text-xs">
            実際の認証は次のステップで実装します
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
