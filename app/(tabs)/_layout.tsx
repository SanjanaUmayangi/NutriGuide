// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import  useTheme from '../../hooks/useTheme';

export default function TabsLayout() {
  const { theme, isDark } = useTheme();
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: true,
        tabBarStyle: {
          backgroundColor: theme.surface, // Theme tab bar
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.primary, // Theme active tab
        tabBarInactiveTintColor: theme.textSecondary, //Theme inactive tab
        headerStyle: {
          backgroundColor: theme.surface, //Theme header
        },
        headerTintColor: theme.text, // Theme header text
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="favourites" options={{ title: 'Favourites', tabBarIcon: ({ color, size }) => <Feather name="heart" size={size} color={color} /> }} />
      <Tabs.Screen name="tracker" options={{ title: 'Tracker', tabBarIcon: ({ color, size }) => <Feather name="activity" size={size} color={color} /> }} />
      <Tabs.Screen name="tips" options={{ title: 'Tips', tabBarIcon: ({ color, size }) => <Feather name="info" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }} />
    </Tabs>
  );
}
