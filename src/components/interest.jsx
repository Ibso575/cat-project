import React from 'react';
import { ChevronRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    date: '02 июня 2020 г.',
    title: '10 причин завести льва и 34 причины этого не делать',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    date: '02 июня 2020 г.',
    title: 'Как стричь Лису-фенек дома. Подводные камни и лайфхаки',
    image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    date: '02 июня 2020 г.',
    title: 'Он ест все подряд - что делать?',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
  }
];

const ArticleCard = ({ article }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      {/* Rasm qismi hoverda kattalashadi */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Hoverda rasm ustiga yengil qora qatlam tushadi */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>

      {/* Ma'lumot qismi */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-gray-400 text-xs mb-3 font-medium">
          {article.date}
        </span>
        <h3 className="text-gray-800 text-lg font-bold leading-snug group-hover:text-[#ff9800] transition-colors duration-300 line-clamp-2">
          {article.title}
        </h3>
      </div>
    </div>
  );
};

const ArticlesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Sarlavha qismi */}
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
            Интересные статьи
          </h2>
          <button className="text-[#ff9800] flex items-center gap-1 font-bold hover:gap-2 transition-all">
            Смотреть все <ChevronRight size={20} />
          </button>
        </div>

        {/* Maqolalar to'plami (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default ArticlesSection;