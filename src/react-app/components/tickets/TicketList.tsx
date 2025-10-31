import { CSSProperties, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Ticket } from '../../types';
import TicketCard from './TicketCard';
import Button from '../common/Button';
import Loading from '../common/Loading';
import { del } from '../../utils/api';

interface TicketListProps {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  loadTickets: () => Promise<void>;
}

export default function TicketList({ tickets, loading, error, loadTickets }: TicketListProps) {
  const { t } = useTranslation();
  const [deletingId, setDeletingId] = useState<string | null>(null);


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
        <Loading text={t('ticketList.loading')} />
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
             <Button onClick={loadTickets} variant="danger">
               {t('ticketList.retryButton')}
             </Button>
          </div>
        </div>
      </div>
    );
  }

  // Пустой список
  if (tickets.length === 0) {
    const userIdentifierString = localStorage.getItem('userIdentifier');
    const isNewUser = !userIdentifierString;
    const emptyTitle = isNewUser
      ? t('ticketList.emptyTitleNewUser')
      : t('ticketList.emptyTitleUser');
    const emptyMessage = isNewUser
      ? t('ticketList.emptyMessageNewUser')
      : t('ticketList.emptyMessageUser');

    return (
      <div style={containerStyle}>
        <div style={emptyStyle}>
          <span style={emptyIconStyle}>📋</span>
          <h3 style={emptyTitleStyle}>{emptyTitle}</h3>
          <p style={emptyMessageStyle}>
            {emptyMessage}
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

      <div style={{ position: 'relative' }}>
        <div style={listStyle}>
          {sortedTickets.map((ticket) => (
            <div key={ticket.id} style={ticketItemStyle}>
              <div style={{ flex: 1 }}>
                <TicketCard
                  ticket={ticket}
                  deleting={deletingId === ticket.id}
                  onDelete={async (id: string) => {
                    try {
                      setDeletingId(id);
                      const res = await del(`/tickets/${id}`);
                      if (res.error) {
                        // Показываем ошибку пользователю
                        alert(t('ticketList.deleteError', { defaultValue: 'Не удалось удалить заявку: ' }) + res.error);
                      } else {
                        // Обновляем список
                        await loadTickets();
                      }
                    } catch (e) {
                      const msg = e instanceof Error ? e.message : String(e);
                      alert(t('ticketList.deleteError', { defaultValue: 'Не удалось удалить заявку: ' }) + msg);
                    } finally {
                      setDeletingId(null);
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div style={loadingOverlayStyle}>
            <Loading size="medium" text={t('ticketList.loadingOverlay')} />
          </div>
        )}
      </div>
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

const ticketItemStyle: CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'flex-start',
};

/* ticketActionsStyle removed — actions are rendered inside TicketCard now */


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
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingTop: '2rem',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(1px)',
  borderRadius: '0.5rem',
  zIndex: 10,
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