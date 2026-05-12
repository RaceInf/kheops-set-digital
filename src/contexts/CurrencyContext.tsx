import React, { createContext, useContext, useState, useCallback } from 'react';

type Currency = 'XAF' | 'EUR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  currentCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const EXCHANGE_RATES: Record<Currency, number> = {
  XAF: 1,
  EUR: 655.957,
  USD: 600.5
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('XAF');

  const convertPrice = useCallback((price: number) => {
    const rate = EXCHANGE_RATES[currency];
    return Math.round(price / rate);
  }, [currency]);

  const formatPrice = useCallback((price: number) => {
    const convertedPrice = convertPrice(price);
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(convertedPrice);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      currentCurrency: currency,
      setCurrency, 
      formatPrice, 
      convertPrice 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}; 