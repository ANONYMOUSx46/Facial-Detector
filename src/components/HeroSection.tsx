
import React from 'react';
import { ArrowDown, Scan } from 'lucide-react';
import FloatingElements from './FloatingElements';
import { Button } from './ui/button';

const HeroSection = () => {
  const scrollToDetection = () => {
    const detectionSection = document.getElementById('detection-section');
    if (detectionSection) {
      detectionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-[80vh] relative flex flex-col items-center justify-center py-16 px-6 overflow-hidden">
      <FloatingElements />
      
      <div className="absolute inset-0 overflow-hidden -z-10">
        {/* Subtle gradient backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-64 bg-gradient-to-r from-primary/10 to-accent/10 blur-[100px] -z-10 transform -rotate-6"></div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.02)_50%,transparent_100%),linear-gradient(0deg,transparent_0%,rgba(0,0,0,0.02)_50%,transparent_100%)] bg-[length:50px_50px]"></div>
      </div>
      
      <div className="text-center max-w-3xl mx-auto relative z-10">
        <div className="inline-block mb-6">
          <span className="text-sm font-space-mono tracking-wider text-muted-foreground">ADVANCED FACIAL RECOGNITION</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-6xl font-press-start mb-6 leading-tight">
          <span className="bg-gradient-to-r from-primary via-secondary to-accent text-transparent bg-clip-text relative inline-block">
            Lumeo
          </span>
          <br />
          <span className="text-foreground inline-block mt-2 text-2xl md:text-3xl lg:text-4xl relative">
            ANALYSIS ENGINE
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent"></span>
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-space-mono">
          Experience the OpenCV-powered facial recognition with precise landmark detection 
          and near detection accuracy.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button 
            onClick={scrollToDetection}
            className="px-6 py-5 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-space-mono text-sm group"
            size="lg"
          >
            <Scan size={18} className="mr-2" />
            <span>START FACIAL ANALYSIS</span>
          </Button>
          
          <div className="hidden md:block">
            <button 
              onClick={scrollToDetection}
              className="w-12 h-12 border border-border bg-background/80 shadow-sm backdrop-blur-sm flex items-center justify-center hover:bg-primary/5 transition-colors duration-300 rounded-full animate-bounce"
              aria-label="Scroll to detection section"
            >
              <ArrowDown size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
