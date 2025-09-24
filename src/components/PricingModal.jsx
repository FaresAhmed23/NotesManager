// components/PricingModal.jsx - Update the content div
import React from 'react';
import { X, Check, Zap, Shield, Users, Cloud } from 'lucide-react';

const PricingModal = ({ onClose }) => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for personal use",
      features: [
        "Unlimited notes",
        "Basic organization",
        "Search functionality",
        "Light/Dark themes",
        "Export to JSON",
        "Local storage"
      ],
      limitations: [
        "No cloud sync",
        "No collaboration",
        "Basic templates only"
      ],
      cta: "Current Plan",
      current: true
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "For power users",
      features: [
        "Everything in Free",
        "Cloud sync",
        "Advanced templates",
        "Priority support",
        "Custom themes",
        "PDF export",
        "API access"
      ],
      limitations: [],
      cta: "Upgrade to Pro",
      highlighted: true
    },
    {
      name: "Team",
      price: "$19",
      period: "per user/month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Shared workspaces",
        "Admin controls",
        "SSO integration",
        "Advanced security",
        "Dedicated support"
      ],
      limitations: [],
      cta: "Contact Sales"
    }
  ];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in-up"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-5xl max-h-[80vh] flex flex-col animate-scale-in-smooth">
          <div className="p-6 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Pricing Plans</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-muted-foreground text-center mb-8">
              Choose the perfect plan for your needs. Upgrade or downgrade anytime.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative p-6 rounded-xl border-2 transition-all animate-fade-in-up ${
                    plan.highlighted 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <li key={idx} className="flex items-start gap-2 opacity-60">
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                      plan.current
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : plan.highlighted
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    disabled={plan.current}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                All plans include automatic updates and basic support. 
                <br />
                Need a custom plan? <button className="text-primary hover:underline">Contact us</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingModal;