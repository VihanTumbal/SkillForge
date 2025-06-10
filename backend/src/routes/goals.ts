import express from "express";
import { body, param } from "express-validator";
import {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
  getGoalsStats,
} from "../controllers/goalController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Validation rules
const goalValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("description")
    .trim()
    .isLength({ min: 0, max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("targetSkill").trim().notEmpty().withMessage("Target skill is required"),
  body("priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),
  body("status")
    .optional()
    .isIn(["not-started", "in-progress", "completed", "paused"])
    .withMessage(
      "Status must be one of: not-started, in-progress, completed, paused"
    ),
  body("targetDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Invalid target date format"),
  body("progress")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Progress must be between 0 and 100"),
  body("resources")
    .optional()
    .isArray()
    .withMessage("Resources must be an array"),
  body("resources.*")
    .optional()
    .isString()
    .withMessage("Each resource must be a string"),
];

// Update validation rules (more flexible)
const goalUpdateValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 0, max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("targetSkill")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Target skill cannot be empty"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),
  body("status")
    .optional()
    .isIn(["not-started", "in-progress", "completed", "paused"])
    .withMessage(
      "Status must be one of: not-started, in-progress, completed, paused"
    ),
  body("targetDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Invalid target date format"),
  body("progress")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Progress must be between 0 and 100"),
  body("resources")
    .optional()
    .isArray()
    .withMessage("Resources must be an array"),
  body("resources.*")
    .optional()
    .isString()
    .withMessage("Each resource must be a string"),
];

const idValidation = [param("id").isMongoId().withMessage("Invalid goal ID")];

// Apply authentication to all routes
router.use(authenticate);

// Routes
router.get("/", getGoals);
router.get("/stats", getGoalsStats);
router.get("/:id", idValidation, getGoal);
router.post("/", goalValidation, createGoal);
router.put("/:id", [...idValidation, ...goalUpdateValidation], updateGoal);
router.patch("/:id/progress", idValidation, updateGoalProgress);
router.delete("/:id", idValidation, deleteGoal);

export default router;
