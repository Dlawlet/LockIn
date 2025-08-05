// global.d.ts
declare global {
  type HabitStatus = 'success' | 'failed' | 'pending' | 'inactive';
  
  interface ValidationWindow {
    start: string;
    end: string;
  }
  interface Goal {
    title: string;  
    description: string;
    completed: boolean;
  }

  type User = {
  goals: Goal[];
  email: string;
  name: string;
  firstname: string;
  currentDay: number;
  totalDays: number;
  amountDeposited: number;
  amountRecovered: number;
  currentStreak: number;
  todayValidated: boolean;
  createdAt: string;
  goalTitle: string;
  validationWindow: ValidationWindow;
  weekProgress: Array<{ day: string; status: HabitStatus }>;
};
  
  type ColorScheme = 'light' | 'dark';
}

export { };

