import React, { useState } from 'react';
import {
  FileText,
  Settings,
  HelpCircle,
  Sparkles,
  Upload,
  PlusCircle,
  Hash,
  Wand2,
  ListPlus,
  Loader2,
  Check,
} from 'lucide-react';
import { ExamData, LogoType, BorderStyle, FontSize, LineSpacing } from '../types/exam';

interface EditorSidebarProps {
  exam: ExamData;
  onChangeExam: (newExam: ExamData) => void;
  onOpenAiGenerator: () => void;
  onOpenAnswerKey: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  exam,
  onChangeExam,
  onOpenAiGenerator,
  onOpenAnswerKey,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'questions' | 'layout'>('info');
  const [isAiCleaning, setIsAiCleaning] = useState(false);
  const [cleanSuccess, setCleanSuccess] = useState(false);

  const updateHeader = (field: keyof typeof exam.header, value: any) => {
    onChangeExam({
      ...exam,
      header: {
        ...exam.header,
        [field]: value,
      },
    });
  };

  const updateLayout = (field: keyof typeof exam.layout, value: any) => {
    onChangeExam({
      ...exam,
      layout: {
        ...exam.layout,
        [field]: value,
      },
    });
  };

  const insertSnippet = (snippet: string) => {
    const current = exam.questionsText;
    const separator = current.endsWith('\n') || current === '' ? '' : '\n';
    onChangeExam({
      ...exam,
      questionsText: current + separator + snippet,
    });
  };

  const handleConvertNumbersToKurdish = () => {
    const kurdishDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const converted = exam.questionsText.replace(/[0-9]/g, (w) => kurdishDigits[+w]);
    onChangeExam({
      ...exam,
      questionsText: converted,
    });
  };

  const handleGrammarClean = async () => {
    if (!exam.questionsText.trim()) return;
    setIsAiCleaning(true);
    setCleanSuccess(false);

    try {
      const res = await fetch('/api/gemini/format-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionsText: exam.questionsText,
          action: 'clean_grammar',
        }),
      });

      const data = await res.json();
      if (data.success && data.formattedText) {
        onChangeExam({
          ...exam,
          questionsText: data.formattedText,
        });
        setCleanSuccess(true);
        setTimeout(() => setCleanSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiCleaning(false);
    }
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateHeader('customLogoUrl', reader.result as string);
        updateHeader('logoType', 'custom');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden no-print" dir="rtl">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'info'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>سەرپەڕە و زانیاری</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'questions'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>دەقی پرسیارەکان</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('layout')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'layout'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>دیزاین و ڕێکخستن</span>
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: INFO / HEADER */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">لۆگۆی پەڕەی پرسیار:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'krg_seal', label: 'ئارمی پەروەردەی کوردستان' },
                  { id: 'education_torch', label: 'مەشخەڵ و کتێبی خوێندن' },
                  { id: 'kurdish_flag', label: 'ئاڵای کوردستان' },
                  { id: 'none', label: 'بێ لۆگۆ' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateHeader('logoType', item.id as LogoType)}
                    className={`py-1.5 px-2 rounded border text-right transition-colors ${
                      exam.header.logoType === item.id
                        ? 'border-slate-900 bg-slate-900 text-white font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Custom Logo Upload */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">دانانی لۆگۆی تایبەتی قوتابخانە:</span>
                <label className="cursor-pointer inline-flex items-center gap-1 bg-white border border-slate-300 px-2.5 py-1 rounded text-slate-700 hover:bg-slate-50 font-medium">
                  <Upload className="w-3.5 h-3.5" />
                  <span>دیاریکردنی وێنە</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCustomLogoUpload}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ناوی قوتابخانە / خوێندنگە:
                </label>
                <input
                  type="text"
                  value={exam.header.school}
                  onChange={(e) => updateHeader('school', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="ناوی قوتابخانەکەت بنووسە"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">بابەتی تاقیکردنەوە:</label>
                  <input
                    type="text"
                    value={exam.header.subject}
                    onChange={(e) => updateHeader('subject', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="کۆمپیوتەر، زانست..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">پۆل و قۆناغ:</label>
                  <input
                    type="text"
                    value={exam.header.grade}
                    onChange={(e) => updateHeader('grade', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="پۆلی ١٠ی ئامادەیی"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">مامۆستای بابەت:</label>
                  <input
                    type="text"
                    value={exam.header.teacher}
                    onChange={(e) => updateHeader('teacher', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="م. بەهرۆز یوسف"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">کاتی تاقیکردنەوە:</label>
                  <input
                    type="text"
                    value={exam.header.timeLimit}
                    onChange={(e) => updateHeader('timeLimit', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="١ کاتژمێر و ٣٠ خولەک"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">خول یان وەرز:</label>
                  <select
                    value={exam.header.examRound}
                    onChange={(e) => updateHeader('examRound', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="وەرزی یەکەم - خولی یەکەم">وەرزی یەکەم - خولی یەکەم</option>
                    <option value="وەرزی یەکەم - خولی دووەم">وەرزی یەکەم - خولی دووەم</option>
                    <option value="وەرزی دووەم - خولی یەکەم">وەرزی دووەم - خولی یەکەم</option>
                    <option value="وەرزی دووەم - خولی دووەم">وەرزی دووەم - خولی دووەم</option>
                    <option value="نیوەی وەرزی یەکەم">نیوەی وەرزی یەکەم</option>
                    <option value="نیوەی وەرزی دووەم">نیوەی وەرزی دووەم</option>
                    <option value="تاقیکردنەوەی مانگانە">تاقیکردنەوەی مانگانە</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">نمرەی تەواو:</label>
                  <input
                    type="text"
                    value={exam.header.totalMarks}
                    onChange={(e) => updateHeader('totalMarks', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="٥٠ نمرە"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">بەڕێوەبەرایەتی پەروەردە:</label>
                  <input
                    type="text"
                    value={exam.header.directorate}
                    onChange={(e) => updateHeader('directorate', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="بەڕێوەبەرایەتی گشتی پەروەردەی سلێمانی"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ساڵی خوێندن:</label>
                  <input
                    type="text"
                    value={exam.header.academicYear}
                    onChange={(e) => updateHeader('academicYear', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="٢٠٢٥ - ٢٠٢٦"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">تێبینی سەر پەڕە (Instructions):</label>
                <input
                  type="text"
                  value={exam.header.instructions}
                  onChange={(e) => updateHeader('instructions', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="تێبینی: وەڵامی هەموو پرسیارەکان بدەرەوە..."
                />
              </div>

              {/* Additional Options Checkboxes */}
              <div className="pt-2 space-y-2 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={exam.header.includeStudentName}
                    onChange={(e) => updateHeader('includeStudentName', e.target.checked)}
                    className="rounded text-slate-900 focus:ring-slate-900"
                  />
                  <span>دیاریکردنی شوێنی ناوی چواری قوتابی لە سەرپەڕە</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={exam.header.includeGradeTable}
                    onChange={(e) => updateHeader('includeGradeTable', e.target.checked)}
                    className="rounded text-slate-900 focus:ring-slate-900"
                  />
                  <span>خشتەی دابەشکردنی نمرەی پرسیارەکان بۆ مامۆستا (پ١، پ٢...)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUESTIONS */}
        {activeTab === 'questions' && (
          <div className="space-y-3">
            {/* AI Assistant Banner */}
            <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-950 block">یاریدەدەری زیرەک بۆ پرسیار</span>
                <span className="text-[11px] text-emerald-700">دروستکردنی پرسیاری مەنهەجی بە کوردی بە یەک کرتە</span>
              </div>
              <button
                type="button"
                onClick={onOpenAiGenerator}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>دروستکردن بە AI</span>
              </button>
            </div>

            {/* Quick Insertion Tools */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                زیادکردنی خێرا (Shortcuts):
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => insertSnippet('پ/ وەڵامی ڕاست هەڵبژێرە:  (١٠ نمرە)\n١- \n   (  -   -   )')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-300 transition-colors"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>هەڵبژاردن</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertSnippet('پ/ ئەم بۆشاییانەی خوارەوە پڕبکەرەوە:  (١٠ نمرە)\n١- ......................')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-300 transition-colors"
                >
                  <ListPlus className="w-3 h-3" />
                  <span>بۆشایی</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertSnippet('پ/ هێمای ( ✓ ) لەبەرامبەر ڕاست و هێمای ( ✗ ) لەبەرامبەر هەڵە دابنێ:  (١٠ نمرە)\n١-   (   )')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-300 transition-colors"
                >
                  <span>ڕاست / هەڵە</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertSnippet('(١٠ نمرە)')}
                  className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-300 transition-colors"
                >
                  نمرە
                </button>

                <button
                  type="button"
                  onClick={handleConvertNumbersToKurdish}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-300 transition-colors"
                  title="گۆڕینی ژمارە ئینگلیزییەکان بۆ کوردی: ١، ٢، ٣"
                >
                  <Hash className="w-3 h-3" />
                  <span>ژمارەی کوردی</span>
                </button>

                <button
                  type="button"
                  onClick={handleGrammarClean}
                  disabled={isAiCleaning}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded border border-indigo-200 transition-colors disabled:opacity-50"
                  title="چاککردنی هەڵەی ڕێنووس و خاڵبەندی بە ژیری دەستکرد"
                >
                  {isAiCleaning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  <span>{isAiCleaning ? 'چاککردن...' : 'چاککردنی ڕێنووس'}</span>
                </button>
              </div>

              {cleanSuccess && (
                <div className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>ڕێنووس و فۆرماتی کوردی بە سەرکەوتوویی چاککران.</span>
                </div>
              )}
            </div>

            {/* Questions Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">دەقی پرسیارەکان:</label>
                <span className="text-[11px] text-slate-400">
                  {exam.questionsText.split('\n').filter(Boolean).length} دێڕ | {exam.questionsText.length} پیت
                </span>
              </div>
              <textarea
                value={exam.questionsText}
                onChange={(e) => onChangeExam({ ...exam, questionsText: e.target.value })}
                rows={18}
                className="w-full text-xs md:text-sm leading-relaxed p-3.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white font-sans resize-y"
                placeholder="دەقی پرسیارەکان لێرە بنووسە..."
              />
            </div>

            <button
              type="button"
              onClick={onOpenAnswerKey}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>بینین و ڕێکخستنی کلیلی وەڵامە نموونەییەکان</span>
            </button>
          </div>
        )}

        {/* TAB 3: LAYOUT & DESIGN */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            {/* Border Style */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">شێوازی چوارچێوەی پەڕەکە:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'standard', label: 'هێڵی ستاندارد (ڕەش)' },
                  { id: 'double', label: 'دوو هێڵ (فەرمی پەروەردە)' },
                  { id: 'ornament', label: 'چوارچێوەی دوولایی' },
                  { id: 'none', label: 'بێ چوارچێوە' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => updateLayout('borderStyle', b.id as BorderStyle)}
                    className={`p-2 rounded border text-right transition-colors ${
                      exam.layout.borderStyle === b.id
                        ? 'border-slate-900 bg-slate-900 text-white font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Columns (1 vs 2) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">ڕیزکردنی پرسیارەکان:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => updateLayout('columns', 1)}
                  className={`p-2 rounded border text-center transition-colors ${
                    exam.layout.columns === 1
                      ? 'border-slate-900 bg-slate-900 text-white font-medium'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  یەک ستوون (ئاسایی)
                </button>
                <button
                  type="button"
                  onClick={() => updateLayout('columns', 2)}
                  className={`p-2 rounded border text-center transition-colors ${
                    exam.layout.columns === 2
                      ? 'border-slate-900 bg-slate-900 text-white font-medium'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  دوو ستوون (بۆ کەمکردنەوەی کاغەز)
                </button>
              </div>
            </div>

            {/* Font Size & Line Spacing */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">قەبارەی فۆنت:</label>
                <select
                  value={exam.layout.fontSize}
                  onChange={(e) => updateLayout('fontSize', e.target.value as FontSize)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="sm">بچووک (پڕکردنەوەی زیاتر)</option>
                  <option value="base">مامناوەند (پێشنیارکراو)</option>
                  <option value="lg">گەورە (ڕوون بۆ بنەڕەتی)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">بۆشایی نێوان دێڕەکان:</label>
                <select
                  value={exam.layout.lineHeight}
                  onChange={(e) => updateLayout('lineHeight', e.target.value as LineSpacing)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="tight">کەم</option>
                  <option value="normal">ئاسایی</option>
                  <option value="relaxed">فراوان (شوێنی وەڵامدانەوە)</option>
                </select>
              </div>
            </div>

            {/* Watermark */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={exam.layout.showWatermark}
                  onChange={(e) => updateLayout('showWatermark', e.target.checked)}
                  className="rounded text-slate-900 focus:ring-slate-900"
                />
                <span>دانانی نیشانەی ئاوی لە پاشبنەما (Watermark)</span>
              </label>

              {exam.layout.showWatermark && (
                <input
                  type="text"
                  value={exam.layout.watermarkText}
                  onChange={(e) => updateLayout('watermarkText', e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  placeholder="دەقی نیشانەی ئاوی (بۆ نموونە: قوتابخانەی هەڵگورد)"
                />
              )}
            </div>

            {/* Footer Options */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">نزای کۆتایی لە ژێرپەڕە:</label>
                <input
                  type="text"
                  value={exam.layout.footerWish}
                  onChange={(e) => updateLayout('footerWish', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="هیوای سەرکەوتن بۆ هەمووان"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={exam.layout.principalApproval}
                  onChange={(e) => updateLayout('principalApproval', e.target.checked)}
                  className="rounded text-slate-900 focus:ring-slate-900"
                />
                <span>شوێنی واژۆ و ڕەزامەندی بەڕێوەبەر لە ژێرپەڕە</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
