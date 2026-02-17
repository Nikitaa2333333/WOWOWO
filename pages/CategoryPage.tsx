import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SUBCATEGORIES } from '../lib/data';
import { ROUTES } from '../lib/routes';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Находим первую доступную подкатегорию для этой категории
    // В нашем случае, так как у нас пока одна структура, просто берем первую из списка
    const firstSubcategory = SUBCATEGORIES[0];

    if (firstSubcategory && categoryId) {
      // Мгновенный редирект на страницу с товарами и сайдбаром
      navigate(ROUTES.SUBCATEGORY(categoryId, firstSubcategory.id), { replace: true });
    }
  }, [categoryId, navigate]);

  // Пока идет редирект, показываем пустой экран или спиннер
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default CategoryPage;
