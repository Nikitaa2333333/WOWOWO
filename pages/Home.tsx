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
  ChevronRight,
  X,
  Zap,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { CATEGORIES, SUBCATEGORIES } from '../lib/data';
import { useProducts } from '../context/ProductContext';
import clsx from 'clsx';
import { ROUTES } from '../lib/routes';

const Home: React.FC = () => {
  const { products: PRODUCTS } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const getIcon = (id: string) => {
    const iconClass = "w-full h-full text-gray-200 group-hover:text-blue-500 transition-colors duration-300";
    switch (id) {
      case 'general-lab': return <FlaskConical className={iconClass} />;
      case 'consumables': return <Package className={iconClass} />;
      case 'analytical': return <Beaker className={iconClass} />;
      case 'thermo': return <Thermometer className={iconClass} />;
      case 'measuring': return <Gauge className={iconClass} />;
      case 'centrifuge': return <RefreshCw className={iconClass} />;
      case 'distillation': return <Droplets className={iconClass} />;
      case 'pharmaceutical': return <Pill className={iconClass} />;
      case 'microscopes': return <Microscope className={iconClass} />;
      case 'laminar': return <Wind className={iconClass} />;
      case 'cleaning': return <Sparkles className={iconClass} />;
      case 'furniture': return <Armchair className={iconClass} />;
      default: return <FlaskConical className={iconClass} />;
    }
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PRODUCTS.forEach(product => {
      const sub = SUBCATEGORIES.find(s => s.id === product.subcategoryId);
      if (sub) {
        counts[sub.categoryId] = (counts[sub.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [PRODUCTS]);

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
      return fuse.search(searchQuery).map(r => r.item).slice(0, 5);
    }
    return [];
  }, [searchQuery, fuse]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.85] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            ADVANCED<br/><span className="text-blue-600">RESEARCH</span><br/>EQUIPMENT.
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-xl text-gray-500 font-medium leading-relaxed mb-12 opacity-80">
            Professional solutions for laboratory excellence. Precision, reliability, and state-of-the-art technology.
          </p>

          {/* Premium Search */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="w-full pl-8 pr-16 py-5 md:py-7 rounded-[2rem] bg-white border border-gray-200 text-lg md:text-2xl font-bold shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
              />
              <div className="absolute right-4 p-4 bg-gray-900 text-white rounded-2xl shadow-xl">
                <Search className="w-6 h-6" />
              </div>
            </div>

            {/* Live Results Dropdown */}
            {searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white/90 backdrop-blur-2xl rounded-3xl border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] z-50 overflow-hidden">
                {searchResults.length > 0 ? (
                  <div className="p-2 space-y-1">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={ROUTES.PRODUCT(product.categoryId!, product.subcategoryId, product.id)}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all group"
                      >
                        <div className="w-12 h-12 bg-white rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-100 p-1">
                          <img src={product.images?.[0]} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h4>
                          <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mt-0.5">{product.categoryName}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400 font-bold">Nothing found.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-indigo-400/30 blur-[120px] rounded-full" />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Zap className="w-5 h-5" />, label: "Fast Delivery", sub: "Global shipping" },
            { icon: <ShieldCheck className="w-5 h-5" />, label: "Quality Control", sub: "ISO Certified" },
            { icon: <Truck className="w-5 h-5" />, label: "Free Quote", sub: "Response in 15min" },
            { icon: <Package className="w-5 h-5" />, label: "Safe Packing", sub: "Industrial standard" },
          ].map((item, i) => (
            <div key={i} className="bg-white/50 backdrop-blur-lg border border-white/60 p-6 rounded-3xl flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-200">
                {item.icon}
              </div>
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-tighter">{item.label}</h4>
              <p className="text-[10px] text-gray-400 font-bold">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="px-4 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 px-2">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Browse Catalog</h2>
              <div className="h-1 w-12 bg-blue-600 mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={ROUTES.CATEGORY(category.id)}
                className="group relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col justify-between min-h-[280px] overflow-hidden"
              >
                <div className="absolute -bottom-4 -right-4 w-40 h-40 opacity-10 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                  {getIcon(category.id)}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                      {categoryCounts[category.id] || 0} Models
                    </p>
                    <h3 className="text-2xl font-black text-gray-900 leading-none uppercase tracking-tighter">
                      {category.name}
                    </h3>
                  </div>

                  <div className="mt-auto flex items-center gap-2 text-xs font-black text-gray-300 group-hover:text-blue-600 transition-colors uppercase tracking-widest">
                    <span>Explore Products</span>
                    <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;