import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isOpen: boolean;
  openModal: (productName?: string) => void;
  closeModal: () => void;
  productName: string;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [productName, setProductName] = useState('');

  const openModal = (name: string = '') => {
    setProductName(name);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setProductName('');
  };

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, productName }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
