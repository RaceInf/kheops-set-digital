import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8 p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto md:w-full">
        <div className="flex-1 sm:flex-none md:flex-1">
          <Label htmlFor="category" className="text-white mb-2 block">Catégorie</Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger id="category" className="w-full sm:w-[200px] md:w-full bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              <SelectItem value="all" className="text-white hover:bg-white/10">
                Toutes les catégories
              </SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-white hover:bg-white/10"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 sm:flex-none md:flex-1">
          <Label htmlFor="sort" className="text-white mb-2 block">Trier par</Label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger id="sort" className="w-full sm:w-[200px] md:w-full bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              <SelectItem value="price-asc" className="text-white hover:bg-white/10">
                Prix croissant
              </SelectItem>
              <SelectItem value="price-desc" className="text-white hover:bg-white/10">
                Prix décroissant
              </SelectItem>
              <SelectItem value="date-desc" className="text-white hover:bg-white/10">
                Plus récents
              </SelectItem>
              <SelectItem value="date-asc" className="text-white hover:bg-white/10">
                Plus anciens
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar; 