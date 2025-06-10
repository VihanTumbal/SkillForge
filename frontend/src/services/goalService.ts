import { apiClient } from "./api";

export interface LearningGoal {
  _id: string;
  title: string;
  description: string;
  targetSkill: string;
  priority: "low" | "medium" | "high";
  status: "not-started" | "in-progress" | "completed" | "paused";
  targetDate: string;
  progress: number;
  resources: string[];
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalRequest {
  title: string;
  description: string;
  targetSkill: string;
  priority: LearningGoal["priority"];
  targetDate: string;
  resources?: string[];
}

export interface UpdateGoalRequest extends Partial<CreateGoalRequest> {
  status?: LearningGoal["status"];
  progress?: number;
}

export interface GoalStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  byPriority: Record<string, number>;
}

export class GoalService {
  static async getGoals(): Promise<LearningGoal[]> {
    const response = await apiClient.get<{
      status: string;
      results: number;
      data: { goals: LearningGoal[] };
    }>("/api/goals");
    return response.data.goals;
  }

  static async getGoal(id: string): Promise<LearningGoal> {
    const response = await apiClient.get<{
      status: string;
      data: { goal: LearningGoal };
    }>(`/api/goals/${id}`);
    return response.data.goal;
  }

  static async createGoal(goalData: CreateGoalRequest): Promise<LearningGoal> {
    const response = await apiClient.post<{
      status: string;
      message: string;
      data: { goal: LearningGoal };
    }>("/api/goals", goalData);
    return response.data.goal;
  }

  static async updateGoal(
    id: string,
    goalData: UpdateGoalRequest
  ): Promise<LearningGoal> {
    const response = await apiClient.put<{
      status: string;
      message: string;
      data: { goal: LearningGoal };
    }>(`/api/goals/${id}`, goalData);
    return response.data.goal;
  }

  static async deleteGoal(id: string): Promise<void> {
    await apiClient.delete<{
      status: string;
      message: string;
    }>(`/api/goals/${id}`);
  }

  static async getGoalStats(): Promise<GoalStats> {
    const response = await apiClient.get<{
      status: string;
      data: GoalStats;
    }>("/api/goals/stats");
    return response.data;
  }

  static async updateProgress(
    id: string,
    progress: number
  ): Promise<LearningGoal> {
    const response = await apiClient.patch<{
      status: string;
      message: string;
      data: { goal: LearningGoal };
    }>(`/api/goals/${id}/progress`, {
      progress,
    });
    return response.data.goal;
  }
}
