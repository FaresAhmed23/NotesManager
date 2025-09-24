"use client";

import { Search, X } from "lucide-react";
import { useState, useRef } from "react";

const SearchBar = ({ searchQuery, onSearchChange, placeholder = "Search notes..." }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleClear = () => {
    onSearchChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative search-bar-container">
      <div 
        className={`relative flex items-center bg-muted rounded-xl border-2 transition-all duration-200 ${
          isFocused ? 'border-primary shadow-md' : 'border-transparent'
        }`}
      >
        <div className="pl-4 pr-2">
          <Search className={`w-5 h-5 transition-colors duration-200 ${
            isFocused ? 'text-primary' : 'text-muted-foreground'
          }`} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-3 pr-2 text-foreground placeholder-muted-foreground outline-none transition-all duration-200"
        />
        
        {searchQuery && (
          <button
            onClick={handleClear}
            className="p-2 mr-2 rounded-lg hover:bg-muted transition-colors duration-200 group"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        )}
      </div>
      
      {searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-muted-foreground animate-fade-in-up">
          Searching for "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;