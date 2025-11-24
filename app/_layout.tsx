// app/_layout.tsx
import { Slot, useSegments, useRouter, SplashScreen, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../lib/redux/store";
import { loadAuth } from "../lib/redux/slices/authSlice";
import { setFavourites } from "../lib/redux/slices/favouriteSlice";
import { setTracker, setDailyGoalFromStorage } from "../lib/redux/slices/calorieSlice";
import { setBookmarkedTips } from "../lib/redux/slices/tipsSlice";
import { setTheme } from "../lib/redux/slices/themeSlice";
import { getItem } from "../lib/utils/storage";
import useTheme from "../hooks/useTheme";
import { View, Text } from "react-native";
import { useFonts } from 'expo-font';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  
  return (
    <SafeAreaProvider style={{ backgroundColor: theme.background }}>
      {children}
    </SafeAreaProvider>
  );
}

function AuthWrapper() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  return <Slot />;
}

function HydrateAndRender() {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [
          authData,
          favourites,
          tracker,
          dailyGoal,
          bookmarkedTips,
          theme
        ] = await Promise.all([
          getItem('auth'),
          getItem('favourites'),
          getItem('tracker'),
          getItem('dailyGoal'),
          getItem('bookmarkedTips'),
          getItem('theme')
        ]);

        if (authData) dispatch(loadAuth() as any);
        if (favourites) dispatch(setFavourites(favourites));
        if (tracker) dispatch(setTracker(tracker));
        if (dailyGoal) dispatch(setDailyGoalFromStorage(dailyGoal));
        if (bookmarkedTips) dispatch(setBookmarkedTips(bookmarkedTips));
        if (theme) dispatch(setTheme(theme));

        setReady(true);
      } catch (error) {
        console.error('Error loading data:', error);
        setReady(true);
      }
    })();
  }, [dispatch]);

  if (!ready) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7F9' }}>
          <Text>Loading NutriGuide+...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <ThemeWrapper>
      <AuthWrapper />
    </ThemeWrapper>
  );
}

// export default function RootLayout() {
//   return (
//     <Provider store={store}>
//       <HydrateAndRender />
//     </Provider>
//   );
// }

// export default function RootLayout() {
//   const [fontsLoaded, fontError] = useFonts({
//     'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
//     'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
//     'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
//   });

//   useEffect(() => {
//     if (fontsLoaded || fontError) {
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded, fontError]);

//   if (!fontsLoaded && !fontError) {
//     return null;
//   }

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//       <Stack.Screen name="(auth)" />
//       <Stack.Screen name="(tabs)" />
//       <Stack.Screen name="product/[id]" />
//     </Stack>
//   );
// }

export default function RootLayout() {
  // No custom fonts, so remove useFonts completely

  // Hide splash screen instantly
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" />
      </Stack>
    </Provider>
  );
}
