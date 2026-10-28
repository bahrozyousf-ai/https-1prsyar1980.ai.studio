import React from 'react';
import { ExamData } from '../types/exam';
import { EmblemRenderer } from './Emblems';

interface A4PaperPreviewProps {
  exam: ExamData;
  scale?: number;
}

export const A4PaperPreview: React.FC<A4PaperPreviewProps> = ({ exam, scale = 1 }) => {
  const { header, layout, questionsText } = exam;

  // Determine border styles
  const getBorderClasses = () => {
    switch (layout.borderStyle) {
      case 'double':
        return 'border-4 border-double border-black';
      case 'ornament':
        return 'border-[3px] border-slate-900 ring-2 ring-slate-900 ring-offset-2 ring-offset-white';
      case 'none':
        return 'border-0';
      case 'standard':
      default:
        return 'border-2 border-black';
    }
  };

  // Determine font size
  const getFontSizeClass = () => {
    switch (layout.fontSize) {
      case 'sm':
        return 'text-[12.5px] leading-relaxed';
      case 'lg':
        return 'text-[15.5px] leading-loose';
      case 'base':
      default:
        return 'text-[14px] leading-[2.1]';
    }
  };

  return (
    <div
      className="origin-top transition-transform duration-200"
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
      }}
    >
      <div
        id="printable-exam-sheet"
        className={`a4-sheet mx-auto bg-white p-7 md:p-9 text-slate-900 relative shadow-md print:shadow-none print:p-0 ${getBorderClasses()}`}
        dir="rtl"
      >
        {/* Watermark (optional) */}
        {layout.showWatermark && layout.watermarkText && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 opacity-[0.06]">
            <span className="text-7xl md:text-8xl font-black -rotate-45 tracking-widest text-slate-900">
              {layout.watermarkText}
            </span>
          </div>
        )}

        <div className="relative z-10 flex flex-col justify-between h-full min-h-[265mm] print:min-h-0">
          <div>
            {/* Header Section */}
            <div className="border-b-2 border-black pb-3 mb-3">
              <div className="grid grid-cols-3 items-center gap-2 text-right">
                {/* Column 1: Government & School Details */}
                <div className="text-xs md:text-sm leading-snug space-y-0.5">
                  <div className="font-bold text-slate-900">{header.regionTitle}</div>
                  <div className="font-semibold text-slate-800">{header.ministry}</div>
                  {header.directorate && (
                    <div className="text-slate-700 text-xs">{header.directorate}</div>
                  )}
                  <div className="font-bold text-slate-900 pt-0.5">
                    قوتابخانەی: <span className="underline underline-offset-2">{header.school || '.....................'}</span>
                  </div>
                </div>

                {/* Column 2: Logo and Exam Period */}
                <div className="text-center flex flex-col items-center justify-center space-y-1">
                  <EmblemRenderer
                    type={header.logoType}
                    customUrl={header.customLogoUrl}
                    className="w-14 h-14 md:w-16 md:h-16 mx-auto"
                  />
                  <div className="text-xs md:text-sm font-bold text-slate-900 leading-tight">
                    {header.examTitle || 'تاقیکردنەوەی فەرمی'}
                  </div>
                  <div className="text-xs text-slate-700 font-medium">
                    ( {header.examRound} )
                  </div>
                  <div className="text-[11px] text-slate-600">
                    ساڵی خوێندن: {header.academicYear}
                  </div>
                </div>

                {/* Column 3: Subject & Exam Metadata */}
                <div className="text-left text-xs md:text-sm leading-snug space-y-0.5" dir="rtl">
                  <div>
                    <span className="font-bold">بابەت:</span>{' '}
                    <span className="font-semibold">{header.subject || '.....................'}</span>
                  </div>
                  <div>
                    <span className="font-bold">پۆل:</span>{' '}
                    <span>{header.grade || '.....................'}</span>
                  </div>
                  <div>
                    <span className="font-bold">کات:</span>{' '}
                    <span>{header.timeLimit || '.....................'}</span>
                  </div>
                  <div>
                    <span className="font-bold">نمرەی تەواو:</span>{' '}
                    <span>{header.totalMarks || '.....................'}</span>
                  </div>
                </div>
              </div>

              {/* Student Name and Roll Number Strip */}
              {(header.includeStudentName || header.includeStudentRoll) && (
                <div className="mt-3 pt-2 border-t border-slate-300 flex items-center justify-between text-xs md:text-sm font-medium">
                  {header.includeStudentName && (
                    <div className="flex-1 flex items-center gap-2">
                      <span className="font-bold text-slate-800 shrink-0">ناوی چواری قوتابی:</span>
                      <span className="border-b border-dotted border-slate-700 flex-1 h-5 inline-block"></span>
                    </div>
                  )}
                  {header.includeStudentRoll && (
                    <div className="flex items-center gap-2 mr-4 shrink-0">
                      <span className="font-bold text-slate-800">هۆبە:</span>
                      <span className="border-b border-dotted border-slate-700 w-16 h-5 inline-block"></span>
                      <span className="font-bold text-slate-800 mr-2">ژمارەی تاقیکردنەوە:</span>
                      <span className="border-b border-dotted border-slate-700 w-16 h-5 inline-block"></span>
                    </div>
                  )}
                </div>
              )}

              {/* Optional Teacher Grading Table */}
              {header.includeGradeTable && (
                <div className="mt-2 text-[11px] font-sans">
                  <table className="w-full border-collapse border border-slate-400 text-center">
                    <thead>
                      <tr className="bg-slate-50 print:bg-transparent text-slate-700 font-bold">
                        <th className="border border-slate-400 p-0.5">پرسیار</th>
                        <th className="border border-slate-400 p-0.5 w-12">پ١</th>
                        <th className="border border-slate-400 p-0.5 w-12">پ٢</th>
                        <th className="border border-slate-400 p-0.5 w-12">پ٣</th>
                        <th className="border border-slate-400 p-0.5 w-12">پ٤</th>
                        <th className="border border-slate-400 p-0.5 w-12">پ٥</th>
                        <th className="border border-slate-400 p-0.5 w-16">کۆی نمرە</th>
                        <th className="border border-slate-400 p-0.5">واژۆی مامۆستا</th>
                        <th className="border border-slate-400 p-0.5">وردبینیکار</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="h-6 text-slate-800 font-semibold">
                        <td className="border border-slate-400 p-0.5 bg-slate-50 font-bold text-slate-700 print:bg-transparent">نمرە</td>
                        <td className="border border-slate-400 p-0.5"></td>
                        <td className="border border-slate-400 p-0.5"></td>
                        <td className="border border-slate-400 p-0.5"></td>
                        <td className="border border-slate-400 p-0.5"></td>
                        <td className="border border-slate-400 p-0.5"></td>
                        <td className="border border-slate-400 p-0.5 font-bold">/ {header.totalMarks?.replace(/[^0-9٠-٩]/g, '') || '٥٠'}</td>
                        <td className="border border-slate-400 p-0.5"></td>
                        <td className="border border-slate-400 p-0.5"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Instruction Warning Note */}
            {header.instructions && (
              <div className="mb-3 text-[12px] bg-slate-50 print:bg-transparent border-r-2 border-slate-800 py-1 px-2.5 font-semibold text-slate-800">
                {header.instructions}
              </div>
            )}

            {/* Questions Body */}
            <div
              className={`questions-content font-sans text-slate-900 ${getFontSizeClass()} ${
                layout.columns === 2 ? 'columns-2 gap-8 [column-rule:1px_dashed_#cbd5e1]' : ''
              }`}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {questionsText || 'تکایە دەقی پرسیارەکان لە بەشی پرسیارەکان بنووسە...'}
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-8 pt-3 border-t-2 border-black flex items-end justify-between text-xs md:text-sm font-bold text-slate-800 print:mt-auto">
            <div>
              <span>مامۆستای بابەت: </span>
              <span className="underline underline-offset-2">{header.teacher || '.....................'}</span>
            </div>
            <div className="text-center font-bold text-slate-900">
              {layout.footerWish || 'هیوای سەرکەوتن بۆ هەمووان'}
            </div>
            <div>
              {layout.principalApproval ? (
                <span>ڕەزامەندی بەڕێوەبەر: .....................</span>
              ) : (
                <span>بەروار: ..... / ..... / ٢٠٢...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
