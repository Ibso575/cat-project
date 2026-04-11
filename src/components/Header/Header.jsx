import { memo, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ChevronDown,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingBasket,
  User,
  X,
} from "lucide-react";
import logo from "../../assets/logo.svg";

const topNavItems = [
  { name: "О нас", href: "/" },
  { name: "Доставка и оплата", href: "/products" },
  { name: "Вопросы и ответы", href: "/products" },
  { name: "Отзывы", href: "/products" },
  { name: "Статьи", href: "/products" },
  { name: "Контакты", href: "/products" },
];

const categoryItems = [
  "Кошки",
  "Собаки",
  "Грызуны",
  "Птицы",
  "Аквариумистика",
  "Ветаптека",
  "Акции",
  "Франчайзинг",
  "Ветклиника",
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#efe5d8] bg-white/95 backdrop-blur">
      <div className="hidden border-b border-[#f0e4d2] bg-[#f8f3eb] lg:block">
        <div className="container flex items-center justify-between gap-4 py-2 text-xs text-slate-600">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1.5 transition hover:text-[#ff9800]">
              <MapPin size={16} className="text-[#d38b28]" />
              <span>Новый Уренгой</span>
              <ChevronDown size={14} />
            </button>
            <a
              href="tel:+73432594943"
              className="flex items-center gap-2 font-semibold text-slate-900 transition hover:text-[#ff9800]"
            >
              <Phone size={16} className="text-[#ff9800]" />
              +7 (3432) 59-49-43
            </a>
          </div>

          <nav className="flex items-center gap-5">
            {topNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `transition hover:text-[#ff9800] ${
                    isActive ? "font-semibold text-[#ff9800]" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <button className="font-semibold text-[#ff9800] transition hover:text-[#d97706]">
            Заказать звонок
          </button>
        </div>
      </div>

      <div className="container flex items-center gap-4 py-4 lg:py-5">
        <Link to="/" className="shrink-0">
          <img src={logo} alt="Сытая Морда" className="h-10 w-auto lg:h-14" />
        </Link>

        <div className="relative hidden flex-1 lg:block">
          <input
            type="search"
            placeholder="Поиск товаров"
            className="block w-full rounded-full border border-[#ead8c0] bg-[#fffaf4] px-6 py-3 pr-12 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#ff9800] focus:ring-4 focus:ring-[#ffe7c2]"
          />
          <Search
            size={18}
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="hidden items-center gap-2 rounded-full border border-[#ead8c0] px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#ff9800] hover:text-[#ff9800] lg:flex">
            <User size={18} />
            Николай
          </button>
          <button className="hidden items-center gap-2 rounded-full border border-[#ead8c0] px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#ff9800] hover:text-[#ff9800] lg:flex">
            <span className="relative">
              <ShoppingBasket size={18} />
              <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff9800] px-1 text-[10px] text-white">
                14
              </span>
            </span>
            6800 ₽
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="rounded-2xl border border-[#ead8c0] p-3 text-slate-700 transition hover:border-[#ff9800] hover:text-[#ff9800] lg:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <div className="hidden border-t border-[#f5ebde] bg-white lg:block">
        <div className="container flex items-center justify-between gap-3 overflow-x-auto py-3 text-sm text-slate-600">
          {categoryItems.map((item) => (
            <button
              key={item}
              className="flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 transition hover:bg-[#fff2df] hover:text-[#ff9800]"
            >
              <span>{item}</span>
              {item === "Акции" ? (
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff9800]" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] transition lg:hidden ${
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 h-full w-full overflow-y-auto bg-white transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex min-h-full flex-col px-4 py-4 sm:px-5">
            <div className="mb-6 flex items-center justify-between border-b border-[#f2e6d7] pb-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <img src={logo} alt="Сытая Морда" className="h-10 w-auto" />
              </Link>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-full bg-[#fff5e8] p-2 text-slate-700"
              >
                <X size={22} />
              </button>
            </div>

            <div className="relative mb-6">
              <input
                type="search"
                placeholder="Поиск товаров"
                className="block h-[44px] w-full rounded-2xl border border-[#ead8c0] bg-[#fffaf4] px-4 pr-11 text-sm outline-none focus:border-[#ff9800]"
              />
              <Search
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-[#f2e6d7] px-4 py-3 text-sm font-semibold text-slate-700">
                <User size={18} />
                Николай
              </button>
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-[#f2e6d7] px-4 py-3 text-sm font-semibold text-slate-700">
                <ShoppingBasket size={18} />
                6800 ₽
              </button>
            </div>

            <div className="mb-6 border-b border-[#f2e6d7] pb-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#ff9800]">
                Навигация
              </p>
              <nav className="grid gap-2">
                {topNavItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-2xl border border-[#f2e6d7] px-4 py-3 text-sm text-slate-700 transition hover:border-[#ff9800] hover:text-[#ff9800]"
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex-1 overflow-y-auto">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#ff9800]">
                Категории
              </p>
              <nav className="flex flex-col gap-3">
              {categoryItems.map((item) => (
                <button
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-[#f2e6d7] px-4 py-3 text-left text-sm text-slate-700"
                >
                  <span>{item}</span>
                  <ChevronDown size={18} className="-rotate-90 text-slate-300" />
                </button>
              ))}
              </nav>
            </div>

            <div className="mt-8 border-t border-[#f2e6d7] pt-6 text-sm text-slate-600">
              <a
                href="tel:+73432594943"
                className="mb-3 flex items-center gap-2 font-semibold text-[#ff9800]"
              >
                <Phone size={18} />
                +7 (3432) 59-49-43
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                Новый Уренгой
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
