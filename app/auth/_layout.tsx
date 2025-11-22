import React from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
// Layout for auth routes
export default function AuthLayout() {
  return (
    <View style={{flex:1}}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </View>
  );
}
