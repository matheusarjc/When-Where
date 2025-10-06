import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "./useDebounce";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceMs: number = 500
): [T, (value: T) => void] {
  // Estado para o valor atual - lazy initialization
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Estado para o valor pendente de ser salvo
  const [pendingValue, setPendingValue] = useState<T>(storedValue);

  // Debounce do valor pendente
  const debouncedValue = useDebounce(pendingValue, debounceMs);

  // Ref para evitar re-criação da função de cleanup
  const cleanupRef = useRef<(() => void) | null>(null);

  // Salvar no localStorage quando o valor debounced mudar
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Só salva se o valor mudou
      if (JSON.stringify(debouncedValue) !== JSON.stringify(storedValue)) {
        window.localStorage.setItem(key, JSON.stringify(debouncedValue));
        setStoredValue(debouncedValue);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [debouncedValue, key, storedValue]);

  // Função para atualizar o valor
  const setValue = useCallback((value: T) => {
    setPendingValue(value);
  }, []);

  // Sincronizar com mudanças externas no localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
          setPendingValue(newValue);
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Armazenar função de cleanup no ref
    cleanupRef.current = () => {
      window.removeEventListener("storage", handleStorageChange);
    };

    return cleanupRef.current;
  }, [key]);

  return [storedValue, setValue];
}
