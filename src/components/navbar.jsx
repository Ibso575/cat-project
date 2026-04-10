import React, { useState } from 'react';
import { 
  MapPin, Search, User, ShoppingBasket, Phone, 
  ChevronDown, Menu, X 
} from 'lucide-react';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const topNavItems = [
    { name: 'О нас', active: true },
    { name: 'Доставка и оплата' },
    { name: 'Вопросы и ответы' },
    { name: 'Отзывы' },
    { name: 'Статьи' },
    { name: 'Контакты' },
    { name: 'Еще', isDropdown: true },
  ];

  const categoryItems = [
    'Кошки', 'Собаки', 'Грызуны', 'Птицы', 
    'Аквариумистика', 'Ветаптека', 'Акции', 
    'Франчайзинг', 'Ветклиника'
  ];

  return (
    <header className="w-full font-sans text-xs antialiased relative">
      
      {/* 1. YUQORI PANEL (Faqat Desktop) */}
      <div className="hidden lg:block bg-[#f2f2f2] text-[#4d4d4d] py-2 border-b border-gray-200">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 cursor-pointer">
              <MapPin size={16} className="text-[#bfbfbf]" />
              <span>Новый Уренгой</span>
              <ChevronDown size={14} className="text-[#bfbfbf]" />
            </div>
            <div className="flex items-center gap-1.5">
              <Phone size={16} className="text-[#ff9800]" />
              <a href="tel:+73432594943" className="font-medium text-[#222]">+7 (3432) 59-49-43</a>
            </div>
          </div>
          <nav className="flex-1 flex justify-center">
            <ul className="flex items-center gap-5 whitespace-nowrap">
              {topNavItems.map((item, index) => (
                <li key={index} className={`cursor-pointer hover:text-[#ff9800] ${item.active ? 'text-[#ff9800] font-medium' : ''}`}>
                  {item.name}
                </li>
              ))}
            </ul>
          </nav>
          <button className="text-[#ff9800] font-medium hover:underline">Заказать звонок</button>
        </div>
      </div>

      {/* 2. ASOSIY NAVBAR */}
      <div className="bg-white py-3 lg:py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* LOGO - Har doim eng chapda */}
          <div className="flex-shrink-0 cursor-pointer">
            <img src={logo} alt="Logo" className="h-9 lg:h-14 w-auto" />
          </div>

          {/* DESKTOP QIDIRUV (Mobilda yashirin) */}
          <div className="hidden lg:flex flex-1 mx-10 relative max-w-2xl">
            <input 
              type="search" 
              placeholder="Поиск товаров" 
              className="w-full bg-[#f9f9f9] border border-gray-200 rounded-full pl-6 pr-12 py-3 text-sm focus:outline-none focus:border-[#ff9800]"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4d4d4d]"><Search size={20} /></button>
          </div>

          {/* O'NG TOMONDAGI ELEMENTLAR (Desktop: User/Savat | Mobil: Hamburger) */}
          <div className="flex items-center gap-4">
            {/* Desktop tugmalari (Mobilda yashirin) */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="px-6 py-3 border border-gray-200 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-colors">
                <User size={22} className="text-[#bfbfbf]" />
                <span className="font-medium text-[#222]">Николай</span>
              </button>
              
              <button className="px-6 py-3 border border-gray-200 rounded-full flex items-center gap-2 relative hover:bg-gray-50 transition-colors">
                <ShoppingBasket size={22} className="text-[#bfbfbf]" />
                <span className="absolute top-2 left-7 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">14</span>
                <span className="font-medium text-[#222]">6800 P</span>
              </button>
            </div>

            {/* MOBIL HAMBURGER - Har doim eng o'ngda */}
            <button 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={30} />
            </button>
          </div>

        </div>
      </div>

      {/* 3. KATEGORIYALAR PANELI (Faqat Desktop) */}
      <div className="hidden lg:block bg-white pb-3 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-between text-[#4d4d4d] whitespace-nowrap">
            {categoryItems.map((item, index) => (
              <li key={index} className="cursor-pointer py-2 px-1 hover:text-[#316c8c] transition-colors flex items-center gap-1.5">
                {item}
                {item === 'Акции' && <span className="w-2.5 h-2.5 bg-[#ff9800] rounded-full"></span>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. MOBIL DRAWER (Menyu ochilganda) */}
      <div className={`
        lg:hidden fixed inset-0 bg-white z-[100] transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-4 flex flex-col h-full">
          {/* Mobil Menyu Tepasi: Logo chapda, X o'ngda */}
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <img src={logo} alt="Logo" className="h-9" />
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Mobil Qidiruv */}
            <div className="relative">
              <input 
                type="search" 
                placeholder="Поиск товаров" 
                className="w-full bg-gray-100 rounded-xl p-4 outline-none text-base"
              />
              <Search className="absolute right-4 top-4 text-gray-400" size={20} />
            </div>

            {/* Mobil Kategoriyalar */}
            <nav>
              <h3 className="font-bold text-lg mb-4 text-[#316c8c] border-l-4 border-[#316c8c] pl-3">Категории</h3>
              <ul className="space-y-4">
                {categoryItems.map((item, index) => (
                  <li key={index} className="flex items-center justify-between text-lg text-gray-700 border-b border-gray-50 pb-2 active:text-[#ff9800]">
                    {item}
                    <ChevronDown size={18} className="-rotate-90 text-gray-300" />
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Mobil Footer (Bog'lanish) */}
          <div className="mt-auto pt-6 border-t border-gray-100 space-y-4">
            <div className="flex items-center gap-3 text-xl font-bold text-[#ff9800]">
              <Phone /> +7 (3432) 59-49-43
            </div>
            <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
              <MapPin size={18} /> Новый Уренгой
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;