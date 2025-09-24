"use client";

import NoteCard from "./NoteCard";
import EmptyState from "./EmptyState";
import { groupNotesByTime } from "../utils/timeGrouping";
import { Calendar } from "lucide-react";

const NotesGrid = ({ 
  notes, 
  onToggleFavorite, 
  onEdit, 
  onDelete, 
  searchQuery, 
  currentView, 
  activeSmartCollection 
}) => {
  if (notes.length === 0) {
    return <EmptyState 
      searchQuery={searchQuery} 
      currentView={currentView} 
      activeSmartCollection={activeSmartCollection} 
    />;
  }

  // Group notes by time for 'all' view
  if (currentView === "all" && !searchQuery && !activeSmartCollection) {
    const groupedNotes = groupNotesByTime(notes);

    return (
      <div className="space-y-10 animate-fade-in-up">
        {Object.entries(groupedNotes).map(([timeGroup, groupNotes], groupIndex) => (
          <div key={timeGroup} className={`stagger-${groupIndex + 1}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{timeGroup}</h3>
              <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full font-medium">
                {groupNotes.length} {groupNotes.length === 1 ? 'note' : 'notes'}
              </span>
              <div className="flex-1 h-px bg-border/50 ml-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groupNotes.map((note, index) => (
                <div 
                  key={note.id} 
                  className={`animate-scale-in-smooth stagger-${index + 1}`}
                >
                  <NoteCard 
                    note={note} 
                    onToggleFavorite={onToggleFavorite}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Regular grid for other views
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
      {notes.map((note, index) => (
        <div 
          key={note.id} 
          className={`animate-scale-in-smooth stagger-${Math.min(index + 1, 5)}`}
        >
          <NoteCard 
            note={note} 
            onToggleFavorite={onToggleFavorite}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default NotesGrid;