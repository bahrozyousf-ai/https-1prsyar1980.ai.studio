import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { EditorSidebar } from './components/EditorSidebar';
import { A4PaperPreview } from './components/A4PaperPreview';
import { AiGeneratorModal } from './components/AiGeneratorModal';
import { AnswerKeyModal } from './components/AnswerKeyModal';
import { ExportModal } from './components/ExportModal';
import { PRESET_EXAMS } from './data/presets';
import { ExamData } from './types/exam';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Columns,
  Eye,
  Edit3,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const STORAGE_KEY = 'kurdish_exam_maker_data_v1';

export default function App() {
  // Initialize state from localStorage or default preset
  const [exam, setExam] = useState<ExamData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
    return PRESET_EXAMS[0].data;
  });

  const [previewScale, setPreviewScale] = useState<number>(0.95);
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');

  // Modals state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAnswerKeyOpen, setIsAnswerKeyOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exam));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [exam]);

  const handleLoadPreset = (presetId: string) => {
    const found = PRESET_EXAMS.find((p) => p.id === presetId);
    if (found) {
      if (
        window.confirm(
          `ئایا دڵنیایت دەتەوێت قاڵبی "${found.name}" دابنێیت؟ زانیارییەکانی ئێستا دەگۆڕدرێن.`
        )
      ) {
        setExam(found.data);
      }
    }
  };

  const handleResetExam = () => {
    if (window.confirm('ئایا دڵنیایت دەتەوێت پەڕەکە بگەڕێنیتەوە بۆ دۆخی سەرەتایی؟')) {
      setExam(PRESET_EXAMS[0].data);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApplyAiQuestions = (
    newQuestions: string,
    answerKey: string,
    timeLimit?: string,
    totalMarks?: string
  ) => {
    setExam((prev) => ({
      ...prev,
      questionsText: newQuestions,
      answerKey: answerKey || prev.answerKey,
      header: {
        ...prev.header,
        timeLimit: timeLimit || prev.header.timeLimit,
        totalMarks: totalMarks || prev.header.totalMarks,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 select-text" dir="rtl">
      {/* Top Bar Contract Navbar */}
      <Navbar
        currentExam={exam}
        onLoadPreset={handleLoadPreset}
        onOpenAiGenerator={() => setIsAiOpen(true)}
        onOpenAnswerKey={() => setIsAnswerKeyOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onPrint={handlePrint}
      />

      {/* Workspace Secondary Toolbar (No-Print) */}
      <div className="bg-white border-b border-slate-200 py-2 px-4 sm:px-6 no-print">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">دوولایی (دەستکاریکردن و بینین)</span>
              <span className="sm:hidden">دوولایی</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === 'editor'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تەنها دەستکاریکەر</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === 'preview'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>تەنها پەڕەی A4</span>
            </button>
          </div>

          {/* Quick preset chips on mobile & tablet */}
          <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => setIsAiOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3" />
              <span>یاریدەدەری AI</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAnswerKeyOpen(true)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg whitespace-nowrap"
            >
              کلیل
            </button>
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg whitespace-nowrap"
            >
              هەناردە
            </button>
          </div>

          {/* Zoom controls & Reset action */}
          <div className="flex items-center gap-3 mr-auto sm:mr-0">
            {viewMode !== 'editor' && (
              <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewScale((s) => Math.max(0.6, s - 0.1))}
                  className="p-1 text-slate-600 hover:text-slate-900 rounded"
                  title="بچووککردنەوە"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-bold text-slate-700 px-1.5 min-w-[3rem] text-center">
                  {Math.round(previewScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewScale((s) => Math.min(1.4, s + 0.1))}
                  className="p-1 text-slate-600 hover:text-slate-900 rounded"
                  title="گەورەکردن"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewScale(0.95)}
                  className="p-1 text-slate-600 hover:text-slate-900 rounded"
                  title="قەبارەی بنەڕەتی"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleResetExam}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              title="گەڕاندنەوەی سەرەتایی"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-5 md:p-6 flex flex-col print:p-0 print:max-w-none">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:block">
          {/* Left/Editor Column */}
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div
              className={`h-[calc(100vh-8.5rem)] sticky top-24 no-print ${
                viewMode === 'editor' ? 'lg:col-span-12 max-w-3xl mx-auto w-full' : 'lg:col-span-5 xl:col-span-4'
              }`}
            >
              <EditorSidebar
                exam={exam}
                onChangeExam={setExam}
                onOpenAiGenerator={() => setIsAiOpen(true)}
                onOpenAnswerKey={() => setIsAnswerKeyOpen(true)}
              />
            </div>
          )}

          {/* Right/A4 Stage Preview Column */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              className={`print-area-container flex flex-col items-center overflow-auto print:overflow-visible ${
                viewMode === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7 xl:col-span-8'
              }`}
            >
              <div className="w-full flex justify-center py-2 print:py-0">
                <A4PaperPreview exam={exam} scale={previewScale} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AiGeneratorModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        exam={exam}
        onApplyQuestions={handleApplyAiQuestions}
      />

      <AnswerKeyModal
        isOpen={isAnswerKeyOpen}
        onClose={() => setIsAnswerKeyOpen(false)}
        exam={exam}
        onUpdateAnswerKey={(newKey) => setExam((prev) => ({ ...prev, answerKey: newKey }))}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        exam={exam}
      />
    </div>
  );
}
