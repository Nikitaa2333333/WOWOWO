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
  X
} from 'lucide-react';
import { CATEGORIES, SUBCATEGORIES } from '../lib/data';
import { useProducts } from '../context/ProductContext';
import clsx from 'clsx';
import type { Product } from '../types';
import { ROUTES } from '../lib/routes';

const Home: React.FC = () => {
  const { products: PRODUCTS } = useProducts();
  const [searchMode, setSearchMode] = useState<'category' | 'manufacturer'>('category');
  const [searchQuery, setSearchQuery] = useState('');

  const getIcon = (id: string) => {
    const iconClass = "w-full h-full text-gray-400 group-hover:text-blue-500 transition-colors duration-200";
    switch (id) {
      case 'general-lab': return <FlaskConical className={iconClass} stroke="url(#grad-blue)" />;
      case 'consumables': return <Package className={iconClass} stroke="url(#grad-green)" />;
      case 'analytical': return <Beaker className={iconClass} stroke="url(#grad-purple)" />;
      case 'thermo': return <Thermometer className={iconClass} stroke="url(#grad-orange)" />;
      case 'measuring': return <Gauge className={iconClass} stroke="url(#grad-yellow)" />;
      case 'centrifuge': return <RefreshCw className={iconClass} stroke="url(#grad-teal)" />;
      case 'distillation': return <Droplets className={iconClass} stroke="url(#grad-cyan)" />;
      case 'pharmaceutical': return <Pill className={iconClass} stroke="url(#grad-pink)" />;
      case 'microscopes': return <Microscope className={iconClass} stroke="url(#grad-indigo)" />;
      case 'laminar': return <Wind className={iconClass} stroke="url(#grad-sky)" />;
      case 'cleaning': return <Sparkles className={iconClass} stroke="url(#grad-emerald)" />;
      case 'furniture': return <Armchair className={iconClass} stroke="url(#grad-amber)" />;
      default: return <FlaskConical className={iconClass} stroke="url(#grad-blue)" />;
    }
  }

  // Calculate products per category
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

  // Enrich products with category and subcategory names
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

  // Fuse.js configuration
  const fuse = useMemo(() => {
    return new Fuse(enrichedProducts, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'description', weight: 1 },
        { name: 'specs', weight: 1.5 },
        { name: 'categoryName', weight: 0.5 },
        { name: 'subcategoryName', weight: 0.7 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [enrichedProducts]);

  // Search results
  const searchResults = useMemo(() => {
    if (searchQuery.trim().length >= 2) {
      return fuse.search(searchQuery)
        .map(result => result.item)
        .slice(0, 8); // Показываем только первые 8 результатов для скорости
    }
    return [];
  }, [searchQuery, fuse]);

  // Helper for highlighting text matches
  const HighlightText = ({ text, query }: { text: string; query: string }) => {
    if (!query.trim()) return <>{text}</>;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="text-blue-600 font-bold">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-10">
      {/* SVG Gradients Definition */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
          <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <linearGradient id="grad-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="grad-teal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5EEAD4" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
          <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5F3FC" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
          <linearGradient id="grad-pink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>
          <linearGradient id="grad-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5B4FC" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="grad-sky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D1FAE5" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-16 space-y-8">
        <img
          src="/logo.svg"
          alt="Graphic Lab"
          className="h-16 md:h-24 w-auto object-contain"
        />

        {/* Search Bar Container */}
        <div className="w-full max-w-2xl group flex flex-col items-center">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Поиск оборудования"
              className="block w-full pl-6 pr-24 py-4 rounded-2xl glass-panel bg-white/80 text-lg font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100/50 transition-all shadow-lg"
              placeholder="Поиск оборудования..."
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-14 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Очистить поиск"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => searchQuery.trim().length >= 2 && console.log('Search triggered:', searchQuery)}
              className="absolute right-2 p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-md flex items-center justify-center group z-20"
            >
              <Search className="h-6 w-6 group-hover:scale-110 transition-transform stroke-[2.5]" />
            </button>

            {/* Search Results Dropdown */}
            {searchQuery.trim().length >= 2 && (
              <div className="absolute top-full mt-2 w-full glass-panel rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={ROUTES.PRODUCT(product.categoryId!, product.subcategoryId, product.id)}
                      onClick={() => setSearchQuery('')}
                      className="block px-4 py-3 hover:bg-white/50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                          <img
                            src={(product.images && product.images.length > 0 ? product.images[0] : `https://placehold.co/100x100/f8fafc/94a3b8?text=${product.name.charAt(0)}`)}
                            alt=""
                            className="w-full h-full object-cover p-1 opacity-80"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 truncate">
                            <HighlightText text={product.name} query={searchQuery} />
                          </h4>
                          <p className="text-[10px] font-medium text-gray-500 mt-0.5">
                            {product.categoryName} → {product.subcategoryName}
                          </p>
                        </div>

                        <div className={`text-[10px] px-2 py-0.5 rounded-lg flex-shrink-0 font-bold ${product.inStock
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-50 text-gray-400'
                          }`}>
                          {product.inStock ? 'В наличии' : 'Под заказ'}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center bg-white/50">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-blue-400 opacity-50" />
                    </div>
                    <p className="text-gray-900 font-bold mb-1">Ничего не нашли?</p>
                    <p className="text-sm text-gray-500 mb-4">Подберем оборудование под вашу задачу за 15 минут.</p>
                    <button
                      onClick={() => { (window as any).openModal?.(); setSearchQuery(''); }}
                      className="bg-gray-900 text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition-all active:scale-95"
                    >
                      Связаться с менеджером
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Popular Search Tags */}
          <div className={clsx(
            "mt-4 flex flex-wrap justify-center gap-2 transition-opacity duration-300",
            searchQuery.length > 0 ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            <span className="text-xs font-bold text-gray-400 self-center mr-1">Часто ищут:</span>
            {['Микроскопы', 'Центрифуги', 'Шкафы', 'Пипетки'].map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/50 border border-white/40 text-gray-600 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>



        {/* Toggle */}
        <div className="flex gap-2 p-1 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40">
          <button
            onClick={() => setSearchMode('category')}
            className={clsx(
              "px-6 py-2 rounded-xl text-sm font-semibold min-h-[44px]",
              searchMode === 'category' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Категории
          </button>
          <button
            onClick={() => setSearchMode('manufacturer')}
            className={clsx(
              "px-6 py-2 rounded-xl text-sm font-semibold min-h-[44px]",
              searchMode === 'manufacturer' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Производители
          </button>
        </div>
      </div>

      {/* Content */}
      <div id="main-content" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchMode === 'category' ? (
          CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={ROUTES.CATEGORY(category.id)}
              className="bg-white rounded-2xl p-8 relative overflow-hidden group border border-gray-200 hover:border-blue-500 transition-colors duration-200 flex flex-col justify-between min-h-[240px]"
            >
              <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity">
                {getIcon(category.id)}
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {categoryCounts[category.id] || 0} позиций
                    </p>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                    {category.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
                  <span>Перейти</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-panel rounded-3xl p-8 flex items-center justify-center col-span-1 row-span-1 hover:bg-white/60 cursor-pointer group text-center">
              <span className="text-2xl font-bold text-gray-300 group-hover:text-gray-800">BRAND {i + 1}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;