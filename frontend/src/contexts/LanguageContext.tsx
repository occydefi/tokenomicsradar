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
  // Default: detect browser language, fallback to PT
  const browserLang = navigator.language?.startsWith('en') ? 'en' : 'pt';
  const [lang, setLang] = useState<Lang>(browserLang);

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
    <button
      onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all hover:opacity-90 font-mono text-sm font-bold"
      style={{
        backgroundColor: 'rgba(57,211,83,0.08)',
        border: '1px solid rgba(57,211,83,0.25)',
        color: '#39d353',
      }}
      title={lang === 'pt' ? 'Switch to English' : 'Mudar para Português'}
    >
      <span style={{ fontSize: '18px', lineHeight: 1 }}>
        {lang === 'pt' ? '🇧🇷' : '🇺🇸'}
      </span>
      <span style={{ fontSize: '11px', letterSpacing: '1px' }}>
        {lang === 'pt' ? 'PT' : 'EN'}
      </span>
    </button>
  );
}
