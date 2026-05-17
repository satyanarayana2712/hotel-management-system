/**
 * Get user-specific storage key
 * @param {string} baseKey - The base key name
 * @returns {string} - User-specific key
 */
export const getUserStorageKey = (baseKey) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user?.id || 'anonymous'
  return `${baseKey}_${userId}`
}

/**
 * Set user-specific item in localStorage
 * @param {string} key - The base key name
 * @param {*} value - The value to store
 */
export const setUserStorage = (key, value) => {
  const userKey = getUserStorageKey(key)
  localStorage.setItem(userKey, JSON.stringify(value))
}

/**
 * Get user-specific item from localStorage
 * @param {string} key - The base key name
 * @param {*} defaultValue - Default value if not found
 * @returns {*} - The stored value or default
 */
export const getUserStorage = (key, defaultValue = null) => {
  const userKey = getUserStorageKey(key)
  const item = localStorage.getItem(userKey)
  return item ? JSON.parse(item) : defaultValue
}

/**
 * Remove user-specific item from localStorage
 * @param {string} key - The base key name
 */
export const removeUserStorage = (key) => {
  const userKey = getUserStorageKey(key)
  localStorage.removeItem(userKey)
}

/**
 * Clear all user-specific storage on logout
 */
export const clearUserStorage = () => {
  const keys = Object.keys(localStorage)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user?.id || 'anonymous'

  keys.forEach(key => {
    if (key.endsWith(`_${userId}`)) {
      localStorage.removeItem(key)
    }
  })
}
