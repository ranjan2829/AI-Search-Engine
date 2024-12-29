"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { 
  FiMoon, 
  FiSun, 
  FiGithub, 
  FiInfo, 
  FiBook, 
  FiCpu, 
   
  FiDatabase 
} from 'react-icons/fi';
import dynamic from 'next/dynamic';




// Type definition
type FeatureItem = {
  icon: React.ElementType;
  text: string;
};

// Define features outside of the component
const features: FeatureItem[] = [
  { icon: FiCpu, text: 'Neural Processing' },
  { icon: FiCpu, text: 'Machine Learning' },
  { icon: FiDatabase, text: 'Deep Learning' }
];

const Globe = dynamic(() => import('../3dGlobe/Globe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center">
      <div className="animate-pulse text-blue-500">
        <FiCpu className="w-12 h-12 animate-spin-slow" />
      </div>
    </div>
  )
});

export default function Home() {
  
  const [darkMode, setDarkMode] = useState(true);
  const [animatedText, setAnimatedText] = useState('');
  const fullText = "Next-Gen AI Search Engine";
  
  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    const animateText = async () => {
      while (true) {
        for (let i = 0; i <= fullText.length; i++) {
          setAnimatedText(fullText.substring(0, i));
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        for (let i = fullText.length; i >= 0; i--) {
          setAnimatedText(fullText.substring(0, i));
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };
    
    animateText();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
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
              <button onClick={() => setDarkMode(!darkMode)} className="nav-button group">
                {darkMode ? 
                  <FiSun className="w-5 h-5 group-hover:text-yellow-400" /> : 
                  <FiMoon className="w-5 h-5 group-hover:text-blue-400" />
                }
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 relative mt-16">
        <div className="absolute inset-0 opacity-80">
          <Globe />
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-4xl">
          <div className="backdrop-blur-sm bg-black/30 p-8 rounded-3xl border border-white/10 shadow-2xl">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              {animatedText}
              <span className="animate-blink">|</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Powered by advanced AI to deliver intelligent, context-aware search results
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/search">
                <button className="primary-button inline-flex items-center">
                  <FiCpu className="w-5 h-5 mr-2" />
                  Try AI Search Engine
                </button>
              </Link>

              <Link href="/docs">
                <button className="secondary-button">
                  <FiBook className="w-5 h-5 mr-2" />
                  View Documentation
                </button>
              </Link>
            </div>

            <div className="mt-16 flex gap-4 justify-center flex-wrap">
              {features.map(({ icon: Icon, text }, index) => (
                <div key={index} 
                     className="feature-pill">
                  
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-md border-t border-white/10">
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