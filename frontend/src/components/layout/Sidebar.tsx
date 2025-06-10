"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  BarChart3,
  Target,
  Brain,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Code,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Skills",
    href: "/skills",
    icon: Code,
    color: "from-green-500 to-green-600",
  },
  {
    name: "Learning Goals",
    href: "/goals",
    icon: Target,
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "AI Assistant",
    href: "/ai",
    icon: Brain,
    color: "from-pink-500 to-pink-600",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    color: "from-indigo-500 to-indigo-600",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} className="text-slate-700" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} className="text-slate-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 bg-slate-800/50 border-b border-slate-700/50">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  SkillForge
                </h1>
                <p className="text-xs text-slate-400">Learn. Track. Grow.</p>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link href={item.href}>
                    <div
                      className={`
                        group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                        ${
                          isActive
                            ? `bg-gradient-to-r ${
                                item.color
                              } text-white shadow-lg shadow-${
                                item.color.split("-")[1]
                              }-500/25`
                            : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                        }
                      `}
                    >
                      <div
                        className={`
                        w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200
                        ${
                          isActive
                            ? "bg-white/20"
                            : "bg-slate-700/50 group-hover:bg-slate-600/50"
                        }
                      `}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="truncate">{item.name}</span>

                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-800/50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "Developer"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email || "developer@skillforge.com"}
                </p>
              </div>
            </div>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-red-600/20 border border-slate-700/50 hover:border-red-500/50 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="lg:hidden fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white"
      >
        <div className="flex flex-col h-full backdrop-blur-sm">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 bg-slate-800/50 border-b border-slate-700/50">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  SkillForge
                </h1>
                <p className="text-xs text-slate-400">Learn. Track. Grow.</p>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link href={item.href} onClick={() => setIsOpen(false)}>
                    <div
                      className={`
                        group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                        ${
                          isActive
                            ? `bg-gradient-to-r ${
                                item.color
                              } text-white shadow-lg shadow-${
                                item.color.split("-")[1]
                              }-500/25`
                            : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                        }
                      `}
                    >
                      <div
                        className={`
                        w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200
                        ${
                          isActive
                            ? "bg-white/20"
                            : "bg-slate-700/50 group-hover:bg-slate-600/50"
                        }
                      `}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="truncate">{item.name}</span>

                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-800/50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "Developer"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email || "developer@skillforge.com"}
                </p>
              </div>
            </div>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-red-600/20 border border-slate-700/50 hover:border-red-500/50 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
