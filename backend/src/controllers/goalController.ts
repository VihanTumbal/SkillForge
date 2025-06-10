import { Response } from "express";
import { validationResult } from "express-validator";
import LearningGoal, { ILearningGoal } from "../models/LearningGoal";
import { AuthenticatedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";

// Get all learning goals for authenticated user
export const getGoals = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!._id;

    const {
      status,
      priority,
      search,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    // Build query
    const query: any = { user: userId };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { targetSkill: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sortOrder = order === "desc" ? -1 : 1;
    const sortObj: any = {};
    sortObj[sort as string] = sortOrder;

    const goals = await LearningGoal.find(query).sort(sortObj);

    res.status(200).json({
      status: "success",
      results: goals.length,
      data: {
        goals,
      },
    });
  }
);

// Get single learning goal
export const getGoal = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!._id;

    const goal = await LearningGoal.findOne({ _id: id, user: userId });

    if (!goal) {
      res.status(404).json({
        status: "error",
        message: "Learning goal not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        goal,
      },
    });
  }
);

// Create new learning goal
export const createGoal = asyncHandler(
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
    const {
      title,
      description,
      targetSkill,
      priority,
      status,
      targetDate,
      progress,
      milestones,
      resources,
    } = req.body;

    const goal = await LearningGoal.create({
      title,
      description,
      targetSkill,
      priority: priority || "medium",
      status: status || "not-started",
      targetDate: targetDate ? new Date(targetDate) : undefined,
      progress: progress || 0,
      milestones: milestones || [],
      resources: resources || [],
      user: userId,
    });

    res.status(201).json({
      status: "success",
      message: "Learning goal created successfully",
      data: {
        goal,
      },
    });
  }
);

// Update learning goal
export const updateGoal = asyncHandler(
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
    const {
      title,
      description,
      targetSkill,
      priority,
      status,
      targetDate,
      progress,
      milestones,
      resources,
    } = req.body;

    const updateData: any = {
      title,
      description,
      targetSkill,
      priority,
      status,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      progress,
      milestones: milestones || [],
      resources: resources || [],
    };

    const goal = await LearningGoal.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!goal) {
      res.status(404).json({
        status: "error",
        message: "Learning goal not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Learning goal updated successfully",
      data: {
        goal,
      },
    });
  }
);

// Delete learning goal
export const deleteGoal = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!._id;

    const goal = await LearningGoal.findOneAndDelete({ _id: id, user: userId });

    if (!goal) {
      res.status(404).json({
        status: "error",
        message: "Learning goal not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Learning goal deleted successfully",
    });
  }
);

// Update goal progress
export const updateGoalProgress = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { progress } = req.body;
    const userId = req.user!._id;

    if (progress < 0 || progress > 100) {
      res.status(400).json({
        status: "error",
        message: "Progress must be between 0 and 100",
      });
      return;
    }

    const goal = await LearningGoal.findOne({ _id: id, user: userId });

    if (!goal) {
      res.status(404).json({
        status: "error",
        message: "Learning goal not found",
      });
      return;
    }

    goal.progress = progress;

    // Auto-update status based on progress
    if (progress === 0) {
      goal.status = "not-started";
    } else if (progress === 100) {
      goal.status = "completed";
    } else if (goal.status === "not-started" || goal.status === "completed") {
      goal.status = "in-progress";
    }

    await goal.save();

    res.status(200).json({
      status: "success",
      message: "Goal progress updated successfully",
      data: {
        goal,
      },
    });
  }
);

// Get learning goals statistics
export const getGoalsStats = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!._id;

    const stats = await LearningGoal.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
          notStarted: {
            $sum: { $cond: [{ $eq: ["$status", "not-started"] }, 1, 0] },
          },
          paused: {
            $sum: { $cond: [{ $eq: ["$status", "paused"] }, 1, 0] },
          },
          averageProgress: { $avg: "$progress" },
        },
      },
    ]);

    const priorityStats = await LearningGoal.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$priority",
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
    ]);

    // Goals with approaching deadlines (within 7 days)
    const upcomingDeadlines = await LearningGoal.find({
      user: userId,
      status: { $ne: "completed" },
      targetDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Overdue goals
    const overdueGoals = await LearningGoal.find({
      user: userId,
      status: { $ne: "completed" },
      targetDate: {
        $lt: new Date(),
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        overview: stats[0] || {
          total: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0,
          paused: 0,
          averageProgress: 0,
        },
        byPriority: priorityStats.reduce((acc: any, item: any) => {
          acc[item._id] = item.total;
          return acc;
        }, {}),
        upcomingDeadlines: upcomingDeadlines.length,
        overdue: overdueGoals.length,
      },
    });
  }
);
