export type CurrencyConfig = {
  code: string;
  symbol: string;
  rate: number; // Taux de conversion vers FCFA
  position: 'before' | 'after';
  decimalSeparator: string;
  thousandSeparator: string;
};

// Configuration des devises avec leurs taux de conversion vers FCFA
export const currencies: Record<string, CurrencyConfig> = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    rate: 655.957, // 1 EUR = 655.957 FCFA
    position: 'after',
    decimalSeparator: ',',
    thousandSeparator: ' ',
  },
  XAF: {
    code: 'XAF',
    symbol: 'FCFA',
    rate: 1, // Devise de base
    position: 'after',
    decimalSeparator: ',',
    thousandSeparator: ' ',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rate: 600.5, // 1 USD = 600.5 FCFA
    position: 'before',
    decimalSeparator: '.',
    thousandSeparator: ',',
  },
};

// Devise actuelle
let currentCurrency = 'XAF';

// Récupérer la devise actuelle
export const getCurrentCurrency = (): string => {
  const savedCurrency = localStorage.getItem('currentCurrency');
  if (savedCurrency && currencies[savedCurrency]) {
    currentCurrency = savedCurrency;
  }
  return currentCurrency;
};

// Changer la devise
export const setCurrentCurrency = (currency: string): void => {
  if (currencies[currency]) {
    currentCurrency = currency;
    localStorage.setItem('currentCurrency', currency);
    window.location.reload();
  } else {
    console.error(`Currency "${currency}" is not supported.`);
  }
};

// Formater un prix
export const formatPrice = (
  price: number, 
  currencyCode?: string, 
  showDecimal: boolean = false
): string => {
  const currency = currencies[currencyCode || currentCurrency];
  
  if (!currency) {
    console.error(`Currency "${currencyCode}" is not supported.`);
    return `${price}`;
  }

  // Convertir le prix FCFA vers la devise cible
  let convertedPrice: number;
  if (currency.code === 'XAF') {
    convertedPrice = price;
  } else {
    convertedPrice = price / currency.rate;
  }
  
  // Formater le prix
  let formattedValue: string;
  if (showDecimal) {
    formattedValue = convertedPrice.toFixed(2)
      .replace('.', currency.decimalSeparator);
  } else {
    formattedValue = Math.round(convertedPrice)
      .toString();
  }
  
  // Ajouter les séparateurs de milliers
  formattedValue = formattedValue
    .replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandSeparator);
  
  // Positionner le symbole de la devise
  return currency.position === 'before' 
    ? `${currency.symbol}${formattedValue}` 
    : `${formattedValue} ${currency.symbol}`;
};

// Calculer le pourcentage de réduction
export const calculateDiscountPercentage = (originalPrice: number, discountedPrice: number): number => {
  if (!originalPrice || originalPrice <= 0 || discountedPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}; 