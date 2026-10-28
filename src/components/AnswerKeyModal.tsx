import React, { useState } from 'react';
import { Copy, Check, Printer, X, Sparkles, AlertCircle } from 'lucide-react';
import { ExamData } from '../types/exam';

interface AnswerKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamData;
  onUpdateAnswerKey: (newKey: string) => void;
}

export const AnswerKeyModal: React.FC<AnswerKeyModalProps> = ({
  isOpen,
  onClose,
  exam,
  onUpdateAnswerKey,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(exam.answerKey || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintAnswerKey = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ckb" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>کلیلی وەڵامی نموونەیی - ${exam.header.subject}</title>
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Vazirmatn', sans-serif;
            padding: 30px;
            max-width: 800px;
            margin: auto;
            color: #111;
          }
          .header {
            border-bottom: 2px solid #000;
            padding-bottom: 12px;
            margin-bottom: 20px;
            text-align: center;
          }
          h1 { margin: 0 0 8px 0; font-size: 20px; }
          .meta { font-size: 14px; margin-bottom: 6px; }
          .content {
            font-size: 15px;
            line-height: 2;
            white-space: pre-wrap;
            background: #fff;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>کلیلی وەڵامە نموونەییەکان و پێوەری نمرەدانان</h1>
          <div class="meta">قوتابخانە: ${exam.header.school} | بابەت: ${exam.header.subject} | پۆل: ${exam.header.grade}</div>
          <div class="meta">مامۆستای بابەت: ${exam.header.teacher} | خول/وەرز: ${exam.header.examRound}</div>
        </div>
        <div class="content">${exam.answerKey || 'هیچ کلیلێک نەنووسراوە.'}</div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleGenerateAIKey = async () => {
    if (!exam.questionsText.trim()) {
      setErrorMsg('تکایە سەرەتا پرسیارەکان بنووسە بۆ ئەوەی کلیلی وەڵام دروست بکرێت.');
      return;
    }
    setErrorMsg('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini/format-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionsText: exam.questionsText,
          action: 'generate_answers',
        }),
      });

      const data = await res.json();
      if (data.success && data.formattedText) {
        onUpdateAnswerKey(data.formattedText);
      } else {
        setErrorMsg(data.error || 'کێشەیەک ڕوویدا لە دروستکردنی وەڵامەکان');
      }
    } catch {
      setErrorMsg('پەیوەندی لەگەڵ سێرڤەر سەرکەوتوو نەبوو.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              کلیلی وەڵامە نموونەییەکان بۆ مامۆستا (Answer Key)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ئەم بەشە تایبەتە بە مامۆستا بۆ کاتی چاککردن و نمرەدانانی پەڕەی تاقیکردنەوە
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">دەقی وەڵامە نموونەییەکان و پێوەری نمرە:</span>
            <button
              onClick={handleGenerateAIKey}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'خەریکی دروستکردنە...' : 'دروستکردنی وەڵام بە ژیری دەستکرد'}</span>
            </button>
          </div>

          <textarea
            value={exam.answerKey}
            onChange={(e) => onUpdateAnswerKey(e.target.value)}
            placeholder="لێرە وەڵامی نموونەیی هەر پرسیارێک بە جیا بنووسە بۆ ڕێبەری نمرەدانان..."
            rows={14}
            className="w-full text-sm leading-relaxed p-4 border border-slate-200 rounded-lg font-sans focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white resize-none"
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'کۆپی کرا' : 'کۆپیکردنی دەق'}</span>
            </button>

            <button
              onClick={handlePrintAnswerKey}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>چاپکردنی کلیل بە تەنیا</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            داخستن
          </button>
        </div>
      </div>
    </div>
  );
};
