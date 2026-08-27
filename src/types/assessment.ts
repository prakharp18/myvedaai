// TypeScript interface definitions for Assessment Extraction and Mapping

export interface BoundingBox {
  pageIndex: number; // 0-indexed page number
  ymin: number;      // 0 to 1000 normalized coordinate
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface QuestionItem {
  id: string;              // e.g. "q1", "q11a", "q11b"
  numberLabel: string;     // e.g. "1", "11(a)", "11(b)"
  text: string;            // Question text
  maxMarks?: number;       // e.g. 5
}

export interface AnswerItem {
  questionId: string;      // ID of mapped question, or "unmatched"
  studentAnswerText: string;
  isAnswered: boolean;
  boundingBoxes: BoundingBox[]; // region(s) on answer sheet
  marksAwarded?: number;
  feedback?: string;
  isCorrect?: boolean;
}

export interface MappedAssessmentResult {
  questions: QuestionItem[];
  answers: Record<string, AnswerItem>; // keyed by questionId
  unmatchedAnswers: AnswerItem[];      // answers written but not matching any question
  overallSummary?: {
    totalMarks: number;
    scoredMarks: number;
    feedback: string;
  };
}
