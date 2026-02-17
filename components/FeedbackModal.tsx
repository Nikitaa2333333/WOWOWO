import React, { useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { submitLead } from '../lib/formService';

const FeedbackModal: React.FC = () => {
  const { isOpen, closeModal, productName } = useModal();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState({ name: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ name: '', phone: '' });

    const newErrors = { name: '', phone: '' };
    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, введите ваше имя';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Пожалуйста, введите номер телефона';
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Некорректный формат телефона';
    }

    if (newErrors.name || newErrors.phone) {
      setErrors(newErrors);
      return;
    }

    setFormState('submitting');

    const result = await submitLead({
      name: formData.name,
      phone: formData.phone,
      productName: productName || undefined
    });

    if (result.success) {
      setFormState('success');
      setTimeout(() => {
        closeModal();
        setFormState('idle');
        setFormData({ name: '', phone: '' });
        setErrors({ name: '', phone: '' });
      }, 3000);
    } else {
      setFormState('idle');
      alert('Ошибка при отправке. Проверьте соединение или ключи в .env.local');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeModal}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl p-8 overflow-hidden z-10"
      >
        <button
          onClick={closeModal}
          aria-label="Закрыть модальное окно"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {formState === 'success' ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Отправлено!</h3>
            <p className="text-gray-500 text-center">Мы свяжемся с вами в течение 15 минут.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                {productName ? 'Запрос цены' : 'Обратная связь'}
              </h3>
              <p className="text-gray-500 text-sm">
                {productName
                  ? `Оставьте контакты для получения КП по "${productName}"`
                  : 'Заполните форму, и мы свяжемся с вами.'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name-input" className="block text-xs font-semibold text-gray-500 mb-1">Имя</label>
                <input
                  id="name-input"
                  required
                  type="text"
                  autoComplete="name"
                  className={`w-full bg-white border rounded-xl px-4 py-3 focus:outline-none transition-all placeholder:text-gray-400 ${errors.name
                    ? 'border-red-500 ring-2 ring-red-500/20'
                    : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  placeholder="Иван Иванов"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && (
                  <p role="alert" className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="phone-input" className="block text-xs font-semibold text-gray-500 mb-1">Телефон</label>
                <input
                  id="phone-input"
                  required
                  type="tel"
                  className={`w-full bg-white border rounded-xl px-4 py-3 focus:outline-none transition-all placeholder:text-gray-400 ${errors.phone
                    ? 'border-red-500 ring-2 ring-red-500/20'
                    : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  placeholder="+7 (999) 000-00-00"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                {errors.phone && (
                  <p role="alert" className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={formState === 'submitting'}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-full shadow-lg transition-all flex items-center justify-center"
            >
              {formState === 'submitting' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Отправить запрос'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
