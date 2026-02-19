import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { translations } from '../i18n/translations';
import type { Lang } from '../i18n/translations';

type Translations = typeof translations.pt;

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'pt',
  setLang: () => {},
  t: translations.pt,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default: always PT (Brazilian Portuguese) — this is a Brazilian product
  const [lang, setLang] = useState<Lang>('pt');

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] as Translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LangToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLang('pt')}
        className="px-2 py-1.5 sm:py-2 rounded-lg transition-all"
        style={{
          backgroundColor: lang === 'pt' ? 'rgba(57,211,83,0.15)' : 'rgba(57,211,83,0.04)',
          border: lang === 'pt' ? '1.5px solid rgba(57,211,83,0.5)' : '1px solid rgba(57,211,83,0.15)',
          opacity: lang === 'pt' ? 1 : 0.5,
          boxShadow: lang === 'pt' ? '0 0 12px rgba(57,211,83,0.25)' : 'none',
        }}
        title="Português"
      >
        <span style={{ fontSize: '16px', lineHeight: 1 }}>🇧🇷</span>
      </button>
      <button
        onClick={() => setLang('en')}
        className="px-2 py-1.5 sm:py-2 rounded-lg transition-all"
        style={{
          backgroundColor: lang === 'en' ? 'rgba(57,211,83,0.15)' : 'rgba(57,211,83,0.04)',
          border: lang === 'en' ? '1.5px solid rgba(57,211,83,0.5)' : '1px solid rgba(57,211,83,0.15)',
          opacity: lang === 'en' ? 1 : 0.5,
          boxShadow: lang === 'en' ? '0 0 12px rgba(57,211,83,0.25)' : 'none',
        }}
        title="English"
      >
        <span style={{ fontSize: '16px', lineHeight: 1 }}>🇺🇸</span>
      </button>
    </div>
  );
}
