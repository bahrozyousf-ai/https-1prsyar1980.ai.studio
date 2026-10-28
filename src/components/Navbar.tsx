import React from 'react';
import { Printer, Sparkles, BookOpen, Download, FileText } from 'lucide-react';
import { PRESET_EXAMS } from '../data/presets';
import { ExamData } from '../types/exam';

interface NavbarProps {
  onLoadPreset: (presetId: string) => void;
  onOpenAnswerKey: () => void;
  onOpenExport: () => void;
  onOpenAiGenerator: () => void;
  onPrint: () => void;
  currentExam: ExamData;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadPreset,
  onOpenAnswerKey,
  onOpenExport,
  onOpenAiGenerator,
  onPrint,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 no-print" dir="rtl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-base md:text-lg font-extrabold tracking-tight text-slate-900">
            دروستکەری پرسیاری تاقیکردنەوە
          </span>
        </div>

        {/* Zone 2: 4-5 Clean single-line navigation & tools */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          {/* Preset selector */}
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <select
              onChange={(e) => {
                if (e.target.value) onLoadPreset(e.target.value);
              }}
              defaultValue=""
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 px-2.5 rounded-lg border-0 text-xs font-semibold cursor-pointer focus:ring-2 focus:ring-slate-900"
            >
              <option value="" disabled>
                قاڵبە ئامادەکراوەکان (Presets)
              </option>
              {PRESET_EXAMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenAiGenerator}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>یاریدەدەری AI</span>
          </button>

          <button
            type="button"
            onClick={onOpenAnswerKey}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>کلیلی وەڵامەکان</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>هەناردەکردن</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onPrint}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>چاپکردن یان PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
