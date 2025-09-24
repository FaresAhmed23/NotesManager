export const groupNotesByTime = (notes) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const groups = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    "This Month": [],
    Older: [],
  }

  notes.forEach((note) => {
    const noteDate = new Date(note.createdAt)

    if (noteDate >= today) {
      groups["Today"].push(note)
    } else if (noteDate >= yesterday) {
      groups["Yesterday"].push(note)
    } else if (noteDate >= thisWeek) {
      groups["This Week"].push(note)
    } else if (noteDate >= thisMonth) {
      groups["This Month"].push(note)
    } else {
      groups["Older"].push(note)
    }
  })

  // Remove empty groups
  Object.keys(groups).forEach((key) => {
    if (groups[key].length === 0) {
      delete groups[key]
    }
  })

  return groups
}
