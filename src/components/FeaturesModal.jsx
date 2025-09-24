// components/FeaturesModal.jsx
import React from 'react';
import { X, Zap, Brain, Shield, Palette, Timer, Share2 } from 'lucide-react';

const FeaturesModal = ({ onClose }) => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Organization",
      description: "Automatically categorize and tag your notes with AI-powered suggestions."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Instant search across all your notes with real-time results."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your notes are encrypted and stored securely with privacy in mind."
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Beautiful Themes",
      description: "Choose from multiple themes to match your style and mood."
    },
    {
      icon: <Timer className="w-8 h-8" />,
      title: "Productivity Tools",
      description: "Built-in Pomodoro timer and focus modes to boost productivity."
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Easy Sharing",
      description: "Share notes with others or export in multiple formats."
    }
  ];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in-up"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden animate-scale-in-smooth">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Features</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto">
            <p className="text-muted-foreground mb-8">
              Discover all the powerful features that make our notes app the perfect companion for your thoughts and ideas.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-6 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturesModal;