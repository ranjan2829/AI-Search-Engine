"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AIFlowBackground from "../SearchEngine/AIBackground";
import {
  FiMoon,
  FiSun,
  FiGithub,
  FiInfo,
  FiBook,
  FiCpu,
  FiDatabase,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

import { motion } from "framer-motion";

// Type definition
type FeatureItem = {
  icon: React.ElementType;
  text: string;
  color: string;
};

// Enhanced features with modern AI capabilities
const features: FeatureItem[] = [
  { icon: FiCpu, text: "Neural Processing", color: "text-blue-500" },
  { icon: FiZap, text: "Real-Time Ranking", color: "text-purple-500" },
  { icon: FiDatabase, text: "Deep Learning", color: "text-pink-500" },
  { icon: FiTrendingUp, text: "Trend Analysis", color: "text-green-500" },
];



export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [animatedText, setAnimatedText] = useState("");
  const fullText = "Next-Gen AI Search Engine";

  // Memoized animation function
  const animateText = useCallback(async () => {
    while (true) {
      for (let i = 0; i <= fullText.length; i++) {
        setAnimatedText(fullText.substring(0, i));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      for (let i = fullText.length; i >= 0; i--) {
        setAnimatedText(fullText.substring(0, i));
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }, []);

  // Optimized useEffect with system dark mode detection
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
    animateText();
  }, [animateText]);

  // Memoized dark mode toggle
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-blue-900/20 text-white overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed w-full top-0 z-20 bg-black/40 backdrop-blur-lg border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <FiCpu className="w-8 h-8 text-blue-500 animate-pulse" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                AI Search
              </h2>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="https://github.com/yourusername/your-repo" target="_blank">
                <button className="nav-button group">
                  <FiGithub className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                </button>
              </Link>
              <Link href="/docs">
                <button className="nav-button group">
                  <FiBook className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                </button>
              </Link>
              <Link href="/trending">
                <button className="nav-button group">
                  <FiTrendingUp className="w-5 h-5 group-hover:text-green-400 transition-colors" />
                </button>
              </Link>
              <Link href="/about">
                <button className="nav-button group">
                  <FiInfo className="w-5 h-5 group-hover:text-pink-400 transition-colors" />
                </button>
              </Link>
              <button onClick={toggleDarkMode} className="nav-button group">
                {darkMode ? (
                  <FiSun className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
                ) : (
                  <FiMoon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 relative mt-16">
        <div className="absolute inset-0 opacity-70 pointer-events-none">
          <AIFlowBackground />
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-sm bg-black/30 p-8 rounded-3xl border border-white/10 shadow-2xl"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              {animatedText}
              <span className="animate-blink">|</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Powered by advanced AI to deliver intelligent, context-aware search results
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/search">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="primary-button inline-flex items-center"
                >
                  <FiCpu className="w-5 h-5 mr-2" />
                  Try AI Search Engine
                </motion.button>
              </Link>
              <Link href="/docs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="secondary-button inline-flex items-center"
                >
                  <FiBook className="w-5 h-5 mr-2" />
                  View Documentation
                </motion.button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex gap-4 justify-center flex-wrap"
            >
              {features.map(({ icon: Icon, text, color }, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="feature-pill flex items-center space-x-2"
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span>{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 bg-black/30 backdrop-blur-lg border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400">
              Copyright © {new Date().getFullYear()} AI Search Engine • All rights reserved
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <FiZap className="w-5 h-5 text-blue-500 animate-pulse" />
              <span className="text-sm text-gray-400">Powered by Advanced AI</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}