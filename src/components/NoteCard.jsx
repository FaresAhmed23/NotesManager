"use client";

import { Star, Edit3, Trash2, Calendar, Tag, MoreVertical } from "lucide-react";
import { useState } from "react";

const NoteCard = ({ note, onToggleFavorite, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (date) => {
    const noteDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - noteDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return noteDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: noteDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="card-modern p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden bg-card">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground line-clamp-2 mb-1">
              {note.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(note.createdAt)}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onToggleFavorite(note.id)}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                note.isFavorite
                  ? "text-yellow-500 hover:bg-yellow-500/10"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              aria-label={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`w-4 h-4 ${note.isFavorite ? "fill-current" : ""}`} />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 z-20 min-w-[120px] animate-scale-in-smooth">
                    <button
                      onClick={() => {
                        onEdit(note);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete(note.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {note.content}
        </p>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="tag flex items-center gap-1 text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;