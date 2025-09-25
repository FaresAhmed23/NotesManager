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
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

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
  onShowSettings,
  isMobile,
  isOpen,
  onClose,
}) => {
  const [showSmartCollections, setShowSmartCollections] = useState(false);

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile && !collapsed) {
      onToggleCollapse();
    }
  }, [isMobile]);

  const SidebarButton = ({
    icon,
    label,
    onClick,
    isActive,
    isSecondary = false,
    badge = null,
  }) => (
    <button
      onClick={() => {
        onClick();
        if (isMobile) onClose?.();
      }}
      className={`sidebar-btn flex items-center w-full rounded-xl transition-all duration-200 ease-in-out font-medium group relative overflow-hidden
        ${collapsed ? 'px-2 py-2 sm:px-3 sm:py-3 justify-center' : 'px-3 py-2.5 sm:px-4 sm:py-3'}
        ${
          isActive
            ? "bg-primary text-primary-foreground shadow-md before:absolute before:inset-0 before:bg-white/10"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }
        ${isSecondary ? "text-sm" : ""}
        ${isMobile ? "touch-manipulation" : ""}`}
      title={collapsed ? label : ""}
    >
      <div
        className={`flex items-center justify-center flex-shrink-0 transition-all duration-200
          ${collapsed ? "" : "mr-2 sm:mr-3"}`}
      >
        {React.cloneElement(icon, { 
          className: `${collapsed ? 'w-5 h-5' : 'w-5 h-5'} transition-all duration-200` 
        })}
      </div>
      {!collapsed && (
        <>
          <span className="flex-1 text-left truncate text-sm sm:text-base">{label}</span>
          {badge && (
            <span className="ml-2 bg-primary/20 text-primary text-xs font-semibold px-1.5 py-0.5 sm:px-2 rounded-full flex-shrink-0">
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
        onClick={() => {
          onSmartCollectionChange(collection.id);
          if (isMobile) onClose?.();
        }}
        className={`flex items-center w-full rounded-lg transition-all duration-200 text-sm text-left
        ${collapsed ? 'px-2 py-2 sm:px-3 sm:py-2.5 justify-center' : 'py-2 px-3 sm:py-2.5 sm:px-4'}
        ${isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" 
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        }
        ${isMobile ? "touch-manipulation" : ""}`}
        title={collapsed ? collection.label : ""}
      >
        <Bookmark className={`w-4 h-4 flex-shrink-0 ${collapsed ? '' : 'mr-2 sm:mr-3'}`} />
        {!collapsed && <span className="truncate text-xs sm:text-sm">{collection.label}</span>}
      </button>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={`
          ${collapsed ? 'w-16 sm:w-20 lg:w-[5.9rem]' : 'w-64 sm:w-72 lg:w-80'} 
          bg-sidebar 
          border-r border-sidebar-border 
          flex flex-col 
          transition-all duration-300 ease-in-out 
          relative
          shadow-lg
          h-full
          overflow-hidden
          ${isMobile ? `
            fixed left-0 top-0 z-50
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ` : ''}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header - Fixed height */}
          <div className="p-3 sm:p-4 lg:p-6 flex-shrink-0">
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
              {!collapsed && (
                <div className="animate-fade-in-up">
                  <h2 className="text-base sm:text-lg font-semibold text-sidebar-foreground mb-0.5 sm:mb-1">Workspace</h2>
                  <p className="text-xs text-sidebar-foreground/60 hidden sm:block">Organize your thoughts</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                {isMobile && !collapsed && (
                  <button
                    onClick={onClose}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-all duration-200 lg:hidden"
                    aria-label="Close sidebar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={onToggleCollapse}
                  className={`
                    p-1.5 sm:p-2 rounded-lg 
                    hover:bg-sidebar-accent 
                    text-sidebar-foreground 
                    transition-all duration-200
                    ${collapsed ? 'mx-auto' : ''}
                    ${isMobile ? 'hidden sm:block' : ''}
                  `}
                  aria-label="Toggle sidebar"
                >
                  {collapsed ? 
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Main Navigation - Scrollable area */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 sm:px-4 lg:px-6">
            {/* Create Button */}
            <div className="mb-4 sm:mb-6">
              <button
                onClick={() => {
                  onCreateNote();
                  if (isMobile) onClose?.();
                }}
                className={`
                  w-full btn-primary 
                  flex items-center justify-center gap-2 
                  py-2.5 sm:py-3 shadow-md hover:shadow-lg 
                  transition-all duration-200
                  text-sm sm:text-base
                  ${collapsed ? 'px-2 sm:px-3' : 'px-3 sm:px-4'}
                `}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                {!collapsed && <span>Create</span>}
              </button>
            </div>

            {/* Navigation Section */}
            <div className="space-y-0.5 sm:space-y-1">
              {!collapsed && (
                <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-2 sm:px-4 mb-1.5 sm:mb-2">
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
            <div className="pt-4 sm:pt-6 space-y-0.5 sm:space-y-1">
              {!collapsed && (
                <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-2 sm:px-4 mb-1.5 sm:mb-2">
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
                  ${collapsed ? 'px-2 py-2 sm:px-3 sm:py-3 justify-center' : 'px-3 py-2.5 sm:px-4 sm:py-3'}
                  text-sm sm:text-base
                `}
              >
                <Bookmark className={`w-5 h-5 flex-shrink-0 ${collapsed ? '' : 'mr-2 sm:mr-3'}`} />
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
                <div className="pl-2 sm:pl-4 pr-2 space-y-0.5 mt-1 animate-fade-in-up">
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
            <div className="pt-4 sm:pt-6 space-y-0.5 sm:space-y-1 pb-4 sm:pb-6">
              {!collapsed && (
                <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-2 sm:px-4 mb-1.5 sm:mb-2">
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
                label="Pomodoro"
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

          {/* Footer - Fixed height */}
          <div className="p-3 sm:p-4 lg:p-6 border-t border-sidebar-border flex-shrink-0">
            <SidebarButton
              icon={<Settings />}
              label="Settings"
              onClick={onShowSettings}
              isSecondary
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;