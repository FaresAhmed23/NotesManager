"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./useAuth"

export const useNotes = () => {
  const [notes, setNotes] = useState([])
  const { user } = useAuth()

  const getStorageKey = () => {
    return user ? `notes_${user.id}` : 'notes_guest'
  }

  // Load notes from localStorage on mount or user change
  useEffect(() => {
    const storageKey = getStorageKey()
    const savedNotes = localStorage.getItem(storageKey)
    
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes)
        setNotes(parsedNotes)
      } catch (error) {
        console.error('Error parsing saved notes:', error)
        setNotes([])
      }
    } else {
      // Initialize with sample notes for new users
      if (!user) {
        const sampleNotes = [
          {
            id: "1",
            title: "Welcome to Notes",
            content: "Start creating your notes! Click the 'Create New Note' button to begin.",
            tags: ["welcome", "getting-started"],
            isFavorite: true,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ]
        setNotes(sampleNotes)
      } else {
        setNotes([])
      }
    }
  }, [user])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0 || localStorage.getItem(getStorageKey())) {
      localStorage.setItem(getStorageKey(), JSON.stringify(notes))
    }
  }, [notes])

  const addNote = (noteData) => {
    const newNote = {
      id: Date.now().toString(),
      ...noteData,
      isFavorite: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user?.id || 'guest'
    }

    setNotes((prev) => [newNote, ...prev])
    return newNote
  }

  const toggleFavorite = (noteId) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, isFavorite: !note.isFavorite, updatedAt: new Date().toISOString() } : note,
      ),
    )
  }

  const deleteNote = (noteId) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, isDeleted: true, updatedAt: new Date().toISOString() } : note,
      ),
    )
  }

  const restoreNote = (noteId) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, isDeleted: false, updatedAt: new Date().toISOString() } : note,
      ),
    )
  }

  const permanentlyDeleteNote = (noteId) => {
    setNotes((prev) => prev.filter(note => note.id !== noteId))
  }

  const updateNote = (noteId, updates) => {
    setNotes((prev) =>
      prev.map((note) => 
        note.id === noteId 
          ? { ...note, ...updates, updatedAt: new Date().toISOString() } 
          : note
      ),
    )
  }

  const searchNotes = (query) => {
    if (!query.trim()) return notes

    return notes.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
  }

  const getStats = () => {
    return {
      total: notes.filter(n => !n.isDeleted).length,
      favorites: notes.filter(n => n.isFavorite && !n.isDeleted).length,
      deleted: notes.filter(n => n.isDeleted).length,
      tags: [...new Set(notes.flatMap(n => n.tags))].length
    }
  }

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `notes-backup-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importNotes = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedNotes = JSON.parse(e.target.result)
          // Validate the structure
          if (Array.isArray(importedNotes)) {
            const processedNotes = importedNotes.map(note => ({
              ...note,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              userId: user?.id || 'guest',
              importedAt: new Date().toISOString()
            }))
            setNotes(prev => [...prev, ...processedNotes])
            resolve(processedNotes.length)
          } else {
            reject(new Error('Invalid file format'))
          }
        } catch (error) {
          reject(error)
        }
      }
      reader.readAsText(file)
    })
  }

  return {
    notes,
    addNote,
    toggleFavorite,
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
    updateNote,
    searchNotes,
    getStats,
    exportNotes,
    importNotes
  }
}