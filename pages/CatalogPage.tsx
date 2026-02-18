import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import {
    Search,
    FlaskConical,
    Microscope,
    Thermometer,
    Package,
    Beaker,
    Gauge,
    RefreshCw,
    Droplets,
    Pill,
    Wind,
    Sparkles,
    Armchair,
    ChevronRight
} from 'lucide-react';
import { CATEGORIES, SUBCATEGORIES } from '../lib/data';
import { useProducts } from '../context/ProductContext';
import { ROUTES } from '../lib/routes';

const CatalogPage: React.FC = () => {
    const { products: PRODUCTS } = useProducts();
    const [searchQuery, setSearchQuery] = useState('');

    const categoryStyles: Record<string, { gradient: string; hoverGradient: string; iconColor: string }> = {
        'general-lab': { gradient: 'from-blue-50 to-indigo-50', hoverGradient: 'hover:from-blue-50 hover:to-indigo-50', iconColor: 'text-blue-500' },
        'consumables': { gradient: 'from-amber-50 to-orange-50', hoverGradient: 'hover:from-amber-50 hover:to-orange-50', iconColor: 'text-amber-500' },
        'analytical': { gradient: 'from-emerald-50 to-teal-50', hoverGradient: 'hover:from-emerald-50 hover:to-teal-50', iconColor: 'text-emerald-500' },
        'thermo': { gradient: 'from-rose-50 to-red-50', hoverGradient: 'hover:from-rose-50 hover:to-red-50', iconColor: 'text-rose-500' },
        'measuring': { gradient: 'from-purple-50 to-violet-50', hoverGradient: 'hover:from-purple-50 hover:to-violet-50', iconColor: 'text-purple-500' },
        'centrifuge': { gradient: 'from-cyan-50 to-blue-50', hoverGradient: 'hover:from-cyan-50 hover:to-blue-50', iconColor: 'text-cyan-500' },
        'distillation': { gradient: 'from-blue-50 to-sky-50', hoverGradient: 'hover:from-blue-50 hover:to-sky-50', iconColor: 'text-blue-500' },
        'pharmaceutical': { gradient: 'from-fuchsia-50 to-pink-50', hoverGradient: 'hover:from-fuchsia-50 hover:to-pink-50', iconColor: 'text-fuchsia-500' },
        'microscopes': { gradient: 'from-indigo-50 to-violet-50', hoverGradient: 'hover:from-indigo-50 hover:to-violet-50', iconColor: 'text-indigo-500' },
        'laminar': { gradient: 'from-teal-50 to-green-50', hoverGradient: 'hover:from-teal-50 hover:to-green-50', iconColor: 'text-teal-500' },
        'cleaning': { gradient: 'from-yellow-50 to-amber-50', hoverGradient: 'hover:from-yellow-50 hover:to-amber-50', iconColor: 'text-yellow-500' },
        'furniture': { gradient: 'from-stone-50 to-gray-50', hoverGradient: 'hover:from-stone-50 hover:to-gray-50', iconColor: 'text-stone-500' },
    };

    const getIcon = (id: string, className: string) => {
        switch (id) {
            case 'general-lab': return <FlaskConical className={className} />;
            case 'consumables': return <Package className={className} />;
            case 'analytical': return <Beaker className={className} />;
            case 'thermo': return <Thermometer className={className} />;
            case 'measuring': return <Gauge className={className} />;
            case 'centrifuge': return <RefreshCw className={className} />;
            case 'distillation': return <Droplets className={className} />;
            case 'pharmaceutical': return <Pill className={className} />;
            case 'microscopes': return <Microscope className={className} />;
            case 'laminar': return <Wind className={className} />;
            case 'cleaning': return <Sparkles className={className} />;
            case 'furniture': return <Armchair className={className} />;
            default: return <FlaskConical className={className} />;
        }
    }

    const enrichedProducts = useMemo(() => {
        return PRODUCTS.map(product => {
            const subcategory = SUBCATEGORIES.find(s => s.id === product.subcategoryId);
            const category = CATEGORIES.find(c => c.id === subcategory?.categoryId);
            return {
                ...product,
                subcategoryName: subcategory?.name,
                categoryName: category?.name,
                categoryId: category?.id,
            };
        });
    }, [PRODUCTS]);

    const fuse = useMemo(() => {
        return new Fuse(enrichedProducts, {
            keys: ['name', 'categoryName', 'subcategoryName'],
            threshold: 0.3,
        });
    }, [enrichedProducts]);

    const searchResults = useMemo(() => {
        if (searchQuery.trim().length >= 2) {
            return fuse.search(searchQuery).map(r => r.item).slice(0, 10);
        }
        return [];
    }, [searchQuery, fuse]);

    return (
        <div className="flex flex-col min-h-screen bg-white pb-24">
            {/* Header is global, but we need to inject the toggle there or hide the global header and render a custom one.
               For now, let's assume the user wants the Visual effect of a single header.
               
               If I can't easily modify the global header from here without context/prop drilling, 
               I might need to modify Header.tsx directly.
               
               I will RETURN from this tool and modify Header.tsx instead.
            */}

            {/* Categories Grid */}
            <section className="px-4 md:px-8 lg:px-12 py-8">
                <div className="max-w-[1920px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CATEGORIES.map((category) => {
                            const style = categoryStyles[category.id] || { gradient: 'from-gray-50 to-slate-50', hoverGradient: 'hover:from-gray-50 hover:to-slate-50', iconColor: 'text-gray-400' };

                            return (
                                <Link
                                    key={category.id}
                                    to={ROUTES.CATEGORY(category.id)}
                                    className={`group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-transparent hover:shadow-lg transition-all h-32 overflow-hidden flex flex-col justify-start bg-gradient-to-br ${style.hoverGradient}`}
                                >
                                    {/* Text - Top Left */}
                                    <h3 className="relative z-10 text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors max-w-[70%]">
                                        {category.name}
                                    </h3>

                                    {/* Icon - Peeking from Bottom Right */}
                                    <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity rotate-[-10deg]">
                                        {getIcon(category.id, `w-32 h-32 ${style.iconColor} stroke-[1.5]`)}
                                    </div>
                                </Link>
                            );
                        }
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CatalogPage;
