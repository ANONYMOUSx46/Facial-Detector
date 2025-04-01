
import React from 'react';
import { Sparkles, Database } from 'lucide-react';

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background decorative elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary opacity-[0.02] animate-pulse-light"></div>
      <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-accent opacity-[0.02] animate-float"></div>
      
      {/* Floating icons with subtle glowing effects */}
      <div className="absolute top-[15%] right-[20%] text-primary opacity-20 animate-float">
        <Sparkles size={28} />
        <div className="absolute inset-0 bg-primary blur-xl opacity-10"></div>
      </div>
      
      <div className="absolute bottom-[25%] left-[15%] text-secondary opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
        <Database size={24} />
        <div className="absolute inset-0 bg-secondary blur-xl opacity-10"></div>
      </div>
      
      {/* Tech circuit patterns - more subtle */}
      <div className="absolute top-1/4 left-10 w-20 h-32 pointer-events-none opacity-5">
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-secondary"></div>
        <div className="absolute top-1/3 left-0 w-full h-0.5 bg-secondary"></div>
        <div className="absolute top-2/3 left-0 w-full h-0.5 bg-secondary"></div>
        <div className="absolute top-1/3 right-0 w-2 h-2 rounded-full bg-secondary"></div>
        <div className="absolute top-2/3 right-0 w-2 h-2 rounded-full bg-secondary"></div>
      </div>
      
      <div className="absolute bottom-1/4 right-10 w-32 h-20 pointer-events-none opacity-5">
        <div className="absolute top-0 left-1/3 w-0.5 h-full bg-accent"></div>
        <div className="absolute top-0 left-2/3 w-0.5 h-full bg-accent"></div>
        <div className="absolute top-0 left-0 w-full h-0.5 bg-accent"></div>
        <div className="absolute bottom-0 left-1/3 w-2 h-2 rounded-full bg-accent"></div>
        <div className="absolute bottom-0 left-2/3 w-2 h-2 rounded-full bg-accent"></div>
      </div>
      
      {/* Small particle elements */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            opacity: Math.random() * 0.2,
            animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default FloatingElements;
