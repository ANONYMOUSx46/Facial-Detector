
import React from 'react';
import { Shield, Zap, Sparkles, Globe } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Privacy First",
      description: "All processing happens locally in your browser. Your images never leave your device."
    },
    {
      icon: <Zap className="w-8 h-8 text-secondary" />,
      title: "Lightning Fast",
      description: "Advanced algorithms deliver real-time detection results with minimal latency."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-accent" />,
      title: "High Accuracy",
      description: "Precisely detect and highlight facial features with the state-of-the-art AI."
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Works Everywhere",
      description: "Compatible with all modern browsers and devices, no installation required."
    }
  ];

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-press-start mb-4 gradient-text">Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-space-mono">
            The facial detection technology combines cutting-edge AI with professional design to create an exceptional experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 bg-muted/50 p-3 rounded-full w-14 h-14 flex items-center justify-center">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2 font-space-mono">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
