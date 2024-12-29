"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiCpu, FiZap, FiTrendingUp } from 'react-icons/fi';
import AIFlowBackground from './AIBackground';

interface SearchResult {
  title: string;
  link: string;
  snippet?: string;
  relevance_score?: number;
}

interface SearchResponse {
  results: SearchResult[];
}

export default function SearchEngine() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [trendingData, setTrendingData] = useState([]);
  const [isLive, setIsLive] = useState(true);
  

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/trending', {
          timeout: 10000
        });
        
        if (response.data && response.data.trending) {
          setTrendingData(response.data.trending);
          setIsLive(true);
        }
      } catch (error) {
        console.error('Error fetching trending data:', error);
        setIsLive(false);
        let errorMessage = 'Failed to fetch trending searches.';
        
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 429) {
            errorMessage = 'Too many requests. Please try again later.';
          } else if (error.response?.data?.detail) {
            errorMessage = error.response.data.detail;
          }
        }
        setError(errorMessage);
      }
    };
  
    fetchTrendingData();
    const interval = setInterval(fetchTrendingData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const simulateAIProcessing = async () => {
    const steps = [
      "Initializing neural networks...",
      "Extracting meaningful features from the search query and page content using NLP techniques....",
      "Feeding extracted features into a neural network model (MLPRegressor) ...",
      "Processing semantic analysis...",
      "Using Neural Networks to process multiple features ...",
      "Synthesizing information streams...",
      "Optimizing result coherence..."
    ];

    for (const step of steps) {
      setProcessingSteps(prev => [...prev, step]);
      await new Promise(resolve => setTimeout(resolve, 800));
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

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Side Panel for Trending */}
      <div className="w-64 min-h-screen border-r border-blue-500/20 backdrop-blur-sm bg-black/30 p-4 fixed">
        <div className="flex items-center space-x-2 mb-6">
          <FiTrendingUp className="text-blue-400 w-5 h-5" />
          <h2 className="text-xl font-bold text-white">Live Trends</h2>
          <div className="flex items-center ml-2">
            <div className="relative">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-red-500'}`}>
                <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-75"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {trendingData && trendingData.length > 0 ? (
            trendingData.map((trend, index) => (
              <div key={index} 
                className="p-3 bg-gray-900/50 rounded-lg border border-blue-500/20 
                          hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                onClick={() => setSearchQuery(trend)}
              >
                <p className="text-gray-300 text-sm">
                  {index + 1}. {trend}
                </p>
              </div>
            ))
          ) : (
            <div className="p-3 bg-gray-900/50 rounded-lg border border-blue-500/20">
              <p className="text-gray-400 text-sm">Loading Trend Data</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <AIFlowBackground />
        {/* Side Panel for Trending */}
<div className="w-64 min-h-screen border-r border-blue-500/20 backdrop-blur-sm bg-black/30 p-4 fixed left-0 top-0">
  <div className="flex items-center space-x-2 mb-6">
    <FiTrendingUp className="text-blue-400 w-5 h-5" />
    <h2 className="text-xl font-bold text-white">Live Trends</h2>
    <div className="flex items-center ml-2">
      <div className="relative">
        <div className="w-2 h-2 rounded-full bg-green-500">
          <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-75"></div>
        </div>
      </div>
    </div>
  </div>
  
  <div className="space-y-4">
    {trendingData && trendingData.length > 0 ? (
      trendingData.map((trend, index) => (
        <div key={index} 
          className="p-3 bg-gray-900/50 rounded-lg border border-blue-500/20 
                    hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
          onClick={() => setSearchQuery(trend)}
        >
          <p className="text-gray-300 text-sm">
            {index + 1}. {trend}
          </p>
        </div>
      ))
    ) : (
      <div className="p-3 bg-gray-900/50 rounded-lg border border-blue-500/20">
        <p className="text-gray-400 text-sm">Loading Trend Data</p>
      </div>
    )}
  </div>
</div>
<main className="flex-grow flex flex-col items-center justify-start px-4 pt-24 relative z-10 ml-64">
          <div className="w-full max-w-4xl mx-auto">
            {/* Neural Engine Status */}
            <div className="flex items-center justify-center mb-6 space-x-2">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${aiThinking ? 'bg-blue-500' : 'bg-green-500'}`}>
                  <div className={`absolute inset-0 rounded-full ${aiThinking ? 'animate-ping' : ''} 
                    ${aiThinking ? 'bg-blue-400' : 'bg-green-400'} opacity-75`}>
                  </div>
                </div>
              </div>
              <FiCpu style={{ width: '1.25rem', height: '1.25rem', color: aiThinking ? '#3b82f6' : '#3ef059', animation: aiThinking ? 'spin' : '' }} />
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
                  placeholder="Query the AI..."
                  className="w-full p-4 pl-12 pr-16 rounded-lg bg-gray-900/50 border border-blue-500/20 
                           focus:outline-none focus:border-blue-500 backdrop-blur-sm
                           text-lg placeholder-gray-400 transition-all duration-300"
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2
                           px-4 py-2 bg-blue-600/80 rounded-md hover:bg-blue-700
                           transition-all duration-300 disabled:opacity-50 flex items-center space-x-2
                           backdrop-blur-sm"
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

            {/* Display Errors */}
            {error && (
              <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Processing Steps */}
            {isSearching && (
              <div className="mb-8 p-6 backdrop-blur-sm bg-black/30 rounded-3xl border border-blue-500/20">
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
              <div className="w-full space-y-4 mb-8 backdrop-blur-sm bg-black/30 p-6 rounded-3xl border border-blue-500/20">
                <h2 className="text-xl font-bold text-white mb-4">Neural Network Results</h2>
                {searchResults.map((result, index) => (
                  <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300">
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
    </div>
  );
}
