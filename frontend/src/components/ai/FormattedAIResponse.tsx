import React from "react";
import { motion } from "framer-motion";
import { Target, Lightbulb, TrendingUp } from "lucide-react";

interface FormattedAIResponseProps {
  content: string;
  type: "learning-path" | "skill-suggestions" | "skill-gap-analysis";
}

export default function FormattedAIResponse({
  content,
  type,
}: FormattedAIResponseProps) {
  // Clean and simple content formatting
  const formatContent = () => {
    if (!content || content.trim().length === 0) {
      return "No content available";
    }
    return content.trim();
  };

  const formattedContent = formatContent();

  const getTypeConfig = () => {
    switch (type) {
      case "learning-path":
        return {
          primaryColor: "blue",
          icon: Target,
          title: "📚 Your Learning Path",
          bgGradient: "bg-gradient-to-br from-blue-50 to-indigo-100",
          borderColor: "border-blue-200",
          textAccent: "text-blue-700",
        };
      case "skill-suggestions":
        return {
          primaryColor: "yellow",
          icon: Lightbulb,
          title: "💡 Skill Suggestions",
          bgGradient: "bg-gradient-to-br from-yellow-50 to-amber-100",
          borderColor: "border-yellow-200",
          textAccent: "text-yellow-700",
        };
      case "skill-gap-analysis":
        return {
          primaryColor: "green",
          icon: TrendingUp,
          title: "📊 Gap Analysis",
          bgGradient: "bg-gradient-to-br from-green-50 to-emerald-100",
          borderColor: "border-green-200",
          textAccent: "text-green-700",
        };
    }
  };

  const config = getTypeConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${config.bgGradient} ${config.borderColor} border-2 rounded-2xl p-8 shadow-sm`}
    >
      {/* Simple Header */}
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${config.textAccent} mb-2`}>
          {config.title}
        </h3>
        <div className="h-1 w-20 bg-gradient-to-r from-current to-transparent opacity-50 rounded-full"></div>
      </div>

      {/* Clean Content Display */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
        <div className="prose prose-slate max-w-none">
          <div
            className="text-slate-800 leading-relaxed whitespace-pre-wrap text-base"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            {formattedContent}
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="mt-6 text-center">
        <div
          className={`inline-flex items-center px-4 py-2 ${config.textAccent} bg-white/50 rounded-full text-sm font-medium`}
        >
          ✨ AI-Generated Recommendations
        </div>
      </div>
    </motion.div>
  );
}
