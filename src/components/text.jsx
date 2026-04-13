import { useTranslation } from 'react-i18next';

export default function Textinfo() {
  const { t } = useTranslation();

  return (
    <div className="py-10 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 p-6 md:p-10 rounded-2xl shadow-sm border border-gray-50 dark:border-slate-800 transition-colors duration-300">
        
        {/* Title */}
        <h1 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white mb-4 uppercase tracking-tight">
          {t('seo_title')}
        </h1>

        {/* Paragraph */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm md:text-base leading-relaxed">
          {t('seo_p1')}
        </p>

        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm md:text-base leading-relaxed">
          {t('seo_p2')}
        </p>

        {/* Section title */}
        <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 border-l-4 border-[#ff9800] pl-4">
          {t('seo_h2_1')}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm md:text-base leading-relaxed">
          {t('seo_p3')}
        </p>

        {/* List */}
        <ul className="list-disc pl-8 space-y-2 text-gray-600 dark:text-gray-400 text-sm md:text-base mb-6">
          <li>{t('seo_li1')}</li>
          <li>{t('seo_li2')}</li>
          <li>{t('seo_li3')}</li>
          <li>{t('seo_li4')}</li>
          <li>{t('seo_li5')}</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm md:text-base leading-relaxed">
          {t('seo_p4')}
        </p>

        {/* Last section */}
        <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 border-l-4 border-[#ff9800] pl-4">
          {t('seo_h2_2')}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
          {t('seo_p5')}
        </p>

      </div>
    </div>
  );
}