import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textPrimary = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  // Mock data - remplacer par Firebase plus tard
  const mockData = {
    currentPlan: {
      startDate: "2024-01-01",
      endDate: "2024-01-30",
      totalDays: 30,
      completedDays: 12,
      failedDays: 3,
      totalAmount: 500,
      recoveredAmount: 156,
      lostAmount: 78,
      currentStreak: 5,
      longestStreak: 8,
      successRate: 80,
    },
    calendar: [
      // Semaine 1
      [
        { date: 1, status: "success", amount: 12 },
        { date: 2, status: "success", amount: 15 },
        { date: 3, status: "failed", amount: 0 },
        { date: 4, status: "success", amount: 18 },
        { date: 5, status: "success", amount: 22 },
        { date: 6, status: "inactive", amount: 0 },
        { date: 7, status: "inactive", amount: 0 },
      ],
      // Semaine 2
      [
        { date: 8, status: "success", amount: 25 },
        { date: 9, status: "failed", amount: 0 },
        { date: 10, status: "success", amount: 28 },
        { date: 11, status: "success", amount: 32 },
        { date: 12, status: "success", amount: 35 },
        { date: 13, status: "inactive", amount: 0 },
        { date: 14, status: "inactive", amount: 0 },
      ],
      // Semaine 3
      [
        { date: 15, status: "success", amount: 38 },
        { date: 16, status: "success", amount: 42 },
        { date: 17, status: "failed", amount: 0 },
        { date: 18, status: "success", amount: 45 },
        { date: 19, status: "pending", amount: 48 },
        { date: 20, status: "future", amount: 52 },
        { date: 21, status: "future", amount: 55 },
      ],
      // Semaine 4
      [
        { date: 22, status: "future", amount: 58 },
        { date: 23, status: "future", amount: 62 },
        { date: 24, status: "future", amount: 65 },
        { date: 25, status: "future", amount: 68 },
        { date: 26, status: "future", amount: 72 },
        { date: 27, status: "future", amount: 0 },
        { date: 28, status: "future", amount: 0 },
      ],
    ],
    projectionData: [
      { day: 1, recovered: 12, lost: 0 },
      { day: 5, recovered: 89, lost: 0 },
      { day: 10, recovered: 156, lost: 26 },
      { day: 15, recovered: 243, lost: 26 },
      { day: 20, recovered: 334, lost: 52 },
      { day: 25, recovered: 423, lost: 52 },
      { day: 30, recovered: 500, lost: 78 },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "#10B981";
      case "failed":
        return "#EF4444";
      case "pending":
        return "#F59E0B";
      case "future":
        return colorScheme === "dark" ? "#374151" : "#E5E7EB";
      default:
        return colorScheme === "dark" ? "#1F2937" : "#F3F4F6";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "checkmark";
      case "failed":
        return "close";
      case "pending":
        return "time";
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => `€${amount}`;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBackground }]}>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>
          Progression
        </Text>
        <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
          Plan en cours • {mockData.currentPlan.completedDays}/
          {mockData.currentPlan.totalDays} jours
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {["week", "month", "all"].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && { backgroundColor: tint },
                { borderColor: border },
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodText,
                  {
                    color: selectedPeriod === period ? "white" : textSecondary,
                  },
                ]}
              >
                {period === "week"
                  ? "Semaine"
                  : period === "month"
                  ? "Mois"
                  : "Tout"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: cardBackground }]}>
            <View style={styles.statHeader}>
              <Ionicons name="trophy" size={20} color="#F59E0B" />
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {mockData.currentPlan.successRate}%
              </Text>
            </View>
            <Text style={[styles.statLabel, { color: textSecondary }]}>
              Taux de réussite
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: cardBackground }]}>
            <View style={styles.statHeader}>
              <Ionicons name="flame" size={20} color="#EF4444" />
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {mockData.currentPlan.longestStreak}
              </Text>
            </View>
            <Text style={[styles.statLabel, { color: textSecondary }]}>
              Meilleure série
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: cardBackground }]}>
            <View style={styles.statHeader}>
              <Ionicons name="trending-up" size={20} color="#10B981" />
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {formatCurrency(mockData.currentPlan.recoveredAmount)}
              </Text>
            </View>
            <Text style={[styles.statLabel, { color: textSecondary }]}>
              Récupéré
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: cardBackground }]}>
            <View style={styles.statHeader}>
              <Ionicons name="trending-down" size={20} color="#EF4444" />
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {formatCurrency(mockData.currentPlan.lostAmount)}
              </Text>
            </View>
            <Text style={[styles.statLabel, { color: textSecondary }]}>
              Perdu
            </Text>
          </View>
        </View>

        {/* Calendar */}
        <View
          style={[styles.calendarSection, { backgroundColor: cardBackground }]}
        >
          <View style={styles.calendarHeader}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              Calendrier
            </Text>
            <Text style={[styles.calendarMonth, { color: textSecondary }]}>
              Janvier 2024
            </Text>
          </View>

          {/* Days of week */}
          <View style={styles.weekDays}>
            {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
              <Text
                key={index}
                style={[styles.weekDay, { color: textSecondary }]}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {mockData.calendar.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.calendarWeek}>
                {week.map((day, dayIndex) => (
                  <TouchableOpacity
                    key={dayIndex}
                    style={[
                      styles.calendarDay,
                      { backgroundColor: getStatusColor(day.status) },
                    ]}
                    disabled={
                      day.status === "future" || day.status === "inactive"
                    }
                  >
                    {day.status !== "inactive" && (
                      <>
                        <Text
                          style={[
                            styles.calendarDayNumber,
                            {
                              color:
                                day.status === "future"
                                  ? textSecondary
                                  : "white",
                            },
                          ]}
                        >
                          {day.date}
                        </Text>
                        {getStatusIcon(day.status) !== null && (
                          <Ionicons
                            name={
                              getStatusIcon(
                                day.status
                              ) as keyof typeof Ionicons.glyphMap
                            }
                            size={12}
                            color="white"
                            style={styles.calendarDayIcon}
                          />
                        )}
                        {day.amount > 0 && (
                          <Text style={styles.calendarDayAmount}>
                            €{day.amount}
                          </Text>
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Progress Chart Placeholder */}
        <View
          style={[styles.chartSection, { backgroundColor: cardBackground }]}
        >
          <View style={styles.chartHeader}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              Évolution des gains
            </Text>
            <TouchableOpacity>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Simple bar chart mockup */}
          <View style={styles.chartContainer}>
            <View style={styles.chartBars}>
              {mockData.projectionData.map((item, index) => (
                <View key={index} style={styles.chartBar}>
                  <View
                    style={[
                      styles.chartBarFill,
                      {
                        height: `${(item.recovered / 500) * 100}%`,
                        backgroundColor: "#10B981",
                      },
                    ]}
                  />
                  <Text
                    style={[styles.chartBarLabel, { color: textSecondary }]}
                  >
                    J{item.day}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.chartLegendItem}>
                <View
                  style={[
                    styles.chartLegendColor,
                    { backgroundColor: "#10B981" },
                  ]}
                />
                <Text
                  style={[styles.chartLegendText, { color: textSecondary }]}
                >
                  Récupéré
                </Text>
              </View>
              <View style={styles.chartLegendItem}>
                <View
                  style={[
                    styles.chartLegendColor,
                    { backgroundColor: "#EF4444" },
                  ]}
                />
                <Text
                  style={[styles.chartLegendText, { color: textSecondary }]}
                >
                  Perdu
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Projection */}
        <View
          style={[
            styles.projectionSection,
            { backgroundColor: cardBackground },
          ]}
        >
          <View style={styles.projectionHeader}>
            <Ionicons name="analytics" size={20} color={tint} />
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              Projection
            </Text>
          </View>
          <Text style={[styles.projectionText, { color: textSecondary }]}>
            Si tu continues à ce rythme, tu récupéreras environ{" "}
            <Text style={[styles.projectionAmount, { color: tint }]}>
              {formatCurrency(400)}
            </Text>{" "}
            sur les {formatCurrency(500)} déposés.
          </Text>
          <View style={styles.projectionBar}>
            <View
              style={[
                styles.projectionBarFill,
                {
                  width: "80%",
                  backgroundColor: tint,
                },
              ]}
            />
          </View>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: "row",
    margin: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  periodText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 56) / 2,
    padding: 16,
    borderRadius: 12,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
  },
  calendarSection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  calendarMonth: {
    fontSize: 14,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  weekDay: {
    fontSize: 12,
    fontWeight: "600",
    width: 32,
    textAlign: "center",
  },
  calendarGrid: {
    gap: 8,
  },
  calendarWeek: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
  },
  calendarDay: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  calendarDayNumber: {
    fontSize: 12,
    fontWeight: "600",
  },
  calendarDayIcon: {
    position: "absolute",
    top: 2,
    right: 2,
  },
  calendarDayAmount: {
    fontSize: 8,
    color: "white",
    position: "absolute",
    bottom: 1,
  },
  chartSection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartContainer: {
    height: 150,
  },
  chartBars: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 100,
    marginBottom: 20,
  },
  chartBar: {
    width: 20,
    height: 100,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  chartBarFill: {
    width: "100%",
    borderRadius: 4,
    minHeight: 4,
  },
  chartBarLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  chartLegendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  chartLegendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  chartLegendText: {
    fontSize: 12,
  },
  projectionSection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
  },
  projectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  projectionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  projectionAmount: {
    fontWeight: "bold",
  },
  projectionBar: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  projectionBarFill: {
    height: "100%",
    borderRadius: 4,
  },
});
