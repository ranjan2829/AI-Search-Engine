"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiSearch, FiCpu, FiArrowLeft, FiGithub, FiInfo, FiBook, 
  FiCommand, FiZap, FiBrain, FiDatabase, FiTrendingUp 
} from 'react-icons/fi';
import AIBackground from './AIBackground';

export default function SearchEngine() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);

  // Simulated AI processing steps
  const simulateAIProcessing = async () => {
    const steps = [
      "Initializing neural networks...",
      "Processing natural language...",
      "Analyzing context and semantics...",
      "Accessing knowledge base...",
      "Generating intelligent results...",
    ];

    setAiThinking(true);
    for (const step of steps) {
      setProcessingSteps(prev => [...prev, step]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    setAiThinking(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setProcessingSteps([]);
    await simulateAIProcessing();
    setIsSearching(false);
  };

  // AI-powered search suggestions
  useEffect(() => {
    const suggestions = [
      "Latest AI developments",
      "Machine learning algorithms",
      "Neural network architectures",
      "Deep learning applications"
    ];
    setSearchSuggestions(suggestions);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AIBackground />
      
      {/* Enhanced Navbar */}
      <nav className="fixed w-full top-0 z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <button className="nav-button group">
                  <FiArrowLeft className="w-5 h-5 group-hover:text-blue-400" />
                </button>
              </Link>
              <FiCpu className="w-8 h-8 text-blue-500 animate-pulse" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                AI Search
              </h2>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="https://github.com/yourusername/your-repo" target="_blank">
                <button className="nav-button group">
                  <FiGithub className="w-5 h-5 group-hover:text-blue-400" />
                </button>
              </Link>
              <Link href="/docs">
                <button className="nav-button group">
                  <FiBook className="w-5 h-5 group-hover:text-purple-400" />
                </button>
              </Link>
              <Link href="/about">
                <button className="nav-button group">
                  <FiInfo className="w-5 h-5 group-hover:text-pink-400" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-start px-4 pt-24">
        <div className="w-full max-w-4xl mx-auto">
          {/* AI Status Indicator */}
          <div className="flex items-center justify-center mb-6 space-x-2">
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${aiThinking ? 'bg-yellow-500' : 'bg-green-500'}`}>
                {/* Pulsing animation ring */}
                <div className={`absolute inset-0 rounded-full ${aiThinking ? 'animate-none' : 'animate-ping'} 
                  ${aiThinking ? 'bg-yellow-400' : 'bg-green-400'} opacity-75`}>
                </div>
              </div>
            </div>
            <FiCpu className={`w-5 h-5 ${aiThinking ? 'text-yellow-500 animate-spin' : 'text-green-500'}`} />
            <span className="text-sm text-gray-400">
              AI Engine Status: {aiThinking ? 'Processing' : 'Ready'}
            </span>
          </div>

          {/* Enhanced Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full p-4 pl-12 pr-16 rounded-lg bg-gray-900/50 border border-white/10 
                         focus:outline-none focus:border-blue-500 backdrop-blur-sm
                         text-lg placeholder-gray-400"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-2 top-1/2 transform -translate-y-1/2
                         px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700
                         transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isSearching ? (
                  <>
                    <FiCpu className="w-5 h-5 animate-spin" />
                    <span>Processing</span>
                  </>
                ) : (
                  <>
                    <FiZap className="w-5 h-5" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* AI Processing Visualization */}
          {isSearching && (
            <div className="mb-8 p-6 backdrop-blur-sm bg-black/30 rounded-3xl border border-white/10">
              <div className="space-y-4">
                {processingSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <FiBrain className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span className="text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="feature-card">
              <FiCommand className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold">Natural Language Processing</h3>
              <p className="text-sm text-gray-400">Advanced understanding of human queries</p>
            </div>
            <div className="feature-card">
              <FiDatabase className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold">Knowledge Graph</h3>
              <p className="text-sm text-gray-400">Interconnected information network</p>
            </div>
            <div className="feature-card">
              
              <h3 className="text-lg font-semibold">Neural Networks</h3>
              <p className="text-sm text-gray-400">Deep learning powered search</p>
            </div>
            <div className="feature-card">
              <FiTrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold">Real-time Analysis</h3>
              <p className="text-sm text-gray-400">Live data processing and insights</p>
            </div>
          </div>

          {/* Search Suggestions */}
          <div className="space-y-6 backdrop-blur-sm bg-black/30 p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              AI-Powered Suggestions
            </h2>
            <div className="flex flex-wrap gap-2">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-4 py-2 bg-gray-800/50 rounded-full text-sm
                           hover:bg-gray-700/50 transition-colors border border-white/5"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-md border-t border-white/10 mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400">
              Copyright © {new Date().getFullYear()} AI Search Engine • All rights reserved
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <FiCpu className="w-5 h-5 text-blue-500 animate-pulse" />
              <span className="text-sm text-gray-400">Powered by Advanced AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}