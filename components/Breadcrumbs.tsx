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

        let displayName = value;
        // Try to find readable names
        if (value === 'catalog') return null; // Skip 'catalog' in visual breadcrumbs if desired, or keep it. Let's keep it but rename.
        
        if (value === 'catalog') displayName = 'Каталог';
        
        const category = CATEGORIES.find(c => c.id === value);
        if (category) displayName = category.name;

        const subcategory = SUBCATEGORIES.find(s => s.id === value);
        if (subcategory) displayName = subcategory.name;

        // For product pages, we rely on the ID or just show "Product" if we don't want to fetch in this component
        // But let's try to be generic.
        
        if (pathnames[index-1] === 'product') {
             // If previous segment was 'product', this is an ID. 
             // Ideally we shouldn't fetch data in breadcrumbs, but for this mock:
             displayName = 'Товар'; 
        }

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            {isLast ? (
              <span className="font-medium text-gray-900 truncate max-w-[200px]">{displayName}</span>
            ) : (
              <Link to={to} className="hover:text-gray-900 transition-colors truncate max-w-[150px]">
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
