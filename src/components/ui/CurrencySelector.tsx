import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLocation } from 'react-router-dom';
import { currencies } from '@/lib/currencyUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function CurrencySelector() {
  const { currentCurrency, setCurrency } = useCurrency();
  const location = useLocation();
  const isBoutiquePage = location.pathname === '/boutique';

  return (
    <Select
      value={currentCurrency}
      onValueChange={setCurrency}
    >
      <SelectTrigger className={cn(
        "w-[75px] h-9 bg-transparent border transition-all duration-300 text-sm font-medium",
        "focus:outline-none focus:ring-0 focus:ring-offset-0",
        isBoutiquePage 
          ? "border-kheops-gold/20 hover:border-kheops-gold/40 hover:bg-kheops-gold/5 focus:border-kheops-gold/40 text-kheops-gold"
          : "border-kheops-salmon/20 hover:border-kheops-salmon/40 hover:bg-kheops-salmon/5 focus:border-kheops-salmon/40 text-kheops-salmon"
      )}>
        <SelectValue placeholder="Devise" />
      </SelectTrigger>
      <SelectContent className={cn(
        "backdrop-blur-md border text-sm animate-in fade-in-0 zoom-in-95 duration-200 shadow-lg",
        isBoutiquePage 
          ? "bg-gray-900/95 border-kheops-gold/20 shadow-kheops-gold/5"
          : "bg-white/95 border-kheops-salmon/20 shadow-kheops-salmon/5"
      )}>
        {Object.values(currencies).map((currency) => (
          <SelectItem 
            key={currency.code} 
            value={currency.code}
            className={cn(
              "py-2.5 px-3 cursor-pointer transition-all duration-200",
              isBoutiquePage 
                ? "text-gray-300 hover:text-white hover:bg-kheops-gold/5 focus:bg-kheops-gold/5 focus:text-white data-[state=checked]:bg-kheops-gold/10 data-[state=checked]:text-kheops-gold"
                : "text-gray-700 hover:text-gray-900 hover:bg-kheops-salmon/5 focus:bg-kheops-salmon/5 focus:text-gray-900 data-[state=checked]:bg-kheops-salmon/10 data-[state=checked]:text-kheops-salmon"
            )}
          >
            {currency.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 