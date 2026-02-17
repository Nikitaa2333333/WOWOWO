export const ROUTES = {
    HOME: '/',
    CATEGORY: (categoryId: string) => `/catalog/${categoryId}`,
    SUBCATEGORY: (categoryId: string, subcategoryId: string) => `/catalog/${categoryId}/${subcategoryId}`,
    PRODUCT: (categoryId: string, subcategoryId: string, productId: string) => `/catalog/${categoryId}/${subcategoryId}/${productId}`,
};
