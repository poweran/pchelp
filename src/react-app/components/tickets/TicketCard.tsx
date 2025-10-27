import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { Ticket } from '../../types';
import Card from '../common/Card';

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
   const { t } = useTranslation();

   // Получить стиль для статуса
   const getStatusStyle = (status: Ticket['status']): CSSProperties => {
     switch (status) {
       case 'new':
         return { ...badgeStyle, backgroundColor: '#dbeafe', color: '#1e40af' };
       case 'in-progress':
         return { ...badgeStyle, backgroundColor: '#fed7aa', color: '#9a3412' };
       case 'completed':
         return { ...badgeStyle, backgroundColor: '#dcfce7', color: '#166534' };
       case 'cancelled':
         return { ...badgeStyle, backgroundColor: '#f3f4f6', color: '#4b5563' };
       default:
         return badgeStyle;
     }
   };

   // Получить текст статуса
   const getStatusText = (status: Ticket['status']): string => {
     switch (status) {
       case 'new':
         return t('ticketCard.statusNew');
       case 'in-progress':
         return t('ticketCard.statusInProgress');
       case 'completed':
         return t('ticketCard.statusCompleted');
       case 'cancelled':
         return t('ticketCard.statusCancelled');
       default:
         return status;
     }
   };

   // Получить стиль для приоритета
   const getPriorityStyle = (priority: Ticket['priority']): CSSProperties => {
     switch (priority) {
       case 'low':
         return { ...priorityBadgeStyle, backgroundColor: '#f3f4f6', color: '#4b5563' };
       case 'medium':
         return { ...priorityBadgeStyle, backgroundColor: '#fef3c7', color: '#92400e' };
       case 'high':
         return { ...priorityBadgeStyle, backgroundColor: '#fee2e2', color: '#991b1b' };
       default:
         return priorityBadgeStyle;
     }
   };

   // Получить текст приоритета
   const getPriorityText = (priority: Ticket['priority']): string => {
     switch (priority) {
       case 'low':
         return t('ticketCard.priorityLow');
       case 'medium':
         return t('ticketCard.priorityMedium');
       case 'high':
         return t('ticketCard.priorityHigh');
       default:
         return priority;
     }
   };


  // Форматировать дату
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <div style={cardContentStyle}>
        {/* Заголовок с ID и статусом */}
        <div style={headerStyle}>
          <div style={idStyle}>{t('ticketCard.title', { id: ticket.id })}</div>
          <div style={badgesContainerStyle}>
            <span style={getPriorityStyle(ticket.priority)}>
              {getPriorityText(ticket.priority)}
            </span>
            <span style={getStatusStyle(ticket.status)}>
              {getStatusText(ticket.status)}
            </span>
          </div>
        </div>
 
        {/* Информация о клиенте */}
        <div style={sectionStyle}>
          <div style={labelStyle}>{t('ticketCard.labelClient')}</div>
          <div style={valueStyle}>{ticket.clientName}</div>
        </div>
 
        {/* Контактная информация */}
        <div style={contactsStyle}>
          <div style={contactItemStyle}>
            <span style={iconStyle}>📞</span>
            <a href={`tel:${ticket.phone}`} style={linkStyle}>
              {ticket.phone}
            </a>
          </div>
          <div style={contactItemStyle}>
            <span style={iconStyle}>✉️</span>
            <a href={`mailto:${ticket.email}`} style={linkStyle}>
              {ticket.email}
            </a>
          </div>
        </div>
 
        {/* Тип услуги */}
        <div style={sectionStyle}>
          <div style={labelStyle}>{t('ticketCard.labelService')}</div>
          <div style={valueStyle}>{getServiceTypeText(ticket.serviceType)}</div>
        </div>
 
        {/* Описание проблемы */}
        <div style={sectionStyle}>
          <div style={labelStyle}>{t('ticketCard.labelDescription')}</div>
          <div style={descriptionStyle}>{ticket.description}</div>
        </div>
 
        {/* Дата создания */}
        <div style={footerStyle}>
          <span style={dateStyle}>
            {t('ticketCard.footerDate', { date: formatDate(ticket.createdAt) })}
          </span>
        </div>
      </div>
    </Card>
  );
}

// Вспомогательная функция для получения текста типа услуги
function getServiceTypeText(serviceType: string): string {
  const types: Record<string, string> = {
    'repair': 'Ремонт компьютера',
    'setup': 'Настройка ПО',
    'recovery': 'Восстановление данных',
    'consultation': 'Консультация',
    'installation': 'Установка оборудования',
    'virus-removal': 'Удаление вирусов',
  };
  return types[serviceType] || serviceType;
}

// Стили
const cardContentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.75rem',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid #e2e8f0',
};

const idStyle: CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: 600,
  color: '#1e293b',
};

const badgesContainerStyle: CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
};

const badgeStyle: CSSProperties = {
  padding: '0.25rem 0.75rem',
  borderRadius: '9999px',
  fontSize: '0.75rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const priorityBadgeStyle: CSSProperties = {
  ...badgeStyle,
};

const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const labelStyle: CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const valueStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#1e293b',
  fontWeight: 500,
};

const contactsStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const contactItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.875rem',
};

const iconStyle: CSSProperties = {
  fontSize: '1rem',
};

const linkStyle: CSSProperties = {
  color: '#2563eb',
  textDecoration: 'none',
  transition: 'color 0.2s',
};

const descriptionStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#475569',
  lineHeight: '1.5',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

const footerStyle: CSSProperties = {
  paddingTop: '0.75rem',
  borderTop: '1px solid #e2e8f0',
};

const dateStyle: CSSProperties = {
  fontSize: '0.75rem',
  color: '#64748b',
};