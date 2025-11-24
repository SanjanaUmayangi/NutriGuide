import React from 'react';
import { Stack } from 'expo-router';
import useTheme from '@/hooks/useTheme';
// Layout for auth routes
export default function AuthLayout() {
  const { theme } = useTheme();
  return (
    // <View style={{flex:1}}>
    //   <Stack screenOptions={{ headerShown: false }}>
    //     <Stack.Screen name="login" />
    //     <Stack.Screen name="register" />
    //   </Stack>
    // </View>

     <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        contentStyle: { backgroundColor: theme.background }
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Sign In' }} />
      <Stack.Screen name="register" options={{ title: 'Create Account' }} />
    </Stack>
  );
}
