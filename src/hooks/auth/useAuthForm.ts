import supabase from "@/services/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const authSchema = z.object({
  email: z.email("メールアドレスの形式が正しくありません"),
  password: z
    .string()
    .min(1, "パスワードは必須です")
    .min(6, "パスワードは6文字以上で入力してください"),
});

export type AuthFormValues = z.infer<typeof authSchema>;

export type AuthMode = "signin" | "signup";

export function useAuthForm(initialMode: AuthMode = "signin") {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(
    undefined
  );

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const toggleMode = useCallback(() => {
    setFormError(undefined);
    setSuccessMessage(undefined);
    // 入力値とエラーをクリア
    form.reset({ email: "", password: "" });
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
  }, [form]);

  const onSubmit = useCallback(
    async (values: AuthFormValues) => {
      setFormError(undefined);
      setSuccessMessage(undefined);

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });
        if (error) {
          setFormError(error.message ?? "登録に失敗しました");
          return;
        }
        setSuccessMessage(
          "確認メールを送信しました。メール内の手順に従って登録を完了してください。"
        );
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        setFormError(error.message ?? "ログインに失敗しました");
        return;
      }
      setSuccessMessage("ログインに成功しました");
    },
    [mode]
  );

  return {
    ...form,
    mode,
    toggleMode,
    onSubmit,
    formError,
    successMessage,
    setFormError,
    setSuccessMessage,
  };
}

export default useAuthForm;
