import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function Input({ placeholder, value, onChangeText, secureTextEntry }: InputProps) {
  return (
    <TextInput
      style={s.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  );
}

const s = StyleSheet.create({
  input: { 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd'
  }
});