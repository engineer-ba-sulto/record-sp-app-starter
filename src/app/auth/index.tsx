import {
  FieldErrorMessage,
  FormError,
  PasswordField,
  SubmitButton,
  TextField,
} from "@/components/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, Text, View } from "react-native";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("メールアドレスの形式が正しくありません"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

type FormValues = z.infer<typeof schema>;

export default function AuthPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: FormValues) => {
    // 認証実装は別チケットで対応
    console.log("submit", values);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8 gap-6">
        <View className="mt-8">
          <Text className="text-2xl font-bold text-gray-900">ログイン</Text>
          <Text className="text-gray-600 mt-2">メールアドレスでログイン</Text>
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

        <FormError message={undefined} />

        <SubmitButton
          title="ログイン"
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />

        <View className="mt-auto">
          <Text className="text-center text-gray-400 text-xs">
            実際の認証は次のステップで実装します
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
