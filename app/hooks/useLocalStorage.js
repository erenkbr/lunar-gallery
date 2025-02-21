import { useState } from "react";

export function useLocalStorage(key, initialValue = null) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
    setStoredValue(value);
  };

  const removeValue = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
    setStoredValue(null);
  };

  return [storedValue, setValue, removeValue];
}
