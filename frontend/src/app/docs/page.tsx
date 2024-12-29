import React from 'react';

export default function Documentation() {
    return (
        <div className="w-full min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Overview */}
                <section id="overview">
                    <h1 className="text-4xl font-bold mb-4 text-blue-400">AI Search Engine Documentation</h1>
                    <p className="text-gray-300 text-lg">
                        Welcome to the documentation for the AI Search Engine! This project is designed to showcase the power of artificial intelligence in delivering context-aware, intelligent search results.
                    </p>
                </section>

                {/* Features */}
                <section id="features">
                    <h2 className="text-3xl font-bold mb-4 text-purple-400">Features</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                        <li>Real-time AI-powered search</li>
                        <li>Integration with MongoDB for storing and retrieving search results</li>
                        <li>Responsive and dynamic 3D visualizations</li>
                        <li>Customizable API for advanced search functionality</li>
                    </ul>
                </section>

                {/* Installation */}
                <section id="installation">
                    <h2 className="text-3xl font-bold mb-4 text-pink-400">Installation</h2>
                    <pre className="bg-gray-800 p-4 rounded-lg text-gray-200">
                        <code>
                            git clone https://github.com/yourusername/ai-search-engine.git{"\n"}
                            cd ai-search-engine{"\n"}
                            npm install{"\n"}
                            npm run dev
                        </code>
                    </pre>
                </section>

                {/* Usage */}
                <section id="usage">
                    <h2 className="text-3xl font-bold mb-4 text-yellow-400">Usage</h2>
                    <p className="text-gray-300 mb-4">
                        After starting the development server, navigate to <code>http://localhost:3000</code> in your browser. Use the search bar to input queries and experience the power of AI-driven search.
                    </p>
                </section>

                {/* API Reference */}
                <section id="api-reference">
                    <h2 className="text-3xl font-bold mb-4 text-green-400">API Reference</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-semibold">POST /search</h3>
                            <p className="text-gray-300">
                                Submit a query to retrieve search results.
                            </p>
                            <pre className="bg-gray-800 p-4 rounded-lg text-gray-200">
                                <code>
                                    Request:{"\n"}
                                    {"{"}
                                    {"\n"}  &quot;query&quot;: &quot;example&quot;{"\n"}
                                    {"}"}
                                    {"\n\n"}
                                    Response:{"\n"}
                                    {"{"}
                                    {"\n"}  &quot;query&quot;: &quot;example&quot;,{"\n"}  &quot;results&quot;: [&quot;Result 1&quot;, &quot;Result 2&quot;]
                                    {"\n"}
                                    {"}"}
                                </code>
                            </pre>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="pt-8 border-t border-gray-700">
                    <p className="text-gray-500 text-sm">
                        Copyright © {new Date().getFullYear()} AI Search Engine • All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
}