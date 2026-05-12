import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  results?: SearchResult[];
  onResultClick?: (result: SearchResult) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Rechercher un e-book...",
  className,
  results = [],
  onResultClick
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-2xl mx-auto", className)}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full h-14 pl-12 pr-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-kheops-gold focus:ring-kheops-gold"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-white/10"
            onClick={clearSearch}
          >
            <X className="w-5 h-5 text-gray-400" />
          </Button>
        )}
      </form>

      <AnimatePresence>
        {isFocused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-2 bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 overflow-hidden z-50"
          >
            <div className="max-h-96 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => onResultClick?.(result)}
                  className="w-full p-4 hover:bg-white/5 transition-colors text-left border-b border-white/10 last:border-0"
                >
                  <div className="flex items-start gap-4">
                    {result.imageUrl && (
                      <img
                        src={result.imageUrl}
                        alt={result.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{result.title}</h3>
                      <p className="text-kheops-gold font-medium mt-2">
                        {(result.price / 100).toFixed(2)}€
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar; 