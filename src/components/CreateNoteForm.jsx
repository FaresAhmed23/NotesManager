"use client";

import { useState, useEffect, useRef } from "react";
import { X, Hash, Type, FileText, Plus, Loader2 } from "lucide-react";

const CreateNoteForm = ({ note, onSubmit, onClose, initialData }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [tagsList, setTagsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const formRef = useRef(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Use note prop if available, otherwise use initialData
    const noteData = note || initialData;
    if (noteData) {
      setTitle(noteData.title || "");
      setContent(noteData.content || "");
      setTagsList(noteData.tags || []);
      setTags(noteData.tags?.join(", ") || "");
    }

    // Focus title input after a short delay
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100);
  }, [note, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!content.trim()) newErrors.content = "Content is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      if (newErrors.title) {
        titleInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags: tagsList
      });
      setIsLoading(false);
    }, 500);
  };

  const addTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() && !tagsList.includes(currentTag.trim())) {
      setTagsList([...tagsList, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTagsList(tagsList.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.name === "tag") {
      e.preventDefault();
      addTag(e);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, isLoading]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in-up"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
        <div 
          ref={formRef}
          className="bg-card rounded-t-2xl sm:rounded-2xl w-full max-w-2xl shadow-xl border border-border animate-scale-in-smooth pointer-events-auto max-h-[90vh] sm:max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-border/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {note ? "Edit Note" : "Create New Note"}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {note ? "Make changes to your note" : "Start writing your thoughts"}
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

          {/* Form - Scrollable */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Title Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Type className="w-4 h-4 text-muted-foreground" />
                  Title
                </label>
                <input
                  ref={titleInputRef}
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: "" });
                  }}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-muted border-2 rounded-xl transition-all duration-200 placeholder-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base ${
                    errors.title ? "border-destructive" : "border-transparent"
                  }`}
                  placeholder="Enter a memorable title..."
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1 animate-fade-in-up">{errors.title}</p>
                )}
              </div>

              {/* Content Textarea */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content) setErrors({ ...errors, content: "" });
                  }}
                  rows={isMobile ? 6 : 8}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-muted border-2 rounded-xl transition-all duration-200 placeholder-muted-foreground resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base ${
                    errors.content ? "border-destructive" : "border-transparent"
                  }`}
                  placeholder="Write your thoughts here..."
                />
                {errors.content && (
                  <p className="text-sm text-destructive mt-1 animate-fade-in-up">{errors.content}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {content.length} characters
                </p>
              </div>

              {/* Tags Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tagsList.map((tag, index) => (
                    <span
                      key={index}
                      className="tag flex items-center gap-1 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive transition-colors p-1"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="tag"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-muted border-2 border-transparent rounded-xl transition-all duration-200 placeholder-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base"
                    placeholder="Add tags..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn-secondary px-3 sm:px-4 py-2.5 sm:py-3 min-w-[44px]"
                    disabled={!currentTag.trim()}
                    aria-label="Add tag"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to add a tag
                </p>
              </div>
            </div>
          </form>

          {/* Action Buttons - Fixed at bottom */}
          <div className="p-4 sm:p-6 border-t border-border/50 flex-shrink-0 bg-card">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary py-2.5 sm:py-3 text-sm sm:text-base"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 btn-primary py-2.5 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{note ? "Update Note" : "Create Note"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNoteForm;