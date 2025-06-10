import express from "express";
import { body, param } from "express-validator";
import {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillsStats,
} from "../controllers/skillController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Validation rules
const skillValidation = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Skill name must be between 1 and 100 characters"),
  body("category")
    .isIn(["frontend", "backend", "database", "devops", "mobile", "other"])
    .withMessage("Invalid category"),
  body("proficiency")
    .isInt({ min: 1, max: 5 })
    .withMessage("Proficiency must be a number between 1 and 5"),
  body("experience")
    .isNumeric({ no_symbols: true })
    .isFloat({ min: 0 })
    .withMessage("Experience must be a non-negative number"),
  body("lastUsed").isISO8601().withMessage("Last used must be a valid date"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

const idValidation = [param("id").isMongoId().withMessage("Invalid skill ID")];

// Apply authentication to all routes
router.use(authenticate);

// Routes
router.get("/", getSkills);
router.get("/stats", getSkillsStats);
router.get("/:id", idValidation, getSkill);
router.post("/", skillValidation, createSkill);
router.put("/:id", [...idValidation, ...skillValidation], updateSkill);
router.delete("/:id", idValidation, deleteSkill);

export default router;
