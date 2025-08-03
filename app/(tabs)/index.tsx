import { db } from "@/config/firebase";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { collection, getDocs } from "firebase/firestore";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textPrimary = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  // Mock data - remplacer par Firebase plus tard
  const mockData = {
    currentDay: 12,
    totalDays: 30,
    amountDeposited: 500,
    amountRecovered: 156,
    goalTitle: "Méditation quotidienne",
    validationWindow: "19h00 - 21h00 ",
    currentStreak: 5,
    todayValidated: false,
    weekProgress: [
      { day: "L", status: "success" },
      { day: "M", status: "success" },
      { day: "M", status: "failed" },
      { day: "J", status: "success" },
      { day: "V", status: "pending" },
      { day: "S", status: "inactive" },
      { day: "D", status: "inactive" },
    ],
  };

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      console.log("Fetched user data successfully");
      querySnapshot.forEach((doc) => {
        console.log("User data:", doc.data());
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  // Call fetchData to retrieve data from Firestore
  fetchData();

  const progressPercentage = (mockData.currentDay / mockData.totalDays) * 100;
  const moneyPercentage =
    (mockData.amountRecovered / mockData.amountDeposited) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "#10B981";
      case "failed":
        return "#EF4444";
      case "pending":
        return "#F59E0B";
      default:
        return "#374151";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "checkmark-circle";
      case "failed":
        return "close-circle";
      case "pending":
        return "time";
      default:
        return "ellipse-outline";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor}
      />

      {/* Header avec progression */}
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#0F172A", "#1E293B"]
            : ["#F8FAFC", "#E2E8F0"]
        }
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.lockIconContainer}>
            <Ionicons name="lock-closed" size={24} color={tint} />
            <Text style={[styles.lockInText, { color: tint }]}>LOCK IN</Text>
          </View>

          <Text style={[styles.dayCounter, { color: textSecondary }]}>
            Jour {mockData.currentDay}/{mockData.totalDays}
          </Text>
        </View>

        {/* Progress Ring */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressRing,
              {
                backgroundColor: cardBackground,
                borderColor: tint,
              },
            ]}
          >
            <Text style={[styles.progressPercentage, { color: textPrimary }]}>
              {Math.round(progressPercentage)}%
            </Text>
            <Text style={[styles.progressLabel, { color: textSecondary }]}>
              Terminé
            </Text>
          </View>
        </View>

        {/* Money Stats */}
        <View style={styles.moneyStats}>
          <View style={styles.moneyItem}>
            <Text style={[styles.moneyAmount, { color: textPrimary }]}>
              €{mockData.amountRecovered}
            </Text>
            <Text style={[styles.moneyLabel, { color: textSecondary }]}>
              Récupéré
            </Text>
          </View>
          <View style={[styles.moneyDivider, { backgroundColor: border }]} />
          <View style={styles.moneyItem}>
            <Text style={[styles.moneyAmount, { color: textPrimary }]}>
              €{mockData.amountDeposited - mockData.amountRecovered}
            </Text>
            <Text style={[styles.moneyLabel, { color: textSecondary }]}>
              En jeu
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={[styles.content, { backgroundColor }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Goal Section */}
        <View
          style={[
            styles.goalSection,
            {
              backgroundColor: cardBackground,
              borderColor: border,
            },
          ]}
        >
          <View style={styles.goalHeader}>
            <View style={styles.goalInfo}>
              <MaterialCommunityIcons name="target" size={20} color={tint} />
              <Text style={[styles.goalTitle, { color: textPrimary }]}>
                {mockData.goalTitle}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.newPlanButton,
                { backgroundColor: `${tint}20`, borderColor: tint },
              ]}
              onPress={() => console.log("Create new plan")}
            >
              <Ionicons name="add" size={16} color={tint} />
              <Text style={[styles.newPlanText, { color: tint }]}>Nouveau</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timeWindow}>
            <Ionicons name="time-outline" size={16} color={textSecondary} />
            <Text style={[styles.timeWindowText, { color: textSecondary }]}>
              {mockData.validationWindow}
            </Text>
          </View>
        </View>

        {/* Validation Button */}
        <TouchableOpacity style={styles.validationButton} activeOpacity={0.8}>
          <LinearGradient
            colors={["#F97316", "#EA580C"]}
            style={styles.validationGradient}
          >
            <View style={styles.validationContent}>
              <Ionicons name="checkmark-circle" size={32} color="white" />
              <Text style={styles.validationText}>VALIDER AUJOURD'HUI</Text>
              <Text style={styles.validationSubtext}>
                Confirmer ton Lock In
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Week Progress */}
        <View style={styles.weekSection}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Cette semaine
          </Text>
          <View
            style={[
              styles.weekProgress,
              {
                backgroundColor: cardBackground,
              },
            ]}
          >
            {mockData.weekProgress.map((item, index) => (
              <View key={index} style={styles.dayItem}>
                <Text style={[styles.dayLabel, { color: textSecondary }]}>
                  {item.day}
                </Text>
                <View
                  style={[
                    styles.dayStatus,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Ionicons
                    name={getStatusIcon(item.status)}
                    size={16}
                    color="white"
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={[styles.statCard, { backgroundColor: cardBackground }]}>
            <View style={styles.statIcon}>
              <Ionicons name="flame" size={20} color="#EF4444" />
            </View>
            <Text style={[styles.statNumber, { color: textPrimary }]}>
              {mockData.currentStreak}
            </Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>
              Série actuelle
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: cardBackground }]}>
            <View style={styles.statIcon}>
              <Ionicons name="trending-up" size={20} color="#10B981" />
            </View>
            <Text style={[styles.statNumber, { color: textPrimary }]}>
              {Math.round(moneyPercentage)}%
            </Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>
              Argent récupéré
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: cardBackground }]}>
            <View style={styles.statIcon}>
              <Ionicons name="calendar" size={20} color="#3B82F6" />
            </View>
            <Text style={[styles.statNumber, { color: textPrimary }]}>
              {mockData.totalDays - mockData.currentDay}
            </Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>
              Jours restants
            </Text>
          </View>
        </View>

        {/* Next Validation Info */}
        <View
          style={[
            styles.nextValidation,
            {
              backgroundColor: cardBackground,
              borderColor: border,
            },
          ]}
        >
          <View style={styles.nextValidationHeader}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={textSecondary}
            />
            <Text
              style={[styles.nextValidationTitle, { color: textSecondary }]}
            >
              Prochaine validation
            </Text>
          </View>
          <Text style={[styles.nextValidationText, { color: textPrimary }]}>
            Demain entre {mockData.validationWindow}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  lockIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lockInText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  dayCounter: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: "bold",
  },
  progressLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  moneyStats: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  moneyItem: {
    alignItems: "center",
  },
  moneyAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  moneyLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  moneyDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 30,
  },
  content: {
    flex: 1,
  },
  goalSection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  goalInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  newPlanButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  newPlanText: {
    fontSize: 12,
    fontWeight: "600",
  },
  timeWindow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeWindowText: {
    fontSize: 14,
    marginLeft: 4,
  },
  validationButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  validationGradient: {
    padding: 20,
    alignItems: "center",
  },
  validationContent: {
    alignItems: "center",
  },
  validationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 8,
  },
  validationSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  weekSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  weekProgress: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
  },
  dayItem: {
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  dayStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  quickStats: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  nextValidation: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  nextValidationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  nextValidationTitle: {
    fontSize: 14,
    marginLeft: 4,
  },
  nextValidationText: {
    fontSize: 14,
    marginLeft: 24,
  },
});
