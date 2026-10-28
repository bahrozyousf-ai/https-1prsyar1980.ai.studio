export type LogoType = 'krg_seal' | 'education_torch' | 'kurdish_flag' | 'custom' | 'none';
export type BorderStyle = 'standard' | 'double' | 'ornament' | 'none';
export type FontSize = 'sm' | 'base' | 'lg';
export type LineSpacing = 'tight' | 'normal' | 'relaxed';

export interface ExamHeader {
  regionTitle: string;
  ministry: string;
  directorate: string;
  school: string;
  subject: string;
  grade: string;
  academicYear: string;
  examRound: string;
  timeLimit: string;
  totalMarks: string;
  teacher: string;
  examTitle: string;
  instructions: string;
  includeStudentName: boolean;
  includeStudentRoll: boolean;
  includeGradeTable: boolean;
  logoType: LogoType;
  customLogoUrl: string;
}

export interface ExamLayoutConfig {
  borderStyle: BorderStyle;
  fontSize: FontSize;
  lineHeight: LineSpacing;
  columns: 1 | 2;
  showWatermark: boolean;
  watermarkText: string;
  footerWish: string;
  principalApproval: boolean;
  pageNumbering: boolean;
}

export interface ExamData {
  header: ExamHeader;
  layout: ExamLayoutConfig;
  questionsText: string;
  answerKey: string;
}

export interface PresetTemplate {
  id: string;
  name: string;
  subject: string;
  grade: string;
  data: ExamData;
}
