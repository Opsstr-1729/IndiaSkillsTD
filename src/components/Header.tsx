import React from 'react';
import { Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0e5774] text-white shadow-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 px-2.5 py-1 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-white/30">
              <img
                src="/logo.png"
                alt="WorldSkills Logo"
                className="h-8 w-auto object-contain max-w-[150px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://drive.usercontent.google.com/download?id=1ej8K6Oi4I3TAk3EneD13UFyJLNnFnxsj&export=view';
                }}
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-white truncate">
                WorldSkills 2026
              </h1>
              <p className="text-xs text-white/80 truncate hidden sm:block">
                Technical Description Documents Archive
              </p>
            </div>
          </div>

          {/* Search in Header */}
          <div className="flex items-center relative w-64 sm:w-72 lg:w-80">
            <Search className="w-4 h-4 absolute left-3 text-[#0e5774]/70 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search skill documents..."
              className="w-full pl-9 pr-3 py-1.5 bg-white text-[#0e5774] placeholder-[#0e5774]/60 text-sm rounded-md border border-white focus:outline-none focus:ring-2 focus:ring-white transition-colors"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
