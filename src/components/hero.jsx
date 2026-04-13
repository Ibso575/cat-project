import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import catImg from "../assets/cat.png";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = useMemo(
    () => [
      {
        title: t("hero_title", { defaultValue: "Лохматость сильно повысится!" }),
        subtitle: t("hero_subtitle", {
          defaultValue: "Скидка 20% на все шампуни для котеек.",
        }),
        button: t("hero_button", { defaultValue: "Смотреть шампуни" }),
        image: catImg,
        imageAlt: "cat",
        background: "linear-gradient(120deg, #ff9800 0%, #ffad33 100%)",
      },
      {
        title: t("hero_slides.food.title", {
          defaultValue: "Корм премиум-класса\nдля мурлык",
        }),
        subtitle: t("hero_slides.food.subtitle", {
          defaultValue: "Полезный рацион для энергии и блестящей шерсти.",
        }),
        button: t("hero_slides.food.button", { defaultValue: "Выбрать корм" }),
        image: catImg,
        imageAlt: "cat food",
        background: "linear-gradient(120deg, #14b8a6 0%, #2dd4bf 100%)",
      },
      {
        title: t("hero_slides.vet.title", {
          defaultValue: "Советы ветеринара\nв один клик",
        }),
        subtitle: t("hero_slides.vet.subtitle", {
          defaultValue: "Подберём уход и питание под возраст вашего питомца.",
        }),
        button: t("hero_slides.vet.button", { defaultValue: "Получить консультацию" }),
        image: catImg,
        imageAlt: "veterinarian",
        background: "linear-gradient(120deg, #6366f1 0%, #818cf8 100%)",
      },
    ],
    [t]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const formatTitle = (title) => {
    const normalized = title.includes("\n") ? title : title.replace("! ", "!\n");

    return normalized.split("\n").map((line) => (
      <span key={line} className="block">
        {line}
      </span>
    ));
  };

  return (
    <section className="w-full bg-white dark:bg-slate-900 transition-colors duration-300 py-6 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="relative w-full rounded-2xl lg:rounded-[40px] min-h-70 lg:min-h-105 overflow-hidden shadow-2xl">
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.imageAlt}
                className="min-w-full p-6 lg:p-12 flex items-center"
                style={{ background: slide.background }}
              >
                <div className="w-full lg:w-1/2 space-y-4 z-20">
                  <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-black leading-[1.1]">
                    {formatTitle(slide.title)}
                  </h1>

                  <p className="text-white text-sm lg:text-lg font-medium opacity-95">
                    {slide.subtitle}
                  </p>

                  <button
                    onClick={() => navigate("/products")}
                    className="bg-white text-brand font-bold py-3 px-8 rounded-full flex items-center gap-3 hover:scale-105 transition shadow-lg"
                  >
                    {slide.button}
                    <ArrowRight size={22} />
                  </button>
                </div>

                <div className="hidden lg:flex w-1/2 justify-end items-end pointer-events-none">
                  <img
                    src={slide.image}
                    alt={slide.imageAlt}
                    className={`max-h-90 w-auto object-contain transition-all duration-700 ${
                      activeSlide === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-80"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeSlide === index ? "w-8 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 left-3 right-3 lg:left-6 lg:right-6 flex justify-between z-30">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="h-9 w-9 lg:h-11 lg:w-11 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="h-9 w-9 lg:h-11 lg:w-11 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
