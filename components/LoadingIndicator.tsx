import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LoadingIndicator() {
  const colorScheme = useColorScheme(); // get system color scheme
  const [delayedScheme, setDelayedScheme] = React.useState<string | null>(null);
  const tint = useThemeColor({}, "tint");

  // Delay application of scheme to avoid flickering
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedScheme(colorScheme ?? null);
    }, 50); // shorter delay works better
    return () => clearTimeout(timeout);
  }, [colorScheme]);

  // Don't render until scheme is determined
  if (!delayedScheme) return null;
  console.log("LoadingIndicator colorScheme:", colorScheme);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            delayedScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
        },
      ]}
    >
      <ActivityIndicator color={tint} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
