import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

export default function OnboardingScreens() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const slides = [
    {
      key: "slide1",
      title: "Welcome to LockIn",
      text: "Your personal finance management app.",
      image: require("@/assets/images/favicon.png"),
      backgroundColor: colorScheme === "dark" ? "#334155" : "#f1f5f9",
    },
    {
      key: "slide2",
      title: "Make a Deposit",
      text: "Deposit funds and plan your LockIn journey.",
      image: require("@/assets/images/deposit.png"),
      backgroundColor: colorScheme === "dark" ? "#334155" : "#f1f5f9",
    },
    {
      key: "slide3",
      title: "Support Associations",
      text: "If you fail your LockIn day, your money is gifted to an association of your choice.",
      image: require("@/assets/images/deposit.png"),
      backgroundColor: colorScheme === "dark" ? "#334155" : "#f1f5f9",
    },
  ];

  const handleDone = () => {
    AsyncStorage.setItem("hasSeenWalkthrough", "true");
    const router = useRouter();
    router.push("/auth/SignupScreen"); // Switch to auth page
  };

  type Slide = {
    key: string;
    title: string;
    text: string;
    image: any;
    backgroundColor: string;
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={[styles.title, colorScheme === "dark" && styles.titleDark]}>
        {item.title}
      </Text>
      <Text style={[styles.text, colorScheme === "dark" && styles.textDark]}>
        {item.text}
      </Text>
    </View>
  );

  const renderDoneButton = () => (
    <TouchableOpacity style={styles.button} onPress={handleDone}>
      <Text style={styles.buttonText}>Get Started</Text>
    </TouchableOpacity>
  );

  return (
    <AppIntroSlider
      data={slides}
      renderItem={renderItem}
      showSkipButton={false}
      showNextButton={false}
      renderDoneButton={renderDoneButton}
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
    textAlign: "center",
  },
  titleDark: {
    color: "#fff",
  },
  text: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 32,
  },
  textDark: {
    color: "#d1d5db",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 24,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  dot: {
    backgroundColor: "#cbd5e1",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#2563eb",
    width: 16,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
