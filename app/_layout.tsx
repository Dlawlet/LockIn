import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync(); // Keep splash until check is done

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function checkAuthAndWalkthrough() {
      const seenWalkthrough = await AsyncStorage.getItem("hasSeenWalkthrough");

      const token = await AsyncStorage.getItem("userToken");

      if (!seenWalkthrough) {
        router.replace("/onboarding");
        // then set hasSeenWalkthrough to true
      } else if (!token) {
        router.replace("/auth/LoginScreen");
      } else {
        // Stay on current route (home, etc.)
      }

      setIsReady(true);
      SplashScreen.hideAsync();
    }

    checkAuthAndWalkthrough();
  }, []);

  if (!loaded && !isReady) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
