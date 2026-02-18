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

    return (
        <div className="relative w-full">
            {/* Search Input Area */}
            <div className="relative flex items-center group">
                <Search className="absolute left-4 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Поиск оборудования..."
                    className="w-full pl-11 pr-14 py-2 bg-white rounded-xl border border-gray-200 focus:border-blue-600 transition-colors text-sm font-medium text-gray-900 placeholder-gray-400 outline-none"
                />

                {query && (
                    <button
                        onClick={() => { setQuery(''); setResults([]); }}
                        className="absolute right-12 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}

                <div className="absolute right-3 p-1.5 bg-gray-50 text-gray-400 rounded-lg group-focus-within:bg-blue-600 group-focus-within:text-white transition-colors">
                    <Search className="w-4 h-4" />
                </div>
            </div>

            {/* Results Dropdown */}
            {isOpen && query.trim().length >= 2 && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                        <div className="max-h-[60vh] overflow-y-auto">
                            {results.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Package className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                                    <p className="text-sm font-medium">Ничего не найдено</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {results.slice(0, 8).map((product) => {
                                        const subcategory = SUBCATEGORIES.find(s => s.id === product.subcategoryId);
                                        const category = CATEGORIES.find(c => c.id === subcategory?.categoryId);
                                        return (
                                            <Link
                                                key={product.id}
                                                to={ROUTES.PRODUCT(category?.id || '', subcategory?.id || '', product.id)}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors group"
                                            >
                                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center p-1 border border-gray-100 group-hover:border-blue-100">
                                                    <img src={product.images?.[0]} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                                        {product.categoryName} → {product.subcategoryName}
                                                    </p>
                                                </div>
                                                <div className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${product.inStock ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                                                    }`}>
                                                    {product.inStock ? 'В наличии' : 'Под заказ'}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 flex justify-between">
                            <span>Найдено результатов: {results.length}</span>
                            <span>Esc чтобы закрыть</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
