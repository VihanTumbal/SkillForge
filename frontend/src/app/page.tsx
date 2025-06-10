"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  Brain,
  Zap,
  Star,
  ChevronRight,
  Code,
  Rocket,
  Trophy,
  Users,
  BarChart3,
  BookOpen,
} from "lucide-react";

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const features = [
    {
      icon: Code,
      title: "Smart Skill Tracking",
      description:
        "Track your technical skills with intelligent proficiency levels and personalized insights.",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: Target,
      title: "Goal Management",
      description:
        "Set learning objectives and track your progress with our simplified goal system.",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Get personalized learning paths and skill recommendations powered by advanced AI.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description:
        "Visualize your learning journey with detailed analytics and progress tracking.",
      color: "from-orange-500 to-red-600",
    },
  ];

  const stats = [
    { icon: Users, value: "10K+", label: "Active Users" },
    { icon: BookOpen, value: "500+", label: "Skills Tracked" },
    { icon: Trophy, value: "50K+", label: "Goals Achieved" },
    { icon: Sparkles, value: "99%", label: "User Satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SkillForge
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Link
              href="/login"
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-6 py-20"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-slate-200">
                AI-Powered Developer Growth
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Master Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Developer Journey
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Track skills, set goals, and accelerate your growth with
              AI-powered insights. The ultimate platform for ambitious
              developers.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
          >
            <Link
              href="/register"
              className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Start Your Journey</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="border-2 border-slate-600 hover:border-slate-500 text-slate-200 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/5"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-6 py-20 bg-slate-800/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Developers
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to track, improve, and accelerate your
              development skills
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-6 py-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl border border-white/10 p-12">
            <Rocket className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of developers who are accelerating their careers
              with SkillForge
            </p>
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Start Free Today</span>
              <Star className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="border-t border-slate-800 px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400">
            © 2025 SkillForge. Built for developers, by developers.
          </p>
        </div>
      </div>
    </div>
  );
}
