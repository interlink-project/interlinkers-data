
export function comparePrerequisites(a, b) {
    if (a.prerequisites_ids.length === 0) {
      return -1
    }
    return !a.prerequisites_ids.includes(b.id) ? 1 : 0
  }
  
  