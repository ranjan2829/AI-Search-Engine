"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
  FiSearch, FiCpu, FiArrowLeft, FiGithub, FiInfo, FiBook, 
  FiCommand, FiZap, FiBrain, FiDatabase, FiTrendingUp 
} from 'react-icons/fi';
import AIBackground from './AIBackground';

interface SearchResult {
  title: string;
  link: string;
  snippet?: string;
}

interface SearchResponse {
  results: SearchResult[];
  total_results: number;
  query_time: number;
  timestamp: string;
}

export default function SearchEngine() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const simulateAIProcessing = async () => {
    const steps = [
      "Initializing search process...",
      "Processing query...",
      "Analyzing search parameters...",
      "Fetching results...",
      "Processing response..."
    ];

    for (const step of steps) {
      setProcessingSteps(prev => [...prev, step]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setProcessingSteps([]);
    setAiThinking(true);
    setError(null);
    setSearchResults([]);

    try {
      await simulateAIProcessing();
      
      const response = await axios.post<SearchResponse>('http://localhost:8000/search', {
        query: searchQuery,
        max_results: 10
      });
      
      setSearchResults(response.data.results);
      
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to fetch search results. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      setAiThinking(false);
    }
  };

  useEffect(() => {
    setSearchSuggestions([
      "Latest AI developments",
      "Machine learning algorithms",
      "Neural network architectures",
      "Deep learning applications"
    ]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AIBackground />
      
      <nav className="fixed w-full top-0 z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
        {/* ... (keep your existing navbar code) ... */}
      </nav>

      <main className="flex-grow flex flex-col items-center justify-start px-4 pt-24">
        <div className="w-full max-w-4xl mx-auto">
          {/* Status Indicator */}
          <div className="flex items-center justify-center mb-6 space-x-2">
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${aiThinking ? 'bg-yellow-500' : 'bg-green-500'}`}>
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

          {/* Search Form */}
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

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* Processing Steps */}
          {isSearching && (
            <div className="mb-8 p-6 backdrop-blur-sm bg-black/30 rounded-3xl border border-white/10">
              <div className="space-y-4">
                {processingSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <FiCpu className="w-4 h-4 text-blue-400 animate-spin" />
                    <span className="text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="w-full space-y-4 mb-8 backdrop-blur-sm bg-black/30 p-6 rounded-3xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Search Results</h2>
              {searchResults.map((result, index) => (
                <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-white/5 hover:border-blue-500/50 transition-colors">
                  <a 
                    href={result.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h3 className="text-lg font-semibold text-blue-400 hover:text-blue-300 mb-2">
                      {result.title}
                    </h3>
                    {result.snippet && (
                      <p className="text-gray-300 mb-2">{result.snippet}</p>
                    )}
                    <p className="text-sm text-gray-400 truncate">{result.link}</p>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}