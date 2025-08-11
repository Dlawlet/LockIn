import { db } from "@/config/firebase";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AuthenticatedUserContext } from "@/providers/AuthenticatedUserProvider";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
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

const PROFILE_CACHE_KEY = "profileDataCache";
const STATS_CACHE_KEY = "statsDataCache";
const SETTINGS_CACHE_KEY = "settingsDataCache";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  avatar?: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  totalDays: number;
  currentStreak: number;
  completedHabits: number;
  readArticles: number;
  lastActiveDate?: string;
}

interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  reminderTime?: string;
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const user = useContext(AuthenticatedUserContext);

  // États
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalDays: 0,
    currentStreak: 0,
    completedHabits: 0,
    readArticles: 0,
  });
  const [userSettings, setUserSettings] = useState<UserSettings>({
    notifications: true,
    darkMode: colorScheme === "dark",
    language: "fr",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Redirection si pas d'utilisateur
  if (!user) {
    router.replace("/auth/LoginScreen");
    return null;
  }

  const userId = user.user.uid;

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");
  const textPrimary = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  // Charger le cache au démarrage
  useEffect(() => {
    const loadCache = async () => {
      try {
        const [cachedProfile, cachedStats, cachedSettings] = await Promise.all([
          AsyncStorage.getItem(PROFILE_CACHE_KEY),
          AsyncStorage.getItem(STATS_CACHE_KEY),
          AsyncStorage.getItem(SETTINGS_CACHE_KEY),
        ]);

        if (cachedProfile) {
          setUserProfile(JSON.parse(cachedProfile));
        }
        if (cachedStats) {
          setUserStats(JSON.parse(cachedStats));
        }
        // Charger les paramètres depuis AsyncStorage uniquement
        if (cachedSettings) {
          setUserSettings(JSON.parse(cachedSettings));
        } else {
          // Paramètres par défaut si pas de cache
          const defaultSettings = {
            notifications: true,
            darkMode: colorScheme === "dark",
            language: "fr",
          };
          setUserSettings(defaultSettings);
          AsyncStorage.setItem(
            SETTINGS_CACHE_KEY,
            JSON.stringify(defaultSettings)
          );
        }
      } catch (error) {
        console.error("Error loading cache:", error);
      }
    };
    loadCache();
  }, [colorScheme]);

  // Listeners Firestore en temps réel
  useEffect(() => {
    if (!userId) return;

    const profileRef = doc(db, "users", userId);
    const statsRef = doc(db, "userStats", userId);
    const settingsRef = doc(db, "userSettings", userId);

    // Charger les données initiales
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // Charger le profil
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const profileData = {
            id: profileSnap.id,
            ...profileSnap.data(),
          } as UserProfile;
          setUserProfile(profileData);
          AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profileData));
        } else {
          // Créer un profil par défaut si il n'existe pas
          await createDefaultProfile();
        }

        // Charger les stats
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
          const statsData = statsSnap.data() as UserStats;
          setUserStats(statsData);
          AsyncStorage.setItem(STATS_CACHE_KEY, JSON.stringify(statsData));
        } else {
          const defaultStats = {
            totalDays: 0,
            currentStreak: 0,
            completedHabits: 0,
            readArticles: 0,
          };
          setUserStats(defaultStats);
          await setDoc(statsRef, defaultStats);
        }

        // Charger les paramètres
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          const settingsData = settingsSnap.data() as UserSettings;
          setUserSettings(settingsData);
          AsyncStorage.setItem(
            SETTINGS_CACHE_KEY,
            JSON.stringify(settingsData)
          );
        } else {
          const defaultSettings = {
            notifications: true,
            darkMode: colorScheme === "dark",
            language: "fr",
          };
          setUserSettings(defaultSettings);
          await setDoc(settingsRef, defaultSettings);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        Alert.alert("Erreur", "Impossible de charger les données utilisateur");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    // Listeners en temps réel
    const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        const profileData = {
          id: docSnap.id,
          ...docSnap.data(),
        } as UserProfile;
        setUserProfile(profileData);
        AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profileData));
      }
    });

    const unsubscribeStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const statsData = docSnap.data() as UserStats;
        setUserStats(statsData);
        AsyncStorage.setItem(STATS_CACHE_KEY, JSON.stringify(statsData));
      }
    });

    const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const settingsData = docSnap.data() as UserSettings;
        setUserSettings(settingsData);
        AsyncStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settingsData));
      }
    });

    return () => {
      unsubscribeProfile();
      unsubscribeStats();
      unsubscribeSettings();
    };
  }, [userId]);

  const createDefaultProfile = async () => {
    try {
      const now = new Date().toISOString();
      const defaultProfile = {
        name:
          user.user.displayName ||
          user.user.email?.split("@")[0] ||
          "Utilisateur",
        email: user.user.email || "",
        joinDate: now,
        level: 1,
        xp: 0,
        nextLevelXp: 100,
        createdAt: now,
        updatedAt: now,
      };

      const profileRef = doc(db, "users", userId);
      await setDoc(profileRef, defaultProfile);

      const profileData = { id: userId, ...defaultProfile } as UserProfile;
      setUserProfile(profileData);
      AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profileData));
    } catch (error) {
      console.error("Error creating default profile:", error);
    }
  };

  const handleSettingChange = async (
    key: keyof UserSettings,
    value: boolean | string
  ) => {
    if (!userSettings || !userId) return;

    try {
      setUpdating(true);

      // Mise à jour optimiste
      const newSettings = { ...userSettings, [key]: value };
      setUserSettings(newSettings);

      // Mise à jour en base
      const settingsRef = doc(db, "userSettings", userId);
      await updateDoc(settingsRef, { [key]: value });
    } catch (error) {
      console.error("Error updating setting:", error);
      // Reverser le changement en cas d'erreur
      setUserSettings(userSettings);
      Alert.alert("Erreur", "Impossible de sauvegarder les paramètres");
    } finally {
      setUpdating(false);
    }
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  };

  const calculateProgress = () => {
    if (!userProfile) return 0;
    return (userProfile.xp / userProfile.nextLevelXp) * 100;
  };

  const handleEditProfile = () => {
    Alert.alert("À venir", "La modification du profil sera bientôt disponible");
  };

  const handleSettings = () => {
    Alert.alert("À venir", "La page des paramètres sera bientôt disponible");
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
      disabled={updating}
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

  // Affichage de chargement
  if (loading) {
    return (
      <View
        style={[styles.container, styles.loadingContainer, { backgroundColor }]}
      >
        <ActivityIndicator size="large" color={tint} />
        <Text style={[styles.loadingText, { color: textPrimary }]}>
          Chargement du profil...
        </Text>
      </View>
    );
  }

  // Affichage d'erreur si pas de profil
  if (!userProfile) {
    return (
      <View
        style={[styles.container, styles.errorContainer, { backgroundColor }]}
      >
        <Ionicons
          name="person-circle-outline"
          size={64}
          color={textSecondary}
        />
        <Text style={[styles.errorText, { color: textPrimary }]}>
          Profil introuvable
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: tint }]}
          onPress={createDefaultProfile}
        >
          <Text style={styles.retryButtonText}>Créer le profil</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        {userStats && (
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
        )}

        {/* Menu Section */}
        {userSettings && (
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
                  value={userSettings.notifications}
                  onValueChange={(value) =>
                    handleSettingChange("notifications", value)
                  }
                  trackColor={{ false: border, true: `${tint}40` }}
                  thumbColor={userSettings.notifications ? tint : textSecondary}
                  disabled={updating}
                />
              }
            />

            <MenuButton
              icon="moon"
              title="Mode sombre"
              subtitle="Thème de l'application"
              onPress={() =>
                handleSettingChange("darkMode", !userSettings.darkMode)
              }
              rightElement={
                <Switch
                  value={userSettings.darkMode}
                  onValueChange={(value) =>
                    handleSettingChange("darkMode", value)
                  }
                  trackColor={{ false: border, true: `${tint}40` }}
                  thumbColor={userSettings.darkMode ? tint : textSecondary}
                  disabled={updating}
                />
              }
            />

            <MenuButton
              icon="language"
              title="Langue"
              subtitle={userSettings.language === "fr" ? "Français" : "English"}
              onPress={() => {}}
            />

            <MenuButton
              icon="time"
              title="Rappels"
              subtitle="Gérer les horaires"
              onPress={() => {}}
            />
          </View>
        )}

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

// Styles restent identiques à votre version précédente
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
