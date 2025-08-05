import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GoalSection({ userData }: { userData: User }) {
  // Theme colors
  const cardBackground = useThemeColor({}, "cardBackground");
  const textPrimary = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  if (!userData.goals || userData.goals.length === 0) {
    return (
      <View
        style={[
          styles.goalSection,
          {
            backgroundColor: cardBackground,
            borderColor: border,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.newgoalButton,
            { backgroundColor: `${tint}20`, borderColor: tint },
          ]}
          onPress={() => console.log("Create new goal")}
        >
          <Ionicons name="add" size={16} color={tint} />
          <Text style={[styles.newgoalText, { color: tint }]}>
            Ajoutez un Nouvel Objectif{" "}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
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
            {userData.goalTitle}
          </Text>
        </View>
      </View>
      <View style={styles.timeWindow}>
        <Ionicons name="time-outline" size={16} color={textSecondary} />
        <Text style={[styles.timeWindowText, { color: textSecondary }]}>
          {userData.validationWindow?.start} - {userData.validationWindow?.end}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

  newgoalText: {
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 5,
  },
  newgoalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  timeWindow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeWindowText: {
    fontSize: 14,
    marginLeft: 4,
  },
});
