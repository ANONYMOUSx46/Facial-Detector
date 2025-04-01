
import React from 'react';
import { Scan } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background py-12 px-6 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent flex items-center justify-center rounded-sm">
                <Scan className="text-white h-4 w-4" />
              </div>
              <h2 className="text-xl font-space-mono font-bold gradient-text">Lumeo</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Next-level facial detection with a professional interface and powerful capabilities.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-base font-space-mono">Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="#detection-section" className="text-muted-foreground hover:text-primary transition-colors">Detection</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-base font-space-mono">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://github.com/ANONYMOUSx46" className="text-muted-foreground hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/liam-de-wet-42b80a355/" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/30 pt-8">
          <p className="text-center text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Lumeo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
