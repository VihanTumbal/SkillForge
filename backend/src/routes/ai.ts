import express from "express";
import { body, param } from "express-validator";
import {
  generateLearningPath,
  getSkillSuggestions,
  analyzeSkillGaps,
  generateStudyPlan,
  getAIInsights,
} from "../controllers/aiController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Validation rules
const skillGapAnalysisValidation = [
  body("targetRole")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Target role must be between 1 and 100 characters"),
];

const goalIdValidation = [
  param("goalId").isMongoId().withMessage("Invalid goal ID"),
];

// Apply authentication to all routes
router.use(authenticate);

// Routes
router.get("/insights", getAIInsights);
router.get("/learning-path", generateLearningPath);
router.get("/skill-suggestions", getSkillSuggestions);
router.post("/skill-gaps", skillGapAnalysisValidation, analyzeSkillGaps);
router.get("/study-plan/:goalId", goalIdValidation, generateStudyPlan);

export default router;
