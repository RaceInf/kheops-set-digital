import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import countries from 'i18n-iso-countries';
import frLocale from 'i18n-iso-countries/langs/fr.json';
import Flag from '../ui/Flag';
import { ChevronDown } from 'lucide-react';

// Register French locale for country names
countries.registerLocale(frLocale as any);

interface CustomCountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

const CustomCountrySelect: React.FC<CustomCountrySelectProps> = ({ value, onChange, options, disabled }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  // Remove accents for accent-insensitive search
  const removeAccents = (str: string) =>
    str.normalize('NFD')
      // Strip combining diacritical marks
      .replace(/[\u0300-\u036f]/g, '')
      // Recompose to NFC
      .normalize('NFC');
  const normalizedSearch = removeAccents(search.trim()).toLowerCase();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find(opt => opt.value === value);
  const filtered = options.filter(opt => {
    if (!opt.value) return false;
    const code = opt.value.toUpperCase();
    const nameFr = countries.getName(code, 'fr') || code;
    const dial = opt.label.match(/\+\d+/)?.[0] || '';
    const combined = removeAccents(`${nameFr} ${dial}`).toLowerCase();
    return combined.includes(normalizedSearch) || code.toLowerCase().includes(normalizedSearch);
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setSearch('');
  }, [open]);

  useLayoutEffect(() => {
    if (open) inputRef.current?.focus();
  }, [search]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        disabled={disabled}
        className="flex items-center justify-between w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-1">
          {selected && <Flag countryCode={selected.value} className="w-5 h-auto" />}
          <span className="text-sm font-medium text-gray-700">{selected?.value?.toUpperCase() ?? ''}</span>
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {open && (
        <div
          className="absolute z-10 mt-1 w-auto min-w-[17rem] bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          onPointerDownCapture={() => inputRef.current?.focus()}
          onPointerUpCapture={() => inputRef.current?.focus()}
          onWheelCapture={() => inputRef.current?.focus()}
          onScrollCapture={() => inputRef.current?.focus()}
        >
          <div className="sticky top-0 bg-white p-2">
            <input
              title="Rechercher un pays"
              aria-label="Rechercher un pays"
              ref={inputRef}
              type="text"
              placeholder="Rechercher un pays..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onBlurCapture={e => { e.preventDefault(); inputRef.current?.focus(); }}
              onBlur={() => inputRef.current?.focus()}
              onMouseUpCapture={() => inputRef.current?.focus()}
              onPointerUpCapture={() => inputRef.current?.focus()}
              className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div role="listbox" aria-label="Liste des pays" className="focus:outline-none">
            {filtered.map(opt => {
              const code = opt.value.toUpperCase();
              const nameFr = countries.getName(code, 'fr') || code;
              const dial = opt.label.match(/\+\d+/)?.[0] || '';
              return (
                <div
                  key={opt.value}
                  role="option"
                  onMouseDownCapture={(e) => e.preventDefault()}
                  onTouchStartCapture={(e) => e.preventDefault()}
                  className="cursor-pointer px-3 py-2 flex items-center gap-2 hover:bg-gray-100"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                >
                  <Flag countryCode={opt.value} className="w-5 h-auto" />
                  <span className="whitespace-nowrap">{`${nameFr} ${dial}`}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCountrySelect;
