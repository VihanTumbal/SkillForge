import { Response } from "express";
import { validationResult } from "express-validator";
import Skill, { ISkill } from "../models/Skill";
import { AuthenticatedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";

// Get all skills for authenticated user
export const getSkills = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!._id;

    const { category, search, sort = "name", order = "asc" } = req.query;

    // Build query
    const query: any = { user: userId };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sortOrder = order === "desc" ? -1 : 1;
    const sortObj: any = {};
    sortObj[sort as string] = sortOrder;

    const skills = await Skill.find(query).sort(sortObj);

    res.status(200).json({
      status: "success",
      results: skills.length,
      data: {
        skills,
      },
    });
  }
);

// Get single skill
export const getSkill = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!._id;

    const skill = await Skill.findOne({ _id: id, user: userId });

    if (!skill) {
      res.status(404).json({
        status: "error",
        message: "Skill not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        skill,
      },
    });
  }
);

// Create new skill
export const createSkill = asyncHandler(
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
    const { name, category, proficiency, experience, lastUsed, notes } =
      req.body;

    // Check if skill already exists for this user
    const existingSkill = await Skill.findOne({ name, user: userId });
    if (existingSkill) {
      res.status(400).json({
        status: "error",
        message: "Skill already exists",
      });
      return;
    }
    const skill = await Skill.create({
      name,
      category,
      proficiency,
      experience,
      lastUsed,
      notes,
      user: userId,
    });

    res.status(201).json({
      status: "success",
      message: "Skill created successfully",
      data: {
        skill,
      },
    });
  }
);

// Update skill
export const updateSkill = asyncHandler(
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
    const { id } = req.params;
    const userId = req.user!._id;
    const { name, category, proficiency, experience, lastUsed, notes } =
      req.body;

    const skill = await Skill.findOneAndUpdate(
      { _id: id, user: userId },
      { name, category, proficiency, experience, lastUsed, notes },
      { new: true, runValidators: true }
    );

    if (!skill) {
      res.status(404).json({
        status: "error",
        message: "Skill not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Skill updated successfully",
      data: {
        skill,
      },
    });
  }
);

// Delete skill
export const deleteSkill = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!._id;

    const skill = await Skill.findOneAndDelete({ _id: id, user: userId });

    if (!skill) {
      res.status(404).json({
        status: "error",
        message: "Skill not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Skill deleted successfully",
    });
  }
);

// Get skills statistics
export const getSkillsStats = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!._id;
    const stats = await Skill.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalSkills: { $sum: 1 },
          averageProficiency: { $avg: "$proficiency" },
          skillsByCategory: {
            $push: {
              category: "$category",
              proficiency: "$proficiency",
            },
          },
        },
      },
    ]);
    const categoryStats = await Skill.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgProficiency: { $avg: "$proficiency" },
          maxProficiency: { $max: "$proficiency" },
          minProficiency: { $min: "$proficiency" },
        },
      },
      { $sort: { count: -1 } },
    ]);
    const proficiencyDistribution = await Skill.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ["$proficiency", 3] }, then: "Beginner" },
                { case: { $lte: ["$proficiency", 6] }, then: "Intermediate" },
                { case: { $lte: ["$proficiency", 8] }, then: "Advanced" },
              ],
              default: "Expert",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        overview: stats[0] || { totalSkills: 0, averageProficiency: 0 },
        categoryStats,
        proficiencyDistribution,
      },
    });
  }
);
