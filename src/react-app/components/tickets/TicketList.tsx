import { useEffect, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useTickets } from '../../hooks/useTickets';
import TicketCard from './TicketCard';

export default function TicketList() {
   const { t } = useTranslation();
   const { tickets, loading, error, loadTickets } = useTickets();

  useEffect(() => {
    loadTickets();
  }, []);

  // Сортировка заявок по дате создания (новые сначала)
  const sortedTickets = [...tickets].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // Сортировка по убыванию (новые сначала)
  });

  // Состояние загрузки
  if (loading && tickets.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <p>{t('ticketList.loading')}</p>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          <span style={errorIconStyle}>⚠️</span>
          <div>
            <h3 style={errorTitleStyle}>{t('ticketList.errorTitle')}</h3>
            <p style={errorMessageStyle}>{error}</p>
            <button onClick={loadTickets} style={retryButtonStyle}>
              {t('ticketList.retryButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Пустой список
  if (tickets.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={emptyStyle}>
          <span style={emptyIconStyle}>📋</span>
          <h3 style={emptyTitleStyle}>{t('ticketList.emptyTitle')}</h3>
          <p style={emptyMessageStyle}>
            {t('ticketList.emptyMessage')}
          </p>
        </div>
      </div>
    );
  }

  // Список заявок
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>{t('ticketList.title')}</h2>
        <div style={countStyle}>
          {t('ticketList.count')}: {tickets.length}
        </div>
      </div>

      <div style={listStyle}>
        {sortedTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>

      {loading && (
        <div style={loadingOverlayStyle}>
          <div style={smallSpinnerStyle}></div>
          <span>{t('ticketList.loadingOverlay')}</span>
        </div>
      )}
    </div>
  );
}

// Стили
const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
};

const titleStyle: CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#1e293b',
  margin: 0,
};

const countStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#64748b',
};

const listStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const loadingStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem 1rem',
  gap: '1rem',
  color: '#64748b',
};

const spinnerStyle: CSSProperties = {
  width: '3rem',
  height: '3rem',
  border: '4px solid #e2e8f0',
  borderTop: '4px solid #2563eb',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const errorStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
  padding: '1.5rem',
  backgroundColor: '#fee2e2',
  border: '1px solid #ef4444',
  borderRadius: '0.5rem',
};

const errorIconStyle: CSSProperties = {
  fontSize: '2rem',
};

const errorTitleStyle: CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: 600,
  color: '#991b1b',
  margin: '0 0 0.5rem 0',
};

const errorMessageStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#7f1d1d',
  margin: '0 0 1rem 0',
};

const retryButtonStyle: CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#ef4444',
  color: '#ffffff',
  border: 'none',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

const emptyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem 1rem',
  textAlign: 'center',
};

const emptyIconStyle: CSSProperties = {
  fontSize: '4rem',
  marginBottom: '1rem',
};

const emptyTitleStyle: CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#1e293b',
  margin: '0 0 0.5rem 0',
};

const emptyMessageStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#64748b',
  margin: 0,
};

const loadingOverlayStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  padding: '1rem',
  backgroundColor: '#f8fafc',
  borderRadius: '0.5rem',
  fontSize: '0.875rem',
  color: '#64748b',
};

const smallSpinnerStyle: CSSProperties = {
  width: '1rem',
  height: '1rem',
  border: '2px solid #e2e8f0',
  borderTop: '2px solid #2563eb',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

// Добавляем keyframes для анимации спиннера в глобальный стиль
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}