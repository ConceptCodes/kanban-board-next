import { useState } from "react";

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item =
      typeof window !== "undefined" ? localStorage?.getItem(key) : null;
    return item ? (JSON.parse(item) as T) : initialValue;
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    typeof window !== "undefined" &&
      localStorage?.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
};

export const getFromLocalStorage = <T>(key: string): T | null => {
  const item =
    typeof window !== "undefined" ? localStorage?.getItem(key) : null;
  return item ? (JSON.parse(item) as T) : null;
};
