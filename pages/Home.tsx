import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import {
  Search,
  FlaskConical,
  Microscope,
  Thermometer,
  Package,
  Beaker,
  Gauge,
  RefreshCw,
  Droplets,
  Pill,
  Wind,
  Sparkles,
  Armchair,
  ChevronRight,
  X,
  Zap,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { CATEGORIES, SUBCATEGORIES } from '../lib/data';
import { useProducts } from '../context/ProductContext';
import clsx from 'clsx';
import { ROUTES } from '../lib/routes';

const Home: React.FC = () => {
  const { products: PRODUCTS } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const getIcon = (id: string) => {
    const iconClass = "w-full h-full text-gray-200 group-hover:text-blue-500 transition-colors duration-300";
    switch (id) {
      case 'general-lab': return <FlaskConical className={iconClass} />;
      case 'consumables': return <Package className={iconClass} />;
      case 'analytical': return <Beaker className={iconClass} />;
      case 'thermo': return <Thermometer className={iconClass} />;
      case 'measuring': return <Gauge className={iconClass} />;
      case 'centrifuge': return <RefreshCw className={iconClass} />;
      case 'distillation': return <Droplets className={iconClass} />;
      case 'pharmaceutical': return <Pill className={iconClass} />;
      case 'microscopes': return <Microscope className={iconClass} />;
      case 'laminar': return <Wind className={iconClass} />;
      case 'cleaning': return <Sparkles className={iconClass} />;
      case 'furniture': return <Armchair className={iconClass} />;
      default: return <FlaskConical className={iconClass} />;
    }
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PRODUCTS.forEach(product => {
      const sub = SUBCATEGORIES.find(s => s.id === product.subcategoryId);
      if (sub) {
        counts[sub.categoryId] = (counts[sub.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [PRODUCTS]);

  const enrichedProducts = useMemo(() => {
    return PRODUCTS.map(product => {
      const subcategory = SUBCATEGORIES.find(s => s.id === product.subcategoryId);
      const category = CATEGORIES.find(c => c.id === subcategory?.categoryId);
      return {
        ...product,
        subcategoryName: subcategory?.name,
        categoryName: category?.name,
        categoryId: category?.id,
      };
    });
  }, [PRODUCTS]);

  const fuse = useMemo(() => {
    return new Fuse(enrichedProducts, {
      keys: ['name', 'categoryName', 'subcategoryName'],
      threshold: 0.3,
    });
  }, [enrichedProducts]);

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length >= 2) {
      return fuse.search(searchQuery).map(r => r.item).slice(0, 5);
    }
    return [];
  }, [searchQuery, fuse]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-12 md:pt-32 md:pb-24 px-4 isolate">
        {/* Background Blobs Container (Clipped) */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-indigo-400/30 blur-[120px] rounded-full" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-20">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Современное <br className="hidden sm:block" /><span className="text-blue-600">лабораторное</span> оборудование
          </h1>
          <p className="max-w-xl mx-auto text-base md:text-xl text-gray-500 font-medium leading-relaxed mb-10 opacity-80">
            Профессиональные решения для лабораторий. Точность, надежность и передовые технологии.
          </p>

          {/* Premium Search */}
          <div className="max-w-2xl mx-auto relative group z-50 text-left">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по каталогу..."
                className="w-full pl-6 pr-14 py-4 md:py-6 rounded-full bg-white border border-gray-200 text-base md:text-xl font-medium shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all relative z-20"
              />
              <div className="absolute right-3 p-3 bg-gray-900 text-white rounded-full shadow-lg z-20">
                <Search className="w-5 h-5" />
              </div>
            </div>

            {/* Live Results Dropdown */}
            {searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="p-2 space-y-1">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={ROUTES.PRODUCT(product.categoryId!, product.subcategoryId, product.id)}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all group"
                      >
                        <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-100 p-1">
                          <img src={product.images?.[0]} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">{product.categoryName}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-400 font-medium text-sm">Ничего не найдено</div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-4 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: <Zap className="w-5 h-5" />, label: "Быстрая доставка", sub: "По всей России" },
            { icon: <ShieldCheck className="w-5 h-5" />, label: "Контроль качества", sub: "Сертификаты ISO" },
            { icon: <Truck className="w-5 h-5" />, label: "Бесплатный расчёт", sub: "КП за 15 минут" },
            { icon: <Package className="w-5 h-5" />, label: "Надёжная упаковка", sub: "По стандартам" },
          ].map((item, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-lg border border-white/60 p-4 md:p-6 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-2 shadow-blue-200 shadow-lg">
                {item.icon}
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-0.5">{item.label}</h4>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 px-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Каталог товаров</h2>
              <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={ROUTES.CATEGORY(category.id)}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[220px] overflow-hidden"
              >
                <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-5 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12 group-hover:text-blue-100 transition-all duration-500 text-gray-200">
                  {getIcon(category.id)}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-blue-600 mb-1">
                      {categoryCounts[category.id] || 0} моделей
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {category.name}
                    </h3>
                  </div>

                  <div className="mt-auto flex items-center gap-2 text-xs font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
                    <span>Перейти в каталог</span>
                    <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;