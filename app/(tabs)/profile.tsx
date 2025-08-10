import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface UserStats {
  totalDays: number;
  currentStreak: number;
  completedHabits: number;
  readArticles: number;
}

interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  avatar?: string;
  level: number;
  xp: number;
  nextLevelXp: number;
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Alex Martin",
    email: "alex.martin@example.com",
    joinDate: "2024-01-01",
    level: 12,
    xp: 2340,
    nextLevelXp: 2500,
  });

  const [userStats, setUserStats] = useState<UserStats>({
    totalDays: 45,
    currentStreak: 7,
    completedHabits: 156,
    readArticles: 23,
  });

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

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  };

  const calculateProgress = () => {
    return (userProfile.xp / userProfile.nextLevelXp) * 100;
  };

  const handleEditProfile = () => {
    //router.push('/edit-profile');
  };

  const handleSettings = () => {
    //router.push('/settings');
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: () => {
          // TODO: Implement logout
          console.log("Logout");
        },
      },
    ]);
  };

  const StatCard = ({
    icon,
    title,
    value,
    subtitle,
  }: {
    icon: string;
    title: string;
    value: string | number;
    subtitle?: string;
  }) => (
    <View
      style={[
        styles.statCard,
        { backgroundColor: cardBackground, borderColor: border },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: `${tint}20` }]}>
        <Ionicons name={icon as any} size={24} color={tint} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: textPrimary }]}>{value}</Text>
        <Text style={[styles.statTitle, { color: textSecondary }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.statSubtitle, { color: textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );

  const MenuButton = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[
        styles.menuButton,
        { backgroundColor: cardBackground, borderColor: border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.menuIcon, { backgroundColor: `${tint}20` }]}>
          <Ionicons name={icon as any} size={20} color={tint} />
        </View>
        <View style={styles.menuText}>
          <Text style={[styles.menuTitle, { color: textPrimary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.menuSubtitle, { color: textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward" size={20} color={textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>
            Profil
          </Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleSettings}
          >
            <Ionicons name="settings-outline" size={24} color={textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: cardBackground, borderColor: border },
          ]}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {userProfile.avatar ? (
                <Image
                  source={{ uri: userProfile.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[styles.avatarPlaceholder, { backgroundColor: tint }]}
                >
                  <Text style={styles.avatarText}>
                    {userProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={[styles.levelBadge, { backgroundColor: tint }]}>
                <Text style={styles.levelText}>{userProfile.level}</Text>
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: textPrimary }]}>
                {userProfile.name}
              </Text>
              <Text style={[styles.userEmail, { color: textSecondary }]}>
                {userProfile.email}
              </Text>
              <Text style={[styles.joinDate, { color: textSecondary }]}>
                Membre depuis {formatJoinDate(userProfile.joinDate)}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.editButton, { borderColor: tint }]}
              onPress={handleEditProfile}
            >
              <Ionicons name="pencil" size={16} color={tint} />
            </TouchableOpacity>
          </View>

          {/* XP Progress */}
          <View style={styles.xpContainer}>
            <View style={styles.xpHeader}>
              <Text style={[styles.xpTitle, { color: textPrimary }]}>
                Niveau {userProfile.level}
              </Text>
              <Text style={[styles.xpText, { color: textSecondary }]}>
                {userProfile.xp} / {userProfile.nextLevelXp} XP
              </Text>
            </View>
            <View
              style={[styles.progressBar, { backgroundColor: `${tint}20` }]}
            >
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: tint, width: `${calculateProgress()}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="calendar"
            title="Jours au total"
            value={userStats.totalDays}
          />
          <StatCard
            icon="flame"
            title="Série actuelle"
            value={userStats.currentStreak}
            subtitle="jours"
          />
          <StatCard
            icon="checkmark-circle"
            title="Habitudes"
            value={userStats.completedHabits}
            subtitle="terminées"
          />
          <StatCard
            icon="book"
            title="Articles"
            value={userStats.readArticles}
            subtitle="lus"
          />
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Préférences
          </Text>

          <MenuButton
            icon="notifications"
            title="Notifications"
            subtitle="Rappels et alertes"
            onPress={() => {}}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: border, true: `${tint}40` }}
                thumbColor={notificationsEnabled ? tint : textSecondary}
              />
            }
          />

          <MenuButton
            icon="moon"
            title="Mode sombre"
            subtitle="Thème de l'application"
            onPress={() => setDarkModeEnabled(!darkModeEnabled)}
            rightElement={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: border, true: `${tint}40` }}
                thumbColor={darkModeEnabled ? tint : textSecondary}
              />
            }
          />

          <MenuButton
            icon="language"
            title="Langue"
            subtitle="Français"
            onPress={() => {}}
          />

          <MenuButton
            icon="time"
            title="Rappels"
            subtitle="Gérer les horaires"
            onPress={() => {}}
          />
        </View>

        {/* Support Section */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Support
          </Text>

          <MenuButton
            icon="help-circle"
            title="Centre d'aide"
            subtitle="FAQ et support"
            onPress={() => {}}
          />

          <MenuButton
            icon="mail"
            title="Nous contacter"
            subtitle="Feedback et suggestions"
            onPress={() => {}}
          />

          <MenuButton
            icon="star"
            title="Noter l'app"
            subtitle="Donnez-nous votre avis"
            onPress={() => {}}
          />

          <MenuButton
            icon="document-text"
            title="Politique de confidentialité"
            onPress={() => {}}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: "#EF4444" }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={[styles.logoutText, { color: "#EF4444" }]}>
            Se déconnecter
          </Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={[styles.appVersion, { color: textSecondary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  settingsButton: {
    padding: 8,
  },
  profileCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  levelBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  levelText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
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
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  xpContainer: {
    marginTop: 4,
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  xpTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  xpText: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: (width - 56) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: "500",
  },
  statSubtitle: {
    fontSize: 10,
  },
  menuSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
  appVersion: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 20,
  },
});
