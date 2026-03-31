import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

export const LANGUAGE_OPTIONS = [
  { code: 'TR', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'AR', label: 'العربية', flag: '🇸🇦' },
];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'TR';
    return window.localStorage.getItem('amazonLanguage') || 'TR';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('amazonLanguage', language);
    }
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
