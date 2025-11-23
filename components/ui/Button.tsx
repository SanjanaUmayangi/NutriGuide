import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import useTheme from '../../hooks/useTheme'; // 🆕 Import theme hook

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  showFavouriteButton?: boolean; 
}

export default function Button({ title, onPress, variant = 'primary', disabled, style }: ButtonProps) {
  const { theme } = useTheme(); // 🆕 Get theme

  return (
    <TouchableOpacity 
      style={[
        s.button, 
        variant === 'primary' 
          ? [s.primary, { backgroundColor: theme.primary }] 
          : [s.secondary, { backgroundColor: theme.secondary }],
        disabled && { opacity: 0.6 },
        style
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[s.text, { color: theme.textInverse }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  button: { 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  primary: { 
    // Styles handled inline
  },
  secondary: { 
    // Styles handled inline
  },
  text: { 
    fontWeight: '600' 
  }
});