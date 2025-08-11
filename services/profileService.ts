import { db } from '@/config/firebase';
import { doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';

export interface UserProfile {
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

export interface UserStats {
  totalDays: number;
  currentStreak: number;
  completedHabits: number;
  readArticles: number;
  lastActiveDate?: string;
}

export interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  reminderTime?: string;
}

// Récupérer le profil utilisateur
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Récupérer les statistiques utilisateur
export const getUserStats = async (userId: string): Promise<UserStats> => {
  try {
    const statsRef = doc(db, 'userStats', userId);
    const statsSnap = await getDoc(statsRef);
    
    if (statsSnap.exists()) {
      return statsSnap.data() as UserStats;
    }
    
    // Retourner des stats par défaut si elles n'existent pas
    return {
      totalDays: 0,
      currentStreak: 0,
      completedHabits: 0,
      readArticles: 0,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalDays: 0,
      currentStreak: 0,
      completedHabits: 0,
      readArticles: 0,
    };
  }
};

// Récupérer les paramètres utilisateur
export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  try {
    const settingsRef = doc(db, 'userSettings', userId);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      return settingsSnap.data() as UserSettings;
    }
    
    // Paramètres par défaut
    return {
      notifications: true,
      darkMode: false,
      language: 'fr',
    };
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return {
      notifications: true,
      darkMode: false,
      language: 'fr',
    };
  }
};

// Créer un profil utilisateur
export const createUserProfile = async (userId: string, userData: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const now = new Date().toISOString();
    
    const defaultProfile: Omit<UserProfile, 'id'> = {
      name: userData.name || 'Utilisateur',
      email: userData.email || '',
      joinDate: now,
      level: 1,
      xp: 0,
      nextLevelXp: 100,
      createdAt: now,
      updatedAt: now,
      ...userData,
    };
    
    await setDoc(userRef, defaultProfile);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Mettre à jour le profil utilisateur
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Mettre à jour les paramètres utilisateur
export const updateUserSettings = async (userId: string, settings: Partial<UserSettings>): Promise<void> => {
  try {
    const settingsRef = doc(db, 'userSettings', userId);
    await setDoc(settingsRef, settings, { merge: true });
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

// Ajouter de l'XP et gérer les niveaux
export const addUserXP = async (userId: string, xpAmount: number): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile;
      const newXP = userData.xp + xpAmount;
      
      // Calculer le nouveau niveau
      let newLevel = userData.level;
      let nextLevelXp = userData.nextLevelXp;
      
      while (newXP >= nextLevelXp) {
        newLevel++;
        nextLevelXp = calculateNextLevelXP(newLevel);
      }
      
      await updateDoc(userRef, {
        xp: newXP,
        level: newLevel,
        nextLevelXp: nextLevelXp,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error adding user XP:', error);
    throw error;
  }
};

// Incrémenter les statistiques utilisateur
export const incrementUserStat = async (userId: string, statType: keyof UserStats, amount: number = 1): Promise<void> => {
  try {
    const statsRef = doc(db, 'userStats', userId);
    await updateDoc(statsRef, {
      [statType]: increment(amount),
      lastActiveDate: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error incrementing user stat:', error);
    throw error;
  }
};

// Calculer l'XP nécessaire pour le prochain niveau
const calculateNextLevelXP = (level: number): number => {
  return level * 100 + (level - 1) * 50; // Formule progressive
};