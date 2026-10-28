import React, { useState } from 'react';
import { Sparkles, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ExamData } from '../types/exam';

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamData;
  onApplyQuestions: (newQuestions: string, answerKey: string, timeLimit?: string, totalMarks?: string) => void;
}

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  isOpen,
  onClose,
  exam,
  onApplyQuestions,
}) => {
  const [subject, setSubject] = useState(exam.header.subject || 'کۆمپیوتەر');
  const [grade, setGrade] = useState(exam.header.grade || 'پۆلی دەیەمی ئامادەیی');
  const [topic, setTopic] = useState('ڕەقەکاڵا و نەرمەکاڵا و سەرەتای پرۆگرامسازی پایسۆن');
  const [questionCount, setQuestionCount] = useState(4);
  const [difficulty, setDifficulty] = useState('مامناوەند');
  const [language, setLanguage] = useState<'sorani' | 'badini'>('sorani');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'هەڵبژاردن لە نێوان چەند وەڵامێکدا',
    'پڕکردنەوەی بۆشایی',
    'ڕاست و هەڵە',
    'پرسیاری کورت و شیکاری',
  ]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    questionsText: string;
    answerKey: string;
    suggestedTime: string;
    suggestedTotalMarks: number;
    summary: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg('');
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/gemini/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade,
          topic,
          questionTypes: selectedTypes,
          questionCount,
          difficulty,
          language,
          additionalNotes,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setGeneratedResult(json.data);
      } else {
        setErrorMsg(json.error || 'کێشەیەک ڕوویدا لە کاتی دروستکردنی پرسیارەکان');
      }
    } catch {
      setErrorMsg('پەیوەندی لەگەڵ سێرڤەر سەرکەوتوو نەبوو.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (mode: 'replace' | 'append') => {
    if (!generatedResult) return;

    let finalQuestions = generatedResult.questionsText;
    if (mode === 'append' && exam.questionsText.trim()) {
      finalQuestions = `${exam.questionsText.trim()}\n\n${generatedResult.questionsText.trim()}`;
    }

    let finalAnswers = generatedResult.answerKey;
    if (mode === 'append' && exam.answerKey?.trim()) {
      finalAnswers = `${exam.answerKey.trim()}\n\n${generatedResult.answerKey?.trim()}`;
    }

    onApplyQuestions(
      finalQuestions,
      finalAnswers,
      generatedResult.suggestedTime,
      generatedResult.suggestedTotalMarks ? `${generatedResult.suggestedTotalMarks} نمرە` : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                دروستکردنی پرسیار بە ژیری دەستکرد (Gemini AI)
              </h3>
              <p className="text-xs text-slate-500">
                بەپێی مەنهەجی وەزارەتی پەروەردەی هەرێمی کوردستان پرسیاری ڕێکوپێک دروست بکە
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!generatedResult ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">بابەتی خوێندن:</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    placeholder="بۆ نموونە: بیرکاری، زانست، کۆمپیوتەر"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">پۆل:</label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    placeholder="بۆ نموونە: پۆلی ٩ی بنەڕەتی یان ١٢ی زانستی"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">تەوەر یان وانەی دیاریکراو:</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  placeholder="بۆ نموونە: بەشی یەکەم، یاساکانی نیوتن، ئەندامەکانی لەش..."
                />
              </div>

              {/* Question Types */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">جۆری پرسیارەکان:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'هەڵبژاردن لە نێوان چەند وەڵامێکدا',
                    'پڕکردنەوەی بۆشایی',
                    'ڕاست و هەڵە',
                    'پرسیاری کورت و شیکاری',
                    'پێناسە و چەمکەکان',
                    'گەیاندن و بەستنەوە (Matching)',
                  ].map((type) => {
                    const isSelected = selectedTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleType(type)}
                        className={`text-right text-xs p-2 rounded-lg border transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white font-medium'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{type}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 mr-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Counts, Difficulty & Dialect */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ژمارەی پرسیار:</label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value={3}>٣ پرسیار</option>
                    <option value={4}>٤ پرسیار</option>
                    <option value={5}>٥ پرسیار</option>
                    <option value={6}>٦ پرسیار</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ئاستی سەختی:</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="ئاسان">ئاسان</option>
                    <option value="مامناوەند">مامناوەند</option>
                    <option value="سەخت و کێبڕکێکار">سەخت / ئاست بەرز</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">شێوەزاری کوردی:</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="sorani">سۆرانی (ناوەڕاست)</option>
                    <option value="badini">بادینی (دهۆک)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">تێبینی زیاتر (ئارەزوومەندانە):</label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  placeholder="بۆ نموونە: پرسیارەکان لەسەر لاپەڕەی ٢٠ تا ٤٥ بێت، یان نمرەی پ١ زیادتر بێت"
                />
              </div>
            </div>
          ) : (
            /* Result Preview */
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                <span className="font-bold">سەرکەوتوو بوو!</span> {generatedResult.summary}
              </div>

              <div>
                <span className="text-xs font-bold text-slate-800 block mb-1">پرسیارە دروستکراوەکان:</span>
                <textarea
                  readOnly
                  value={generatedResult.questionsText}
                  rows={10}
                  className="w-full text-xs leading-relaxed p-3 border border-slate-300 rounded-lg bg-slate-50 font-sans resize-none"
                />
              </div>

              {generatedResult.answerKey && (
                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-1">کلیلی وەڵامەکان:</span>
                  <textarea
                    readOnly
                    value={generatedResult.answerKey}
                    rows={4}
                    className="w-full text-xs leading-relaxed p-3 border border-slate-300 rounded-lg bg-slate-50 font-sans resize-none text-slate-600"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {!generatedResult ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                پاشگەزبوونەوە
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>خەریکی دروستکردنی پرسیارەکانە...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>دروستکردنی پرسیارەکان</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setGeneratedResult(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                دروستکردنەوە لە نوێ
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApply('append')}
                  className="px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  زیادکردن بۆ پرسیارەکانم
                </button>

                <button
                  type="button"
                  onClick={() => handleApply('replace')}
                  className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  جێگرتنەوەی پەڕەی تاقیکردنەوە
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
