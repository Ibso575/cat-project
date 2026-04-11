import { memo } from "react";
import { ArrowUp } from "lucide-react";
import { FaFacebookF, FaInstagram, FaVk } from "react-icons/fa";

const footerLinks = [
  "О нас",
  "Доставка и оплата",
  "Вопросы и ответы",
  "Отзывы",
  "Франчайзинг",
  "Для юр.лиц",
  "Бонусная программа",
  "Контакты",
  "Акции",
  "Статьи",
  "Ветклиника",
];

function Footer() {
  return (
    <footer className="border-t border-[#efe5d8] bg-[#f7f2ea] text-slate-600">
      <div className="container py-10 lg:py-14">
        <div className="flex flex-col gap-6 border-b border-[#e7dac7] pb-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-xs text-sm text-slate-500">
            Узнавайте о новых скидках и специальных предложениях первыми.
          </p>

          <div className="flex w-full max-w-xl rounded-full border border-[#e2d2bc] bg-white p-1 shadow-sm">
            <input
              type="email"
              placeholder="Ваш E-mail"
              className="min-w-0 flex-1 rounded-full px-4 py-3 text-sm outline-none"
            />
            <button className="rounded-full bg-[#ff9800] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e68600]">
              Подписаться
            </button>
          </div>

          <div className="flex gap-3 text-slate-500">
            {[FaVk, FaFacebookF, FaInstagram].map((Icon, index) => (
              <button
                key={index}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e2d2bc] bg-white transition hover:border-[#ff9800] hover:text-[#ff9800]"
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-[#e7dac7] py-8 text-sm">
          {footerLinks.map((item) => (
            <button key={item} className="transition hover:text-[#ff9800]">
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-slate-500 lg:flex-row lg:items-center lg:justify-between">
          <p>© 2015-2019 Интернет-магазин зоотоваров «Сытая Морда»</p>
          <p>Стоимость товаров на сайте не является публичной офертой</p>
          <div className="flex items-center gap-4">
            <a href="tel:+73432594945" className="text-slate-700">
              +7 (3452) 59-49-45
            </a>
            <button className="font-semibold text-[#ff9800]">
              Заказать звонок
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 left-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#e2d2bc] bg-white text-slate-700 shadow-lg transition hover:border-[#ff9800] hover:text-[#ff9800]"
      >
        <ArrowUp size={16} />
      </button>
    </footer>
  );
}

export default memo(Footer);
