"use client";
import React, { useEffect, useRef } from 'react';

const AIBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number; // Define x property
      y: number; // Define y property
      speed: number; // Define speed property
      length: number; // Define length property
      opacity: number; // Define opacity property

      constructor() {
        this.reset();
      }

      reset() {
        this.x = 0;
        this.y = Math.random() * (canvas.height || 0); // Ensure canvas height is used
        this.speed = 1 + Math.random() * 2;
        this.length = 50 + Math.random() * 100;
        this.opacity = 0.1 + Math.random() * 0.3;
      }

      update() {
        this.x += this.speed;
        if (this.x > (canvas.width || 0)) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length, this.y);
        ctx.strokeStyle = `rgba(64, 128, 255, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    const init = () => {
      resizeCanvas();
      particles = Array.from({ length: 50 }, () => new Particle());
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ background: 'linear-gradient(to bottom, #000000, #0a192f)' }}
    />
  );
};

export default AIBackground;
