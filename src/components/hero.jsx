import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import catImg from "../assets/cat.png";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="w-full bg-white dark:bg-slate-900 transition-colors duration-300 py-6 lg:py-20">
      <div className="container mx-auto px-4">
        <div
          className="relative w-full bg-[#ff9800] dark:bg-orange-600 rounded-[16px] lg:rounded-[40px] 
        p-6 lg:p-12 flex items-center min-h-[260px] lg:min-h-[360px] 
        overflow-visible shadow-2xl transition-colors duration-300"
        >
          {/* MATN */}
          <div className="w-full lg:w-1/2 space-y-4 z-20">
            <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-black leading-[1.1]">
              {t("hero_title").split("!").map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}{i < arr.length - 1 ? "!" : ""}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
            </h1>

            <p className="text-white text-sm lg:text-lg font-medium opacity-95">
              {t("hero_subtitle")}
            </p>

            <button
              onClick={() => navigate("/products")}
              className="bg-white dark:bg-slate-900 text-[#ff9800] dark:text-white font-bold py-3 px-8 rounded-full flex items-center gap-3 hover:scale-105 transition shadow-lg"
            >
              {t("hero_button")}
              <ArrowRight size={22} />
            </button>
          </div>

          {/* MUSHUK */}
          <div className="hidden lg:block absolute right-[-50px] bottom-0 w-[40%] max-w-[500px] overflow-hidden pointer-events-none">
            <img
              src={catImg}
              alt="cat"
              className="w-full h-auto object-contain translate-y-4 scale-80 transition-all duration-700 hover:scale-100 hover:translate-y-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
