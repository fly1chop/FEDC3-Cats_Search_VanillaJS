const storage = window.sessionStorage;

export const setItem = (key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch(e) {
    console.error(e)
  }
}

export const getItem = (key, defaultValue) => {
  try {
    const storedValue = storage.getItem(key);

    return storedValue ? JSON.parse(storedValue) : defaultValue

  } catch(e) {
    console.error(e)
    return defaultValue
  }
}
export const removeItem = (key) => {
  storage.removeItem(key);
}

export default {
  getItem,
  setItem
}