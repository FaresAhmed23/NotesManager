"use client";

import { useState, useEffect } from "react";
import { X, Hash, Type, FileText, Plus, Loader2 } from "lucide-react";

const CreateNoteForm = ({ note, onSubmit, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [tagsList, setTagsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setTagsList(note.tags || []);
      setTags(note.tags?.join(", ") || "");
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!content.trim()) newErrors.content = "Content is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="bg-card rounded-2xl w-full max-w-2xl shadow-xl border border-border animate-scale-in-smooth">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {note ? "Edit Note" : "Create New Note"}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Type className="w-4 h-4 text-muted-foreground" />
              Title
            </label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              className={`w-full px-4 py-3 bg-muted border-2 rounded-xl transition-all duration-200 placeholder-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none ${
                errors.title ? "border-destructive" : "border-transparent"
              }`}
              placeholder="Enter a memorable title..."
              autoFocus
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
              rows={8}
              className={`w-full px-4 py-3 bg-muted border-2 rounded-xl transition-all duration-200 placeholder-muted-foreground resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none ${
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
                  className="tag flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive transition-colors"
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
                className="flex-1 px-4 py-3 bg-muted border-2 border-transparent rounded-xl transition-all duration-200 placeholder-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                placeholder="Add tags..."
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary px-4 py-3"
                disabled={!currentTag.trim()}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary py-3"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{note ? "Update Note" : "Create Note"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoteForm;