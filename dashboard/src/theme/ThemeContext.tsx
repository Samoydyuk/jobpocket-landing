import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'auto',
  isDark: false,
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('jp_theme') as ThemeMode) || 'auto';
  });

  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isDark = mode === 'dark' || (mode === 'auto' && systemDark);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      isDark ? '#0B0F17' : '#F7F8FA',
    );
  }, [isDark]);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    localStorage.setItem('jp_theme', m);
  };

  return (
    <ThemeContext.Provider value={{ mode, isDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
