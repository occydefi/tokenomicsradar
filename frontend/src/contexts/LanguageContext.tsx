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

  const buttonStyle = (active: boolean) => ({
    padding: '6px 10px',
    borderRadius: '6px',
    backgroundColor: active ? 'rgba(57,211,83,0.15)' : 'rgba(57,211,83,0.04)',
    border: active ? '1.5px solid rgba(57,211,83,0.5)' : '1px solid rgba(57,211,83,0.15)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    opacity: active ? 1 : 0.5,
    transform: active ? 'scale(1.05)' : 'scale(1)',
    boxShadow: active ? '0 0 12px rgba(57,211,83,0.25)' : 'none',
  });

  return (
    <div
      className="flex items-center gap-1.5"
      style={{
        backgroundColor: 'rgba(15,26,15,0.6)',
        padding: '3px',
        borderRadius: '8px',
        border: '1px solid rgba(57,211,83,0.2)',
      }}
    >
      <button
        onClick={() => setLang('pt')}
        style={buttonStyle(lang === 'pt')}
        title="Português"
      >
        <span style={{ fontSize: '18px', lineHeight: 1 }}>🇧🇷</span>
      </button>
      <button
        onClick={() => setLang('en')}
        style={buttonStyle(lang === 'en')}
        title="English"
      >
        <span style={{ fontSize: '18px', lineHeight: 1 }}>🇺🇸</span>
      </button>
    </div>
  );
}
