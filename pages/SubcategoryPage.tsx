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

      <div className="flex flex-col lg:flex-row gap-8 mt-8">

        {/* SIDEBAR (Меню категорий) */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-2 border border-blue-100 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4 py-2 sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-gray-100">
                Категории
              </h3>
              <nav className="flex flex-col gap-0.5 p-2">
                {SUBCATEGORIES.map((cat) => {
                  const isActive = cat.id === subcategoryId;
                  return (
                    <Link
                      key={cat.id}
                      to={ROUTES.SUBCATEGORY(categoryId!, cat.id)}
                      className={clsx(
                        "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold",
                        isActive
                          ? "bg-gray-900 text-white shadow-lg scale-[1.02]"
                          : "text-gray-600 hover:bg-white/60 hover:text-blue-600"
                      )}
                    >
                      <span className="truncate mr-2">{cat.name}</span>
                      {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                    </Link>
                  );
                })}
              </nav>
            </div>


          </div>
        </aside>

        {/* MAIN CONTENT (Сетка товаров) */}
        <main className="flex-1 min-w-0">
          {/* Header категории */}
          <div className="glass-panel rounded-[2rem] p-8 mb-6 bg-white/40 border border-white/60 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2 leading-tight">
                {currentSubcategory.name}
              </h1>
              <p className="text-gray-500 font-medium text-xs flex items-center gap-2">
                <LayoutGrid className="w-3 h-3" />
                {allProducts.length} моделей в наличии
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/50 p-1.5 rounded-xl border border-white/60">
              <button
                onClick={() => setSortBy('name')}
                className={clsx("px-4 py-2 rounded-lg text-xs font-medium transition-all", sortBy === 'name' ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600")}
              >
                По названию
              </button>
              <button
                onClick={() => setSortBy('stock')}
                className={clsx("px-4 py-2 rounded-lg text-xs font-medium transition-all", sortBy === 'stock' ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600")}
              >
                По наличию
              </button>
            </div>
          </div>

          {/* Grid товаров */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={ROUTES.PRODUCT(categoryId!, subcategoryId!, product.id)}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-blue-500 transition-colors duration-200 flex flex-col h-full group"
                >
                  <div className="aspect-square bg-white relative p-6 flex items-center justify-center">
                    <img
                      src={(product.images && product.images.length > 0 ? product.images[0] : `https://placehold.co/600x600/f1f5f9/94a3b8?text=${encodeURIComponent(product.name)}`)}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
                    {product.inStock && (
                      <div className="absolute top-4 left-4 text-green-700 bg-green-50 px-2 py-1 rounded text-[10px] font-bold border border-green-100">
                        В наличии
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow border-t border-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                      {product.name}
                    </h3>

                    {/* Key Specs Preview - Critical for B2B */}
                    <div className="mb-4 space-y-1">
                      {product.specs.slice(0, 2).map((spec, i) => (
                        <div key={i} className="text-[10px] text-gray-500 flex items-start gap-1.5 leading-tight">
                          <span className="w-1 h-1 rounded-full bg-gray-300 mt-1 flex-shrink-0" />
                          <span className="line-clamp-1">{spec}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-medium group-hover:text-blue-600 transition-colors">
                        Подробнее
                      </span>
                      <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-300 text-6xl mb-4 font-black opacity-20">¯\_(ツ)_/¯</p>
                <p className="text-gray-400 font-bold">В этой категории пока нет товаров</p>
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
