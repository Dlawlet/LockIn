import LoadingIndicator from "@/components/LoadingIndicator";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  AuthenticatedUserContext,
  AuthenticatedUserProvider,
} from "@/providers";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useMemo } from "react";
import { Text } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <AuthenticatedUserProvider>
      <RootLayoutContent />
    </AuthenticatedUserProvider>
  );
}

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { isLoading, error, user, seenWalkthrough } = useContext(
    AuthenticatedUserContext
  );
  const theme = useMemo(
    () => (colorScheme === "dark" ? DarkTheme : DefaultTheme),
    [colorScheme]
  );
  const router = useRouter();
  const pathname = usePathname();

  // Handle redirects here
  useEffect(() => {
    if (isLoading) return;
    if (!seenWalkthrough && !pathname.startsWith("/onboarding")) {
      router.replace("/onboarding");
    } else if (!user && seenWalkthrough && !pathname.startsWith("/auth")) {
      router.replace("/auth/LoginScreen");
    } else if (
      user &&
      seenWalkthrough &&
      (pathname.startsWith("/auth") || pathname.startsWith("/onboarding"))
    ) {
      router.replace("/(tabs)");
    }
  }, [isLoading, user, seenWalkthrough]);

  if (isLoading || !loaded) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <ThemeProvider value={theme}>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="+error" options={{ headerShown: false }} />
        </Stack>
        <Text>{String(error)}</Text>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="goal-config" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        {/* <Stack.Screen name="*" redirectTo="(tabs)" /> */}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
