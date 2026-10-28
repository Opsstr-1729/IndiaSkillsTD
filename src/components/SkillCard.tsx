import React from 'react';
import {
  FileText,
  ExternalLink,
  Download,
  Star,
  Eye,
} from 'lucide-react';
import {
  SkillDocument,
  getViewUrl,
  getDownloadUrl,
  SECTOR_CONFIG,
} from '../data/skills';

interface SkillCardProps {
  document: SkillDocument;
  isActive: boolean;
  isStarred: boolean;
  onSelect: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  document,
  isActive,
  isStarred,
  onSelect,
  onToggleStar,
}) => {
  const sectorStyle = SECTOR_CONFIG[document.sector];
  const viewUrl = getViewUrl(document.driveId);
  const downloadUrl = getDownloadUrl(document.driveId);

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-lg border p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isActive
          ? 'bg-[#f0f7f9] border-[#0e5774] ring-2 ring-[#0e5774]/30 shadow-md'
          : 'bg-white border-[#0e5774]/25 hover:border-[#0e5774] hover:shadow-md'
      }`}
    >
      <div>
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center font-bold text-xs px-2 py-0.5 rounded ${
                isActive
                  ? 'bg-[#0e5774] text-white'
                  : 'bg-[#f0f7f9] text-[#0e5774] border border-[#0e5774]/30'
              }`}
            >
              #{String(document.no).padStart(2, '0')}
            </span>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded border border-[#0e5774]/30 bg-white text-[#0e5774] truncate max-w-[170px]"
            >
              {sectorStyle.shortName}
            </span>
          </div>

          {/* Star toggle */}
          <button
            onClick={onToggleStar}
            className="p-1.5 rounded text-[#0e5774]/60 hover:text-[#0e5774] hover:bg-[#f0f7f9] transition-colors"
            title={isStarred ? 'Remove star' : 'Star this document'}
          >
            <Star
              className={`w-4 h-4 ${
                isStarred
                  ? 'fill-[#0e5774] text-[#0e5774]'
                  : 'text-[#0e5774]/40 hover:text-[#0e5774]'
              }`}
            />
          </button>
        </div>

        {/* Skill Title */}
        <h3 className="font-bold text-base text-[#0e5774] group-hover:underline transition-colors leading-snug mb-1.5">
          {document.skill}
        </h3>

        {/* Filename & size */}
        <div className="flex items-center gap-1.5 text-xs text-[#0e5774]/80 mb-2">
          <FileText className="w-3.5 h-3.5 text-[#0e5774] shrink-0" />
          <span className="truncate text-[11px]">{document.filename}</span>
          <span className="shrink-0 text-[#0e5774]/40">•</span>
          <span className="shrink-0 font-semibold text-[11px]">
            {document.size}
          </span>
        </div>

        {/* Summary */}
        <p className="text-xs text-[#0e5774]/80 line-clamp-2 mb-3 leading-relaxed">
          {document.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {document.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-[#f0f7f9] text-[#0e5774] border border-[#0e5774]/20"
            >
              #{tag}
            </span>
          ))}
          {document.tags.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f0f7f9] text-[#0e5774]/70 border border-[#0e5774]/20">
              +{document.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-2.5 border-t border-[#0e5774]/20 flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
            isActive
              ? 'bg-[#0e5774] text-white shadow-xs'
              : 'bg-white text-[#0e5774] border border-[#0e5774] hover:bg-[#0e5774] hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isActive ? 'Currently Viewing' : 'View Document'}</span>
        </button>

        <div className="flex items-center gap-1">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded text-[#0e5774]/70 hover:text-[#0e5774] hover:bg-[#f0f7f9] transition-colors"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded text-[#0e5774]/70 hover:text-[#0e5774] hover:bg-[#f0f7f9] transition-colors"
            title="Open in Google Drive"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
