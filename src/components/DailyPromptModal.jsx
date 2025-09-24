"use client";

import React, { useState } from "react";
import { Copy, X, Sparkles, RefreshCw, ExternalLink } from "lucide-react";

const DailyPromptModal = ({ prompt, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(prompt)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => console.error("Could not copy text: ", err));
  };

  const handleCreateNote = () => {
    // This would trigger creating a new note with the prompt as content
    console.log("Create note with prompt");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-card text-card-foreground rounded-3xl shadow-2xl w-full max-w-xl relative border border-border animate-scale-in-smooth overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Daily Writing Prompt</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted transition-colors duration-200"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className={`bg-muted/50 p-6 rounded-2xl mb-6 border border-border/50 transition-all duration-300 ${
              isExpanded ? 'cursor-default' : 'cursor-pointer hover:bg-muted/70'
            }`}
            onClick={() => !isExpanded && setIsExpanded(true)}
            >
              <p className={`text-lg font-medium italic text-foreground/90 leading-relaxed ${
                !isExpanded ? 'line-clamp-3' : ''
              }`}>
                "{prompt}"
              </p>
              {!isExpanded && prompt.length > 150 && (
                <p className="text-sm text-primary mt-2 font-medium">Click to read more...</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className={`flex-1 btn-secondary py-3 flex items-center justify-center gap-2 transition-all duration-200 ${
                  isCopied ? 'bg-green-500/10 text-green-600 border-green-500' : ''
                }`}
              >
                {isCopied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Prompt
                  </>
                )}
              </button>
              
              <button
                onClick={handleCreateNote}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Create Note
              </button>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-primary" />
                Writing Tips
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Set a timer for 15-20 minutes of uninterrupted writing</li>
                <li>• Don't worry about grammar or structure on your first draft</li>
                <li>• Let your thoughts flow freely and edit later</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyPromptModal;