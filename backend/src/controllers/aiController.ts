import { Response } from "express";
import { validationResult } from "express-validator";
import { GeminiService } from "../services/geminiService";
import Skill from "../models/Skill";
import LearningGoal from "../models/LearningGoal";
import { AuthenticatedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";

let geminiService: GeminiService | null = null;

const getGeminiService = () => {
  if (!geminiService) {
    try {
      geminiService = new GeminiService();
    } catch (error) {
      console.error("Failed to initialize GeminiService:", error);
      throw new Error(
        "AI service is not available. Please check your GEMINI_API_KEY configuration."
      );
    }
  }
  return geminiService;
};

// Generate personalized learning path
export const generateLearningPath = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!._id;

    try {
      const skills = await Skill.find({ user: userId });
      const goals = await LearningGoal.find({
        user: userId,
        status: { $ne: "completed" },
      });

      const recommendations = await getGeminiService().generateLearningPath(
        skills,
        goals
      );

      res.status(200).json({
        status: "success",
        data: {
          recommendations,
          basedOn: {
            skillsCount: skills.length,
            goalsCount: goals.length,
          },
        },
      });
    } catch (error) {
      console.error("Learning path generation error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to generate learning path recommendations",
      });
    }
  }
);

// Get skill suggestions
export const getSkillSuggestions = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!._id;
    try {
      const skills = await Skill.find({ user: userId });
      const skillNames = skills.map((skill) => skill.name);

      const suggestions = await getGeminiService().suggestSkillCategories(
        skillNames
      );

      res.status(200).json({
        status: "success",
        data: {
          suggestions,
          basedOnSkills: skillNames,
        },
      });
    } catch (error) {
      console.error("Skill suggestions error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to generate skill suggestions",
      });
    }
  }
);

// Analyze skill gaps for target role
export const analyzeSkillGaps = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const userId = req.user!._id;
    const { targetRole } = req.body;
    try {
      const skills = await Skill.find({ user: userId });

      const analysis = await getGeminiService().analyzeSkillGaps(
        skills,
        targetRole
      );

      res.status(200).json({
        status: "success",
        data: {
          analysis,
          targetRole,
          currentSkillsCount: skills.length,
        },
      });
    } catch (error) {
      console.error("Skill gap analysis error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to analyze skill gaps",
      });
    }
  }
);

// Generate study plan for specific goal
export const generateStudyPlan = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { goalId } = req.params;
    const userId = req.user!._id;
    try {
      const goal = await LearningGoal.findOne({ _id: goalId, user: userId });
      if (!goal) {
        res.status(404).json({
          status: "error",
          message: "Learning goal not found",
        });
        return;
      }

      const userSkills = await Skill.find({ user: userId });

      const studyPlan = await getGeminiService().generateStudyPlan(
        goal,
        userSkills
      );
      res.status(200).json({
        status: "success",
        data: {
          studyPlan,
          goal: {
            id: goal._id,
            title: goal.title,
            targetSkill: goal.targetSkill,
            priority: goal.priority,
            status: goal.status,
          },
        },
      });
    } catch (error) {
      console.error("Study plan generation error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to generate study plan",
      });
    }
  }
);

// Get AI insights dashboard
export const getAIInsights = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!._id;
    try {
      const skills = await Skill.find({ user: userId });
      const goals = await LearningGoal.find({ user: userId });

      const completedGoals = goals.filter(
        (goal) => goal.status === "completed"
      );
      const inProgressGoals = goals.filter(
        (goal) => goal.status === "in-progress"
      );

      // Calculate insights
      const insights = {
        totalSkills: skills.length,
        averageProficiency:
          skills.length > 0
            ? Math.round(
                (skills.reduce((sum, skill) => sum + skill.proficiency, 0) /
                  skills.length) *
                  10
              ) / 10
            : 0,
        topSkillCategory: getTopCategory(skills),
        goalsCompleted: completedGoals.length,
        goalsInProgress: inProgressGoals.length,
        skillsNeedingImprovement: skills.filter(
          (skill) => skill.proficiency < 5
        ).length,
        expertSkills: skills.filter((skill) => skill.proficiency >= 9).length,
        overdueTasks: inProgressGoals.filter(
          (goal) => goal.targetDate && new Date(goal.targetDate) < new Date()
        ).length,
      };

      res.status(200).json({
        status: "success",
        data: {
          insights,
          recommendations: {
            focusAreas: skills
              .filter((skill) => skill.proficiency < 5)
              .slice(0, 3),
            upcomingDeadlines: inProgressGoals
              .filter((goal) => goal.targetDate)
              .sort(
                (a, b) =>
                  new Date(a.targetDate!).getTime() -
                  new Date(b.targetDate!).getTime()
              )
              .slice(0, 3),
          },
        },
      });
    } catch (error) {
      console.error("AI insights error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to generate AI insights",
      });
    }
  }
);

// Helper function to get top skill category
function getTopCategory(skills: any[]): string | null {
  if (skills.length === 0) return null;

  const categoryCount = skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return (
    Object.entries(categoryCount).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    )[0]?.[0] || null
  );
}
