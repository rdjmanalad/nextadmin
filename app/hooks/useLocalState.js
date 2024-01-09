import { useState, useEffect } from "react";

const useLocalState = (key, initialValue) => {
  // Check for window to ensure you are on the client side
  const isClient = typeof window !== "undefined";

  // Get the stored value from localStorage or use the initialValue
  const storedValue = isClient
    ? localStorage.getItem(key) || initialValue
    : initialValue;

  // Create state to hold the current value
  const [value, setValue] = useState(storedValue);

  // Update the value in useEffect to avoid issues during server-side rendering
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(key, value);
    }
  }, [key, value, isClient]);

  return [value, setValue];
};

export default useLocalState;
