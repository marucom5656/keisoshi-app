export type Subject = '計装一般' | '計測' | '制御' | '計装工事' | '法規・規格';

export interface Question {
  id: string;
  year: number;
  subject: Subject;
  text: string;
  choices: [string, string, string, string];
  answer: number; // 0-3
  explanation?: string;
}

export type Screen = 'start' | 'exam' | 'result';

export interface ExamSession {
  questions: Question[];
  userAnswers: (number | null)[];
  startedAt: number;
  finishedAt?: number;
  timeLimitSec: number;
}
