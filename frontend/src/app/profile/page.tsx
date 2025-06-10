"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSkillStore } from "@/store/skillStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Edit,
  Save,
  X,
  Shield,
  Download,
  RotateCcw,
  Trash2,
  Calendar,
  Trophy,
  Target,
  TrendingUp,
  BookOpen,
  Sparkles,
  AlertTriangle,
  Check,
  Mail,
  Clock,
} from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { skills, learningGoals } = useSkillStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, mounted]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  if (!mounted || !isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"
          />
        </div>
      </DashboardLayout>
    );
  }

  const stats = {
    totalSkills: skills.length,
    totalGoals: learningGoals.length,
    completedGoals: learningGoals.filter((g) => g.status === "completed")
      .length,
    averageProficiency:
      skills.length > 0
        ? (
            skills.reduce((sum, skill) => sum + skill.proficiency, 0) /
            skills.length
          ).toFixed(1)
        : "0",
    joinedDaysAgo: user?.createdAt
      ? Math.floor(
          (Date.now() - new Date(user.createdAt).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0,
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage({ type: "error", text: "Name and email are required" });
      return;
    }

    if (showPasswordSection) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: "error", text: "New passwords do not match" });
        return;
      }
      if (formData.newPassword && formData.newPassword.length < 6) {
        setMessage({
          type: "error",
          text: "New password must be at least 6 characters",
        });
        return;
      }
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
      setShowPasswordSection(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowPasswordSection(false);
    setMessage(null);
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleExportData = async () => {
    try {
      const data = {
        profile: user,
        skills: skills,
        goals: learningGoals,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `skillforge-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: "success", text: "Data exported successfully!" });
    } catch {
      setMessage({ type: "error", text: "Failed to export data" });
    }
  };

  const handleResetProgress = () => {
    if (
      confirm(
        "Are you sure you want to reset all your progress? This cannot be undone."
      )
    ) {
      setMessage({ type: "success", text: "Progress reset successfully!" });
    }
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      setMessage({
        type: "error",
        text: "Password is required to delete account",
      });
      return;
    }

    if (
      confirm(
        "This will permanently delete your account and all data. Are you absolutely sure?"
      )
    ) {
      logout();
      window.location.href = "/login";
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-slate-600 mt-2">
              Manage your account and preferences
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-xl flex items-center space-x-2 ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
              <button
                onClick={() => setMessage(null)}
                className="ml-auto p-1 hover:bg-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Overview */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-5 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Skills Tracked
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.totalSkills}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Learning Goals
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.totalGoals}
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
                  {stats.completedGoals}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
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
                  {stats.averageProficiency}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Days Active
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.joinedDaysAgo}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <User className="w-6 h-6 text-indigo-600 mr-2" />
              Account Information
            </h2>
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </motion.button>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl">
                    <User className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-900">{user?.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-900">{user?.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Member Since
              </label>
              <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl">
                <Clock className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Password Section */}
            {isEditing && (
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-900 flex items-center">
                    <Shield className="w-5 h-5 text-purple-600 mr-2" />
                    Change Password
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {showPasswordSection ? "Cancel" : "Change Password"}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showPasswordSection && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">
                          Current Password
                        </label>{" "}
                        <input
                          type="password"
                          value={formData.currentPassword}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            New Password
                          </label>{" "}
                          <input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            Confirm New Password
                          </label>{" "}
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleCancel}
                  className="px-6 py-3 border border-slate-300 text-slate-900 rounded-xl font-medium hover:bg-slate-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{loading ? "Saving..." : "Save Changes"}</span>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <Sparkles className="w-6 h-6 text-yellow-600 mr-2" />
            Account Actions
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div>
                <h3 className="font-medium text-blue-900">Export Data</h3>
                <p className="text-sm text-blue-700">
                  Download all your skills and goals data as JSON
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleExportData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div>
                <h3 className="font-medium text-orange-900">Reset Progress</h3>
                <p className="text-sm text-orange-700">
                  Clear all skills and goals (cannot be undone)
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleResetProgress}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-orange-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </motion.button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
              <div>
                <h3 className="font-medium text-red-900">Delete Account</h3>
                <p className="text-sm text-red-700">
                  Permanently delete your account and all data
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Delete Account Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-red-900 flex items-center">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                    Delete Account
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-600">
                    This action cannot be undone. All your data will be
                    permanently deleted.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Enter your password to confirm
                    </label>{" "}
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeletePassword("");
                    }}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-900 rounded-xl font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-700"
                  >
                    Delete Account
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
