"use client";

import React from "react";
import {
  Notebook,
  Star,
  Trash2,
  Settings,
  Plus,
  Moon,
  Sun,
  Palette,
  LayoutGrid,
  Map,
  Timer,
  BookOpenText,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Search,
  Hash,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import SettingsModal from './SettingsModal';

const Sidebar = ({
  currentView,
  onViewChange,
  onCreateNote,
  theme,
  onShowMindMap,
  smartCollections,
  toggleTheme,
  onSmartCollectionChange,
  activeSmartCollection,
  onShowPomodoro,
  onShowDailyPrompt,
  collapsed,
  onToggleCollapse,
}) => {
  const [showSmartCollections, setShowSmartCollections] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const SidebarButton = ({
    icon,
    label,
    onClick,
    isActive,
    isSecondary = false,
    badge = null,
  }) => (
    <button
      onClick={onClick}
      className={`sidebar-btn flex items-center w-full rounded-xl transition-all duration-200 ease-in-out font-medium group relative overflow-hidden
        ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
        ${
          isActive
            ? "bg-primary text-primary-foreground shadow-md before:absolute before:inset-0 before:bg-white/10"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }
        ${isSecondary ? "text-sm" : ""}`}
      title={collapsed ? label : ""}
    >
      <div
        className={`flex items-center justify-center flex-shrink-0 transition-all duration-200
          ${collapsed ? "" : "mr-3"}`}
      >
        {React.cloneElement(icon, { 
          className: `${collapsed ? 'w-5 h-5' : 'w-5 h-5'} transition-all duration-200` 
        })}
      </div>
      {!collapsed && (
        <>
          <span className="flex-1 text-left truncate">{label}</span>
          {badge && (
            <span className="ml-2 bg-primary/20 text-primary text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );

  const SmartCollectionButton = ({ collection }) => {
    const isActive = activeSmartCollection === collection.id;
    return (
      <button
        onClick={() => onSmartCollectionChange(collection.id)}
        className={`flex items-center w-full rounded-lg transition-all duration-200 text-sm text-left
        ${collapsed ? 'px-3 py-2.5 justify-center' : 'py-2.5 px-4'}
        ${isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" 
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        }`}
        title={collapsed ? collection.label : ""}
      >
        <Bookmark className={`w-4 h-4 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
        {!collapsed && <span className="truncate">{collection.label}</span>}
      </button>
    );
  };

  return (
    <aside 
      className={`
        ${collapsed ? 'w-[5.9rem]' : 'w-80'} 
        bg-sidebar 
        border-r border-sidebar-border 
        flex flex-col 
        transition-all duration-300 ease-in-out 
        relative z-10
        shadow-lg
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 pointer-events-none" />
      
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center mb-8 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="animate-fade-in-up">
              <h2 className="text-lg font-semibold text-sidebar-foreground mb-1">Workspace</h2>
              <p className="text-xs text-sidebar-foreground/60">Organize your thoughts</p>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className={`
              p-2 rounded-lg 
              hover:bg-sidebar-accent 
              text-sidebar-foreground 
              transition-all duration-200
              ${collapsed ? 'mx-auto' : 'ml-auto'}
            `}
            aria-label="Toggle sidebar"
          >
            {collapsed ? 
              <ChevronRight className="w-5 h-5" /> : 
              <ChevronLeft className="w-5 h-5" />
            }
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {/* Create Button */}
          <div className="mb-6">
            <button
              onClick={onCreateNote}
              className={`
                w-full btn-primary 
                flex items-center justify-center gap-2 
                py-3 shadow-md hover:shadow-lg 
                transition-all duration-200
                ${collapsed ? 'px-3' : 'px-4'}
              `}
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>Create New Note</span>}
            </button>
          </div>

          {/* Navigation Section */}
          <div className="space-y-1">
            {!collapsed && (
              <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-4 mb-2">
                Navigation
              </p>
            )}
            <SidebarButton
              icon={<LayoutGrid />}
              label="All Notes"
              onClick={() => onViewChange("all")}
              isActive={currentView === "all" && !activeSmartCollection}
            />
            <SidebarButton
              icon={<Star />}
              label="Favorites"
              onClick={() => onViewChange("favorites")}
              isActive={currentView === "favorites"}
            />
            <SidebarButton
              icon={<Trash2 />}
              label="Deleted"
              onClick={() => onViewChange("deleted")}
              isActive={currentView === "deleted"}
            />
          </div>

          {/* Collections Section */}
          <div className="pt-6 space-y-1">
            {!collapsed && (
              <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-4 mb-2">
                Collections
              </p>
            )}
            <button
              onClick={() => !collapsed && setShowSmartCollections(!showSmartCollections)}
              className={`
                flex items-center w-full rounded-xl 
                transition-all duration-200 ease-in-out 
                font-medium text-sidebar-foreground/70 
                hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground
                ${collapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
              `}
            >
              <Bookmark className={`w-5 h-5 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">Smart Collections</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                      showSmartCollections ? "rotate-90" : ""
                    }`}
                  />
                </>
              )}
            </button>
            {showSmartCollections && !collapsed && (
              <div className="pl-4 pr-2 space-y-0.5 mt-1 animate-fade-in-up">
                {smartCollections.map((collection) => (
                  <SmartCollectionButton
                    key={collection.id}
                    collection={collection}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tools Section */}
          <div className="pt-6 space-y-1">
            {!collapsed && (
              <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-4 mb-2">
                Tools
              </p>
            )}
            <SidebarButton
              icon={<BookOpenText />}
              label="Daily Prompt"
              onClick={onShowDailyPrompt}
              isSecondary
            />
            <SidebarButton
              icon={<Timer />}
              label="Pomodoro Timer"
              onClick={onShowPomodoro}
              isSecondary
            />
            <SidebarButton
              icon={<Map />}
              label="Mind Map"
              onClick={onShowMindMap}
              isSecondary
            />
          </div>
        </nav>

        {/* Footer */}
        <div className="pt-6 mt-auto space-y-1 border-t border-sidebar-border">
          <SidebarButton
  icon={<Settings />}
  label="Settings"
  onClick={() => setShowSettings(true)}
  isSecondary
/>
        </div>
      </div>
      {showSettings && (
  <SettingsModal
    onClose={() => setShowSettings(false)}
    theme={theme}
    toggleTheme={toggleTheme}
  />
)}
    </aside>
  );
};

export default Sidebar;