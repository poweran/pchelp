import { useState, CSSProperties } from 'react';
import TicketForm from '../components/tickets/TicketForm';
import TicketList from '../components/tickets/TicketList';
import Input from '../components/common/Input';

type TabType = 'create' | 'my-tickets';

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('create');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
        {/* Breadcrumbs */}
        <div style={breadcrumbsContainerStyle}>
          <nav style={breadcrumbsStyle}>
            <a href="/" style={breadcrumbLinkStyle}>Главная</a>
            <span style={breadcrumbSeparatorStyle}>/</span>
            <span style={breadcrumbCurrentStyle}>Заявки</span>
          </nav>
        </div>

        {/* Заголовок страницы */}
        <section style={headerSectionStyle}>
          <div style={containerStyle}>
            <h1 style={pageTitleStyle}>Заявки</h1>
            <p style={pageSubtitleStyle}>
              Создайте новую заявку или просмотрите статус существующих
            </p>
          </div>
        </section>

        {/* Tabs навигация */}
        <section style={tabsSectionStyle}>
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
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'create') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={tabIconStyle}>✏️</span>
                Создать заявку
              </button>
              
              <button
                onClick={() => setActiveTab('my-tickets')}
                style={{
                  ...tabButtonStyle,
                  ...(activeTab === 'my-tickets' ? activeTabButtonStyle : {}),
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'my-tickets') {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'my-tickets') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={tabIconStyle}>📋</span>
                Мои заявки
              </button>
            </div>
          </div>
        </section>

        {/* Контент */}
        <section style={contentSectionStyle}>
          <div style={containerStyle}>
            {activeTab === 'create' ? (
              <div style={formContainerStyle}>
                <TicketForm />
                
                {/* Дополнительная информация */}
                <div style={infoBoxStyle}>
                  <h3 style={infoTitleStyle}>💡 Полезная информация</h3>
                  <ul style={infoListStyle}>
                    <li style={infoItemStyle}>
                      Заявки обрабатываются в течение 2 часов в рабочее время
                    </li>
                    <li style={infoItemStyle}>
                      Для срочных вопросов используйте приоритет "Высокий"
                    </li>
                    <li style={infoItemStyle}>
                      Мы свяжемся с вами по указанному телефону или email
                    </li>
                    <li style={infoItemStyle}>
                      Вы можете отслеживать статус заявки во вкладке "Мои заявки"
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
                    placeholder="🔍 Поиск по имени или ID заявки..."
                  />
                </div>

                {/* Список заявок */}
                <TicketList />
                
                {/* Подсказка если нет заявок */}
                <div style={hintBoxStyle}>
                  <p style={hintTextStyle}>
                    <strong>Совет:</strong> Чтобы создать новую заявку, перейдите на вкладку "Создать заявку"
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Контактная информация внизу */}
        <section style={contactSectionStyle}>
          <div style={containerStyle}>
            <div style={contactBoxStyle}>
              <h3 style={contactTitleStyle}>Нужна помощь?</h3>
              <p style={contactTextStyle}>
                Свяжитесь с нами напрямую:
              </p>
              <div style={contactLinksStyle}>
                <a href="tel:+7XXXXXXXXXX" style={contactLinkStyle}>
                  📞 +7 (XXX) XXX-XX-XX
                </a>
                <a href="mailto:info@pchelp.example" style={contactLinkStyle}>
                  📧 info@pchelp.example
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
  padding: '0 1rem',
};

const breadcrumbsContainerStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
};

const breadcrumbsStyle: CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0.75rem 1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.875rem',
};

const breadcrumbLinkStyle: CSSProperties = {
  color: '#2563eb',
  textDecoration: 'none',
  transition: 'color 0.2s',
};

const breadcrumbSeparatorStyle: CSSProperties = {
  color: '#94a3b8',
};

const breadcrumbCurrentStyle: CSSProperties = {
  color: '#64748b',
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
  padding: '1rem 0',
  flexWrap: 'wrap',
};

const tabButtonStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 500,
  color: '#64748b',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '3px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.2s',
  outline: 'none',
};

const activeTabButtonStyle: CSSProperties = {
  color: '#2563eb',
  borderBottomColor: '#2563eb',
  backgroundColor: '#f8fafc',
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