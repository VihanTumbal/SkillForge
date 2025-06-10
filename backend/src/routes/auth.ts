import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getProfile,
  updateProfile,
  exportUserData,
  resetUserProgress,
  deleteAccount,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Validation rules
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("currentPassword")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Current password cannot be empty"),
  body("newPassword")
    .optional()
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

const deleteAccountValidation = [
  body("password")
    .notEmpty()
    .withMessage("Password is required to delete account"),
];

// Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/profile", authenticate, getProfile);
router.patch("/profile", authenticate, updateProfileValidation, updateProfile);
router.get("/export", authenticate, exportUserData);
router.delete("/reset", authenticate, resetUserProgress);
router.delete("/account", authenticate, deleteAccountValidation, deleteAccount);

export default router;
