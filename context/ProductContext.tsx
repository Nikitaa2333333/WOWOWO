
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product, Category, Subcategory } from '../types';
import { CATEGORIES, SUBCATEGORIES } from '../lib/data';

interface ProductContextType {
    products: Product[];
    categories: Category[];
    subcategories: Subcategory[];
    loading: boolean;
    error: string | null;
    getProductById: (id: string) => Product | undefined;
    getProductsByCategory: (categoryId: string) => Product[];
    getProductsBySubcategory: (subcategoryId: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/products.json');
                if (!response.ok) {
                    throw new Error('Failed to load products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error("Failed to load products:", err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getProductById = (id: string) => products.find(p => p.id === id);

    const getProductsByCategory = (categoryId: string) => {
        // Получаем ID подкатегорий этой категории
        const catSubIds = SUBCATEGORIES
            .filter(s => s.categoryId === categoryId)
            .map(s => s.id);

        // Если у категории нет подкатегорий (или логика другая), можно искать иначе.
        // Но у нас связь через subcategoryId.
        // Если товар привязан к подкатегории, которая принадлежит категории.
        return products.filter(p => catSubIds.includes(p.subcategoryId));
    };

    const getProductsBySubcategory = (subcategoryId: string) => {
        return products.filter(p => p.subcategoryId === subcategoryId);
    };

    return (
        <ProductContext.Provider
            value={{
                products,
                categories: CATEGORIES,
                subcategories: SUBCATEGORIES,
                loading,
                error,
                getProductById,
                getProductsByCategory,
                getProductsBySubcategory
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
