import React, { useState } from 'react';
import { Button } from './ui/button';
import { Github, Scan, Moon, Sun } from 'lucide-react';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to toggle between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle('dark');
  };

  const scrollToDetection = () => {
    const detectionSection = document.getElementById('detection-section');
    if (detectionSection) {
      detectionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full py-5 px-6 md:px-10 flex items-center justify-between z-10 sticky top-0">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md -z-10 border-b border-border/40"></div>

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-sm bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
          <Scan className="text-primary-foreground h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-press-start tracking-tight bg-gradient-to-r from-primary via-secondary to-accent text-transparent bg-clip-text">
            Lumeo
          </h1>
          <p className="text-xs text-muted-foreground font-vt323 tracking-wider">
            FACIAL RECOGNITION SYSTEM
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="hidden md:flex gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300" asChild>
          <a href="https://github.com/ANONYMOUSx46" target="_blank" rel="noopener noreferrer">
            <Github size={16} />
            <span className="font-space-mono text-xs">GitHub</span>
          </a>
        </Button>
        <Button
          size="sm"
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-sm"
          onClick={scrollToDetection}
        >
          <Scan size={16} className="mr-2" />
          <span className="font-space-mono text-xs">Start Analysis</span>
        </Button>
        {/* Theme Toggle Button */}
        <Button
          size="icon"
          variant="outline"
          className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <Sun size={16} className="text-yellow-400" />
          ) : (
            <Moon size={16} className="text-slate-800" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;