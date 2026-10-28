import React from 'react';
import {
  Search,
  Grid,
  List,
  Columns,
  Star,
  X,
  ArrowUpDown,
} from 'lucide-react';
import { SectorCategory, SECTOR_CONFIG } from '../data/skills';

export type ViewMode = 'grid' | 'table';
export type SortOption = 'number-asc' | 'number-desc' | 'name-asc' | 'name-desc' | 'size-desc';

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedSector: SectorCategory | 'All';
  onSectorChange: (sector: SectorCategory | 'All') => void;
  sectorCounts: Record<string, number>;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favoriteCount: number;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  selectedSector,
  onSectorChange,
  sectorCounts,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoriteCount,
  onResetFilters,
  isFiltered,
}) => {
  const sectors: (SectorCategory | 'All')[] = [
    'All',
    'Information & Communication Technology',
    'Manufacturing & Engineering Technology',
    'Construction & Building Technology',
    'Transportation & Logistics',
    'Creative Arts & Fashion',
    'Social & Personal Services',
  ];

  return (
    <div className="bg-white border-b border-[#0e5774]/20 sticky top-16 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Main Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0e5774]/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by skill name, PDF filename, #no..."
              className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-[#0e5774]/40 rounded-md text-[#0e5774] placeholder-[#0e5774]/50 focus:outline-none focus:ring-2 focus:ring-[#0e5774]/20 focus:border-[#0e5774] transition-all"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#0e5774]/50 hover:text-[#0e5774]"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort, Favorites, View Switcher */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-[#0e5774]/40 rounded-md px-2.5 py-1.5 text-[#0e5774]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#0e5774]/70 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                aria-label="Sort skills by"
                className="bg-transparent text-xs font-semibold text-[#0e5774] focus:outline-none cursor-pointer pr-1"
              >
                <option value="number-asc">Skill # (1 to 34)</option>
                <option value="number-desc">Skill # (34 to 1)</option>
                <option value="name-asc">Name (A → Z)</option>
                <option value="name-desc">Name (Z → A)</option>
                <option value="size-desc">File Size (Largest)</option>
              </select>
            </div>

            {/* Favorites Toggle */}
            <button
              onClick={onToggleFavoritesOnly}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                showFavoritesOnly
                  ? 'bg-[#0e5774] text-white border-[#0e5774]'
                  : 'bg-white text-[#0e5774] border-[#0e5774]/40 hover:bg-[#f0f7f9]'
              }`}
              title="Show only starred documents"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  showFavoritesOnly ? 'fill-white text-white' : 'text-[#0e5774]'
                }`}
              />
              <span>Starred</span>
              {favoriteCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    showFavoritesOnly
                      ? 'bg-white text-[#0e5774]'
                      : 'bg-[#f0f7f9] text-[#0e5774]'
                  }`}
                >
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* View Mode Toggle: Grid and Table */}
            <div className="flex items-center bg-[#f0f7f9] rounded-md p-0.5 border border-[#0e5774]/30">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#0e5774] text-white shadow-xs'
                    : 'text-[#0e5774] hover:bg-white'
                }`}
                title="Grid View: Card layout"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#0e5774] text-white shadow-xs'
                    : 'text-[#0e5774] hover:bg-white'
                }`}
                title="Table View: Compact list"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="text-xs text-[#0e5774] underline font-semibold px-2 py-1 hover:opacity-80"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Sector Category Pills (Horizontal scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2.5">
          {sectors.map((sector) => {
            const isSelected = selectedSector === sector;
            const count = sectorCounts[sector] ?? 0;
            const shortName =
              sector === 'All' ? 'All Skills' : SECTOR_CONFIG[sector]?.shortName || sector;

            return (
              <button
                key={sector}
                onClick={() => onSectorChange(sector)}
                className={`whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#0e5774] text-white border-[#0e5774]'
                    : 'bg-white hover:bg-[#f0f7f9] text-[#0e5774] border-[#0e5774]/30'
                }`}
              >
                <span>{shortName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white text-[#0e5774]'
                      : 'bg-[#f0f7f9] text-[#0e5774]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
