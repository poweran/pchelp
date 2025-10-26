import { useState, FormEvent, CSSProperties } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';

interface QuickFormData {
  name: string;
  phone: string;
  description: string;
}

export default function HomePage() {
  const [formData, setFormData] = useState<QuickFormData>({
    name: '',
    phone: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleQuickSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Имитация отправки
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', phone: '', description: '' });
      
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1000);
  };

  return (
    <>
        {/* Hero секция */}
        <section style={heroStyle}>
          <div style={heroContentStyle}>
            <h1 style={heroTitleStyle}>
              Профессиональная компьютерная помощь
            </h1>
            <p style={heroSubtitleStyle}>
              Ремонт, настройка и обслуживание компьютеров и ноутбуков. 
              Быстро, качественно, с гарантией.
            </p>
            <div style={heroButtonsStyle}>
              <Button onClick={() => window.location.href = '/services'}>
                Наши услуги
              </Button>
              <Button 
                variant="secondary"
                onClick={() => document.getElementById('quick-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Оставить заявку
              </Button>
            </div>
          </div>
        </section>

        {/* Преимущества */}
        <section style={advantagesStyle}>
          <h2 style={sectionTitleStyle}>Почему выбирают нас</h2>
          <div style={advantagesGridStyle}>
            <Card>
              <div style={advantageCardStyle}>
                <span style={advantageIconStyle}>⚡</span>
                <h3 style={advantageTitleStyle}>Быстрый отклик</h3>
                <p style={advantageTextStyle}>
                  Выезд мастера в течение 2 часов. Срочный ремонт за 24 часа.
                </p>
              </div>
            </Card>

            <Card>
              <div style={advantageCardStyle}>
                <span style={advantageIconStyle}>🎓</span>
                <h3 style={advantageTitleStyle}>Профессионализм</h3>
                <p style={advantageTextStyle}>
                  Сертифицированные специалисты с опытом работы более 10 лет.
                </p>
              </div>
            </Card>

            <Card>
              <div style={advantageCardStyle}>
                <span style={advantageIconStyle}>💰</span>
                <h3 style={advantageTitleStyle}>Честные цены</h3>
                <p style={advantageTextStyle}>
                  Прозрачное ценообразование. Бесплатная диагностика на месте.
                </p>
              </div>
            </Card>

            <Card>
              <div style={advantageCardStyle}>
                <span style={advantageIconStyle}>✅</span>
                <h3 style={advantageTitleStyle}>Гарантия качества</h3>
                <p style={advantageTextStyle}>
                  Гарантия на все виды работ до 6 месяцев. Качество проверено временем.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Быстрая форма заявки */}
        <section id="quick-form" style={quickFormSectionStyle}>
          <div style={quickFormContainerStyle}>
            <h2 style={sectionTitleStyle}>Оставьте заявку</h2>
            <p style={quickFormSubtitleStyle}>
              Заполните форму, и мы свяжемся с вами в ближайшее время
            </p>

            {showSuccess && (
              <div style={successMessageStyle}>
                ✓ Заявка отправлена! Мы свяжемся с вами в ближайшее время.
              </div>
            )}

            <form onSubmit={handleQuickSubmit} style={formStyle}>
              <Input
                label="Ваше имя"
                type="text"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                placeholder="Иван Иванов"
                required
                disabled={isSubmitting}
              />

              <Input
                label="Телефон"
                type="tel"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                placeholder="+7 (999) 123-45-67"
                required
                disabled={isSubmitting}
              />

              <Textarea
                label="Опишите проблему"
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Кратко опишите вашу проблему..."
                required
                disabled={isSubmitting}
                rows={4}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </Button>
            </form>

            <p style={noteStyle}>
              Или позвоните нам: <a href="tel:+7XXXXXXXXXX" style={linkStyle}>+7 (XXX) XXX-XX-XX</a>
            </p>
          </div>
        </section>

        {/* Контактная информация */}
        <section style={contactInfoStyle}>
          <div style={contactGridStyle}>
            <div style={contactItemStyle}>
              <span style={contactIconStyle}>📞</span>
              <div>
                <h3 style={contactTitleStyle}>Телефон</h3>
                <p style={contactTextStyle}>+7 (XXX) XXX-XX-XX</p>
              </div>
            </div>

            <div style={contactItemStyle}>
              <span style={contactIconStyle}>📧</span>
              <div>
                <h3 style={contactTitleStyle}>Email</h3>
                <p style={contactTextStyle}>info@pchelp.example</p>
              </div>
            </div>

            <div style={contactItemStyle}>
              <span style={contactIconStyle}>📍</span>
              <div>
                <h3 style={contactTitleStyle}>Адрес</h3>
                <p style={contactTextStyle}>г. Москва, ул. Примерная, д. 1</p>
              </div>
            </div>

            <div style={contactItemStyle}>
              <span style={contactIconStyle}>🕐</span>
              <div>
                <h3 style={contactTitleStyle}>Режим работы</h3>
                <p style={contactTextStyle}>Пн-Пт: 9:00-18:00<br />Сб-Вс: 10:00-16:00</p>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

// Стили
const heroStyle: CSSProperties = {
  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
  color: '#ffffff',
  padding: '5rem 1rem',
  textAlign: 'center',
};

const heroContentStyle: CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
};

const heroTitleStyle: CSSProperties = {
  fontSize: '3rem',
  fontWeight: 'bold',
  marginBottom: '1.5rem',
  lineHeight: '1.2',
};

const heroSubtitleStyle: CSSProperties = {
  fontSize: '1.25rem',
  marginBottom: '2.5rem',
  opacity: 0.95,
  lineHeight: '1.6',
};

const heroButtonsStyle: CSSProperties = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const advantagesStyle: CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '4rem 1rem',
};

const sectionTitleStyle: CSSProperties = {
  fontSize: '2.25rem',
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#1e293b',
  marginBottom: '3rem',
};

const advantagesGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '2rem',
};

const advantageCardStyle: CSSProperties = {
  textAlign: 'center',
};

const advantageIconStyle: CSSProperties = {
  fontSize: '3rem',
  marginBottom: '1rem',
  display: 'block',
};

const advantageTitleStyle: CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '0.75rem',
};

const advantageTextStyle: CSSProperties = {
  fontSize: '0.95rem',
  color: '#64748b',
  lineHeight: '1.6',
};

const quickFormSectionStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '4rem 1rem',
};

const quickFormContainerStyle: CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
};

const quickFormSubtitleStyle: CSSProperties = {
  textAlign: 'center',
  color: '#64748b',
  marginBottom: '2rem',
  fontSize: '1rem',
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  marginBottom: '1.5rem',
};

const successMessageStyle: CSSProperties = {
  padding: '1rem',
  backgroundColor: '#dcfce7',
  border: '1px solid #22c55e',
  borderRadius: '0.375rem',
  color: '#166534',
  fontSize: '0.95rem',
  fontWeight: 500,
  marginBottom: '1.5rem',
  textAlign: 'center',
};

const noteStyle: CSSProperties = {
  textAlign: 'center',
  color: '#64748b',
  fontSize: '0.95rem',
};

const linkStyle: CSSProperties = {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: 500,
};

const contactInfoStyle: CSSProperties = {
  backgroundColor: '#f1f5f9',
  padding: '3rem 1rem',
};

const contactGridStyle: CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
};

const contactItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
};

const contactIconStyle: CSSProperties = {
  fontSize: '2rem',
};

const contactTitleStyle: CSSProperties = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '0.5rem',
};

const contactTextStyle: CSSProperties = {
  fontSize: '0.95rem',
  color: '#64748b',
  lineHeight: '1.6',
};