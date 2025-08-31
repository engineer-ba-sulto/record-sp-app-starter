import {
  FieldErrorMessage,
  FormError,
  PasswordField,
  SubmitButton,
  TextField,
} from "@/components/auth";
import { useAuthForm } from "@/hooks/auth/useAuthForm";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function AuthPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    onSubmit,
    formError,
    successMessage,
    mode,
    toggleMode,
    setFocus,
    trigger,
  } = useAuthForm();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8 gap-6">
        <View className="mt-8">
          <Text className="text-2xl font-bold text-gray-900">
            {mode === "signin" ? "ログイン" : "新規登録"}
          </Text>
          <Text className="text-gray-600 mt-2">
            {mode === "signin"
              ? "メールアドレスでログイン"
              : "メールアドレスでアカウントを作成"}
          </Text>
        </View>

        <View className="gap-2 mt-4">
          <TextField
            control={control}
            name="email"
            placeholder="メールアドレス"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FieldErrorMessage message={errors.email?.message} />

          <PasswordField
            control={control}
            name="password"
            placeholder="パスワード"
          />
          <FieldErrorMessage message={errors.password?.message} />
        </View>

        <FormError message={formError} />

        {successMessage ? (
          <Text className="text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 text-xs">
            {successMessage}
          </Text>
        ) : null}

        <SubmitButton
          title={mode === "signin" ? "ログイン" : "新規登録"}
          loading={isSubmitting}
          onPress={() => {
            void trigger();
            handleSubmit(onSubmit, (invalid) => {
              const firstKey = Object.keys(invalid)[0] as
                | "email"
                | "password"
                | undefined;
              if (firstKey) setFocus(firstKey);
            })();
          }}
        />

        <TouchableOpacity
          onPress={toggleMode}
          disabled={isSubmitting}
          className="mt-2"
        >
          <Text className="text-center text-blue-600">
            {mode === "signin"
              ? "アカウントをお持ちでないですか？新規登録"
              : "すでにアカウントをお持ちですか？ログイン"}
          </Text>
        </TouchableOpacity>

        <View className="mt-auto">
          <Text className="text-center text-gray-400 text-xs">
            Supabase認証を使用
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
