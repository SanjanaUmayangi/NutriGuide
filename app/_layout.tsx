import { Slot } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import store from "../lib/redux/store";
// Import all load actions
import useTheme from "../hooks/useTheme";
import { loadAuth } from "../lib/redux/slices/authSlice";
import { setDailyGoalFromStorage, setTracker } from "../lib/redux/slices/calorieSlice";
import { setFavourites } from "../lib/redux/slices/favouriteSlice";
import { setTheme } from "../lib/redux/slices/themeSlice";
import { setBookmarkedTips } from "../lib/redux/slices/tipsSlice";
import { getItem } from "../lib/utils/storage";

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme(); // 🆕 Get current theme
  
  return (
    <SafeAreaProvider style={{ backgroundColor: theme.background }}>
      {children}
    </SafeAreaProvider>
  );
}


function HydrateAndRender() {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load ALL persisted data then render routes
    (async () => {
      try {
        console.log('🔄 Loading persisted data...');
        
        // Load all data from storage in parallel
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

        console.log('📦 Loaded data:', {
          auth: !!authData,
          favourites: favourites?.length || 0,
          tracker: tracker?.length || 0,
          dailyGoal: !!dailyGoal,
          bookmarkedTips: bookmarkedTips?.length || 0,
          theme: theme
        });

        // Dispatch all loaded data to Redux
        if (authData) {
          dispatch(loadAuth() as any);
        }

        if (favourites) {
          dispatch(setFavourites(favourites));
        }

        if (tracker) {
          dispatch(setTracker(tracker));
        }

        if (dailyGoal) {
          dispatch(setDailyGoalFromStorage(dailyGoal));
        }

        if (bookmarkedTips) {
          dispatch(setBookmarkedTips(bookmarkedTips));
        }

        if (theme) {
          dispatch(setTheme(theme));
        }

        console.log('✅ All data loaded successfully');
        
      } catch (error) {
        console.error('❌ Error loading persisted data:', error);
      } finally {
        setReady(true);
      }
    })();
  }, [dispatch]);

  if (!ready) {
    return (
      <SafeAreaProvider>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#F5F7F9'
        }}>
          <Text>Loading NutriGuide+...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <ThemeWrapper>
      <Slot />
    </ThemeWrapper>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <HydrateAndRender />
    </Provider>
  );
}