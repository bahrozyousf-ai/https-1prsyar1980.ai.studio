import React, { useState } from 'react';
import { Download, Copy, Check, ExternalLink, X, FileCode } from 'lucide-react';
import { ExamData } from '../types/exam';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamData;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, exam }) => {
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const generateFullHtml = () => {
    const { header, layout, questionsText } = exam;

    return `<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>پرسیارەکانی تاقیکردنەوە - ${header.subject || 'پەڕەی پرسیار'}</title>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 portrait;
            margin: 10mm;
        }
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        body {
            font-family: 'Vazirmatn', 'Tahoma', 'Arial', sans-serif;
            margin: 0 auto;
            max-width: 820px;
            padding: 30px;
            background-color: #fff;
            color: #000;
            ${layout.borderStyle === 'double' ? 'border: 4px double #000;' : layout.borderStyle === 'none' ? '' : 'border: 2px solid #000;'}
        }
        .header-table {
            width: 100%;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 16px;
        }
        .header-table td {
            font-size: 13.5px;
            padding: 3px;
            vertical-align: top;
        }
        .exam-title {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            margin: 4px 0;
        }
        .student-row {
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px dotted #666;
            font-size: 13px;
            display: flex;
            justify-content: space-between;
        }
        .instruction-box {
            background-color: #f8fafc;
            border-right: 3px solid #000;
            padding: 5px 10px;
            font-size: 12.5px;
            font-weight: 600;
            margin-bottom: 16px;
        }
        .content {
            font-size: ${layout.fontSize === 'sm' ? '13px' : layout.fontSize === 'lg' ? '16px' : '14.5px'};
            line-height: ${layout.lineHeight === 'tight' ? '1.8' : layout.lineHeight === 'relaxed' ? '2.4' : '2.1'};
            white-space: pre-wrap;
            min-height: 480px;
            ${layout.columns === 2 ? 'column-count: 2; column-gap: 24px; column-rule: 1px dashed #cbd5e1;' : ''}
        }
        .footer-table {
            width: 100%;
            margin-top: 30px;
            border-top: 2px solid #000;
            padding-top: 10px;
            font-weight: bold;
            font-size: 13px;
        }
        @media print {
            body {
                border: none;
                padding: 0;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <table class="header-table">
        <tr>
            <td style="text-align: right; width: 33%;">
                <strong>${header.regionTitle}</strong><br>
                ${header.ministry}<br>
                ${header.directorate ? header.directorate + '<br>' : ''}
                <strong>قوتابخانەی: ${header.school || '.....................'}</strong>
            </td>
            <td style="text-align: center; width: 34%;">
                <div class="exam-title">${header.examTitle || 'تاقیکردنەوەی فەرمی'}</div>
                <div>( ${header.examRound} )</div>
                <div style="font-size: 12px; margin-top: 3px;">ساڵی خوێندن: ${header.academicYear}</div>
            </td>
            <td style="text-align: left; width: 33%;" dir="rtl">
                <strong>بابەت:</strong> ${header.subject}<br>
                <strong>پۆل:</strong> ${header.grade}<br>
                <strong>کات:</strong> ${header.timeLimit}<br>
                <strong>نمرەی تەواو:</strong> ${header.totalMarks}
            </td>
        </tr>
    </table>

    ${header.includeStudentName ? `
    <div class="student-row">
        <div><strong>ناوی چواری قوتابی:</strong> ..............................................................</div>
        <div><strong>هۆبە:</strong> ............ <strong>ژمارە:</strong> ............</div>
    </div>
    ` : ''}

    ${header.instructions ? `
    <div class="instruction-box">
        ${header.instructions}
    </div>
    ` : ''}

    <div class="content">${questionsText}</div>

    <table class="footer-table">
        <tr>
            <td style="text-align: right;">مامۆستای بابەت: ${header.teacher}</td>
            <td style="text-align: center;">${layout.footerWish || 'هیوای سەرکەوتن بۆ هەمووان'}</td>
            <td style="text-align: left;">${layout.principalApproval ? 'ڕەزامەندی بەڕێوەبەر' : 'بەروار و واژۆ'}</td>
        </tr>
    </table>

    <script>
        // پەڕەکە ئامادە دەکات بۆ چاپکردنی خێرا
        window.onload = function() { window.print(); }
    </script>
</body>
</html>`;
  };

  const handleDownloadHtml = () => {
    const html = generateFullHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam_${exam.header.subject || 'paper'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenInNewTab = () => {
    const html = generateFullHtml();
    const newTab = window.open('', '_blank');
    if (newTab) {
      newTab.document.write(html);
      newTab.document.close();
    }
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generateFullHtml());
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleCopyTextOnly = () => {
    const text = `${exam.header.school} - ${exam.header.subject} (${exam.header.grade})
${exam.header.examTitle} - ${exam.header.examRound}
کات: ${exam.header.timeLimit} | نمرە: ${exam.header.totalMarks}
مامۆستای بابەت: ${exam.header.teacher}

${exam.header.instructions ? `[ ${exam.header.instructions} ]\n` : ''}
${exam.questionsText}

${exam.layout.footerWish}`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">هەناردەکردن و داگرتنی پەڕەی تاقیکردنەوە</h3>
            <p className="text-xs text-slate-500 mt-0.5">داگرتن بە فایلی سەربەخۆ یان کۆپیکردن بۆ Word</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <div
            onClick={handleDownloadHtml}
            className="flex items-center justify-between p-3.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">داگرتنی وەک فایلی HTML</div>
                <div className="text-xs text-slate-500">فایلی ئامادەکراو بۆ وێبگەڕ و چاپکردنی دەرەکی بەبێ ئینتەرنێت</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">داگرتن</span>
          </div>

          <div
            onClick={handleOpenInNewTab}
            className="flex items-center justify-between p-3.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">کردنەوە لە پەڕەیەکی نوێدا</div>
                <div className="text-xs text-slate-500">بینین و چاپی ڕاستەوخۆ هاوشێوەی پرۆگرامە کۆنەکەی پایسۆن</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded">کردنەوە</span>
          </div>

          <div
            onClick={handleCopyHtml}
            className="flex items-center justify-between p-3.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">کۆپیکردنی کۆدی HTML</div>
                <div className="text-xs text-slate-500">بۆ دانان لە ماڵپەڕ یان هۆست کردنی تایبەتی</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
              {copiedHtml ? 'کۆپی کرا!' : 'کۆپیکردن'}
            </span>
          </div>

          <div
            onClick={handleCopyTextOnly}
            className="flex items-center justify-between p-3.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Copy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">کۆپیکردنی دەقی پرسیارەکان</div>
                <div className="text-xs text-slate-500">بۆ پەیستکردن لە Microsoft Word یان تێلێگرام</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
              {copiedText ? 'کۆپی کرا!' : 'کۆپیکردن'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            داخستن
          </button>
        </div>
      </div>
    </div>
  );
};
