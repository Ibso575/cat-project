import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Search, User, ShoppingBasket, Phone, 
  ChevronDown, Menu, X, Trash2, ShoppingCart, ExternalLink,
  Sun, Moon, Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toggleTheme, setLanguage, selectTheme, selectLanguage } from '../store/settingsSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  removeFromCart,
  addToCart,
  decreaseQuantity,
} from '../store/cartSlice';
import logo from '../assets/logo.svg';

const Navbar = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const cartRef = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);
  const currentLanguage = useSelector(selectLanguage);
  
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);

  const changeLanguage = (lng) => {
    dispatch(setLanguage(lng));
    setIsLangOpen(false);
  };

   // Sync search query with URL params if on products page
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false); // Close mobile menu if open
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setIsCartOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const topNavItems = [
    { key: 'about', active: true },
    { key: 'delivery' },
    { key: 'faq' },
    { key: 'reviews' },
    { key: 'articles' },
    { key: 'contacts' },
    { key: 'more', isDropdown: true },
  ];

  const categoryItems = [
    { key: 'cats',       label: t('cats'),       path: '/products?category=cats' },
    { key: 'dogs',       label: t('dogs'),       path: '/products?category=dogs' },
    { key: 'rodents',    label: t('rodents'),    path: '/products?category=rodents' },
    { key: 'birds',      label: t('birds'),      path: '/products?category=birds' },
    { key: 'aquarium',   label: t('aquarium'),   path: '/products?category=aquarium' },
    { key: 'vet',        label: t('vet'),        path: '/products?category=vet' },
    { key: 'promotions', label: t('promotions'), path: '/products?category=promotions' },
    { key: 'franchise',  label: t('franchise'),  path: '/products?category=franchise' },
    { key: 'vetclinic',  label: t('vetclinic'),  path: '/products?category=vetclinic' },
  ];

  const languages = [
    { code: 'ru', name: 'RU' },
    { code: 'uz', name: 'UZ' },
    { code: 'en', name: 'EN' },
  ];

  return (
    <header className="w-full font-sans text-xs antialiased relative">
      
      {/* 1. TOP BAR (Desktop only) */}
      <div className="hidden lg:block bg-[#f3f3f3] dark:bg-slate-950 text-[#4d4d4d] dark:text-gray-400 h-11 border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
        <div className="container flex h-full items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 cursor-pointer text-[14px]">
              <MapPin size={16} className="text-[#bfbfbf] dark:text-gray-500" />
              <span className="dark:text-gray-300">Новый Уренгой</span>
              <ChevronDown size={14} className="text-[#bfbfbf] dark:text-gray-500" />
            </div>
          </div>
          <nav className="flex-1 flex justify-center">
            <ul className="flex items-center gap-8 whitespace-nowrap">
              {topNavItems.map((item, index) => (
                <li key={index} className={`flex items-center gap-1 cursor-pointer text-[14px] hover:text-[#ff9800] transition-colors ${item.active ? 'text-[#ff9800] font-medium' : ''}`}>
                  <span>{t(item.key)}</span>
                  {item.isDropdown ? <ChevronDown size={14} className="text-[#b8b8b8]" /> : null}
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-[14px]">
              <Phone size={16} className="text-[#ff9800]" />
              <a href="tel:+73432594943" className="font-medium text-[#222] dark:text-gray-200">+7 (3432) 59-49-43</a>
            </div>
            <button className="text-[#d8921e] text-[22px] leading-none font-medium hover:text-[#ff9800] transition-colors">{t('order_call')}</button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="bg-white dark:bg-slate-900 py-2.5 lg:py-3 transition-colors duration-300 relative z-40">
        <div className="container flex items-center justify-between">
          
          {/* LOGO */}
          <div className="shrink-0 cursor-pointer">
            <a href="/">
            <img src={logo} alt="Logo" className="h-9 lg:h-16 w-auto" />
            </a>
          </div>

          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 mx-8 relative max-w-[560px]">
            <input 
              type="search" 
              placeholder="Поиск товаров" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-white dark:bg-slate-950 border border-[#d9d9d9] dark:border-slate-800 rounded-[4px] pl-5 pr-12 text-[22px] leading-none focus:outline-none focus:border-[#ff9800] dark:focus:border-[#ff9800] dark:text-white transition-colors duration-300"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b3b3b3] dark:text-gray-500 hover:text-[#ff9800] dark:hover:text-[#ff9800] transition-colors"><Search size={20} /></button>
          </form>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {/* Desktop buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <button className="px-5 h-12 border border-[#dedede] dark:border-slate-700 rounded-[6px] flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <User size={22} className="text-[#bfbfbf] dark:text-gray-500" />
                <span className="font-medium text-[#222] dark:text-gray-200 text-[22px] leading-none">Николай</span>
              </button>
              
              {/* CART BUTTON */}
              <div className="relative" ref={cartRef}>
                <button
                  onClick={() => setIsCartOpen((prev) => !prev)}
                  className="px-5 h-12 border border-[#dedede] dark:border-slate-700 rounded-[6px] flex items-center gap-2 relative hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ShoppingBasket size={22} className="text-[#bfbfbf] dark:text-gray-500" />
                  {cartCount > 0 && (
                    <span className="absolute top-2 left-7 min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold px-1">
                      {cartCount}
                    </span>
                  )}
                  <span className="font-medium text-[#222] dark:text-gray-100 text-[22px] leading-none">
                    {cartTotal > 0 ? `${cartTotal.toLocaleString()} ₽` : t('cart')}
                  </span>
                </button>

                {/* CART DROPDOWN */}
                {isCartOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-[380px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 z-[200] overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
                      <h3 className="font-bold text-[#333] dark:text-white text-base flex items-center gap-2">
                        <ShoppingCart size={18} className="text-[#ff9800]" />
                        {t('cart')}
                        {cartCount > 0 && (
                          <span className="bg-[#ff9800] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {cartCount}
                          </span>
                        )}
                      </h3>
                      <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <X size={18} />
                      </button>
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <ShoppingBasket size={48} className="mb-3 opacity-30" />
                        <p className="text-sm">{t('cart_empty')}</p>
                      </div>
                    ) : (
                      <>
                        <ul className="max-h-[320px] overflow-y-auto divide-y divide-gray-50 dark:divide-slate-700">
                          {cartItems.map((item) => (
                            <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                              {/* Image */}
                              <div className="w-14 h-14 rounded-xl bg-[#fff8ef] dark:bg-slate-700 flex-shrink-0 overflow-hidden">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ShoppingBasket size={20} />
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <Link
                                  to={`/products/${item.id}`}
                                  onClick={() => setIsCartOpen(false)}
                                  className="text-sm font-medium text-[#333] dark:text-gray-200 hover:text-[#ff9800] line-clamp-2 leading-snug"
                                >
                                  {item.name}
                                </Link>
                                <p className="text-xs text-gray-400 mt-0.5">{item.price} ₽</p>
                              </div>

                              {/* Quantity controls */}
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() => dispatch(decreaseQuantity(item.id))}
                                  className="w-7 h-7 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center hover:border-[#ff9800] hover:text-[#ff9800] dark:text-gray-300 transition"
                                >
                                  <span className="text-lg leading-none">−</span>
                                </button>
                                <span className="text-sm font-bold w-5 text-center dark:text-white uppercase">{item.quantity}</span>
                                <button
                                  onClick={() => dispatch(addToCart({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl }))}
                                  className="w-7 h-7 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center hover:border-[#ff9800] hover:text-[#ff9800] dark:text-gray-300 transition"
                                >
                                  <span className="text-lg leading-none">+</span>
                                </button>
                              </div>

                              {/* Price + delete */}
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <span className="text-sm font-bold text-[#333] dark:text-white">
                                  {(item.price * item.quantity).toLocaleString()} ₽
                                </span>
                                <button
                                  onClick={() => dispatch(removeFromCart(item.id))}
                                  className="text-gray-300 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>

                        {/* TOTAL + CHECKOUT */}
                        <div className="px-5 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-500">{t('total')}:</span>
                            <span className="text-lg font-black text-[#ff9800]">
                              {cartTotal.toLocaleString()} ₽
                            </span>
                          </div>
                          <Link
                            to={`/checkout/cart`}
                            onClick={() => setIsCartOpen(false)}
                            className="block w-full text-center bg-[#ff9800] hover:bg-[#e68600] text-white font-semibold py-3 rounded-full transition-all text-sm"
                          >
                            {t('checkout')} →
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* THEME TOGGLE */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="hidden"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* LANGUAGE SWITCHER */}
              <div className="relative hidden" ref={langRef}>
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="px-3 h-10 border border-gray-200 dark:border-slate-700 rounded-full flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <Globe size={18} className="text-[#bfbfbf]" />
                  <span className="font-bold text-xs">{currentLanguage.toUpperCase()}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLangOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-24 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-[200] overflow-hidden">
                    {languages.map((lng) => (
                      <button
                        key={lng.code}
                        onClick={() => changeLanguage(lng.code)}
                        className={`w-full px-4 py-2 text-left text-xs font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${currentLanguage === lng.code ? 'text-[#ff9800] bg-orange-50/50 dark:bg-orange-500/10' : 'text-gray-600 dark:text-gray-300'}`}
                      >
                        {lng.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* MOBILE HAMBURGER */}
            <button 
              className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={30} />
            </button>
          </div>

        </div>
      </div>

      {/* 3. CATEGORIES BAR (Desktop only) */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 pb-2 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300 relative z-30">
        <div className="container">
          <ul className="flex items-center justify-between text-[#2f2f2f] dark:text-gray-300 whitespace-nowrap">
            {categoryItems.map((item, index) => (
              <li key={index} className="flex items-center gap-1.5">
                <Link
                  to={item.path}
                  className="cursor-pointer py-2 px-1 hover:text-[#ff9800] dark:hover:text-[#ff9800] transition-colors text-[22px] leading-none"
                >
                  {item.label}
                </Link>
                {item.key === 'promotions' && <span className="w-2.5 h-2.5 bg-[#ff9800] rounded-full animate-pulse"></span>}
                {item.key === 'vetclinic' && <ExternalLink size={14} className="text-[#ff9800]" />}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. MOBILE DRAWER */}
      <div className={`
        lg:hidden fixed inset-0 bg-white dark:bg-slate-950 z-[100] transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8 border-b dark:border-slate-800 pb-4">
            <img src={logo} alt="Logo" className="h-9" />
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="search" 
                placeholder="Поиск товаров" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-slate-900 rounded-xl p-4 pr-12 outline-none text-base focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#ff9800]/20 dark:text-gray-200 transition-all"
              />
              <button type="submit" className="absolute right-4 top-4 text-gray-400 dark:text-gray-500">
                <Search size={20} />
              </button>
            </form>

            <nav>
              <h3 className="font-bold text-lg mb-4 text-[#316c8c] border-l-4 border-[#316c8c] pl-3">Категории</h3>
              <ul className="space-y-4">
                {categoryItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between text-lg text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-slate-800 pb-2 hover:text-[#ff9800] dark:hover:text-[#ff9800] transition-colors w-full"
                    >
                      {item.label}
                      <ChevronDown size={18} className="-rotate-90 text-gray-300 dark:text-gray-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-slate-800 space-y-4 transition-colors">
            <div className="flex items-center gap-3 text-xl font-bold text-[#ff9800]">
              <Phone /> +7 (3432) 59-49-43
            </div>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm font-medium">
              <MapPin size={18} /> Новый Уренгой
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;