"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSkillStore } from "@/store/skillStore";
import { useAuthStore } from "@/store/authStore";
import {
  Skill,
  CreateSkillRequest,
  UpdateSkillRequest,
} from "@/services/skillService";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Clock,
  BookOpen,
  Code,
  Zap,
  Star,
  TrendingUp,
  X,
  Calendar,
  User,
  Award,
  Sparkles,
} from "lucide-react";

const categoryIcons = {
  frontend: Code,
  backend: Zap,
  database: BookOpen,
  devops: Star,
  mobile: TrendingUp,
  design: Award,
  other: User,
};

const categoryColors = {
  frontend: "from-blue-500 to-blue-600",
  backend: "from-green-500 to-green-600",
  database: "from-purple-500 to-purple-600",
  devops: "from-orange-500 to-orange-600",
  mobile: "from-pink-500 to-pink-600",
  design: "from-indigo-500 to-indigo-600",
  other: "from-slate-500 to-slate-600",
};

export default function SkillsPage() {
  const {
    skills,
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    isLoadingSkills,
  } = useSkillStore();
  const { isAuthenticated } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  const [newSkill, setNewSkill] = useState<CreateSkillRequest>({
    name: "",
    category: "frontend",
    proficiency: 1,
    experience: 0,
    lastUsed: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchSkills();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isAuthenticated]); // Remove fetchSkills dependency to prevent infinite loop

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
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </DashboardLayout>
    );
  }

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || skill.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const skillsByCategory = skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleAddSkill = async () => {
    if (newSkill.name && newSkill.category) {
      try {
        await createSkill(newSkill);
        setNewSkill({
          name: "",
          category: "frontend",
          proficiency: 1,
          experience: 0,
          lastUsed: new Date().toISOString().split("T")[0],
          notes: "",
        });
        setShowAddForm(false);
      } catch (error) {
        console.error("Failed to create skill:", error);
      }
    }
  };

  const handleUpdateSkill = async () => {
    if (editingSkill) {
      try {
        const updateData: UpdateSkillRequest = {
          name: editingSkill.name,
          category: editingSkill.category,
          proficiency: editingSkill.proficiency,
          experience: editingSkill.experience,
          lastUsed: editingSkill.lastUsed,
          notes: editingSkill.notes,
        };
        await updateSkill(editingSkill._id, updateData);
        setEditingSkill(null);
      } catch (error) {
        console.error("Failed to update skill:", error);
      }
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteSkill(id);
      } catch (error) {
        console.error("Failed to delete skill:", error);
      }
    }
  };
  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 5) return "from-green-500 to-green-600";
    if (proficiency >= 4) return "from-yellow-500 to-yellow-600";
    if (proficiency >= 3) return "from-orange-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  const getProficiencyLabel = (proficiency: number) => {
    if (proficiency >= 5) return "Expert";
    if (proficiency >= 4) return "Advanced";
    if (proficiency >= 3) return "Intermediate";
    if (proficiency >= 2) return "Beginner";
    return "Novice";
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Skills Portfolio
            </h1>
            <p className="text-slate-600 mt-2">
              Track and manage your technical skills
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Skill</span>
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
                  Total Skills
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {skills.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Expert Level
                </p>{" "}
                <p className="text-3xl font-bold text-slate-900">
                  {skills.filter((s) => s.proficiency >= 5).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Categories</p>
                <p className="text-3xl font-bold text-slate-900">
                  {Object.keys(skillsByCategory).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Avg Proficiency
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {skills.length > 0
                    ? (
                        skills.reduce(
                          (sum, skill) => sum + skill.proficiency,
                          0
                        ) / skills.length
                      ).toFixed(1)
                    : "0"}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">All Categories</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
              <option value="devops">DevOps</option>
              <option value="mobile">Mobile</option>
              <option value="design">Design</option>
              <option value="other">Other</option>
            </select>
          </div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div variants={itemVariants}>
          {isLoadingSkills ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-lg border animate-pulse"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill, index) => {
                const CategoryIcon =
                  categoryIcons[skill.category as keyof typeof categoryIcons] ||
                  User;
                const categoryColor =
                  categoryColors[
                    skill.category as keyof typeof categoryColors
                  ] || "from-slate-500 to-slate-600";

                return (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-shadow group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${categoryColor} rounded-xl flex items-center justify-center`}
                        >
                          <CategoryIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {skill.name}
                          </h3>
                          <p className="text-sm text-slate-600 capitalize">
                            {skill.category}
                          </p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setEditingSkill(skill)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDeleteSkill(skill._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-900">
                            Proficiency
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getProficiencyColor(
                              skill.proficiency
                            )} text-white`}
                          >
                            {getProficiencyLabel(skill.proficiency)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(skill.proficiency / 5) * 100}%`,
                            }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={`bg-gradient-to-r ${getProficiencyColor(
                              skill.proficiency
                            )} h-2 rounded-full`}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-slate-500">1</span>
                          <span className="text-xs font-medium text-slate-900">
                            {skill.proficiency}/5
                          </span>
                          <span className="text-xs text-slate-500">5</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span>{skill.experience}+ years</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(skill.lastUsed).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {skill.notes && (
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-sm text-slate-600">
                            {skill.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Code className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No skills found
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm || filterCategory
                  ? "Try adjusting your search or filter criteria"
                  : "Start building your skills portfolio by adding your first skill"}
              </p>
              {!searchTerm && !filterCategory && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Your First Skill</span>
                </motion.button>
              )}
            </div>
          )}
        </motion.div>

        {/* Add Skill Modal */}
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
                    <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                    Add New Skill
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
                  {" "}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={newSkill.name}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                      placeholder="e.g., React, Python, PostgreSQL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Category
                    </label>{" "}
                    <select
                      value={newSkill.category}
                      onChange={(e) =>
                        setNewSkill({
                          ...newSkill,
                          category: e.target.value as
                            | "mobile"
                            | "frontend"
                            | "backend"
                            | "database"
                            | "devops"
                            | "other",
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                      <option value="devops">DevOps</option>
                      <option value="mobile">Mobile</option>
                      <option value="design">Design</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Proficiency Level: {newSkill.proficiency}/5
                    </label>{" "}
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={newSkill.proficiency}
                      onChange={(e) =>
                        setNewSkill({
                          ...newSkill,
                          proficiency: parseInt(e.target.value) as
                            | 1
                            | 2
                            | 3
                            | 4
                            | 5,
                        })
                      }
                      className="w-full"
                    />{" "}
                    <div className="flex justify-between text-xs text-slate-600 mt-1">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={newSkill.experience}
                      onChange={(e) =>
                        setNewSkill({
                          ...newSkill,
                          experience: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Last Used
                    </label>
                    <input
                      type="date"
                      value={newSkill.lastUsed}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, lastUsed: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={newSkill.notes}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, notes: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                      rows={3}
                      placeholder="Add any additional notes about this skill..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  {" "}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-900 rounded-xl font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleAddSkill}
                    disabled={!newSkill.name}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-xl font-medium disabled:opacity-50"
                  >
                    Add Skill
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Skill Modal */}
        <AnimatePresence>
          {editingSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setEditingSkill(null)}
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
                    Edit Skill
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setEditingSkill(null)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>{" "}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={editingSkill.name}
                      onChange={(e) =>
                        setEditingSkill({
                          ...editingSkill,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Category
                    </label>
                    <select
                      value={editingSkill.category}
                      onChange={(e) =>
                        setEditingSkill({
                          ...editingSkill,
                          category: e.target.value as
                            | "frontend"
                            | "backend"
                            | "database"
                            | "devops"
                            | "mobile"
                            | "other",
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                      <option value="devops">DevOps</option>
                      <option value="mobile">Mobile</option>
                      <option value="design">Design</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    {" "}
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Proficiency Level: {editingSkill.proficiency}/5
                    </label>{" "}
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={editingSkill.proficiency}
                      onChange={(e) =>
                        setEditingSkill({
                          ...editingSkill,
                          proficiency: parseInt(e.target.value) as
                            | 1
                            | 2
                            | 3
                            | 4
                            | 5,
                        })
                      }
                      className="w-full"
                    />{" "}
                    <div className="flex justify-between text-xs text-slate-600 mt-1">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={editingSkill.experience}
                      onChange={(e) =>
                        setEditingSkill({
                          ...editingSkill,
                          experience: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Last Used
                    </label>
                    <input
                      type="date"
                      value={editingSkill.lastUsed}
                      onChange={(e) =>
                        setEditingSkill({
                          ...editingSkill,
                          lastUsed: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={editingSkill.notes || ""}
                      onChange={(e) =>
                        setEditingSkill({
                          ...editingSkill,
                          notes: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                      rows={3}
                      placeholder="Add any additional notes about this skill..."
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setEditingSkill(null)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-900 rounded-xl font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleUpdateSkill}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-medium"
                  >
                    Update Skill
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
