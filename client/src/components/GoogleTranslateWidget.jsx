import React, { useEffect, useState } from 'react';
import { Languages, ChevronDown, Globe } from 'lucide-react';

const languageList = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
];

export default function GoogleTranslateWidget({ theme = 'dark' }) {
  const [selectedLang, setSelectedLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const isLight = theme === 'light';

  useEffect(() => {
    // 1. Initialize hidden Google Translate Element if not loaded
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,hi,mr,gu,bn,ta,te,kn,ml,pa,fr,de,es,ja',
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            'google_translate_element_hidden'
          );
        }
      };

      // Add script tag dynamically
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.type = 'text/javascript';
        script.src =
          '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    }

    // Check existing language cookie or localStorage
    const savedLang = localStorage.getItem('sih_selected_lang');
    if (savedLang) {
      setSelectedLang(savedLang);
      window.__sih_current_lang = savedLang;
    } else {
      const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
      if (match && match[1]) {
        const parts = match[1].split('/');
        const code = parts[parts.length - 1];
        if (code) {
          setSelectedLang(code);
          window.__sih_current_lang = code;
          localStorage.setItem('sih_selected_lang', code);
        }
      }
    }
  }, []);

  const changeLanguage = (langCode) => {
    setSelectedLang(langCode);
    window.__sih_current_lang = langCode;
    localStorage.setItem('sih_selected_lang', langCode);
    window.dispatchEvent(new CustomEvent('sih-language-changed', { detail: { lang: langCode } }));
    setIsOpen(false);

    // Set Google Translate cookie directly
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${domain};`;

    // Trigger select element inside hidden google translate box if available
    const selectElem = document.querySelector(
      '#google_translate_element_hidden select.goog-te-combo'
    );
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event('change'));
    } else {
      // Reload page to apply google translation cleanly
      window.location.reload();
    }
  };

  const currentLangObj =
    languageList.find((l) => l.code === selectedLang) || languageList[0];

  return (
    <div className="relative inline-block text-left notranslate">
      {/* Hidden container where Google Translate injects its engine */}
      <div id="google_translate_element_hidden" className="hidden" />

      {/* Styled Custom Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all duration-300 shadow-sm active:scale-95 text-xs font-bold ${
          isLight
            ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-amber-500'
            : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-amber-500/50'
        }`}
        title="Change Language (Google Translate)"
      >
        <Languages className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="truncate max-w-[80px] sm:max-w-none">
          {currentLangObj.native}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-500' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-72 overflow-y-auto custom-scrollbar ${
              isLight
                ? 'bg-white border-slate-200 shadow-slate-300/50'
                : 'bg-slate-900 border-slate-800 shadow-black/80'
            }`}
          >
            <div className="px-2.5 py-1.5 border-b border-slate-800/40 mb-1 flex items-center justify-between text-[10px] font-bold text-amber-500 uppercase tracking-wider">
              <span>Select Language</span>
              <Globe className="w-3 h-3" />
            </div>

            <div className="space-y-0.5">
              {languageList.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    selectedLang === lang.code
                      ? isLight
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                      : isLight
                      ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="font-medium">{lang.native}</span>
                  <span
                    className={`text-[10px] uppercase font-mono ${
                      selectedLang === lang.code
                        ? 'text-slate-950/80 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    {lang.code}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
