const AIBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Neural network nodes */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`node-${i}`}
          className="absolute w-1 h-1 bg-blue-300 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            boxShadow: `
              0 0 5px #60a5fa,
              0 0 10px #60a5fa,
              0 0 20px #3b82f6
            `,
            opacity: 0.6
          }}
        />
      ))}

      {/* Circular pulse effect */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(37,99,235,0) 70%)',
          animation: 'ripple 4s ease-out infinite'
        }}
      />

      {/* Lightened grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #60a5fa 0.5px, transparent 0.5px),
            linear-gradient(to bottom, #60a5fa 0.5px, transparent 0.5px)
          `,
          backgroundSize: '50px 50px',
          mask: 'radial-gradient(circle at center, black 40%, transparent)'
        }}
      />

      {/* Lightning effect on the grid */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
          animation: 'lightning 1.5s ease-in-out infinite'
        }}
      />

      {/* Ambient glow */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(37,99,235,0.1) 0%, rgba(0,0,0,0) 50%)'
        }}
      />
    </div>
  );
};

export default AIBackground; 