import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${className}`} style={footerStyle}>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h3 style={headingStyle}>PCHelp</h3>
          <p style={textStyle}>{t('footer.description')}</p>
        </div>

        <div style={sectionStyle}>
          <h4 style={subHeadingStyle}>{t('footer.contacts')}</h4>
          <p style={textStyle}><a href="tel:+37495019753">📞 +374 (95) 01-97-53</a></p>
          <p style={textStyle}><a href="mailto:info@pchelp.linkpc.net">📧 info@pchelp.linkpc.net</a></p>
        </div>

        <div style={sectionStyle}>
          <h4 style={subHeadingStyle}>{t('footer.hours')}</h4>
          <p style={textStyle}>{t('footer.weekdays')}: 9:00 - 20:00</p>
          <p style={textStyle}>{t('footer.saturday')}: 10:00 - 18:00</p>
        </div>
      </div>

      <div style={copyrightStyle}>
        <p style={textStyle}>
          © {currentYear} PCHelp. {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
}

const footerStyle: CSSProperties = {
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-text)',
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
  color: 'var(--color-primary)',
  marginBottom: '0.5rem',
};

const subHeadingStyle: CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: 'var(--color-text)',
  marginBottom: '0.5rem',
};

const textStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: 'var(--color-secondary)',
  margin: '0.25rem 0',
  lineHeight: '1.5',
};

const copyrightStyle: CSSProperties = {
  borderTop: '1px solid var(--color-border)',
  paddingTop: '1rem',
  textAlign: 'center',
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '1rem',
};