import React, { useState, useMemo } from 'react';
import {
  SKILL_DOCUMENTS,
  SkillDocument,
  SectorCategory,
  DRIVE_FOLDER_URL,
} from './data/skills';
import { Header } from './components/Header';
import { FilterBar, ViewMode, SortOption } from './components/FilterBar';
import { SkillCard } from './components/SkillCard';
import { SkillTableRow } from './components/SkillTableRow';
import { DocumentViewer } from './components/DocumentViewer';
import {
  FolderOpen,
  ExternalLink,
  Search,
} from 'lucide-react';

const STORAGE_FAVORITES_KEY = 'worldskills_2026_favorites';

export default function App() {
  // State: openedDoc is the currently open document. When set, it fills the whole page!
  const [openedDoc, setOpenedDoc] = useState<SkillDocument | null>(null);

  const [search, setSearch] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<SectorCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('number-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  // Persistence: Favorites
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleToggleStar = (docNo: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(docNo)
        ? prev.filter((id) => id !== docNo)
        : [...prev, docNo];
      try {
        localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Filtered & Sorted Documents
  const filteredDocuments = useMemo(() => {
    let result = [...SKILL_DOCUMENTS];

    // Sector Filter
    if (selectedSector !== 'All') {
      result = result.filter((d) => d.sector === selectedSector);
    }

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter((d) => favorites.includes(d.no));
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((d) => {
        const matchName = d.skill.toLowerCase().includes(q);
        const matchFilename = d.filename.toLowerCase().includes(q);
        const matchNo = `#${d.no}`.includes(q) || String(d.no) === q;
        const matchTags = d.tags.some((t) => t.toLowerCase().includes(q));
        const matchSector = d.sector.toLowerCase().includes(q);
        return matchName || matchFilename || matchNo || matchTags || matchSector;
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'number-asc':
          return a.no - b.no;
        case 'number-desc':
          return b.no - a.no;
        case 'name-asc':
          return a.skill.localeCompare(b.skill);
        case 'name-desc':
          return b.skill.localeCompare(a.skill);
        case 'size-desc': {
          const parseSize = (s: string) => {
            const num = parseFloat(s);
            if (s.includes('MB')) return num * 1024;
            return num;
          };
          return parseSize(b.size) - parseSize(a.size);
        }
        default:
          return a.no - b.no;
      }
    });

    return result;
  }, [selectedSector, showFavoritesOnly, favorites, search, sortBy]);

  // Sector Counts
  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: SKILL_DOCUMENTS.length,
    };
    for (const doc of SKILL_DOCUMENTS) {
      counts[doc.sector] = (counts[doc.sector] || 0) + 1;
    }
    return counts;
  }, []);

  // Navigation indices within current filtered list for the opened document
  const currentFilteredIndex = useMemo(() => {
    if (!openedDoc) return -1;
    return filteredDocuments.findIndex((d) => d.no === openedDoc.no);
  }, [filteredDocuments, openedDoc]);

  const hasPrev = currentFilteredIndex > 0;
  const hasNext =
    currentFilteredIndex >= 0 && currentFilteredIndex < filteredDocuments.length - 1;

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && hasPrev) {
      setOpenedDoc(filteredDocuments[currentFilteredIndex - 1]);
    } else if (direction === 'next' && hasNext) {
      setOpenedDoc(filteredDocuments[currentFilteredIndex + 1]);
    }
  };

  const handleOpenDoc = (doc: SkillDocument) => {
    setOpenedDoc(doc);
  };

  const handleCloseDoc = () => {
    setOpenedDoc(null);
  };

  const isFiltered =
    search.trim() !== '' || selectedSector !== 'All' || showFavoritesOnly;

  const handleResetFilters = () => {
    setSearch('');
    setSelectedSector('All');
    setShowFavoritesOnly(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#0e5774] flex flex-col font-sans selection:bg-[#0e5774] selection:text-white">
      {/* FULL PAGE DOCUMENT VIEWER (Fills the whole page when open, with close button) */}
      {openedDoc && (
        <DocumentViewer
          document={openedDoc}
          onClose={handleCloseDoc}
          onNavigate={handleNavigate}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}

      {/* Main Catalog View (when document is closed) */}
      <Header
        searchQuery={search}
        onSearchChange={setSearch}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedSector={selectedSector}
        onSectorChange={setSelectedSector}
        sectorCounts={sectorCounts}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
        favoriteCount={favorites.length}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Home Page Banner (Drive ID: 1Sv2C0P0EEjyoNpUj2-uSrxJQGosUmLx1) */}
        <div className="mb-6 rounded-xl overflow-hidden shadow-sm border border-[#0e5774]/20 bg-[#f0f7f9]">
          <img
            src="/banner.png"
            alt="WorldSkills 2026 Banner"
            className="w-full h-auto max-h-[300px] object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://drive.usercontent.google.com/download?id=1Sv2C0P0EEjyoNpUj2-uSrxJQGosUmLx1&export=view';
            }}
          />
        </div>
        {/* Empty State */}
        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-[#0e5774]/30 my-6">
            <div className="w-14 h-14 rounded-full bg-[#f0f7f9] text-[#0e5774] mx-auto flex items-center justify-center mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0e5774] mb-1">
              No matching documents found
            </h3>
            <p className="text-sm text-[#0e5774]/80 max-w-sm mx-auto mb-4">
              We couldn&apos;t find any skills matching &quot;{search}&quot;. Try adjusting your search query or clear the active sector filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold bg-[#0e5774] text-white hover:bg-[#093c50] transition-colors shadow-xs cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#0e5774]/20 text-xs text-[#0e5774]">
              <span className="font-bold">
                {filteredDocuments.length} Documents Available
              </span>
              <span className="italic">
                Click any skill to open the document full-page
              </span>
            </div>

            {/* VIEW MODE 1: GRID OF CARDS */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDocuments.map((doc) => (
                  <SkillCard
                    key={doc.no}
                    document={doc}
                    isActive={openedDoc?.no === doc.no}
                    isStarred={favorites.includes(doc.no)}
                    onSelect={() => handleOpenDoc(doc)}
                    onToggleStar={(e) => handleToggleStar(doc.no, e)}
                  />
                ))}
              </div>
            )}

            {/* VIEW MODE 2: COMPACT TABLE */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-lg shadow-xs border border-[#0e5774]/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f0f7f9] border-b border-[#0e5774]/30 text-xs font-bold text-[#0e5774] uppercase tracking-wider">
                        <th className="py-3 px-3 text-center w-10">★</th>
                        <th className="py-3 px-3 w-14">#</th>
                        <th className="py-3 px-3">Skill Name</th>
                        <th className="py-3 px-3 hidden md:table-cell">PDF Filename</th>
                        <th className="py-3 px-3 hidden lg:table-cell">Sector</th>
                        <th className="py-3 px-3 w-20">Size</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => (
                        <SkillTableRow
                          key={doc.no}
                          document={doc}
                          isActive={openedDoc?.no === doc.no}
                          isStarred={favorites.includes(doc.no)}
                          onSelect={() => handleOpenDoc(doc)}
                          onToggleStar={(e) => handleToggleStar(doc.no, e)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#0e5774]/20 bg-white py-4 text-xs text-[#0e5774]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold">
            <span>WorldSkills 2026</span>
            <span>•</span>
            <span>Technical Descriptions Archive</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#0e5774] hover:underline inline-flex items-center gap-1 transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Google Drive Folder (1vsAzBG23SowR5TvE5dPO24IBf4ahglCB)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
