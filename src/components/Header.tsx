import React from 'react';
import { Activity, Globe, Database, Cpu, FileCode2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { translations } from '../locales/translations.js';

interface HeaderProps {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  activeTab: 'chat' | 'directory' | 'architecture';
  setActiveTab: (tab: 'chat' | 'directory' | 'architecture') => void;
  activeToolExecutionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  activeTab,
  setActiveTab,
  activeToolExecutionsCount
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1 sm:gap-4">
          {/* Brand Logo & Heading */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                {t.appTitle}
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                Decision Assistant
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-0.5 sm:gap-1.5">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 shrink-0 hidden xs:inline" />
              <span>{t.consultationTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                activeTab === 'directory'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Database className="w-3.5 h-3.5 shrink-0 hidden xs:inline" />
              <span>{t.directoryTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 shrink-0 hidden xs:inline" />
              <span className="hidden sm:inline">{t.architectureTab}</span>
              <span className="sm:hidden">Docs</span>
            </button>
          </nav>

          {/* Right actions: Language toggle */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-md border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs whitespace-nowrap"
              title="Toggle English / Arabic"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="text-[11px] sm:text-xs">{language === 'en' ? 'عربي' : 'EN'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
