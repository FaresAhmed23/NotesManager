"use client";

import { FileText, Star, Trash2, Search, Plus, Sparkles, Tag } from "lucide-react";

const EmptyState = ({ searchQuery, currentView, activeSmartCollection }) => {
  const getEmptyContent = () => {
    if (searchQuery) {
      return {
        title: "No results found",
        message: `We couldn't find any notes matching "${searchQuery}". Try adjusting your search or creating a new note.`,
        icon: Search,
        action: {
          text: "Clear search",
          onClick: () => window.location.reload() // You would pass the actual clear function
        }
      };
    }

    if (activeSmartCollection) {
      return {
        title: "No notes in this collection",
        message: "This smart collection doesn't have any notes yet. Notes matching the criteria will appear here automatically.",
        icon: Tag,
        showCreateButton: true
      };
    }

    switch (currentView) {
      case "favorites":
        return {
          title: "No favorites yet",
          message: "Star your important notes to see them here. Your favorite notes will be easily accessible in one place.",
          icon: Star,
          tips: [
            "Click the star icon on any note to add it to favorites",
            "Use favorites for quick access to important notes",
            "Organize your most-used notes for better productivity"
          ]
        };
        
      case "deleted":
        return {
          title: "Trash is empty",
          message: "Deleted notes will appear here. You can restore or permanently delete them.",
          icon: Trash2,
          tips: [
            "Deleted notes are kept for 30 days",
            "You can restore notes back to your collection",
            "Empty trash to free up space"
          ]
        };
        
      default:
        return {
          title: "Let's create your first note",
          message: "Start capturing your thoughts, ideas, and important information.",
          icon: Sparkles,
          showCreateButton: true,
          tips: [
            "Use tags to organize your notes",
            "Star important notes for quick access",
            "Try the mind map tool for visual thinking"
          ]
        };
    }
  };

  const content = getEmptyContent();
  const Icon = content.icon;

  return (
    <div className="flex-1 flex items-center justify-center p-8 min-h-[60vh]">
      <div className="text-center max-w-md mx-auto animate-fade-in-up">
        {/* Icon */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 bg-muted rounded-full mx-auto flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Icon className="w-16 h-16 text-muted-foreground relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="absolute -inset-4 bg-primary/5 blur-2xl rounded-full animate-pulse"></div>
        </div>

        {/* Text Content */}
        <h3 className="text-2xl font-bold text-foreground mb-3">{content.title}</h3>
        <p className="text-muted-foreground mb-8 leading-relaxed">{content.message}</p>

        {/* Action Button */}
        {content.showCreateButton && (
          <button
            className="btn-primary px-6 py-3 mx-auto flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Create your first note
          </button>
        )}

        {content.action && (
          <button
            onClick={content.action.onClick}
            className="btn-secondary px-6 py-3 mx-auto"
          >
            {content.action.text}
          </button>
        )}

        {/* Tips */}
        {content.tips && (
          <div className="mt-12 p-6 bg-muted/50 rounded-2xl border border-border/50">
            <h4 className="text-sm font-semibold text-foreground mb-4">Quick Tips</h4>
            <ul className="space-y-2 text-left">
              {content.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;