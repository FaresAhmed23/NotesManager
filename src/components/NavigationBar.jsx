// components/NavigationBar.jsx
import React, { useState } from 'react';
import { Moon, Sun, LogIn, UserPlus, LogOut, User, Menu, X } from 'lucide-react';
import FeaturesModal from './FeaturesModal';
import TemplatesModal from './TemplatesModal';
import PricingModal from './PricingModal';

const NavigationBar = ({ theme, toggleTheme, onLogin, onSignup, isAuthenticated, user, onLogout, onTemplateSelect }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'features', label: 'Features' },
    { id: 'templates', label: 'Templates' },
    { id: 'pricing', label: 'Pricing' },
  ];

  return (
    <>
      <nav className="navigation-bar h-16 bg-card border-b border-border/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Notes</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveModal(item.id)}
                  className="nav-link px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg hover:bg-muted transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="theme-toggle p-2.5 rounded-lg hover:bg-muted transition-all duration-200 group"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground hidden sm:block">
                    {user?.name || 'User'}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="btn-secondary flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="btn-secondary flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:block">Login</span>
                </button>
                <button
                  onClick={onSignup}
                  className="btn-primary flex items-center gap-2 shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:block">Sign Up</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg animate-fade-in-up">
            <nav className="flex flex-col p-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModal(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </nav>

      {/* Modals */}
      {activeModal === 'features' && (
        <FeaturesModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'templates' && (
    <TemplatesModal 
      onClose={() => setActiveModal(null)} 
      onSelectTemplate={onTemplateSelect}
    />
  )}
      {activeModal === 'pricing' && (
        <PricingModal onClose={() => setActiveModal(null)} />
      )}
    </>
  );
};

export default NavigationBar;