import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import useTheme from '../../hooks/useTheme'; // 🆕 Import theme hook

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function Input({ placeholder, value, onChangeText, secureTextEntry }: InputProps) {
  const { theme } = useTheme(); // 🆕 Get theme

  return (
    <TextInput
      style={[
        s.input, 
        { 
          backgroundColor: theme.inputBackground,
          borderColor: theme.inputBorder,
          color: theme.inputText
        }
      ]}
      placeholder={placeholder}
      placeholderTextColor={theme.inputPlaceholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  );
}

const s = StyleSheet.create({
  input: { 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 12,
    borderWidth: 1,
  }
});