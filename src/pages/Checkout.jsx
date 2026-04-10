import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../config/axios';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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

  const deliveryOptions = [
    {
      id: 'courier',
      label: 'Доставка курьером',
      description: 'по г. Тюмень, от 1500 рублей - бесплатно',
    },
    {
      id: 'pickup',
      label: 'Самовывоз',
      description: 'ул. В. Гнаровской, 7 (ТЦ Тетрис) - зоомагазин "Сытая Морда"',
    },
    {
      id: 'rf',
      label: 'Доставка по РФ',
      description: 'от 1500 рублей (по предоплате) - 0 р.',
    },
  ];

  const handleDeliveryChange = (value) => {
    setDeliveryType(value);
  };

  const handleSubmitOrder = async () => {
    if (!agreed) return;
    
    // Валидация обязательных полей
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      alert('Пожалуйста, заполните все обязательные поля (имя, фамилия, телефон)');
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
      
      // Добавляем опциональные поля только если они заполнены
      if (email.trim()) {
        orderData.email = email.trim();
      }
      if (comment.trim()) {
        orderData.comment = comment.trim();
      }

      console.log('Sending order data:', orderData);
      
      const response = await api.post('/orders', orderData);
      
      if (response.status === 201 || response.status === 200) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка';
      alert(`Ошибка при оформлении заказа: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen
  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-slate-50 py-0 px-2 flex items-center justify-center">
        <div className="mx-auto max-w-286.5 w-full rounded-3xl bg-linear-to-br from-orange-400 to-orange-500 p-8 shadow-2xl shadow-orange-200 text-white">
          <div className="flex justify-between px-6 items-center text-center gap-6">
            <div>
            <h1 className="text-4xl mb-2 font-bold">Спасибо за заказ!</h1>
            <p className="text-4xl mb-2 font-bold">Вы восхитительны!</p>
            <p className="text-base mb-2 text-orange-50">В ближайшее время мы свяжемся с вами.<br />Остати, у нас туг акции:</p>
            <a href="/" className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-3 text-base font-semibold text-orange-600 transition hover:bg-orange-50">В главную →</a>
            </div>
            <div className="text-[120px]">😸</div>
          </div>
        </div>
      </main>
    );
  }

  // Checkout form
  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 text-slate-900">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl shadow-slate-200">
        <h1 className="text-3xl font-semibold tracking-tight">Оформление заказа</h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-8">
            <div className="rounded-3xl p-6">
              <h2 className="text-lg font-semibold">Покупатель</h2>
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm text-slate-600">Имя</span>
                  <input type="text" placeholder="Иван" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-600">Фамилия</span>
                  <input type="text" placeholder="Иванов" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-600">Телефон</span>
                  <input type="tel" placeholder="+7 (000) 000 00 00" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" />
                </label>
                <label className="block">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-600">E-mail</span>
                    <span className="text-xs font-medium text-emerald-600">необязательно</span>
                  </div>
                  <input type="email" placeholder="myname@mail.ru" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" />
                </label>
              </div>
            </div>

            {deliveryType === 'pickup' ? (
              <div className="rounded-3xl p-6">
                <h2 className="text-lg font-semibold">Комментарий к заказу</h2>
                <textarea placeholder="Комментарий" value={comment} onChange={(e) => setComment(e.target.value)} rows="6" className="mt-4 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" />
              </div>
            ) : (
              <div className="rounded-3xl p-6">
                <h2 className="text-lg font-semibold">Адрес доставки</h2>
                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-sm text-slate-600">Город</span>
                    <input type="text" placeholder="Ваш город" value={city} onChange={(e) => setCity(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-600">Адрес</span>
                    <input type="text" placeholder="Улица, дом, подъезд" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" />
                  </label>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-8">
            <div className="rounded-3xl p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Способ доставки</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {deliveryOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleDeliveryChange(option.id)}
                    className={`flex w-full items-start gap-4 rounded-3xl border px-5 py-4 text-left transition ${deliveryType === option.id ? 'border-orange-400 bg-orange-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <span className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border ${deliveryType === option.id ? 'border-orange-500 bg-orange-500' : 'border-slate-300 bg-white'}`}>
                      {deliveryType === option.id ? <span className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">{option.label}</p>
                      <p className="text-sm text-slate-500">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl p-6">
              <h2 className="text-lg font-semibold">Способ оплаты</h2>
              <p className="mt-4 text-sm text-slate-600">Оплата при получении наличными или картой</p>
            </div>

            {deliveryType !== 'pickup' && (
              <div className="rounded-3xl p-6">
                <h2 className="text-lg font-semibold">Комментарий к заказу</h2>
                <textarea placeholder="Ваш комментарий" value={comment} onChange={(e) => setComment(e.target.value)} rows="6" className="mt-4 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" />
              </div>
            )}
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-5 rounded-3xl p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Сумма заказа</p>
            <p className="text-2xl font-semibold">6890 ₽</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400" />
              <span>Я прочитал и согласен с <span className="font-semibold text-orange-600">Условиями соглашения</span></span>
            </label>
            <button type="button" onClick={handleSubmitOrder} disabled={!agreed || isLoading} className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300">
              {isLoading ? 'Отправка...' : 'Подтвердить заказ'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
