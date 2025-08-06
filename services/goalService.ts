import { auth, db } from '@/config/firebase';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';

export const createGoal = async (goalData: Omit<Goal, 'currentDays'>) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Prepare goal data with default values and unique ID
    const newGoal: Goal = {
      ...goalData,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
      currentDays: 0,
      completed: false,
      status: 'active' as GoalStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add goal to user's goals array
    const userRef = doc(db, 'users', user.uid);
    
    await updateDoc(userRef, {
      goals: arrayUnion(newGoal),
      updatedAt: new Date().toISOString(),
    });

    return { success: true, goalId: newGoal.id, goal: newGoal };
  } catch (error) {
    console.error('Error creating goal:', error);
    throw new Error('Failed to create goal. Please try again.');
  }
};

export const getUserGoals = async (): Promise<Goal[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.goals || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw new Error('Failed to fetch goals');
  }
};

export const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get current user data
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    const userData = userDoc.data();
    const goals = userData.goals || [];
    
    // Find and update the specific goal
    const updatedGoals = goals.map((goal: Goal) => {
      if (goal.id === goalId) {
        return {
          ...goal,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return goal;
    });

    // Update the user document with the modified goals array
    await updateDoc(userRef, {
      goals: updatedGoals,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating goal:', error);
    throw new Error('Failed to update goal');
  }
};

export const deleteGoal = async (goalId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get current user data
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    const userData = userDoc.data();
    const goals = userData.goals || [];
    
    // Filter out the goal to delete
    const updatedGoals = goals.filter((goal: Goal) => goal.id !== goalId);

    // Update the user document
    await updateDoc(userRef, {
      goals: updatedGoals,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw new Error('Failed to delete goal');
  }
};