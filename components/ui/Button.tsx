import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import Colors from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
    disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  showFavouriteButton?: boolean; 
}

export default function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[s.button, variant === 'primary' ? s.primary : s.secondary]} 
      onPress={onPress}
    >
      <Text style={s.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  button: { padding: 16, borderRadius: 12, alignItems: 'center' },
  primary: { backgroundColor: Colors.light.tint }, // use tint as primary
  secondary: { backgroundColor: Colors.light.tabIconDefault }, // pick another color
  text: { color: '#fff', fontWeight: '600' }
});