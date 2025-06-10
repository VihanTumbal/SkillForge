import { create } from "zustand";
import {
  SkillService,
  Skill,
  CreateSkillRequest,
  UpdateSkillRequest,
  SkillStats,
} from "../services/skillService";
import {
  GoalService,
  LearningGoal,
  CreateGoalRequest,
  UpdateGoalRequest,
  GoalStats,
} from "../services/goalService";

interface SkillState {
  // Data
  skills: Skill[];
  learningGoals: LearningGoal[];
  skillStats: SkillStats | null;
  goalStats: GoalStats | null;

  // Loading states
  isLoading: boolean;
  isLoadingSkills: boolean;
  isLoadingGoals: boolean;

  // Error states
  error: string | null;
  skillError: string | null;
  goalError: string | null;

  // Skill actions
  fetchSkills: () => Promise<void>;
  createSkill: (skillData: CreateSkillRequest) => Promise<void>;
  updateSkill: (id: string, updates: UpdateSkillRequest) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  fetchSkillStats: () => Promise<void>;

  // Goal actions
  fetchGoals: () => Promise<void>;
  createGoal: (goalData: CreateGoalRequest) => Promise<void>;
  updateGoal: (id: string, updates: UpdateGoalRequest) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateGoalProgress: (id: string, progress: number) => Promise<void>;
  fetchGoalStats: () => Promise<void>;

  // Utility actions
  clearErrors: () => void;
  resetStore: () => void;
}

export const useSkillStore = create<SkillState>((set) => ({
  // Initial state
  skills: [],
  learningGoals: [],
  skillStats: null,
  goalStats: null,
  isLoading: false,
  isLoadingSkills: false,
  isLoadingGoals: false,
  error: null,
  skillError: null,
  goalError: null,

  // Skill actions
  fetchSkills: async () => {
    set({ isLoadingSkills: true, skillError: null });
    try {
      const skills = await SkillService.getSkills();
      set({ skills, isLoadingSkills: false });
    } catch (error) {
      set({
        skillError:
          error instanceof Error ? error.message : "Failed to fetch skills",
        isLoadingSkills: false,
      });
    }
  },

  createSkill: async (skillData: CreateSkillRequest) => {
    set({ isLoading: true, skillError: null });
    try {
      const newSkill = await SkillService.createSkill(skillData);
      set((state) => ({
        skills: [...state.skills, newSkill],
        isLoading: false,
      }));
    } catch (error) {
      set({
        skillError:
          error instanceof Error ? error.message : "Failed to create skill",
        isLoading: false,
      });
      throw error;
    }
  },

  updateSkill: async (id: string, updates: UpdateSkillRequest) => {
    set({ isLoading: true, skillError: null });
    try {
      const updatedSkill = await SkillService.updateSkill(id, updates);
      set((state) => ({
        skills: state.skills.map((skill) =>
          skill._id === id ? updatedSkill : skill
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        skillError:
          error instanceof Error ? error.message : "Failed to update skill",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteSkill: async (id: string) => {
    set({ isLoading: true, skillError: null });
    try {
      await SkillService.deleteSkill(id);
      set((state) => ({
        skills: state.skills.filter((skill) => skill._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        skillError:
          error instanceof Error ? error.message : "Failed to delete skill",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchSkillStats: async () => {
    try {
      const skillStats = await SkillService.getSkillStats();
      set({ skillStats });
    } catch (error) {
      console.error("Failed to fetch skill stats:", error);
    }
  },

  // Goal actions
  fetchGoals: async () => {
    set({ isLoadingGoals: true, goalError: null });
    try {
      const learningGoals = await GoalService.getGoals();
      set({ learningGoals, isLoadingGoals: false });
    } catch (error) {
      set({
        goalError:
          error instanceof Error ? error.message : "Failed to fetch goals",
        isLoadingGoals: false,
      });
    }
  },

  createGoal: async (goalData: CreateGoalRequest) => {
    set({ isLoading: true, goalError: null });
    try {
      const newGoal = await GoalService.createGoal(goalData);
      set((state) => ({
        learningGoals: [...state.learningGoals, newGoal],
        isLoading: false,
      }));
    } catch (error) {
      set({
        goalError:
          error instanceof Error ? error.message : "Failed to create goal",
        isLoading: false,
      });
      throw error;
    }
  },

  updateGoal: async (id: string, updates: UpdateGoalRequest) => {
    set({ isLoading: true, goalError: null });
    try {
      const updatedGoal = await GoalService.updateGoal(id, updates);
      set((state) => ({
        learningGoals: state.learningGoals.map((goal) =>
          goal._id === id ? updatedGoal : goal
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        goalError:
          error instanceof Error ? error.message : "Failed to update goal",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteGoal: async (id: string) => {
    set({ isLoading: true, goalError: null });
    try {
      await GoalService.deleteGoal(id);
      set((state) => ({
        learningGoals: state.learningGoals.filter((goal) => goal._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        goalError:
          error instanceof Error ? error.message : "Failed to delete goal",
        isLoading: false,
      });
      throw error;
    }
  },

  updateGoalProgress: async (id: string, progress: number) => {
    set({ isLoading: true, goalError: null });
    try {
      const updatedGoal = await GoalService.updateProgress(id, progress);
      set((state) => ({
        learningGoals: state.learningGoals.map((goal) =>
          goal._id === id ? updatedGoal : goal
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        goalError:
          error instanceof Error ? error.message : "Failed to update progress",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchGoalStats: async () => {
    try {
      const goalStats = await GoalService.getGoalStats();
      set({ goalStats });
    } catch (error) {
      console.error("Failed to fetch goal stats:", error);
    }
  },

  // Utility actions
  clearErrors: () => set({ error: null, skillError: null, goalError: null }),

  resetStore: () =>
    set({
      skills: [],
      learningGoals: [],
      skillStats: null,
      goalStats: null,
      isLoading: false,
      isLoadingSkills: false,
      isLoadingGoals: false,
      error: null,
      skillError: null,
      goalError: null,
    }),
}));
