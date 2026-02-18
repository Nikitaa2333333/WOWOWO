import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import { ProductProvider } from './context/ProductContext';
import FeedbackModal from './components/FeedbackModal';
import PDFModal from './components/PDFModal';
import Header from './components/Header';
import Footer from './components/Footer';
import { ROUTES } from './lib/routes';

// Code Splitting
const Home = lazy(() => import('./pages/Home'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ManufacturersPage = lazy(() => import('./pages/ManufacturersPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const SubcategoryPage = lazy(() => import('./pages/SubcategoryPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
import { useModal } from './context/ModalContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { openModal, isOpen } = useModal();

  return (
    <div className="relative min-h-screen font-sans text-gray-900 bg-[#f1f5f9]">
      <ScrollToTop />

      <Header />

      <main className="relative z-10">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-gray-400 font-medium animate-pulse">Загрузка...</div>
          </div>
        }>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
            <Route path={ROUTES.MANUFACTURERS} element={<ManufacturersPage />} />
            <Route path="/catalog/:categoryId" element={<CategoryPage />} />
            <Route path="/catalog/:categoryId/:subcategoryId" element={<SubcategoryPage />} />
            <Route path="/catalog/:categoryId/:subcategoryId/:productId" element={<ProductPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>

      <FeedbackModal />
      <PDFModal />

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => openModal()}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 bg-gray-900 text-white px-8 py-4 rounded-full shadow-2xl z-50 flex items-center justify-center font-semibold hover:bg-gray-800 active:scale-95 transition-all w-[calc(100%-32px)] md:w-auto"
        >
          Связаться с менеджером
        </button>
      )}

      {isHomePage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ModalProvider>
        <ProductProvider>
          <AppContent />
        </ProductProvider>
      </ModalProvider>
    </Router>
  );
};

export default App;
