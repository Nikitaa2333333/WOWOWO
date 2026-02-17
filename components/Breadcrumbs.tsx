import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { CATEGORIES, SUBCATEGORIES } from '../lib/data';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8 px-1">
      <Link to="/" className="hover:text-gray-900 transition-colors flex items-center">
        <Home className="w-4 h-4" />
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        if (value === 'catalog') return null;

        let displayName = value;
        const category = CATEGORIES.find(c => c.id === value);
        if (category) displayName = category.name;

        const subcategory = SUBCATEGORIES.find(s => s.id === value);
        if (subcategory) displayName = subcategory.name;

        if (index > 2 && !isLast) return null; // Only show first few and last on mobile

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
            {isLast ? (
              <span className="font-bold text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">{displayName}</span>
            ) : (
              <Link to={to} className="hover:text-gray-900 transition-colors truncate max-w-[80px] sm:max-w-[150px]">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
