// components/FeaturesModal.jsx
import React from 'react';
import { X, Zap, Brain, Shield, Palette, Timer, Share2 } from 'lucide-react';

const FeaturesModal = ({ onClose }) => {
  const features = [
    {
      icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Smart Organization",
      description: "Automatically categorize and tag your notes with AI-powered suggestions."
    },
    {
      icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Lightning Fast",
      description: "Instant search across all your notes with real-time results."
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Secure & Private",
      description: "Your notes are encrypted and stored securely with privacy in mind."
    },
    {
      icon: <Palette className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Beautiful Themes",
      description: "Choose from multiple themes to match your style and mood."
    },
    {
      icon: <Timer className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Productivity Tools",
      description: "Built-in Pomodoro timer and focus modes to boost productivity."
    },
    {
      icon: <Share2 className="w-6 h-6 sm:w-8 sm:h-8" />,
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] sm:max-h-[80vh] flex flex-col animate-scale-in-smooth pointer-events-auto">
          <div className="p-4 sm:p-6 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Features</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain">
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
              Discover all the powerful features that make our notes app the perfect companion for your thoughts and ideas.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-4 sm:p-6 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-primary mb-3 sm:mb-4">{feature.icon}</div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
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