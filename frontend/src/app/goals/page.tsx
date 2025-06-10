"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSkillStore } from "@/store/skillStore";
import { useAuthStore } from "@/store/authStore";
import {
  LearningGoal,
  CreateGoalRequest,
  UpdateGoalRequest,
} from "@/services/goalService";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  Target,
  Flag,
  BookOpen,
  TrendingUp,
  X,
  Play,
  Pause,
  AlertCircle,
  Filter,
} from "lucide-react";

const priorityColors = {
  low: "from-green-500 to-green-600",
  medium: "from-yellow-500 to-yellow-600",
  high: "from-red-500 to-red-600",
};

const statusColors = {
  "not-started": "from-slate-500 to-slate-600",
  "in-progress": "from-blue-500 to-blue-600",
  completed: "from-green-500 to-green-600",
  paused: "from-orange-500 to-orange-600",
};

const statusIcons = {
  "not-started": Circle,
  "in-progress": Play,
  completed: CheckCircle,
  paused: Pause,
};

export default function GoalsPage() {
  const {
    learningGoals,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    isLoadingGoals,
  } = useSkillStore();
  const { isAuthenticated } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<LearningGoal | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [newGoal, setNewGoal] = useState<CreateGoalRequest>({
    title: "",
    description: "",
    targetSkill: "",
    priority: "medium",
    targetDate: "",
    resources: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchGoals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isAuthenticated]); // Remove fetchGoals dependency to prevent infinite loop

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, mounted]);

  if (!mounted || !isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </DashboardLayout>
    );
  }

  const filteredGoals = (learningGoals || []).filter((goal) => {
    const matchesSearch =
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.targetSkill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || goal.status === filterStatus;
    const matchesPriority = !filterPriority || goal.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const goalStats = {
    total: learningGoals.length,
    completed: learningGoals.filter((g) => g.status === "completed").length,
    inProgress: learningGoals.filter((g) => g.status === "in-progress").length,
    notStarted: learningGoals.filter((g) => g.status === "not-started").length,
  };

  const handleAddGoal = async () => {
    if (newGoal.title && newGoal.targetSkill) {
      try {
        await createGoal(newGoal);
        setNewGoal({
          title: "",
          description: "",
          targetSkill: "",
          priority: "medium",
          targetDate: "",
          resources: [],
        });
        setShowAddForm(false);
      } catch (error) {
        console.error("Failed to create goal:", error);
      }
    }
  };

  const handleUpdateGoal = async () => {
    if (editingGoal) {
      try {
        const updateData: UpdateGoalRequest = {
          title: editingGoal.title,
          description: editingGoal.description,
          targetSkill: editingGoal.targetSkill,
          priority: editingGoal.priority,
          targetDate: editingGoal.targetDate,
          status: editingGoal.status,
          progress: editingGoal.progress,
        };
        await updateGoal(editingGoal._id, updateData);
        setEditingGoal(null);
      } catch (error) {
        console.error("Failed to update goal:", error);
      }
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm("Are you sure you want to delete this learning goal?")) {
      try {
        await deleteGoal(id);
      } catch (error) {
        console.error("Failed to delete goal:", error);
      }
    }
  };

  const toggleGoalCompletion = async (goal: LearningGoal) => {
    const newStatus = goal.status === "completed" ? "in-progress" : "completed";

    try {
      await updateGoal(goal._id, { status: newStatus });
    } catch (error) {
      console.error("Failed to update goal status:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Learning Goals
            </h1>
            <p className="text-slate-600 mt-2">
              Set objectives and track your learning progress
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Goal</span>
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Goals
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {goalStats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-slate-900">
                  {goalStats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  In Progress
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {goalStats.inProgress}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Success Rate
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {goalStats.total > 0
                    ? Math.round((goalStats.completed / goalStats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="">All Status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div className="relative">
              <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="pl-10 pr-8 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Goals Grid */}
        <motion.div variants={itemVariants}>
          {isLoadingGoals ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-lg border animate-pulse"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 bg-slate-200 rounded"></div>
                      <div className="w-6 h-6 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredGoals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredGoals.map((goal, index) => {
                const StatusIcon = statusIcons[goal.status];
                const priorityColor = priorityColors[goal.priority];
                const statusColor = statusColors[goal.status];
                const isOverdue =
                  goal.targetDate &&
                  new Date(goal.targetDate) < new Date() &&
                  goal.status !== "completed";

                return (
                  <motion.div
                    key={goal._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-shadow group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-slate-900 text-lg">
                            {goal.title}
                          </h3>
                          {isOverdue && (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mb-2">
                          {goal.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                          <BookOpen className="w-4 h-4" />
                          <span>{goal.targetSkill}</span>
                        </div>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setEditingGoal(goal)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDeleteGoal(goal._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-900">
                            Progress
                          </span>
                          <span className="text-sm text-slate-600">
                            {goal.progress || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress || 0}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={`bg-gradient-to-r ${statusColor} h-2 rounded-full`}
                          />
                        </div>
                      </div>

                      {/* Status and Priority Tags */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => toggleGoalCompletion(goal)}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${statusColor} text-white`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span className="capitalize">
                              {goal.status.replace("-", " ")}
                            </span>
                          </motion.button>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${priorityColor} text-white`}
                          >
                            {goal.priority.toUpperCase()}
                          </span>
                        </div>
                        {goal.targetDate && (
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Resources */}
                      {goal.resources && goal.resources.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-slate-900 mb-2">
                            Resources:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {goal.resources.slice(0, 3).map((resource, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg"
                              >
                                {resource}
                              </span>
                            ))}
                            {goal.resources.length > 3 && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                                +{goal.resources.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No goals found
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm || filterStatus || filterPriority
                  ? "Try adjusting your search or filter criteria"
                  : "Start setting your learning objectives by creating your first goal"}
              </p>
              {!searchTerm && !filterStatus && !filterPriority && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Goal</span>
                </motion.button>
              )}
            </div>
          )}
        </motion.div>

        {/* Add Goal Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    <Target className="w-6 h-6 text-purple-600 mr-2" />
                    Add New Goal
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowAddForm(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Goal Title
                    </label>{" "}
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                      placeholder="e.g., Master React Hooks"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Description
                    </label>{" "}
                    <textarea
                      value={newGoal.description}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, description: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                      rows={3}
                      placeholder="Describe your learning objective..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Target Skill
                    </label>{" "}
                    <input
                      type="text"
                      value={newGoal.targetSkill}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, targetSkill: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                      placeholder="e.g., React, Python, Machine Learning"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Priority
                    </label>{" "}
                    <select
                      value={newGoal.priority}
                      onChange={(e) =>
                        setNewGoal({
                          ...newGoal,
                          priority: e.target.value as "low" | "medium" | "high",
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Target Date
                    </label>{" "}
                    <input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, targetDate: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-900 rounded-xl font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleAddGoal}
                    disabled={!newGoal.title || !newGoal.targetSkill}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-xl font-medium disabled:opacity-50"
                  >
                    Add Goal
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Goal Modal */}
        <AnimatePresence>
          {editingGoal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setEditingGoal(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    <Edit className="w-6 h-6 text-blue-600 mr-2" />
                    Edit Goal
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setEditingGoal(null)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Goal Title
                    </label>{" "}
                    <input
                      type="text"
                      value={editingGoal.title}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Description
                    </label>{" "}
                    <textarea
                      value={editingGoal.description}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Target Skill
                    </label>{" "}
                    <input
                      type="text"
                      value={editingGoal.targetSkill}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          targetSkill: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Priority
                    </label>{" "}
                    <select
                      value={editingGoal.priority}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          priority: e.target.value as "low" | "medium" | "high",
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Status
                    </label>{" "}
                    <select
                      value={editingGoal.status}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          status: e.target.value as LearningGoal["status"],
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="paused">Paused</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Progress: {editingGoal.progress || 0}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editingGoal.progress || 0}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          progress: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Target Date
                    </label>{" "}
                    <input
                      type="date"
                      value={editingGoal.targetDate}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          targetDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setEditingGoal(null)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-900 rounded-xl font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleUpdateGoal}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-medium"
                  >
                    Update Goal
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}
