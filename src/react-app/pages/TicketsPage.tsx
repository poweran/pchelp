import { useState, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import TicketForm from '../components/tickets/TicketForm';
import TicketList from '../components/tickets/TicketList';
import Input from '../components/common/Input';
import './TicketsPage.css';

type TabType = 'create' | 'my-tickets';

export default function TicketsPage() {
   const { t } = useTranslation();
   const [activeTab, setActiveTab] = useState<TabType>('create');
   const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
        {/* Заголовок страницы */}
        <section style={headerSectionStyle} className="tickets-header hero">
          <div style={containerStyle}>
            <h1 style={pageTitleStyle}>{t('ticketsPage.title')}</h1>
            <p style={pageSubtitleStyle}>
              {t('ticketsPage.subtitle')}
            </p>
          </div>
        </section>

        {/* Tabs навигация */}
        <section style={tabsSectionStyle} className="tickets-tabs">
          <div style={containerStyle}>
            <div style={tabsContainerStyle}>
              <button
                onClick={() => setActiveTab('create')}
                style={{
                  ...tabButtonStyle,
                  ...(activeTab === 'create' ? activeTabButtonStyle : {}),
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'create') {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'create') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={tabIconStyle}>✏️</span>
                {t('ticketsPage.tabCreate')}
              </button>

              <button
                onClick={() => setActiveTab('my-tickets')}
                style={{
                  ...tabButtonStyle,
                  ...(activeTab === 'my-tickets' ? activeTabButtonStyle : {}),
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'my-tickets') {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'my-tickets') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={tabIconStyle}>📋</span>
                {t('ticketsPage.tabMyTickets')}
              </button>
            </div>
          </div>
        </section>

        {/* Контент */}
        <section style={contentSectionStyle} className="tickets-content">
          <div style={containerStyle}>
            {activeTab === 'create' ? (
              <div style={formContainerStyle}>
                <TicketForm />

                {/* Дополнительная информация */}
                <div style={infoBoxStyle}>
                  <h3 style={infoTitleStyle}>💡 {t('ticketsPage.infoTitle')}</h3>
                  <ul style={infoListStyle}>
                    <li style={infoItemStyle}>
                      {t('ticketsPage.infoItem1')}
                    </li>
                    <li style={infoItemStyle}>
                      {t('ticketsPage.infoItem2')}
                    </li>
                    <li style={infoItemStyle}>
                      {t('ticketsPage.infoItem3')}
                    </li>
                    <li style={infoItemStyle}>
                      {t('ticketsPage.infoItem4')}
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div style={listContainerStyle}>
                {/* Поиск по заявкам */}
                <div style={searchContainerStyle}>
                  <Input
                    label=""
                    type="text"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder={`🔍 ${t('ticketsPage.searchPlaceholder')}`}
                  />
                </div>

                {/* Список заявок */}
                <TicketList />

                {/* Подсказка если нет заявок */}
                <div style={hintBoxStyle}>
                  <p style={hintTextStyle}>
                    <strong>{t('ticketsPage.hint')}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Контактная информация внизу */}
        <section style={contactSectionStyle} className="tickets-contact">
          <div style={containerStyle}>
            <div style={contactBoxStyle}>
              <h3 style={contactTitleStyle}>{t('ticketsPage.contactTitle')}</h3>
              <p style={contactTextStyle}>
                {t('ticketsPage.contactText')}
              </p>
              <div style={contactLinksStyle}>
                <a href="tel:+37495019753" style={contactLinkStyle}>
                  📞 +374 (95) 01-97-53
                </a>
                <a href="mailto:info@pchelp.linkpc.net" style={contactLinkStyle}>
                  📧 info@pchelp.linkpc.net
                </a>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

// Стили
const containerStyle: CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
};

const headerSectionStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '3rem 0',
  borderBottom: '1px solid #e2e8f0',
};

const pageTitleStyle: CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: '1rem',
  textAlign: 'center',
};

const pageSubtitleStyle: CSSProperties = {
  fontSize: '1.125rem',
  color: '#64748b',
  textAlign: 'center',
  maxWidth: '600px',
  margin: '0 auto',
  lineHeight: '1.6',
};

const tabsSectionStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
  position: 'sticky',
  top: '73px',
  zIndex: 100,
};

const tabsContainerStyle: CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  padding: '1rem',
  flexWrap: 'wrap',
};

const tabButtonStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 0.75rem',
  fontSize: '0.95rem',
  fontWeight: 500,
  color: '#64748b',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  outline: 'none',
};

const activeTabButtonStyle: CSSProperties = {
  color: '#2563eb',
  backgroundColor: '#dbeafe',
  fontWeight: 600,
};

const tabIconStyle: CSSProperties = {
  fontSize: '1.25rem',
};

const contentSectionStyle: CSSProperties = {
  padding: '3rem 0',
  minHeight: '500px',
};

const formContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  alignItems: 'center',
};

const listContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
};

const searchContainerStyle: CSSProperties = {
  maxWidth: '600px',
  width: '100%',
};

const infoBoxStyle: CSSProperties = {
  maxWidth: '600px',
  width: '100%',
  padding: '1.5rem',
  backgroundColor: '#eff6ff',
  border: '1px solid #3b82f6',
  borderRadius: '0.5rem',
  marginTop: '2rem',
};

const infoTitleStyle: CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1e40af',
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const infoListStyle: CSSProperties = {
  margin: 0,
  paddingLeft: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const infoItemStyle: CSSProperties = {
  fontSize: '0.95rem',
  color: '#1e40af',
  lineHeight: '1.5',
};

const hintBoxStyle: CSSProperties = {
  padding: '1rem',
  backgroundColor: '#fef3c7',
  border: '1px solid #fbbf24',
  borderRadius: '0.5rem',
  marginTop: '2rem',
};

const hintTextStyle: CSSProperties = {
  fontSize: '0.95rem',
  color: '#78350f',
  margin: 0,
  lineHeight: '1.5',
};

const contactSectionStyle: CSSProperties = {
  backgroundColor: '#f1f5f9',
  padding: '3rem 1rem',
  marginTop: '2rem',
};

const contactBoxStyle: CSSProperties = {
  textAlign: 'center',
  maxWidth: '600px',
  margin: '0 auto',
};

const contactTitleStyle: CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: '0.75rem',
};

const contactTextStyle: CSSProperties = {
  fontSize: '1rem',
  color: '#64748b',
  marginBottom: '1.5rem',
};

const contactLinksStyle: CSSProperties = {
  display: 'flex',
  gap: '2rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const contactLinkStyle: CSSProperties = {
  fontSize: '1.125rem',
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: 500,
  transition: 'color 0.2s',
};