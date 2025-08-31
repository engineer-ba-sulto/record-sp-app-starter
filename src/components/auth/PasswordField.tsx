import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TextInput, TextInputProps } from "react-native";

type PasswordFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
} & Omit<TextInputProps, "onChangeText" | "value">;

export function PasswordField<TFieldValues extends FieldValues>(
  props: PasswordFieldProps<TFieldValues>
) {
  const { control, name, ...textInputProps } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          onBlur={onBlur}
          onChangeText={onChange}
          value={value as unknown as string}
          secureTextEntry
          className="border border-gray-300 rounded-md px-4 py-3 text-gray-900"
          {...textInputProps}
        />
      )}
    />
  );
}
