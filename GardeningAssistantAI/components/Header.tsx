import React from 'react';
import { LeafIcon } from './icons';
import { Language } from '../types';
import { t } from '../i18n';

interface HeaderProps {
    language: Language;
    onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <LeafIcon className="w-8 h-8 text-brand-green" />
            <h1 className="text-2xl font-bold text-brand-text tracking-tight">
              {t('headerTitle', language)}
            </h1>
        </div>
        <button
            onClick={() => onLanguageChange(language === 'en' ? 'es' : 'en')}
            className="font-semibold text-brand-green-dark hover:bg-brand-green-light px-3 py-1 rounded-md transition-colors"
            aria-label={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
        >
            {t('languageSwitch', language)}
        </button>
      </div>
    </header>
  );
};
