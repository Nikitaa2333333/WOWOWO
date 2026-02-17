import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { SUBCATEGORIES, CATEGORIES } from '../lib/data';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import { Search, X, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../lib/routes';

interface SearchResult extends Product {
    categoryName?: string;
    subcategoryName?: string;
}

export const GlobalSearch: React.FC = () => {
    const { products: PRODUCTS } = useProducts();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);

    // Enrich products with category and subcategory names
    const enrichedProducts = useMemo(() => {
        return PRODUCTS.map(product => {
            const subcategory = SUBCATEGORIES.find(s => s.id === product.subcategoryId);
            const category = CATEGORIES.find(c => c.id === subcategory?.categoryId);
            return {
                ...product,
                subcategoryName: subcategory?.name,
                categoryName: category?.name,
            };
        });
    }, [PRODUCTS]);

    // Fuse.js configuration
    const fuse = useMemo(() => {
        return new Fuse(enrichedProducts, {
            keys: [
                { name: 'name', weight: 2 },
                { name: 'description', weight: 1 },
                { name: 'specs', weight: 1.5 },
                { name: 'categoryName', weight: 0.5 },
                { name: 'subcategoryName', weight: 0.7 },
            ],
            threshold: 0.4, // 0 = exact match, 1 = match anything
            includeScore: true,
            minMatchCharLength: 2,
        });
    }, [enrichedProducts]);

    // Perform search when query changes
    useEffect(() => {
        if (query.trim().length >= 2) {
            const searchResults = fuse.search(query);
            setResults(searchResults.map(result => result.item));
        } else {
            setResults([]);
        }
    }, [query, fuse]);

    // Keyboard shortcut (Ctrl/Cmd + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white shadow-lg"
                aria-label="Открыть поиск (Ctrl+K)"
            >
                <Search className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Поиск...</span>
                <kbd className="hidden md:inline-block px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">
                    Ctrl K
                </kbd>
            </button>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
                onClick={() => setIsOpen(false)}
            />

            {/* Search Modal */}
            <div className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-[70]">
                <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Поиск оборудования, реактивов, инструментов..."
                            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-base"
                        />
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Закрыть поиск"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-[60vh] overflow-y-auto">
                        {query.trim().length < 2 ? (
                            <div className="p-8 text-center text-gray-500">
                                <p className="text-sm">Введите минимум 2 символа для поиска</p>
                                <p className="text-xs mt-2 text-gray-400">
                                    Поиск работает по названию, описанию и характеристикам
                                </p>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-sm font-medium">Ничего не найдено</p>
                                <p className="text-xs mt-1 text-gray-400">
                                    Попробуйте изменить запрос
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {results.slice(0, 10).map((product) => {
                                    const subcategory = SUBCATEGORIES.find(s => s.id === product.subcategoryId);
                                    const category = CATEGORIES.find(c => c.id === subcategory?.categoryId);

                                    return (
                                        <Link
                                            key={product.id}
                                            to={ROUTES.PRODUCT(category?.id || '', subcategory?.id || '', product.id)}
                                            onClick={() => setIsOpen(false)}
                                            className="block px-4 py-3 hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Package className="w-5 h-5 text-indigo-600" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                                        {product.categoryName} → {product.subcategoryName}
                                                    </p>
                                                    {product.specs && product.specs.length > 0 && (
                                                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                                            {product.specs[0]}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className={`text-xs px-2 py-1 rounded-full ${product.inStock
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {product.inStock ? 'В наличии' : 'Под заказ'}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}

                                {results.length > 10 && (
                                    <div className="px-4 py-3 text-center text-xs text-gray-500 bg-gray-50">
                                        Показано 10 из {results.length} результатов
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50/50">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>💡 Поддержка опечаток и синонимов</span>
                            <span className="flex items-center gap-2">
                                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">
                                    Esc
                                </kbd>
                                закрыть
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
