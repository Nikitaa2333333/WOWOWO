import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlobalSearch } from './GlobalSearch';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '../lib/routes';

const Header: React.FC = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
            <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to={ROUTES.HOME} className="flex items-center gap-2 flex-shrink-0">
                    <img src="/logo.svg" alt="Graphic Lab" className="h-8 w-auto" />
                </Link>

                {/* Search & Actions */}
                <div className="flex items-center gap-2 flex-grow justify-end max-w-md">
                    <GlobalSearch />
                </div>
            </div>
        </header>
    );
};

export default Header;
