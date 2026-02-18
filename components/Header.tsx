import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlobalSearch } from './GlobalSearch';
import { Menu, X, Phone, Mail, Clock } from 'lucide-react';
import { ROUTES } from '../lib/routes';

const Header: React.FC = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    // Logic to show toggle only on Catalog and Manufacturers pages
    const isCatalog = location.pathname.startsWith('/catalog') && !location.pathname.split('/')[2];
    const isManufacturers = location.pathname === '/manufacturers';
    const showToggle = isCatalog || isManufacturers;

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 py-2 flex flex-col gap-2">

                {/* Upper Section: Search & Contacts */}
                <div className="relative w-full flex justify-center min-h-[44px] items-center">

                    {/* Search (Centered, hidden on Home) */}
                    {!isHomePage && (
                        <div className="w-full max-w-2xl px-4 z-10 transition-all duration-300">
                            <GlobalSearch />
                        </div>
                    )}

                    {/* Contacts (Right, Absolute) */}
                    <div className="hidden lg:flex flex-col items-end gap-1 absolute right-0 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 z-20 bg-white pl-4">
                        <a href="tel:+79990000000" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <Phone className="w-3.5 h-3.5 text-blue-500" />
                            <span>+7 (999) 000-00-00</span>
                        </a>
                        <a href="mailto:info@graphic-lab.ru" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <Mail className="w-3.5 h-3.5 text-blue-500" />
                            <span>info@graphic-lab.ru</span>
                        </a>
                        <div className="flex items-center gap-2 cursor-default">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            <span>Пн-Пт 9:00 - 18:00</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Logo & Toggle */}
                <div className="relative flex items-end justify-between w-full h-12">
                    {/* Logo - Left, Aligned to bottom */}
                    <Link to={ROUTES.HOME} className="flex items-center pb-2 group">
                        <span className="text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors lowercase">
                            graf<span className="text-blue-400">it</span>
                        </span>
                    </Link>

                    {/* Central Toggle - Absolute Center Bottom */}
                    {showToggle && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-1">
                            <div className="inline-flex items-center bg-gray-100 p-1 rounded-xl shadow-sm">
                                <Link
                                    to={ROUTES.CATALOG}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${isCatalog
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-transparent text-gray-500 hover:text-blue-600'
                                        }`}
                                >
                                    По категориям
                                </Link>
                                <Link
                                    to={ROUTES.MANUFACTURERS}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${isManufacturers
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-transparent text-gray-500 hover:text-blue-600'
                                        }`}
                                >
                                    По производителям
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Right Spacer/Actions */}
                    <div className="w-20 hidden md:block" />
                </div>
            </div>
        </header>
    );
};

export default Header;
