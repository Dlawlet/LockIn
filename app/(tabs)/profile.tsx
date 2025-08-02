import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    colorScheme === "dark"
  );

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textPrimary = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  // Mock data - remplacer par Firebase plus tard
  const mockUserData = {
    name: "Alex Martin",
    email: "alex.martin@email.com",
    joinDate: "2024-01-01",
    totalPlans: 3,
    completedPlans: 1,
    totalAmountDeposited: 1500,
    totalAmountRecovered: 1200,
    currentPlan: {
      goal: "Méditation quotidienne",
      startDate: "2024-01-01",
      endDate: "2024-01-30",
      validationWindow: "19h00 - 21h00",
      selectedCharity: "Médecins Sans Frontières",
      amount: 500,
    },
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: () => console.log("Logout"),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Cette action est irréversible. Toutes vos données seront perdues.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => console.log("Delete account"),
        },
      ]
    );
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const ProfileSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={[styles.section, { backgroundColor: cardBackground }]}>
      <Text style={[styles.sectionTitle, { color: textPrimary }]}>{title}</Text>
      {children}
    </View>
  );

  type ProfileItemProps = {
    icon: string;
    iconType?: "Ionicons" | "MaterialCommunityIcons";
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showArrow?: boolean;
  };

  const ProfileItem: React.FC<ProfileItemProps> = ({
    icon,
    iconType = "Ionicons",
    title,
    subtitle,
    onPress,
    rightElement,
    showArrow = true,
  }) => (
    <TouchableOpacity
      style={[styles.profileItem, { borderBottomColor: border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.profileItemLeft}>
        <View
          style={[styles.profileItemIcon, { backgroundColor: `${tint}20` }]}
        >
          {iconType === "Ionicons" ? (
            <Ionicons name={icon as any} size={20} color={tint} />
          ) : (
            <MaterialCommunityIcons name={icon as any} size={20} color={tint} />
          )}
        </View>
        <View style={styles.profileItemText}>
          <Text style={[styles.profileItemTitle, { color: textPrimary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[styles.profileItemSubtitle, { color: textSecondary }]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.profileItemRight}>
        {rightElement}
        {showArrow && onPress && (
          <Ionicons name="chevron-forward" size={16} color={textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const StatCard = ({
    icon,
    value,
    label,
    color = tint,
  }: {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    value: string;
    label: string;
    color?: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: cardBackground }]}>
      <View style={[styles.statCardIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statCardValue, { color: textPrimary }]}>
        {value}
      </Text>
      <Text style={[styles.statCardLabel, { color: textSecondary }]}>
        {label}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBackground }]}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: tint }]}>
              <Text style={styles.avatarText}>
                {mockUserData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.userName, { color: textPrimary }]}>
                {mockUserData.name}
              </Text>
              <Text style={[styles.userEmail, { color: textSecondary }]}>
                {mockUserData.email}
              </Text>
              <Text style={[styles.joinDate, { color: textSecondary }]}>
                Membre depuis {formatDate(mockUserData.joinDate)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <StatCard
            icon="trophy"
            value={String(mockUserData.completedPlans)}
            label="Plans terminés"
            color="#F59E0B"
          />
          <StatCard
            icon="trending-up"
            value={`€${mockUserData.totalAmountRecovered}`}
            label="Total récupéré"
            color="#10B981"
          />
          <StatCard
            icon="calendar"
            value={String(mockUserData.totalPlans)}
            label="Plans créés"
            color="#3B82F6"
          />
        </View>

        {/* Current Plan */}
        <ProfileSection title="Plan actuel">
          <ProfileItem
            icon="target"
            iconType="MaterialCommunityIcons"
            title={mockUserData.currentPlan.goal}
            subtitle={`${formatDate(
              mockUserData.currentPlan.startDate
            )} - ${formatDate(mockUserData.currentPlan.endDate)}`}
            onPress={() => console.log("Edit current plan")}
          />
          <ProfileItem
            icon="time"
            title="Fenêtre de validation"
            subtitle={mockUserData.currentPlan.validationWindow}
            onPress={() => console.log("Edit validation window")}
          />
          <ProfileItem
            icon="heart"
            title="Œuvre caritative"
            subtitle={mockUserData.currentPlan.selectedCharity}
            onPress={() => console.log("Change charity")}
          />
          <ProfileItem
            icon="card"
            title="Montant déposé"
            subtitle={`€${mockUserData.currentPlan.amount}`}
            onPress={() => console.log("View payment details")}
            showArrow={false}
          />
        </ProfileSection>

        {/* Settings */}
        <ProfileSection title="Paramètres">
          <ProfileItem
            icon="notifications"
            title="Notifications"
            subtitle="Rappels quotidiens et alertes"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: border, true: `${tint}50` }}
                thumbColor={notificationsEnabled ? tint : textSecondary}
              />
            }
            showArrow={false}
          />
          <ProfileItem
            icon="moon"
            title="Mode sombre"
            subtitle="Thème de l'application"
            rightElement={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: border, true: `${tint}50` }}
                thumbColor={darkModeEnabled ? tint : textSecondary}
              />
            }
            showArrow={false}
          />
          <ProfileItem
            icon="language"
            title="Langue"
            subtitle="Français"
            onPress={() => console.log("Change language")}
          />
          <ProfileItem
            icon="shield-checkmark"
            title="Confidentialité"
            subtitle="Gestion des données"
            onPress={() => console.log("Privacy settings")}
          />
        </ProfileSection>

        {/* Account Management */}
        <ProfileSection title="Compte">
          <ProfileItem
            icon="card"
            title="Méthodes de paiement"
            subtitle="Gérer vos cartes et comptes"
            onPress={() => console.log("Payment methods")}
          />
          <ProfileItem
            icon="document-text"
            title="Historique des plans"
            subtitle="Voir tous vos plans précédents"
            onPress={() => console.log("Plan history")}
          />
          <ProfileItem
            icon="download"
            title="Exporter mes données"
            subtitle="Télécharger vos informations"
            onPress={() => console.log("Export data")}
          />
          <ProfileItem
            icon="help-circle"
            title="Aide et support"
            subtitle="FAQ, contact, guides"
            onPress={() => console.log("Help center")}
          />
        </ProfileSection>

        {/* Legal */}
        <ProfileSection title="Légal">
          <ProfileItem
            icon="document"
            title="Conditions d'utilisation"
            onPress={() => console.log("Terms of service")}
            subtitle={undefined}
            rightElement={undefined}
          />
          <ProfileItem
            icon="shield"
            title="Politique de confidentialité"
            onPress={() => console.log("Privacy policy")}
            subtitle={undefined}
            rightElement={undefined}
          />
          <ProfileItem
            icon="information-circle"
            title="À propos de LockIn"
            subtitle="Version 1.0.0"
            onPress={() => console.log("About app")}
            rightElement={undefined}
          />
        </ProfileSection>

        {/* Danger Zone */}
        <View style={[styles.section, { backgroundColor: cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Zone de danger
          </Text>

          <TouchableOpacity
            style={[styles.dangerButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#F59E0B" />
            <Text style={[styles.dangerButtonText, { color: "#F59E0B" }]}>
              Se déconnecter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dangerButton, styles.deleteButton]}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash" size={20} color="#EF4444" />
            <Text style={[styles.dangerButtonText, { color: "#EF4444" }]}>
              Supprimer le compte
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: textSecondary }]}>
            LockIn • Restez motivé, atteignez vos objectifs
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerText: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 12,
  },
  content: {
    flex: 1,
    marginTop: 15,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  profileItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileItemText: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  profileItemSubtitle: {
    fontSize: 12,
  },
  profileItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  logoutButton: {
    borderColor: "#F59E0B",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
  },
  deleteButton: {
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 12,
  },
});
