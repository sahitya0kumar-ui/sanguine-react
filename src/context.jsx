import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { KEYS, read, write, seedIfEmpty } from './lib/storage';
import { useStored } from './lib/hooks';

seedIfEmpty();

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const user = useStored(KEYS.USER);
  const prefs = useStored(KEYS.PREFS) || {};
  const [toasts, setToasts] = useState([]);

  // Dark mode lives on <body> (the existing CSS keys off body.dark) and persists in localStorage.
  useEffect(() => { document.body.classList.toggle('dark', !!prefs.dark); }, [prefs.dark]);
  const toggleDark = () => write(KEYS.PREFS, { ...read(KEYS.PREFS), dark: !prefs.dark });

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type, leaving: false }]);
    setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x))), 3200);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const login = (u) => write(KEYS.USER, u);
  const logout = () => write(KEYS.USER, null);

  return (
    <Ctx.Provider value={{ user, dark: !!prefs.dark, toggleDark, toast, toasts, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}
