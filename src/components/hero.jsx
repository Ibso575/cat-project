import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import catImg from "../assets/cat.png";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white py-6 lg:py-20 ">
      <div className="container mx-auto px-4">
        
        <div className="relative w-full bg-[#ff9800] rounded-[16px] lg:rounded-[40px] 
        p-6 lg:p-12 flex items-center min-h-[260px] lg:min-h-[360px] 
        overflow-visible shadow-2xl">

          {/* MATN */}
          <div className="w-full lg:w-1/2 space-y-4 z-20">
            <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-black leading-[1.1]">
              Лохматость сильно
              <br />
              повысится!
            </h1>

            <p className="text-white text-sm lg:text-lg font-medium opacity-95">
              Скидка 20% на все шампуни
              <br />
              для котеек.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="bg-white text-[#ff9800] font-bold py-3 px-8 rounded-full flex items-center gap-3 hover:scale-105 transition"
            >
              Смотреть шампуни
              <ArrowRight size={22} />
            </button>
          </div>

          {/* MUSHUK */}
          <div className="hidden lg:block absolute right-[-51px] bottom-[-40px] w-[42%] overflow-hidden">
            <img
              src={catImg}
              alt="cat"
              className="w-full  
              translate-y-6 
              -translate-y-6 
              scale-80"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;