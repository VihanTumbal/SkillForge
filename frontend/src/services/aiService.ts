import { apiClient } from "./api";

export interface AIInsights {
  totalSkills: number;
  averageProficiency: number;
  topSkillCategory: string | null;
  goalsCompleted: number;
  goalsInProgress: number;
  skillsNeedingImprovement: number;
  expertSkills: number;
  overdueTasks: number;
}

export interface AIResponse<T> {
  status: string;
  data: T;
}

export interface FocusArea {
  skill: string;
  priority: string;
  reason: string;
}

export interface UpcomingDeadline {
  goalId: string;
  title: string;
  dueDate: string;
  daysRemaining: number;
}

export interface LearningPathResponse {
  recommendations: string;
  basedOn: {
    skillsCount: number;
    goalsCount: number;
  };
}

export interface SkillSuggestionsResponse {
  suggestions: string;
  basedOnSkills: string[];
}

export interface SkillGapAnalysisResponse {
  analysis: string;
  targetRole: string;
  currentSkillsCount: number;
}

export interface StudyPlanResponse {
  studyPlan: string;
  goal: {
    id: string;
    title: string;
    targetSkill: string;
    priority: string;
    status: string;
  };
}

export interface AIInsightsResponse {
  insights: AIInsights;
  recommendations: {
    focusAreas: FocusArea[];
    upcomingDeadlines: UpcomingDeadline[];
  };
}

class AIService {
  private baseUrl = "/api/ai";
  async getAIInsights(): Promise<AIInsightsResponse> {
    const response = await apiClient.get<AIResponse<AIInsightsResponse>>(
      `${this.baseUrl}/insights`
    );
    return response.data;
  }
  async generateLearningPath(): Promise<LearningPathResponse> {
    const response = await apiClient.get<AIResponse<LearningPathResponse>>(
      `${this.baseUrl}/learning-path`
    );
    return response.data;
  }
  async getSkillSuggestions(): Promise<SkillSuggestionsResponse> {
    const response = await apiClient.get<AIResponse<SkillSuggestionsResponse>>(
      `${this.baseUrl}/skill-suggestions`
    );
    return response.data;
  }
  async analyzeSkillGaps(
    targetRole: string
  ): Promise<SkillGapAnalysisResponse> {
    const response = await apiClient.post<AIResponse<SkillGapAnalysisResponse>>(
      `${this.baseUrl}/skill-gaps`,
      { targetRole }
    );
    return response.data;
  }
  async generateStudyPlan(goalId: string): Promise<StudyPlanResponse> {
    const response = await apiClient.get<AIResponse<StudyPlanResponse>>(
      `${this.baseUrl}/study-plan/${goalId}`
    );
    return response.data;
  }
}

export const aiService = new AIService();
