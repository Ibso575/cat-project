import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/axios';
import { useTranslation } from 'react-i18next';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [deliveryType, setDeliveryType] = useState('courier');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');

  // We should add translations for labels in i18n or use keys here
  // For simplicity, I'll use common keys or specific ones if added
  const deliveryOptions = [
    {
      id: 'courier',
      label: t('delivery_courier', { defaultValue: 'Доставка курьером' }),
      description: t('delivery_courier_desc', { defaultValue: 'по г. Тюмень, от 1500 рублей - бесплатно' }),
    },
    {
      id: 'pickup',
      label: t('delivery_pickup', { defaultValue: 'Самовывоз' }),
      description: t('delivery_pickup_desc', { defaultValue: 'ул. В. Гнаровской, 7 (ТЦ Тетрис) - зоомагазин "Сытая Морда"' }),
    },
    {
      id: 'rf',
      label: t('delivery_rf', { defaultValue: 'Доставка по РФ' }),
      description: t('delivery_rf_desc', { defaultValue: 'от 1500 рублей (по предоплате) - 0 р.' }),
    },
  ];

  const handleDeliveryChange = (value) => {
    setDeliveryType(value);
  };

  const handleSubmitOrder = async () => {
    if (!agreed) return;
    
    // Валидация обязательных полей
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      alert(t('fill_fields_alert'));
      return;
    }
    
    setIsLoading(true);
    try {
      const orderData = {
        customer_name: `${firstName.trim()} ${lastName.trim()}`,
        phone: phone.trim(),
        items: [
          {
            product_id: (id && !isNaN(parseInt(id))) ? parseInt(id) : 1,
            variant_id: 1,
            quantity: 1
          }
        ]
      };
      
      if (email.trim()) {
        orderData.email = email.trim();
      }
      if (comment.trim()) {
        orderData.comment = comment.trim();
      }

      const response = await api.post('/orders', orderData);
      
      if (response.status === 201 || response.status === 200) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error';
      alert(`${t('error_order_alert')}: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-0 px-2 flex items-center justify-center transition-colors duration-300">
        <div className="mx-auto max-w-2xl w-full rounded-3xl bg-linear-to-br from-orange-400 to-orange-500 p-10 shadow-2xl shadow-orange-200 dark:shadow-none text-white text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="text-[120px] animate-bounce">😸</div>
            <div>
              <h1 className="text-4xl md:text-5xl mb-4 font-black">{t('thanks_order')}</h1>
              <p className="text-2xl md:text-3xl mb-4 font-bold opacity-90">{t('you_are_awesome')}</p>
              <p className="text-lg mb-8 text-orange-50">{t('contact_soon')}</p>
              <button 
                onClick={() => navigate('/')} 
                className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-lg font-black text-orange-600 transition hover:bg-orange-50 hover:scale-105 active:scale-95 shadow-lg"
              >
                {t('back_to_main')} →
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Checkout form
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-200 dark:shadow-none border border-gray-50 dark:border-slate-800 transition-colors duration-300">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase border-b border-gray-100 dark:border-slate-800 pb-6">
          {t('checkout_title')}
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-10">
            <div className="rounded-3xl bg-gray-50 dark:bg-slate-800/50 p-6 md:p-8">
              <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-orange-500 pl-4">
                {t('customer')}
              </h2>
              <div className="mt-8 space-y-6">
                <label className="block">
                  <span className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">{t('first_name')}</span>
                  <input type="text" placeholder="Иван" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4 text-base outline-none transition focus:border-orange-400 ring-0 focus:ring-2 focus:ring-orange-400/20" />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">{t('last_name')}</span>
                  <input type="text" placeholder="Иванов" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4 text-base outline-none transition focus:border-orange-400 ring-0 focus:ring-2 focus:ring-orange-400/20" />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">{t('phone')}</span>
                  <input type="tel" placeholder="+7 (000) 000 00 00" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4 text-base outline-none transition focus:border-orange-400 ring-0 focus:ring-2 focus:ring-orange-400/20" />
                </label>
                <label className="block">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">E-mail</span>
                    <span className="text-xs font-bold text-orange-500 dark:text-orange-400 uppercase tracking-widest">{t('optional')}</span>
                  </div>
                  <input type="email" placeholder="myname@mail.ru" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4 text-base outline-none transition focus:border-orange-400 ring-0 focus:ring-2 focus:ring-orange-400/20" />
                </label>
              </div>
            </div>

            <div className="rounded-3xl bg-gray-50 dark:bg-slate-800/50 p-6 md:p-8">
              <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-orange-500 pl-4">
                {deliveryType === 'pickup' ? t('order_comment') : t('delivery_address')}
              </h2>
              {deliveryType === 'pickup' ? (
                <textarea placeholder={t('order_comment')} value={comment} onChange={(e) => setComment(e.target.value)} rows="6" className="mt-6 w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4 text-base outline-none transition focus:border-orange-400 ring-0 focus:ring-2 focus:ring-orange-400/20" />
              ) : (
                <div className="mt-8 space-y-6">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">{t('city')}</span>
                    <input type="text" placeholder={t('city')} value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4 text-base outline-none transition focus:border-orange-400 ring-0 focus:ring-2 focus:ring-orange-400/20" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">{t('address')}</span>
                    <input type="text" placeholder="Улица, дом, подъезд" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4 text-base outline-none transition focus:border-orange-400 ring-0 focus:ring-2 focus:ring-orange-400/20" />
                  </label>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-10">
            <div className="rounded-3xl bg-gray-50 dark:bg-slate-800/50 p-6 md:p-8">
              <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-orange-500 pl-4 mb-8">
                {t('delivery_method')}
              </h2>

              <div className="space-y-4">
                {deliveryOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleDeliveryChange(option.id)}
                    className={`flex w-full items-start gap-4 rounded-3xl border px-6 py-5 text-left transition-all duration-300 ${deliveryType === option.id ? 'border-orange-400 bg-orange-100/50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}`}
                  >
                    <span className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 ${deliveryType === option.id ? 'border-orange-500 bg-orange-500' : 'border-slate-300 dark:border-slate-600 bg-transparent'}`}>
                      {deliveryType === option.id ? <span className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1">{option.label}</p>
                      <p className="text-sm text-slate-500 dark:text-gray-400">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-gray-50 dark:bg-slate-800/50 p-6 md:p-8">
              <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-orange-500 pl-4">
                {t('payment_method')}
              </h2>
              <p className="mt-6 text-base text-slate-600 dark:text-gray-400 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700">
                {t('payment_on_receive')}
              </p>
            </div>

            {deliveryType !== 'pickup' && (
              <div className="rounded-3xl bg-gray-50 dark:bg-slate-800/50 p-6 md:p-8">
                <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-orange-500 pl-4">
                  {t('order_comment')}
                </h2>
                <textarea placeholder={t('order_comment')} value={comment} onChange={(e) => setComment(e.target.value)} rows="6" className="mt-6 w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4 text-base outline-none transition focus:border-orange-400 ring-0 focus:ring-2 focus:ring-orange-400/20" />
              </div>
            )}
          </section>
        </div>

        <div className="mt-12 flex flex-col gap-8 rounded-3xl bg-slate-900 dark:bg-slate-800 p-8 md:p-10 lg:flex-row lg:items-center lg:justify-between text-white shadow-2xl">
          <div className="space-y-2">
            <p className="text-sm uppercase font-black tracking-widest text-slate-400">{t('order_summary')}</p>
            <p className="text-4xl md:text-5xl font-black text-orange-400">6890 ₽</p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-end flex-grow">
            <label className="flex items-center gap-4 text-sm font-medium cursor-pointer group">
              <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="h-6 w-6 rounded-md border-slate-700 bg-slate-800 text-orange-500 focus:ring-orange-400 cursor-pointer" />
              <span className="opacity-80 group-hover:opacity-100 transition-opacity">
                {t('agreed_terms')}
              </span>
            </label>
            <button 
              type="button" 
              onClick={handleSubmitOrder} 
              disabled={!agreed || isLoading} 
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-12 py-5 text-lg font-black text-white transition-all hover:bg-orange-600 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:opacity-50 disabled:scale-100 shadow-xl"
            >
              {isLoading ? t('sending') : t('confirm_order')}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
