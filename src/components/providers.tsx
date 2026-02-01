'use client';

import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Toaster } from '@/components/ui/toaster';
import { SWRegister } from '@/components/sw-register';
import en from '@/locales/en';
import zh from '@/locales/zh';
import { type ThemeName, themes as themeConfig } from '@/lib/themes';

// --- I18n ---
type Translations = typeof zh;
type Locale = 'en' | 'zh';
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Translations) => string;
}
const I18nContext = createContext<I18nContextType | undefined>(undefined);
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within a I18nProvider');
  }
  return context;
}

// --- Theme ---
interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// The main provider component
export function Providers({ children }: { children: ReactNode }) {
  // I18n state
  const [locale, setLocaleState] = useState<Locale>('zh');
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh')) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  }, []);

  const t = useCallback(
    (key: keyof Translations) => {
      const translations: Record<Locale, Translations> = { en, zh };
      return translations[locale][key] || String(key);
    },
    [locale]
  );
  const i18nContextValue = { locale, setLocale, t };

  // Theme state
  const [theme, setThemeState] = useState<ThemeName>('default');
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    const isValidTheme = themeConfig.some((t) => t.name === savedTheme);
    if (savedTheme && isValidTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);
  const themeContextValue = { theme, setTheme };

  return (
    <I18nContext.Provider value={i18nContextValue}>
      <ThemeContext.Provider value={themeContextValue}>
        {children}
        <Toaster />
        <SWRegister />
      </ThemeContext.Provider>
    </I18nContext.Provider>
  );
}
