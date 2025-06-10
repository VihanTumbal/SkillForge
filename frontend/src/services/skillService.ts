import { apiClient } from "./api";

export interface Skill {
  _id: string;
  name: string;
  category: "frontend" | "backend" | "database" | "devops" | "mobile" | "other";
  proficiency: 1 | 2 | 3 | 4 | 5;
  experience: number;
  lastUsed: string;
  notes?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillRequest {
  name: string;
  category: Skill["category"];
  proficiency: Skill["proficiency"];
  experience: number;
  lastUsed: string;
  notes?: string;
}

export interface UpdateSkillRequest {
  name?: string;
  category?: Skill["category"];
  proficiency?: Skill["proficiency"];
  experience?: number;
  lastUsed?: string;
  notes?: string;
}

export interface SkillStats {
  total: number;
  byCategory: Record<string, number>;
  averageProficiency: number;
  recentlyUsed: number;
}

export interface ApiSkillResponse {
  status: string;
  results: number;
  data: {
    skills: Skill[];
  };
}

export interface ApiSingleSkillResponse {
  status: string;
  data: {
    skill: Skill;
  };
}

export interface ApiSkillStatsResponse {
  status: string;
  data: {
    stats: SkillStats;
  };
}

export class SkillService {
  static async getSkills(): Promise<Skill[]> {
    const response = await apiClient.get<ApiSkillResponse>("/api/skills");
    return response.data.skills;
  }

  static async getSkill(id: string): Promise<Skill> {
    const response = await apiClient.get<ApiSingleSkillResponse>(
      `/api/skills/${id}`
    );
    return response.data.skill;
  }

  static async createSkill(skillData: CreateSkillRequest): Promise<Skill> {
    const response = await apiClient.post<ApiSingleSkillResponse>(
      "/api/skills",
      skillData
    );
    return response.data.skill;
  }
  static async updateSkill(
    id: string,
    skillData: UpdateSkillRequest
  ): Promise<Skill> {
    const response = await apiClient.put<ApiSingleSkillResponse>(
      `/api/skills/${id}`,
      skillData
    );
    return response.data.skill;
  }

  static async deleteSkill(id: string): Promise<void> {
    await apiClient.delete<void>(`/api/skills/${id}`);
  }

  static async getSkillStats(): Promise<SkillStats> {
    const response = await apiClient.get<ApiSkillStatsResponse>(
      "/api/skills/stats"
    );
    return response.data.stats;
  }
}
