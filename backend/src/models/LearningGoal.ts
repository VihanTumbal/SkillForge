import mongoose, { Document, Schema } from "mongoose";

export interface ILearningGoal extends Document {
  title: string;
  description: string;
  targetSkill: string;
  priority: "low" | "medium" | "high";
  status: "not-started" | "in-progress" | "completed" | "paused";
  targetDate?: Date;
  progress: number;
  resources: string[];
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const learningGoalSchema = new Schema<ILearningGoal>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    targetSkill: {
      type: String,
      required: [true, "Target skill is required"],
      trim: true,
    },
    priority: {
      type: String,
      required: [true, "Priority is required"],
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["not-started", "in-progress", "completed", "paused"],
      default: "not-started",
    },
    targetDate: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          return !value || value > new Date();
        },
        message: "Target date must be in the future",
      },
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be negative"],
      max: [100, "Progress cannot exceed 100"],
    },
    resources: [
      {
        type: String,
        trim: true,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Set progress to 100 when goal is completed
learningGoalSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "completed" &&
    this.progress < 100
  ) {
    this.progress = 100;
  }
  next();
});

// Indexes for efficient queries
learningGoalSchema.index({ user: 1 });
learningGoalSchema.index({ status: 1 });
learningGoalSchema.index({ priority: 1 });
learningGoalSchema.index({ targetDate: 1 });

export default mongoose.model<ILearningGoal>(
  "LearningGoal",
  learningGoalSchema
);
