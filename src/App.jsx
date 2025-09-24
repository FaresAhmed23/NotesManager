"use client";

import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import Sidebar from "./components/Sidebar";
import NotesGrid from "./components/NotesGrid";
import CreateNoteForm from "./components/CreateNoteForm";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import SearchBar from "./components/SearchBar";
import NavigationBar from "./components/NavigationBar";
import { useNotes } from "./hooks/useNotes";
import "./App.css";
import MindMap from "./components/mindMapping";
import PomodoroTimer from "./components/PomodoroTimer";
import DailyPromptModal from "./components/DailyPromptModal";
import { getDailyPrompt } from "./dailyPromptsData";
import NotificationToast from "./components/NotificationToast";

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [activeSmartCollection, setActiveSmartCollection] = useState(null);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [showDailyPrompt, setShowDailyPrompt] = useState(false);
  const [dailyPrompt, setDailyPrompt] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });
  const [showMindMap, setShowMindMap] = useState(false);
  const [mindMapData, setMindMapData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const { 
    notes, 
    addNote, 
    toggleFavorite, 
    updateNote, 
    deleteNote, 
    restoreNote, 
    permanentlyDeleteNote,
    getStats 
  } = useNotes();

  const showNotification = (message, type = 'info') => {
  const id = Date.now();
  setNotifications(prev => [...prev, { id, message, type }]);
};

const removeNotification = (id) => {
  setNotifications(prev => prev.filter(n => n.id !== id));
};


  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    setDailyPrompt(getDailyPrompt());
    
    // Check if user has seen daily prompt today
    const today = new Date().toDateString();
    const lastPromptDate = localStorage.getItem("lastPromptDate");
    if (lastPromptDate !== today && isAuthenticated) {
      setTimeout(() => {
        setShowDailyPrompt(true);
        localStorage.setItem("lastPromptDate", today);
      }, 2000);
    }
  }, [theme, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", sidebarCollapsed);
  }, [sidebarCollapsed]);

  const smartCollections = [
    {
      id: "last-week",
      label: "Last Week's Notes",
      rule: (note) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(note.createdAt) >= oneWeekAgo;
      },
    },
    {
      id: "work-notes",
      label: "Work Notes",
      rule: (note) => note.tags.includes("work"),
    },
    {
      id: "untagged",
      label: "Untagged Notes",
      rule: (note) => note.tags.length === 0,
    },
  ];

  const handleViewChange = (viewId) => {
    setCurrentView(viewId);
    setActiveSmartCollection(null);
    localStorage.setItem("lastView", viewId);
  };

  const handleSmartCollectionChange = (collectionId) => {
        setCurrentView("smart-collection");
    setActiveSmartCollection(collectionId);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleCreateNote = (noteData) => {
    const newNote = addNote(noteData);
    setShowCreateForm(false);
    
    // Show success notification
    showNotification('Note created successfully!', 'success');
  };

  const handleEditNote = (noteData) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
      setEditingNote(null);
      showNotification('Note updated successfully!', 'success');
    }
  };

  const handleDeleteNote = (noteId) => {
    deleteNote(noteId);
    showNotification('Note moved to trash', 'info');
  };

  const handleRestoreNote = (noteId) => {
    restoreNote(noteId);
    showNotification('Note restored', 'success');
  };

  const handlePermanentDelete = (noteId) => {
    if (window.confirm('Are you sure you want to permanently delete this note?')) {
      permanentlyDeleteNote(noteId);
      showNotification('Note permanently deleted', 'warning');
    }
  };

  const handleSaveMindMap = (mindMapData) => {
    const content = `# Mind Map\n\n${JSON.stringify(mindMapData, null, 2)}`;
    addNote({
      title: `Mind Map - ${new Date().toLocaleDateString()}`,
      content,
      tags: ["mindmap", "visualization"],
    });
    setShowMindMap(false);
    showNotification('Mind map saved as note', 'success');
  };

  const getFilteredNotes = () => {
    let filtered = notes;

    if (activeSmartCollection) {
      const collection = smartCollections.find((c) => c.id === activeSmartCollection);
      if (collection) {
        filtered = filtered.filter(collection.rule);
      }
    } else {
      switch (currentView) {
        case "favorites":
          filtered = notes.filter((note) => note.isFavorite && !note.isDeleted);
          break;
        case "deleted":
          filtered = notes.filter((note) => note.isDeleted);
          break;
        default:
          filtered = notes.filter((note) => !note.isDeleted);
      }
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const stats = getStats();

  const handleTemplateSelect = (template) => {
  const noteData = {
    title: template.title,
    content: template.content,
    tags: [template.title.toLowerCase().replace(/\s+/g, '-')]
  };
  
  addNote(noteData);
  showNotification(`Note created from ${template.title} template`, 'success');
};



  return (
    <div className="app-container min-h-dvh" data-theme={theme}>
      <NavigationBar
        theme={theme}
        toggleTheme={toggleTheme}
        onLogin={() => setShowLoginForm(true)}
        onSignup={() => setShowSignupForm(true)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={() => {
          logout();
          showNotification('Logged out successfully', 'success');
        }}
        onTemplateSelect={handleTemplateSelect}
      />
      
      <div className="flex h-[calc(100vh-4rem)] bg-background text-foreground font-body transition-colors duration-300">
        <Sidebar
          currentView={currentView}
          onViewChange={handleViewChange}
          onCreateNote={() => setShowCreateForm(true)}
          theme={theme}
          toggleTheme={toggleTheme}
          onShowMindMap={() => setShowMindMap(true)}
          smartCollections={smartCollections}
          onSmartCollectionChange={handleSmartCollectionChange}
          activeSmartCollection={activeSmartCollection}
          onShowPomodoro={() => setShowPomodoro(true)}
          onShowDailyPrompt={() => setShowDailyPrompt(true)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-border/50 backdrop-blur-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-heading font-bold text-foreground tracking-tight mb-2">
                    {activeSmartCollection
                      ? smartCollections.find((c) => c.id === activeSmartCollection)?.label
                      : currentView === "all"
                      ? "All Notes"
                      : currentView.charAt(0).toUpperCase() + currentView.slice(1)}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{getFilteredNotes().length} {getFilteredNotes().length === 1 ? 'note' : 'notes'}</span>
                    {isAuthenticated && (
                      <>
                        <span>•</span>
                        <span>{stats.total} total</span>
                        <span>•</span>
                        <span>{stats.favorites} favorites</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Note
                </button>
              </div>
              {(currentView === "all" || currentView === "favorites" || currentView === "deleted" || activeSmartCollection) && (
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  placeholder={`Search ${activeSmartCollection ? "this collection" : currentView}...`}
                />
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto bg-muted/30">
            <div className="max-w-7xl mx-auto p-8">
              <NotesGrid
                notes={getFilteredNotes()}
                onToggleFavorite={toggleFavorite}
                onEdit={setEditingNote}
                onDelete={handleDeleteNote}
                onRestore={handleRestoreNote}
                onPermanentDelete={handlePermanentDelete}
                searchQuery={searchQuery}
                currentView={currentView}
              />
            </div>
          </div>
        </main>
      </div>
      
      {/* Modals */}
      {showDailyPrompt && (
        <DailyPromptModal
          prompt={dailyPrompt}
          onClose={() => setShowDailyPrompt(false)}
          onCreateNote={(promptText) => {
            setShowCreateForm(true);
            setEditingNote({ content: promptText });
            setShowDailyPrompt(false);
          }}
        />
      )}
      {showPomodoro && <PomodoroTimer onClose={() => setShowPomodoro(false)} />}
      {(showCreateForm || editingNote) && (
  <CreateNoteForm
    note={editingNote}
    onSubmit={editingNote && !showCreateForm ? handleEditNote : handleCreateNote}
    onClose={() => {
      setShowCreateForm(false);
      setEditingNote(null);
    }}
    initialData={showCreateForm ? editingNote : null}
  />
)}
      {showMindMap && (
        <MindMap
          onClose={() => setShowMindMap(false)}
          onSave={handleSaveMindMap}
          initialData={mindMapData}
        />
      )}
      {showLoginForm && (
        <LoginForm 
          onClose={() => setShowLoginForm(false)}
          onSuccess={() => {
            setShowLoginForm(false);
            showNotification('Welcome back!', 'success');
          }}
        />
      )}
      {showSignupForm && (
        <SignupForm 
          onClose={() => setShowSignupForm(false)}
          onSuccess={() => {
            setShowSignupForm(false);
            showNotification('Account created successfully!', 'success');
          }}
        />
      )}
      {notifications.map(notification => (
  <NotificationToast
    key={notification.id}
    message={notification.message}
    type={notification.type}
    onClose={() => removeNotification(notification.id)}
  />
))}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;