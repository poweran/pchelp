import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from './Link';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Header.module.css';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // console.log('[Header] Компонент перерендерен');

  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <span>💻</span>
          <span>PCHelp</span>
        </div>
        <nav className={styles.headerNav}>
          <ul className={styles.headerNavList}>
            <li>
              <Link to="/" className={styles.headerNavLink} activeClassName={styles.active}>
                {t('header.home')}
              </Link>
            </li>
            <li>
              <Link to="/services" className={styles.headerNavLink} activeClassName={styles.active}>
                {t('header.services')}
              </Link>
            </li>
            <li>
              <Link to="/tickets" className={styles.headerNavLink} activeClassName={styles.active}>
                {t('header.tickets')}
              </Link>
            </li>
            <li>
              <Link to="/knowledge" className={styles.headerNavLink} activeClassName={styles.active}>
                {t('header.knowledge')}
              </Link>
            </li>
            <li>
              <Link to="/pricing" className={styles.headerNavLink} activeClassName={styles.active}>
                {t('header.pricing')}
              </Link>
            </li>
            <li>
              <Link to="/contacts" className={styles.headerNavLink} activeClassName={styles.active}>
                {t('header.contacts')}
              </Link>
            </li>
          </ul>

          <div className={styles.headerActions}>
            <LanguageSwitcher />

            <button
              ref={buttonRef}
              className={`${styles.headerMobileMenuButton} ${isMenuOpen ? styles.open : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={styles.headerMobileMenuIcon}></span>
            </button>
          </div>
        </nav>

        <div ref={menuRef} className={`${styles.headerMobileMenu} ${isMenuOpen ? styles.open : ''}`}>
          <ul className={styles.headerMobileNavList}>
            <li>
              <Link
                to="/"
                className={styles.headerMobileNavLink}
                activeClassName={styles.active}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.home')}
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className={styles.headerMobileNavLink}
                activeClassName={styles.active}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.services')}
              </Link>
            </li>
            <li>
              <Link
                to="/tickets"
                className={styles.headerMobileNavLink}
                activeClassName={styles.active}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.tickets')}
              </Link>
            </li>
            <li>
              <Link
                to="/knowledge"
                className={styles.headerMobileNavLink}
                activeClassName={styles.active}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.knowledge')}
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className={styles.headerMobileNavLink}
                activeClassName={styles.active}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.pricing')}
              </Link>
            </li>
            <li>
              <Link
                to="/contacts"
                className={styles.headerMobileNavLink}
                activeClassName={styles.active}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.contacts')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

