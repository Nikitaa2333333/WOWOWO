import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ChevronRight,
  Zap,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { ROUTES } from '../lib/routes';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-40 md:pb-32 px-4 z-40 overflow-hidden">
        {/* Background Blobs Container (Clipped) */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-30">
            <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/30 blur-[120px] rounded-full" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-20">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-gray-900 leading-[1.1] mb-8">
            Современное <br className="hidden sm:block" /><span className="text-blue-600">лабораторное</span> оборудование
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-2xl text-gray-500 font-medium leading-relaxed mb-12 opacity-80">
            Профессиональные решения для лабораторий. Точность, надежность и передовые технологии.
          </p>

          <Link
            to={ROUTES.CATALOG}
            className="inline-flex items-center gap-4 bg-gray-900 text-white px-10 py-6 rounded-full text-xl font-bold shadow-lg hover:bg-blue-600 transition-colors group"
          >
            <span>Перейти в каталог</span>
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </div>
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-4 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: <Zap className="w-6 h-6" />, label: "Быстрая доставка", sub: "По всей России" },
            { icon: <ShieldCheck className="w-6 h-6" />, label: "Контроль качества", sub: "Сертификаты ISO" },
            { icon: <Truck className="w-6 h-6" />, label: "Бесплатный расчёт", sub: "КП за 15 минут" },
            { icon: <Package className="w-6 h-6" />, label: "Надёжная упаковка", sub: "По стандартам" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-[32px] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-blue-200 shadow-md">
                {item.icon}
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">{item.label}</h4>
              <p className="text-sm text-gray-400 font-medium">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;