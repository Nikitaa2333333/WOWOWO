import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES, SUBCATEGORIES } from '../lib/data';
import { ROUTES } from '../lib/routes';
import Breadcrumbs from '../components/Breadcrumbs';
import { ChevronRight } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const currentCategory = CATEGORIES.find(c => c.id === categoryId);
  const relevantSubcategories = SUBCATEGORIES.filter(s => s.categoryId === categoryId);

  if (!currentCategory) return <div className="p-20 text-center font-bold">Категория не найдена</div>;

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
      <Breadcrumbs />

      <div className="mt-8 mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
          {currentCategory.name}
        </h1>
        <p className="text-gray-500 font-medium">Выберите интересующий вас подраздел</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relevantSubcategories.map((sub) => (
          <Link
            key={sub.id}
            to={ROUTES.SUBCATEGORY(categoryId!, sub.id)}
            className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all h-32 flex flex-col justify-start overflow-hidden"
          >
            <span className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors pr-8 z-10">
              {sub.name}
            </span>

            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-blue-600">
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>
        ))}
      </div>

      {relevantSubcategories.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold">В этом разделе пока нет подразделов</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
