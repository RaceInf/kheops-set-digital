import React from 'react';
// import { motion } from 'framer-motion'; // Supprimé car non utilisé
import { formatPrice } from "@/lib/currencyUtils";
import { useCurrency } from "@/contexts/CurrencyContext";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  isOnSale?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({
  price,
  originalPrice,
  isOnSale = false,
  className = "",
  size = 'md',
}: PriceDisplayProps) {
  const { currentCurrency } = useCurrency();
  const formattedPrice = formatPrice(price, currentCurrency);
  const formattedOriginalPrice = originalPrice
    ? formatPrice(originalPrice, currentCurrency)
    : null;

  const sizeClasses = {
    sm: {
      price: "text-lg sm:text-xl",
      original: "text-sm sm:text-base",
    },
    md: {
      price: "text-2xl sm:text-3xl",
      original: "text-base sm:text-lg",
    },
    lg: {
      price: "text-3xl sm:text-4xl",
      original: "text-lg sm:text-xl",
    },
  };

  return (
    <div className={`flex items-center gap-2 justify-start min-h-[2.5rem] ${className}`}>
      <span className={`${sizeClasses[size].price} text-kheops-salmon font-bold break-words`}>
        {formattedPrice}
      </span>
      {isOnSale && formattedOriginalPrice && (
        <span className={`${sizeClasses[size].original} text-gray-500 line-through break-words`}>
          {formattedOriginalPrice}
        </span>
      )}
    </div>
  );
}
