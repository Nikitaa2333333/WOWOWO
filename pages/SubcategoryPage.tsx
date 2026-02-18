import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SUBCATEGORIES } from '../lib/data';
import { useProducts } from '../context/ProductContext';
import Breadcrumbs from '../components/Breadcrumbs';
import { ArrowRight, LayoutGrid, Check, ChevronRight, FileText, MessageSquare } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { ROUTES } from '../lib/routes';
import clsx from 'clsx';

const SubcategoryPage: React.FC = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const navigate = useNavigate();
  const { getProductsBySubcategory, loading } = useProducts();
  const { openModal, openPDFModal } = useModal();
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 font-bold animate-pulse">Загрузка...</div>;
  if (!currentSubcategory) return <div className="p-20 text-center">Категория не найдена</div>;

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
      <Breadcrumbs />

      <div className="mt-4 md:mt-8">

        {/* MAIN CONTENT (Сетка товаров) */}
        <main className="flex-1 min-w-0 pb-20">
          {/* Header категории */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              {currentSubcategory.name}
            </h1>
          </div>

          {/* Grid товаров */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-blue-400 transition-colors duration-200 flex flex-col h-full group"
                >
                  <div className="aspect-[1.1] bg-white relative p-6 flex items-center justify-center border-b border-gray-50">
                    <img
                      src={(product.images && product.images.length > 0 ? product.images[0] : `https://placehold.co/600x600/f1f5f9/94a3b8?text=${encodeURIComponent(product.name)}`)}
                      alt={product.name}
                      className="max-width-full max-height-full object-contain mix-blend-multiply"
                      loading="lazy"
                    />

                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                      {product.name}
                    </h3>

                    <div className="flex flex-col gap-2 mb-6">
                      {product.description.split(',').map((part, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 leading-tight">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                          <span>{part.trim()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-3 flex items-center gap-2 justify-start">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPDFModal('/brochure.pdf');
                        }}
                        className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-[11px] font-semibold hover:bg-black transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Открыть PDF</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openModal(product.name);
                        }}
                        className="bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl text-[11px] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95 whitespace-nowrap"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        <span>Запросить предложение</span>
                      </button>
                    </div>
                  </div>
                </div>
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
