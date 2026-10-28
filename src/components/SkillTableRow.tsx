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

interface SkillTableRowProps {
  document: SkillDocument;
  isActive: boolean;
  isStarred: boolean;
  onSelect: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
}

export const SkillTableRow: React.FC<SkillTableRowProps> = ({
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
    <tr
      onClick={onSelect}
      className={`border-b border-[#0e5774]/15 transition-colors cursor-pointer group text-xs sm:text-sm ${
        isActive
          ? 'bg-[#f0f7f9] font-bold text-[#0e5774]'
          : 'bg-white hover:bg-[#f0f7f9]/60 text-[#0e5774]'
      }`}
    >
      {/* Star */}
      <td className="py-3 px-3 text-center w-10">
        <button
          onClick={onToggleStar}
          className="p-1 rounded text-[#0e5774]/40 hover:text-[#0e5774] transition-colors"
          title={isStarred ? 'Unstar' : 'Star'}
        >
          <Star
            className={`w-3.5 h-3.5 ${
              isStarred ? 'fill-[#0e5774] text-[#0e5774]' : ''
            }`}
          />
        </button>
      </td>

      {/* Number */}
      <td className="py-3 px-3 font-bold w-14 text-[#0e5774]">
        #{String(document.no).padStart(2, '0')}
      </td>

      {/* Skill Name */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <span
            className={`group-hover:underline transition-colors ${
              isActive ? 'font-bold text-[#0e5774]' : 'font-semibold text-[#0e5774]'
            }`}
          >
            {document.skill}
          </span>
          {isActive && (
            <span className="inline-flex items-center text-[10px] px-1.5 py-0.2 rounded bg-[#0e5774] text-white font-bold">
              Active
            </span>
          )}
        </div>
      </td>

      {/* Filename */}
      <td className="py-3 px-3 hidden md:table-cell text-[#0e5774]/70 text-xs">
        <div className="flex items-center gap-1.5 max-w-xs truncate">
          <FileText className="w-3.5 h-3.5 text-[#0e5774] shrink-0" />
          <span className="truncate">{document.filename}</span>
        </div>
      </td>

      {/* Sector */}
      <td className="py-3 px-3 hidden lg:table-cell">
        <span
          className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold border border-[#0e5774]/30 bg-[#f0f7f9] text-[#0e5774]"
        >
          {sectorStyle.shortName}
        </span>
      </td>

      {/* File Size */}
      <td className="py-3 px-3 text-[#0e5774]/80 text-xs w-20 font-medium">
        {document.size}
      </td>

      {/* Actions */}
      <td className="py-3 px-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
              isActive
                ? 'bg-[#0e5774] text-white'
                : 'bg-white text-[#0e5774] border border-[#0e5774] hover:bg-[#0e5774] hover:text-white'
            }`}
            title="Preview document"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>

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
            title="Open in Drive"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </td>
    </tr>
  );
};
