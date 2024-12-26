"use client";
import { useEffect, useState } from 'react';

const AIBackground = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    top: number;
    left: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Generate particles only on client-side
    const particleCount = 15;
    const newParticles = Array.from({ length: particleCount }, (_, index) => ({
      id: index,
      top: Math.floor((index * 100) / particleCount), // Distribute evenly
      left: Math.floor((index * 100) / particleCount),
      delay: (index * 0.2).toFixed(2), // Consistent delays
      duration: 2 + (index * 0.1), // Consistent durations
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-blue-300 rounded-full animate-pulse"
          style={{
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            animation: `pulse ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            opacity: 0.6,
            boxShadow: `
              0 0 5px #60a5fa,
              0 0 10px #60a5fa,
              0 0 15px #3b82f6
            `
          }}
        />
      ))}
    </div>
  );
};

export default AIBackground;