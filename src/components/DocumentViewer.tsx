import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import {
  SkillDocument,
  getPreviewUrl,
  getViewUrl,
  getDownloadUrl,
  SECTOR_CONFIG,
} from '../data/skills';

interface DocumentViewerProps {
  document: SkillDocument;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose,
  onNavigate,
  hasPrev = false,
  hasNext = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    setIsLoading(true);
  }, [document.driveId, iframeKey]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev && onNavigate) {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight' && hasNext && onNavigate) {
        onNavigate('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, hasPrev, hasNext, onNavigate]);

  const previewUrl = getPreviewUrl(document.driveId);
  const viewUrl = getViewUrl(document.driveId);
  const downloadUrl = getDownloadUrl(document.driveId);
  const sectorStyle = SECTOR_CONFIG[document.sector];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(viewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen flex flex-col bg-white text-[#0e5774] font-sans overflow-hidden animate-in fade-in duration-150">
      {/* Full-Page Top Header Bar */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 bg-[#0e5774] text-white border-b border-white/20 gap-3 shrink-0 shadow-md">
        {/* Left: Close Button & Document Title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Prominent Close Button */}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold bg-white text-[#0e5774] hover:bg-[#f0f7f9] shadow-sm transition-all shrink-0 cursor-pointer"
            title="Close document and return to library (Escape)"
          >
            <ArrowLeft className="w-4 h-4 text-[#0e5774]" />
            <span>Close Document</span>
            <kbd className="hidden md:inline-block text-[10px] px-1.5 py-0.2 bg-[#0e5774]/10 rounded border border-[#0e5774]/30 text-[#0e5774]">
              Esc
            </kbd>
          </button>

          {/* Document Number & Title */}
          <div className="flex items-center gap-2.5 min-w-0 pl-1 border-l border-white/30">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white text-[#0e5774] font-bold text-xs shrink-0 shadow-xs">
              #{String(document.no).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-white truncate">
                {document.skill}
              </h1>
              <div className="flex items-center gap-2 text-xs text-white/80 truncate">
                <span className="truncate max-w-[200px] sm:max-w-xs">{document.filename}</span>
                <span>•</span>
                <span className="text-white font-medium">{document.size}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Previous / Next navigation */}
          {onNavigate && (
            <div className="flex items-center bg-white/10 rounded-md p-0.5 border border-white/30">
              <button
                onClick={() => onNavigate('prev')}
                disabled={!hasPrev}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                title="Previous Document (← Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden md:inline">Prev</span>
              </button>
              <span className="w-px h-3.5 bg-white/30 mx-0.5" />
              <button
                onClick={() => onNavigate('next')}
                disabled={!hasNext}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                title="Next Document (→ Right Arrow)"
              >
                <span className="hidden md:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Reload Frame */}
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Reload preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Copy Preview Link */}
          <button
            onClick={handleCopyLink}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 transition-colors"
            title="Copy Google Drive link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Link</span>
              </>
            )}
          </button>

          {/* Direct Download */}
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 transition-colors"
            title="Download PDF directly"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </a>

          {/* Open in Google Drive in New Tab */}
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#0e5774] bg-white hover:bg-[#f0f7f9] shadow-xs transition-colors"
            title="Open in full Google Drive viewer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#0e5774]" />
            <span className="hidden lg:inline">Open Drive</span>
          </a>

          {/* Secondary Close Icon Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/20 transition-colors ml-1"
            title="Close document (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Whole-Page Document Frame Body */}
      <div className="relative flex-1 w-full h-full bg-white flex flex-col min-h-0">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 text-[#0e5774]">
            <div className="w-9 h-9 border-3 border-[#0e5774] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-base font-bold text-[#0e5774]">
              Opening {document.skill}...
            </p>
            <span className="text-xs text-[#0e5774]/70 mt-1">
              Loading full page technical description
            </span>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={previewUrl}
          className="w-full h-full flex-1 border-0 bg-white"
          title={`Document viewer for ${document.skill}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Subtle Bottom Information Strip */}
      <footer className="bg-[#f0f7f9] border-t border-[#0e5774]/20 px-4 sm:px-6 py-2 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#0e5774]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">{document.sector}</span>
            <span className="text-[#0e5774]/40 hidden sm:inline">•</span>
            <span className="italic text-[#0e5774]/80 line-clamp-1 max-w-2xl">
              {document.summary}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#0e5774] hover:underline inline-flex items-center gap-1"
            >
              <span>Viewer blocked? Open in New Tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
