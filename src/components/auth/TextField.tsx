import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TextInput, TextInputProps } from "react-native";

type TextFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
} & Omit<TextInputProps, "onChangeText" | "value">;

export function TextField<TFieldValues extends FieldValues>(
  props: TextFieldProps<TFieldValues>
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
          className="border border-gray-300 rounded-md px-4 py-3 text-gray-900"
          {...textInputProps}
        />
      )}
    />
  );
}
