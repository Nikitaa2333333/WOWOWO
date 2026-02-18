export const ROUTES = {
    HOME: '/',
    CATALOG: '/catalog',
    MANUFACTURERS: '/manufacturers',
    CATEGORY: (categoryId: string) => `/catalog/${categoryId}`,
    SUBCATEGORY: (categoryId: string, subcategoryId: string) => `/catalog/${categoryId}/${subcategoryId}`,
    PRODUCT: (categoryId: string, subcategoryId: string, productId: string) => `/catalog/${categoryId}/${subcategoryId}/${productId}`,
};
