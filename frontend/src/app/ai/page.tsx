"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { aiService, AIInsights } from "@/services/aiService";
import FormattedAIResponse from "@/components/ai/FormattedAIResponse";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  Lightbulb,
  Zap,
  ArrowRight,
  RefreshCw,
  BookOpen,
  Trophy,
  Clock,
  AlertCircle,
  Loader,
} from "lucide-react";

export default function AIPage() {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [learningPath, setLearningPath] = useState<string>("");
  const [skillSuggestions, setSkillSuggestions] = useState<string>("");
  const [skillGapAnalysis, setSkillGapAnalysis] = useState<string>("");
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("insights");
  const { isAuthenticated } = useAuthStore();

  const setLoadingState = (key: string, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const loadAIInsights = useCallback(async () => {
    setLoadingState("insights", true);
    try {
      const response = await aiService.getAIInsights();
      setInsights(response.insights);
    } catch (error) {
      console.error("Failed to load AI insights:", error);
    } finally {
      setLoadingState("insights", false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAIInsights();
    }
  }, [isAuthenticated, loadAIInsights]);

  const generateLearningPath = async () => {
    setLoadingState("learningPath", true);
    try {
      const response = await aiService.generateLearningPath();
      setLearningPath(response.recommendations);
    } catch (error) {
      console.error("Failed to generate learning path:", error);
    } finally {
      setLoadingState("learningPath", false);
    }
  };

  const generateSkillSuggestions = async () => {
    setLoadingState("skillSuggestions", true);
    try {
      const response = await aiService.getSkillSuggestions();
      setSkillSuggestions(response.suggestions);
    } catch (error) {
      console.error("Failed to generate skill suggestions:", error);
    } finally {
      setLoadingState("skillSuggestions", false);
    }
  };

  const analyzeSkillGaps = async () => {
    setLoadingState("skillGapAnalysis", true);
    try {
      const response = await aiService.analyzeSkillGaps(targetRole);
      setSkillGapAnalysis(response.analysis);
    } catch (error) {
      console.error("Failed to analyze skill gaps:", error);
    } finally {
      setLoadingState("skillGapAnalysis", false);
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

  const tabs = [
    {
      id: "insights",
      name: "AI Insights",
      icon: Brain,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "learning",
      name: "Learning Path",
      icon: Target,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "suggestions",
      name: "Skill Suggestions",
      icon: Lightbulb,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: "gaps",
      name: "Skill Gap Analysis",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Assistant
              </h1>
              <p className="text-slate-600 mt-2">
                Get personalized insights and recommendations for your learning
                journey
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                  : "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* AI Insights Tab */}
          {activeTab === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                  <Brain className="w-6 h-6 text-purple-600 mr-2" />
                  Your Learning Insights
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={loadAIInsights}
                  disabled={loading.insights}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {loading.insights ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Refresh</span>
                </motion.button>
              </div>

              {loading.insights ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-6 shadow-lg border animate-pulse"
                    >
                      <div className="w-12 h-12 bg-slate-200 rounded-xl mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-8 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : insights ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Total Skills
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {insights.totalSkills}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>{" "}
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Avg Proficiency
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      {insights.averageProficiency}/5
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Goals Completed
                    </h3>
                    <p className="text-3xl font-bold text-purple-600">
                      {insights.goalsCompleted}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50"
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      In Progress
                    </h3>
                    <p className="text-3xl font-bold text-orange-600">
                      {insights.goalsInProgress}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50"
                  >
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Need Improvement
                    </h3>
                    <p className="text-3xl font-bold text-yellow-600">
                      {insights.skillsNeedingImprovement}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50"
                  >
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                      <Trophy className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Expert Skills
                    </h3>
                    <p className="text-3xl font-bold text-pink-600">
                      {insights.expertSkills}
                    </p>
                  </motion.div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">
                    No insights available yet
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={loadAIInsights}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium"
                  >
                    Generate Insights
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {/* Learning Path Tab */}
          {activeTab === "learning" && (
            <motion.div
              key="learning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                  <Target className="w-6 h-6 text-blue-600 mr-2" />
                  Personalized Learning Path
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={generateLearningPath}
                  disabled={loading.learningPath}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {loading.learningPath ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Generate Path</span>
                </motion.button>
              </div>

              {loading.learningPath ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : learningPath ? (
                <FormattedAIResponse
                  content={learningPath}
                  type="learning-path"
                />
              ) : (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">
                    Generate your personalized learning path
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={generateLearningPath}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Get Started</span>
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {/* Skill Suggestions Tab */}
          {activeTab === "suggestions" && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                  <Lightbulb className="w-6 h-6 text-yellow-600 mr-2" />
                  Smart Skill Suggestions
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={generateSkillSuggestions}
                  disabled={loading.skillSuggestions}
                  className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {loading.skillSuggestions ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  <span>Get Suggestions</span>
                </motion.button>
              </div>

              {loading.skillSuggestions ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : skillSuggestions ? (
                <FormattedAIResponse
                  content={skillSuggestions}
                  type="skill-suggestions"
                />
              ) : (
                <div className="text-center py-12">
                  <Lightbulb className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">
                    Discover new skills to learn based on your current expertise
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={generateSkillSuggestions}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center space-x-2"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Get Suggestions</span>
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {/* Skill Gap Analysis Tab */}
          {activeTab === "gaps" && (
            <motion.div
              key="gaps"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                  <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                  Skill Gap Analysis
                </h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Target Role
                </label>
                <div className="flex space-x-3">
                  {" "}
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-slate-900"
                    placeholder="e.g., Senior Frontend Developer"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={analyzeSkillGaps}
                    disabled={loading.skillGapAnalysis}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50"
                  >
                    {loading.skillGapAnalysis ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                    <span>Analyze</span>
                  </motion.button>
                </div>
              </div>

              {loading.skillGapAnalysis ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                    </div>
                  ))}
                </div>
              ) : skillGapAnalysis ? (
                <FormattedAIResponse
                  content={skillGapAnalysis}
                  type="skill-gap-analysis"
                />
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">
                    Analyze the skill gaps for your target role
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={analyzeSkillGaps}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center space-x-2"
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Start Analysis</span>
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
