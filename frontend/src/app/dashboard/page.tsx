"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSkillStore } from "@/store/skillStore";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import {
  Target,
  TrendingUp,
  Sparkles,
  Code,
  Trophy,
  CheckCircle,
  Clock,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { skills, learningGoals, fetchSkills, fetchGoals } = useSkillStore();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchSkills();
      fetchGoals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isAuthenticated]); // Remove function dependencies to prevent infinite loop

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
  const completedGoals = learningGoals.filter(
    (goal) => goal.status === "completed"
  ).length;
  const averageProficiency =
    skills.length > 0
      ? skills.reduce((sum, skill) => sum + skill.proficiency, 0) /
        skills.length
      : 0;

  const stats = [
    {
      title: "Total Skills",
      value: skills.length,
      icon: Code,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      change: "+12%",
    },
    {
      title: "Learning Goals",
      value: learningGoals.length,
      icon: Target,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      change: "+8%",
    },
    {
      title: "Completed Goals",
      value: completedGoals,
      icon: Trophy,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      change: "+25%",
    },
    {
      title: "Avg Proficiency",
      value: `${averageProficiency.toFixed(1)}/5`,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      change: "+15%",
    },
  ];

  const recentSkills = skills.slice(-3);
  const recentGoals = learningGoals.slice(-3);

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
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              {" "}
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Welcome back, {user?.name?.split(" ")[0] || "Developer"}! 👋
              </h1>
              <p className="text-slate-600 mt-2">
                Here&apos;s your learning progress overview
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium"
            >
              <Sparkles className="w-5 h-5" />
              <span>Keep it up!</span>
            </motion.div>
          </div>
        </motion.div>{" "}
        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="relative bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50 overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-6 -translate-y-6">
                <div
                  className={`w-full h-full bg-gradient-to-r ${stat.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}
                />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>{" "}
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Skills */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 order-2 lg:order-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Recent Skills
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Your latest skill additions
                    </p>
                  </div>
                </div>
                <Link href="/skills">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    <span>View All</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentSkills.length > 0 ? (
                  recentSkills.map((skill, index) => (
                    <motion.div
                      key={skill._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Code className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {skill.name}
                          </p>
                          <p className="text-sm text-slate-600 capitalize">
                            {skill.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${(skill.proficiency / 5) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {skill.proficiency}/5
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Code className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">No skills tracked yet</p>
                    <Link href="/skills">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Your First Skill</span>
                      </motion.button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>{" "}
          {/* Recent Goals */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 order-1 lg:order-2"
          >
            {/* Recent Goals */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Target className="w-5 h-5 text-purple-600 mr-2" />
                  Recent Goals
                </h3>
                <Link href="/goals">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    View All
                  </motion.button>
                </Link>
              </div>

              <div className="space-y-3">
                {recentGoals.length > 0 ? (
                  recentGoals.map((goal, index) => (
                    <motion.div
                      key={goal._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl"
                    >
                      {goal.status === "completed" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 text-sm">
                          {goal.title}
                        </p>
                        <p className="text-xs text-slate-600 capitalize">
                          {goal.status}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Target className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 text-sm">No goals yet</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
