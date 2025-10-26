import React, { useState } from 'react';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import type { ContactFormData } from '../types';
import './ContactsPage.css';

const ContactsPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (value: string, field: keyof ContactFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Имитация отправки формы
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="contacts-page">
      <header className="contacts-header">
        <h1>📞 Контакты</h1>
        <p className="subtitle">Свяжитесь с нами удобным для вас способом</p>
      </header>

      <div className="contacts-content">
        <div className="contacts-info">
          <div className="contact-card">
            <div className="contact-card-icon">📍</div>
            <div className="contact-card-content">
              <h3>Адрес офиса</h3>
              <p>г. Москва, ул. Примерная, д. 123, офис 456</p>
              <p className="contact-note">Прием клиентов по предварительной записи</p>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">📱</div>
            <div className="contact-card-content">
              <h3>Телефоны</h3>
              <p>
                <a href="tel:+74951234567">+7 (495) 123-45-67</a> — Основной
              </p>
              <p>
                <a href="tel:+79161234567">+7 (916) 123-45-67</a> — Мобильный
              </p>
              <p>
                <a href="tel:+74957654321">+7 (495) 765-43-21</a> — Для корпоративных клиентов
              </p>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">✉️</div>
            <div className="contact-card-content">
              <h3>Email</h3>
              <p>
                <a href="mailto:info@pchelp.ru">info@pchelp.ru</a> — Общие вопросы
              </p>
              <p>
                <a href="mailto:support@pchelp.ru">support@pchelp.ru</a> — Техподдержка
              </p>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">🕐</div>
            <div className="contact-card-content">
              <h3>График работы</h3>
              <p>Понедельник — Пятница: 9:00 — 20:00</p>
              <p>Суббота: 10:00 — 18:00</p>
              <p>Воскресенье: выходной</p>
              <p className="contact-note">Выездные работы — круглосуточно по договоренности</p>
            </div>
          </div>

          <div className="contact-card map-card">
            <div className="contact-card-icon">🗺️</div>
            <div className="contact-card-content">
              <h3>Как нас найти</h3>
              <div className="map-placeholder">
                <div className="map-placeholder-content">
                  <p>📍 Карта проезда</p>
                  <p className="map-note">Ближайшее метро: Площадь Революции</p>
                  <p className="map-note">5 минут пешком от выхода №3</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contacts-form-section">
          <h2>✍️ Форма обратной связи</h2>
          <p className="form-description">
            Оставьте ваше сообщение, и мы свяжемся с вами в ближайшее время
          </p>

          {submitSuccess && (
            <div className="success-message">
              ✅ Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Ваше имя *</label>
              <Input
                type="text"
                placeholder="Иван Иванов"
                value={formData.name}
                onChange={(value) => handleChange(value, 'name')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <Input
                type="email"
                placeholder="ivan@example.com"
                value={formData.email}
                onChange={(value) => handleChange(value, 'email')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Сообщение *</label>
              <Textarea
                placeholder="Опишите ваш вопрос или проблему..."
                value={formData.message}
                onChange={(value) => handleChange(value, 'message')}
                rows={6}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? 'Отправка...' : '📤 Отправить сообщение'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;