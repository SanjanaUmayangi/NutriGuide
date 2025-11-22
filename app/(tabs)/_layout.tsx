// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
//import { useTheme } from 'react-native-paper';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="favourites" options={{ title: 'Favourites', tabBarIcon: ({ color, size }) => <Feather name="heart" size={size} color={color} /> }} />
      <Tabs.Screen name="tracker" options={{ title: 'Tracker', tabBarIcon: ({ color, size }) => <Feather name="activity" size={size} color={color} /> }} />
      <Tabs.Screen name="tips" options={{ title: 'Tips', tabBarIcon: ({ color, size }) => <Feather name="info" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }} />
    </Tabs>
  );
}
