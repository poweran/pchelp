import { CSSProperties } from 'react';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${className}`} style={footerStyle}>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h3 style={headingStyle}>PCHelp</h3>
          <p style={textStyle}>Профессиональная компьютерная помощь</p>
        </div>

        <div style={sectionStyle}>
          <h4 style={subHeadingStyle}>Контакты</h4>
          <p style={textStyle}>📞 +7 (XXX) XXX-XX-XX</p>
          <p style={textStyle}>📧 info@pchelp.example</p>
          <p style={textStyle}>📍 г. Москва</p>
        </div>

        <div style={sectionStyle}>
          <h4 style={subHeadingStyle}>Часы работы</h4>
          <p style={textStyle}>Пн-Пт: 9:00 - 18:00</p>
          <p style={textStyle}>Сб-Вс: 10:00 - 16:00</p>
        </div>
      </div>

      <div style={copyrightStyle}>
        <p style={textStyle}>
          © {currentYear} PCHelp. Все права защищены.
        </p>
      </div>
    </footer>
  );
}

const footerStyle: CSSProperties = {
  backgroundColor: '#1e293b',
  color: '#e2e8f0',
  padding: '3rem 0 1rem',
  marginTop: 'auto',
};

const containerStyle: CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0 1rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
  marginBottom: '2rem',
};

const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const headingStyle: CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#2563eb',
  marginBottom: '0.5rem',
};

const subHeadingStyle: CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#ffffff',
  marginBottom: '0.5rem',
};

const textStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#cbd5e1',
  margin: '0.25rem 0',
  lineHeight: '1.5',
};

const copyrightStyle: CSSProperties = {
  borderTop: '1px solid #334155',
  paddingTop: '1rem',
  textAlign: 'center',
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '1rem',
};