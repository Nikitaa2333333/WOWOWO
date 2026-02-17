import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import Breadcrumbs from '../components/Breadcrumbs';
import { CheckCircle2, Box } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import clsx from 'clsx';

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { getProductById, loading } = useProducts();
  const product = productId ? getProductById(productId) : undefined;
  const { openModal } = useModal();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [productId]);

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-400 font-bold">Загрузка информации...</div>;
  if (!product) return <div className="p-20 text-center font-bold text-gray-500">Товар не найден</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      <Breadcrumbs />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
        {/* Left Column: Images */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden aspect-[4/3] p-8 border border-gray-200 relative">
            <img
              src={(product.images && product.images.length > 0) ? product.images[activeImage] : `https://placehold.co/800x600/f8fafc/94a3b8?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {(product.images || []).map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImage(i)}
                className={clsx(
                  "rounded-lg aspect-square cursor-pointer transition-all overflow-hidden border",
                  activeImage === i ? "border-blue-600 ring-2 ring-blue-600/10" : "border-gray-200 hover:border-blue-400"
                )}
              >
                <img
                  src={img}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            {product.inStock ? (
              <span className="inline-flex items-center text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                В наличии
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                Под заказ
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            {product.name}
          </h1>

          <div className="text-gray-600 text-lg leading-relaxed mb-10">
            {product.description}
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 mb-6 flex items-center border-b border-gray-200 pb-4">
              <Box className="w-4 h-4 mr-2" />
              Характеристики
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {product.specs.map((spec, idx) => {
                const parts = spec.includes(':') ? spec.split(':') : [spec, ''];
                const label = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                return (
                  <div key={idx} className="flex flex-col border-b border-gray-200 pb-2 last:border-0">
                    <span className="text-[10px] font-bold text-gray-500">{label}</span>
                    <span className="text-gray-900 font-medium">{value || '✓'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => openModal(product.name)}
              className="flex-1 bg-gray-900 text-white font-bold text-lg py-4 px-8 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
            >
              Запросить КП
            </button>
            <button className="flex-1 border border-gray-300 text-gray-900 font-bold text-lg py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors">
              Контакты
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
