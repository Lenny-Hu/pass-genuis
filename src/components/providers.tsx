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

// Define types for translations
type Translations = typeof zh;
type Locale = 'en' | 'zh';

// Define the shape of the context
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Translations) => string;
}

// Create the context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Custom hook to use the context
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Helper to get cookie on the client side
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

// Helper to set cookie on the client side
function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

// The main provider component
export function Providers({ children }: { children: ReactNode }) {
  // Set initial locale to 'zh' to ensure server and client initial render match.
  const [locale, setLocaleState] = useState<Locale>('zh');

  useEffect(() => {
    // On the client, check for a saved cookie and update the locale.
    const savedLocale = getCookie('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh')) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie('locale', newLocale, 365);
  }, []);

  const t = useCallback(
    (key: keyof Translations) => {
      const translations: Record<Locale, Translations> = { en, zh };
      return translations[locale][key] || String(key);
    },
    [locale]
  );

  const contextValue = { locale, setLocale, t };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
      <Toaster />
      <SWRegister />
    </I18nContext.Provider>
  );
}
