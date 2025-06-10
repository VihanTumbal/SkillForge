import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User, { IUser } from "../models/User";
import { generateToken, AuthenticatedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import Skill from "../models/Skill";
import LearningGoal from "../models/LearningGoal";

// Register user
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        status: "error",
        message: "User already exists with this email",
      });
      return;
    } // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  }
);

// Login user
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const { email, password } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
      return;
    } // Generate token
    const token = generateToken((user._id as any).toString());

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt, // Added createdAt
        },
        token,
      },
    });
  }
);

// Get current user profile
export const getProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user as IUser;

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  }
);

// Update user profile
export const updateProfile = asyncHandler(
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

    const user = req.user!;
    const { name, email, currentPassword, newPassword } = req.body;

    // Find the user with password field for password verification
    const userWithPassword = await User.findById(user._id).select("+password");
    if (!userWithPassword) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    const updateData: any = {};

    // Update name if provided
    if (name && name !== user.name) {
      updateData.name = name;
    }

    // Update email if provided and different
    if (email && email !== user.email) {
      // Check if email is already in use
      const existingUser = await User.findOne({
        email,
        _id: { $ne: user._id },
      });
      if (existingUser) {
        res.status(400).json({
          status: "error",
          message: "Email is already in use",
        });
        return;
      }
      updateData.email = email;
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({
          status: "error",
          message: "Current password is required to change password",
        });
        return;
      }

      // Verify current password
      const isCurrentPasswordValid = await userWithPassword.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        res.status(400).json({
          status: "error",
          message: "Current password is incorrect",
        });
        return;
      }

      updateData.password = newPassword;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user: {
          id: updatedUser!._id,
          name: updatedUser!.name,
          email: updatedUser!.email,
          createdAt: updatedUser!.createdAt,
          updatedAt: updatedUser!.updatedAt,
        },
      },
    });
  }
);

// Export user data
export const exportUserData = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!._id;

    try {
      // Get user data
      const user = await User.findById(userId);
      const skills = await Skill.find({ user: userId });
      const goals = await LearningGoal.find({ user: userId });

      const exportData = {
        user: {
          name: user?.name,
          email: user?.email,
          createdAt: user?.createdAt,
        },
        skills: skills.map((skill) => ({
          name: skill.name,
          category: skill.category,
          proficiency: skill.proficiency,
          experience: skill.experience,
          lastUsed: skill.lastUsed,
          notes: skill.notes,
          createdAt: skill.createdAt,
        })),
        goals: goals.map((goal) => ({
          title: goal.title,
          description: goal.description,
          targetSkill: goal.targetSkill,
          priority: goal.priority,
          status: goal.status,
          progress: goal.progress,
          targetDate: goal.targetDate,
          resources: goal.resources,
          createdAt: goal.createdAt,
        })),
        exportedAt: new Date().toISOString(),
      };

      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="skillforge-data.json"'
      );
      res.status(200).json(exportData);
    } catch (error) {
      console.error("Export data error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to export data",
      });
    }
  }
);

// Reset user progress
export const resetUserProgress = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!._id;

    try {
      // Delete all skills and goals for the user
      await Skill.deleteMany({ user: userId });
      await LearningGoal.deleteMany({ user: userId });

      res.status(200).json({
        status: "success",
        message: "All progress has been reset successfully",
      });
    } catch (error) {
      console.error("Reset progress error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to reset progress",
      });
    }
  }
);

// Delete user account
export const deleteAccount = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!._id;
    const { password } = req.body;

    try {
      // Get user with password to verify
      const user = await User.findById(userId).select("+password");
      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found",
        });
        return;
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(400).json({
          status: "error",
          message: "Incorrect password",
        });
        return;
      }

      // Delete all user data
      await Skill.deleteMany({ user: userId });
      await LearningGoal.deleteMany({ user: userId });
      await User.findByIdAndDelete(userId);

      res.status(200).json({
        status: "success",
        message: "Account deleted successfully",
      });
    } catch (error) {
      console.error("Delete account error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to delete account",
      });
    }
  }
);
