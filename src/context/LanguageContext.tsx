import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../data/translations';
import { TRANSLATIONS } from '../data/translations';
import { getStoredLanguage, saveStoredLanguage } from '../services/storage';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => getStoredLanguage());

  useEffect(() => {
    saveStoredLanguage(language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

<<<<<<< HEAD
  const toggleLanguage = () => {
    // No-op for expanded languages. Use setLanguage with LanguageSelector.
  };

=======
>>>>>>> 35d6887 (feat: Refactor Login page and add Header, Sidebar, LanguageSelector, and LocationSelector components)
  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
