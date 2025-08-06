// global.d.ts
declare global {
  type HabitStatus = 'success' | 'failed' | 'pending' | 'inactive';
  type GoalStatus = 'active' | 'completed' | 'stopped';

  interface ValidationWindow {
    start: string;
    end: string;
  }
  interface Goal {
    id: string;
    title: string;  
    description: string;
    completed: boolean;
    startDate: string;
    endDate: string;
    amountDeposited: number;
    amountRecovered: number;
    currentStreak: number;
    todayValidated: boolean;
    validationWindow: ValidationWindow;
    category: string;
    currentDays: number;
    totalDays: number;
    status: GoalStatus;
    createdAt: string;
    updatedAt: string;
    // New validation pattern fields
    validationType: 'everyday' | 'weekdays' | 'custom';
    weekdays?: number[]; // [1,2,3,4,5] for Mon-Fri (0=Sunday, 1=Monday...)
    customDays?: string[]; // ['2024-01-15', '2024-01-20'] for specific dates

  }

  type User = {
  goals: Goal[];
  email: string;
  name: string;
  firstname: string;
  createdAt: string;
};
  
  type ColorScheme = 'light' | 'dark';
}

export { };

