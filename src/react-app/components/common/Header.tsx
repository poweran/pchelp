import { CSSProperties } from 'react';
import { Link } from './Link';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  // console.log('[Header] Компонент перерендерен');

  return (
    <header className={`header ${className}`} style={headerStyle}>
      <div style={containerStyle}>
        <div style={logoStyle}>
          <span style={logoIconStyle}>💻</span>
          <span style={logoTextStyle}>PCHelp</span>
        </div>
        <nav style={navStyle}>
          <Link to="/" className="nav-link" activeClassName="active" style={navLinkStyle}>
            Главная
          </Link>
          <Link to="/services" className="nav-link" activeClassName="active" style={navLinkStyle}>
            Услуги
          </Link>
          <Link to="/tickets" className="nav-link" activeClassName="active" style={navLinkStyle}>
            Заявки
          </Link>
          <Link to="/knowledge" className="nav-link" activeClassName="active" style={navLinkStyle}>
            База знаний
          </Link>
          <Link to="/pricing" className="nav-link" activeClassName="active" style={navLinkStyle}>
            Цены
          </Link>
          <Link to="/contacts" className="nav-link" activeClassName="active" style={navLinkStyle}>
            Контакты
          </Link>
        </nav>
      </div>
    </header>
  );
}

const headerStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
  padding: '1rem 0',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
};

const containerStyle: CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0 1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
};

const logoStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#2563eb',
  textDecoration: 'none',
};

const logoIconStyle: CSSProperties = {
  fontSize: '2rem',
};

const logoTextStyle: CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
};

const navStyle: CSSProperties = {
  display: 'flex',
  gap: '1.5rem',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const navLinkStyle: CSSProperties = {
  color: '#64748b',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
  padding: '0.5rem 0.75rem',
  borderRadius: '0.375rem',
  transition: 'all 0.2s',
};

// Добавляем стили для активной ссылки через CSS
const styleTag = document.createElement('style');
styleTag.textContent = `
  .nav-link:hover {
    color: #2563eb;
    background-color: #eff6ff;
  }
  .nav-link.active {
    color: #2563eb;
    background-color: #dbeafe;
    font-weight: 600;
  }
`;
if (!document.head.querySelector('style[data-header-styles]')) {
  styleTag.setAttribute('data-header-styles', 'true');
  document.head.appendChild(styleTag);
}