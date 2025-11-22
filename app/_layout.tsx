// // app/_layout.tsx
// import React from 'react';
// import { Slot} from 'expo-router';
// import { Provider } from 'react-redux';
// import store from '../lib/redux/store';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { View } from 'react-native';
// import { StatusBar } from 'expo-status-bar';

// export default function RootLayout() {
//   return (
//     <Provider store={store}>
//       <SafeAreaProvider>
//         <View style={{ flex: 1 }}>
//           <StatusBar style="auto" />
//           {/* <Stack screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="index" />
//           </Stack> */}
//           <Slot />
//         </View>
//       </SafeAreaProvider>
//     </Provider>
//   );
// }
// app/_layout.tsx
import { Slot } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import { loadAuth } from "../lib/redux/slices/authSlice";
import store from "../lib/redux/store";

function HydrateAndRender() {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load persisted auth then render routes
    (async () => {
      // dispatch returns a promise when using createAsyncThunk; cast to any to satisfy TS
      await (dispatch(loadAuth() as any) as any);
      setReady(true);
    })();
  }, [dispatch]);

  if (!ready) return null;
  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <HydrateAndRender />
      </SafeAreaProvider>
    </Provider>
  );
}
