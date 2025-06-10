import mongoose, { Document, Schema } from "mongoose";

export interface ISkill extends Document {
  name: string;
  category: string;
  proficiency: number; // 1-5 scale
  experience: number; // years of experience
  lastUsed: string; // date string
  notes?: string;
  user: mongoose.Types.ObjectId; // changed from userId to user
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      maxlength: [100, "Skill name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: ["frontend", "backend", "database", "devops", "mobile", "other"],
    },
    proficiency: {
      type: Number,
      required: [true, "Proficiency level is required"],
      min: [1, "Proficiency must be at least 1"],
      max: [5, "Proficiency cannot exceed 5"],
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
    },
    lastUsed: {
      type: String,
      required: [true, "Last used date is required"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
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

// Pre-save hook for additional validation if needed
skillSchema.pre("save", function (next) {
  next();
});

// Index for efficient queries
skillSchema.index({ userId: 1, name: 1 }, { unique: true });
skillSchema.index({ category: 1 });
skillSchema.index({ proficiency: 1 });

export default mongoose.model<ISkill>("Skill", skillSchema);
