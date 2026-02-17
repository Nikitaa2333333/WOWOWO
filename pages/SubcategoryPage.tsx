import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SUBCATEGORIES } from '../lib/data';
import { useProducts } from '../context/ProductContext';
import Breadcrumbs from '../components/Breadcrumbs';
import { ArrowRight, LayoutGrid, Check, ChevronRight } from 'lucide-react';
import { ROUTES } from '../lib/routes';
import clsx from 'clsx';

const SubcategoryPage: React.FC = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const navigate = useNavigate();
  const { getProductsBySubcategory, loading } = useProducts();
  const [sortBy, setSortBy] = useState<'name' | 'stock'>('name');
  const [displayCount, setDisplayCount] = useState(24);

  // Получаем текущую подкатегорию
  const currentSubcategory = SUBCATEGORIES.find(s => s.id === subcategoryId);

  // Логика фильтрации и сортировки товаров
  const allProducts = useMemo(() => {
    if (!subcategoryId) return [];
    const list = getProductsBySubcategory(subcategoryId);
    return sortBy === 'name'
      ? [...list].sort((a, b) => a.name.localeCompare(b.name))
      : [...list].sort((a, b) => (a.inStock === b.inStock ? 0 : a.inStock ? -1 : 1));
  }, [subcategoryId, sortBy, getProductsBySubcategory]);

  const displayedProducts = allProducts.slice(0, displayCount);

  // Сбрасываем пагинацию при смене категории
  React.useEffect(() => {
    setDisplayCount(24);
    window.scrollTo(0, 0);
  }, [subcategoryId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 font-bold tracking-widest animate-pulse">ЗАГРУЗКА...</div>;
  if (!currentSubcategory) return <div className="p-20 text-center">Категория не найдена</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />

      <div className="flex flex-col lg:flex-row gap-8 mt-4 md:mt-8 relative items-start">
        {/* CATEGORY SELECTOR */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-20 z-10 transition-all">
          <div className="bg-white/50 backdrop-blur-md rounded-2xl border border-blue-50/50 p-2 shadow-sm lg:max-h-[85vh] lg:overflow-y-auto custom-scrollbar">

            {/* Mobile: Horizontal Title */}
            <h3 className="lg:hidden text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2 pt-1">
              Категории
            </h3>

            {/* Container for scrollable list */}
            <div className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar -mx-2 px-2 lg:mx-0 lg:px-0 scroll-smooth snap-x">
              {SUBCATEGORIES.map((cat) => {
                const isActive = cat.id === subcategoryId;
                return (
                  <Link
                    key={cat.id}
                    to={ROUTES.SUBCATEGORY(categoryId!, cat.id)}
                    className={clsx(
                      "flex-shrink-0 snap-start whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 border w-auto lg:w-full text-left flex items-center justify-between group",
                      isActive
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                        : "bg-white text-gray-500 border-transparent hover:bg-blue-50 hover:text-blue-700"
                    )}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className={clsx("hidden lg:block w-3 h-3 transition-opacity", isActive ? "text-gray-400" : "opacity-0 group-hover:opacity-100 text-blue-400")} />
                  </Link>
                );
              })}
            </div>

            {/* Desktop Title */}
            <h3 className="hidden lg:block text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2 px-4 mt-2 border-t border-gray-100 pt-3">
              Все категории
            </h3>
          </div>
        </aside>

        {/* MAIN CONTENT (Сетка товаров) */}
        <main className="flex-1 min-w-0 pb-20">
          {/* Header категории */}
          <div className="bg-white rounded-3xl p-6 md:p-8 mb-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 relative overflow-hidden">

            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -mr-16 -mt-16 opacity-50 pointer-events-none" />

            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2 leading-tight">
                {currentSubcategory.name}
              </h1>
              <p className="text-gray-500 font-semibold text-xs flex items-center gap-2">
                <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold">{allProducts.length}</span> моделей в каталоге
              </p>
            </div>

            <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl relative z-10">
              <button
                onClick={() => setSortBy('name')}
                className={clsx("px-4 py-2 rounded-lg text-xs font-bold transition-colors", sortBy === 'name' ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600")}
              >
                А-Я
              </button>
              <button
                onClick={() => setSortBy('stock')}
                className={clsx("px-4 py-2 rounded-lg text-xs font-bold transition-colors", sortBy === 'stock' ? "bg-white shadow-sm text-green-700" : "text-gray-400 hover:text-gray-600")}
              >
                Наличие
              </button>
            </div>
          </div>

          {/* Grid товаров */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={ROUTES.PRODUCT(categoryId!, subcategoryId!, product.id)}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-blue-400 transition-colors duration-200 flex flex-col h-full group"
                >
                  <div className="aspect-[1.1] bg-white relative p-6 flex items-center justify-center border-b border-gray-50">
                    <img
                      src={(product.images && product.images.length > 0 ? product.images[0] : `https://placehold.co/600x600/f1f5f9/94a3b8?text=${encodeURIComponent(product.name)}`)}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                      loading="lazy"
                    />
                    {/* Stock Badge - Compact & Absolute */}
                    <div className="absolute top-3 left-3">
                      {product.inStock ? (
                        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur border border-green-100 pr-2 pl-1.5 py-1 rounded-lg shadow-sm">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span className="text-[10px] font-bold text-green-700 leading-none">В наличии</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-gray-50/90 backdrop-blur border border-gray-100 pr-2 pl-1.5 py-1 rounded-lg">
                          <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                          <span className="text-[10px] font-bold text-gray-400 leading-none">Под заказ</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                      {product.name}
                    </h3>

                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {product.specs.slice(0, 1).map((s, i) => (
                          <span key={i} className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 line-clamp-1 max-w-[120px]">{s.split(':')[0]}</span>
                        ))}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-300 text-6xl mb-4 font-black opacity-20">¯\_(ツ)_/¯</p>
                <p className="text-gray-900 font-bold mb-1">В этой категории пока пусто</p>
                <p className="text-gray-400 text-sm">Попробуйте выбрать другую категорию</p>
              </div>
            )}
          </div>

          {displayCount < allProducts.length && (
            <div className="mt-16 flex justify-center">
              <button
                onClick={() => setDisplayCount(prev => prev + 24)}
                className="group relative bg-gray-900 text-white font-bold text-sm px-10 py-4 rounded-xl hover:shadow-lg transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Показать еще ({allProducts.length - displayCount})
                </span>
                <div className="absolute inset-0 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SubcategoryPage;
