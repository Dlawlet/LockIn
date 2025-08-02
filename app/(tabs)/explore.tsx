import { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabTwoScreen() {
  const [balance, setBalance] = useState(1250.5);
  const [lockInObjective, setLockInObjective] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    language: "English",
    country: "United States",
  });

  const handleAddMoney = (method: "card" | "paypal") => {
    Alert.alert(
      "Add Money",
      `Adding money via ${method === "card" ? "Bank Card" : "PayPal"}`
    );
  };

  const handleWithdraw = (method: "card" | "paypal") => {
    Alert.alert(
      "Withdraw",
      `Withdrawing via ${method === "card" ? "Bank Card" : "PayPal"}`
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive" },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Balance Section */}
      <ThemedView style={styles.balanceCard}>
        <ThemedText type="subtitle" style={styles.balanceLabel}>
          Current Balance
        </ThemedText>
        <ThemedText style={styles.balanceAmount}>
          ${balance.toFixed(2)}
        </ThemedText>
      </ThemedView>

      {/* Money Management */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Manage Funds
        </ThemedText>

        <ThemedView style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={() => handleAddMoney("card")}
          >
            <IconSymbol name="creditcard.fill" size={20} color="#FFFFFF" />
            <ThemedText style={styles.buttonText}>Add via Card</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={() => handleAddMoney("paypal")}
          >
            <ThemedText style={styles.buttonText}>Add via PayPal</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.withdrawButton]}
            onPress={() => handleWithdraw("card")}
          >
            <IconSymbol name="minus.circle.fill" size={20} color="#FFFFFF" />
            <ThemedText style={styles.buttonText}>Withdraw to Card</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.withdrawButton]}
            onPress={() => handleWithdraw("paypal")}
          >
            <ThemedText style={styles.buttonText}>
              Withdraw to PayPal
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* Profile Configuration */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Profile Settings
        </ThemedText>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Name</ThemedText>
          <TextInput
            style={styles.input}
            value={userProfile.name}
            onChangeText={(text) =>
              setUserProfile({ ...userProfile, name: text })
            }
            placeholder="Enter your name"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Language</ThemedText>
          <TextInput
            style={styles.input}
            value={userProfile.language}
            onChangeText={(text) =>
              setUserProfile({ ...userProfile, language: text })
            }
            placeholder="Select language"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Country</ThemedText>
          <TextInput
            style={styles.input}
            value={userProfile.country}
            onChangeText={(text) =>
              setUserProfile({ ...userProfile, country: text })
            }
            placeholder="Select country"
          />
        </ThemedView>
      </ThemedView>

      {/* Lock-In Objective */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Lock-In Objective
        </ThemedText>
        <ThemedView style={styles.inputGroup}>
          <TextInput
            style={[styles.input, styles.objectiveInput]}
            value={lockInObjective}
            onChangeText={setLockInObjective}
            placeholder="Set your lock-in objective (max 50 chars)"
            maxLength={50}
            multiline
          />
          <ThemedText style={styles.charCount}>
            {lockInObjective.length}/50
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <IconSymbol
          name="rectangle.portrait.and.arrow.right"
          size={20}
          color="#FFFFFF"
        />
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -50,
    left: -35,
    position: "absolute",
  },
  container: {
    padding: 20,
    gap: 24,
  },
  balanceCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    color: "#64748B",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1E293B",
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    color: "#1E293B",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButton: {
    backgroundColor: "#10B981",
  },
  withdrawButton: {
    backgroundColor: "#F59E0B",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  objectiveInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "right",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
