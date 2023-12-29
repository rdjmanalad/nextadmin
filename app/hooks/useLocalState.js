import { useEffect, useState } from "react";

export default function useLocalState(key, initial) {
  const [value, setValue] = useState(() => {
    if (typeof window !== undefined && window.localStorage) {
      const saved = window.localStorage.getItem(key);
      if (saved) {
        // return JSON.parse(saved);
        return saved;
        //return initial;
      }
    }
    return initial;
  });

  useEffect(() => {
    if (window.localStorage) {
      //window.localStorage.setItem(key, JSON.stringify(value));
      window.localStorage.setItem(key, value);
    }
  }, [value]);

  return [value, setValue];
}