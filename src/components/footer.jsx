import React from "react";
import { FaVk, FaFacebookF, FaInstagram, FaTelegramPlane, FaYoutube } from "react-icons/fa";
import { ArrowUp } from "lucide-react";

const socials = [
  { Icon: FaVk,            href: "https://vk.com/sytaya_morda",        label: "ВКонтакте", color: "hover:bg-[#4C75A3]" },
  { Icon: FaInstagram,     href: "https://instagram.com/sytaya_morda", label: "Instagram",  color: "hover:bg-[#E1306C]" },
  { Icon: FaTelegramPlane, href: "https://t.me/sytaya_morda",          label: "Telegram",   color: "hover:bg-[#229ED9]" },
  { Icon: FaYoutube,       href: "https://youtube.com/@sytaya_morda",  label: "YouTube",    color: "hover:bg-[#FF0000]" },
  { Icon: FaFacebookF,     href: "https://facebook.com/sytayamorda",   label: "Facebook",   color: "hover:bg-[#1877F2]" },
];

export default function Footer() {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openChat = () => {
    window.open("https://t.me/@i_sobirov5", "_blank");
  };

  return (
    <footer className="bg-[#f5f5f5] border-t text-gray-600">
      <div className="container mx-auto px-4 py-10">

        {/* TOP */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b pb-6">
          <p className="text-sm text-gray-500 max-w-[220px]">
            Узнавайте о новых скидках и спецпредложениях:
          </p>

          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Ваш E-mail"
              className="px-4 py-2 w-full md:w-64 text-sm border border-gray-300 rounded-l-md outline-none focus:border-orange-500"
            />
            <button className="px-5 py-2 text-sm bg-gray-300 text-gray-500 rounded-r-md hover:bg-orange-500 hover:text-white transition-all duration-300">
              Подписаться
            </button>
          </div>

          {/* SOCIAL LINKS */}
          <div className="flex gap-3">
            {socials.map(({ Icon, href, label, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-all duration-300 hover:text-white hover:border-transparent ${color}`}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* LINKS */}
        <div className="flex flex-wrap justify-center md:justify-between gap-x-6 gap-y-3 text-sm py-6 border-b">
          {[
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
          ].map((item, i) => (
            <span
              key={i}
              className="cursor-pointer text-gray-500 hover:text-orange-500 transition-all duration-300"
            >
              {item}
            </span>
          ))}
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 pt-6">
          <p>© 2015-2019 Интернет-магазин зоотоваров «Сытая Морда»</p>

          <p className="text-center">
            Стоимость товаров на сайте не является публичной офертой
          </p>

          <div className="flex items-center gap-4">
            <span className="text-gray-500">+7 (3452) 59-49-45</span>
            <button className="text-orange-500 hover:underline">
              Заказать звонок
            </button>
          </div>
        </div>
      </div>

      {/* SCROLL TOP */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300"
      >
        <ArrowUp size={16} />
      </button>

      {/* CHAT BUTTON */}
      <button
        onClick={openChat}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#229ED9] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300"
      >
        <FaTelegramPlane size={22} />
      </button>
    </footer>
  );
}
