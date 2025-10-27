import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import styles from './LanguageSwitcher.module.css';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
];

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng);
    };
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <div className={styles.languageSwitcher} ref={dropdownRef}>
      <button
        className={`${styles.languageButton} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('header.selectLanguage')}
      >
        <span className={styles.flag}>{currentLanguage.flag}</span>
        <span className={styles.langCode}>{currentLanguage.code.toUpperCase()}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}>▼</span>
      </button>

      <div className={`${styles.languageDropdown} ${isOpen ? styles.open : ''}`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`${styles.languageOption} ${currentLang === lang.code ? styles.active : ''}`}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className={styles.flag}>{lang.flag}</span>
            <span className={styles.langName}>{lang.name}</span>
            {currentLang === lang.code && <span className={styles.checkmark}>✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}