import { useState } from 'react';
import type { Question, Subject } from '../types';

interface StartScreenProps {
  allQuestions: Question[];
  onStart: (questions: Question[], timeLimitSec: number) => void;
}

const SUBJECTS: Subject[] = ['計装一般', '計測', '制御', '計装工事', '法規・規格'];
const TIME_OPTIONS = [
  { label: '30分', sec: 1800 },
  { label: '60分', sec: 3600 },
  { label: '90分（本番相当）', sec: 5400 },
];

export default function StartScreen({ allQuestions, onStart }: StartScreenProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([...SUBJECTS]);
  const [questionCount, setQuestionCount] = useState(20);
  const [timeSec, setTimeSec] = useState(3600);

  const toggleSubject = (s: Subject) => {
    setSelectedSubjects(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const available = allQuestions.filter(q => selectedSubjects.includes(q.subject));

  const handleStart = () => {
    if (available.length === 0) return;
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    onStart(shuffled.slice(0, Math.min(questionCount, shuffled.length)), timeSec);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-2">計装士1級</h1>
        <p className="text-center text-gray-500 mb-8">模擬試験</p>

        {/* 科目選択 */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-600 mb-2">科目を選択</p>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map(s => (
              <button
                key={s}
                onClick={() => toggleSubject(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedSubjects.includes(s)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-500 border-gray-300 hover:border-indigo-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">対象問題: {available.length}問</p>
        </div>

        {/* 問題数 */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-600 mb-2">出題数</p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={5}
              max={Math.min(available.length, 50)}
              value={questionCount}
              onChange={e => setQuestionCount(Number(e.target.value))}
              className="flex-1 accent-indigo-600"
            />
            <span className="w-14 text-center font-bold text-indigo-700 text-lg">{questionCount}問</span>
          </div>
        </div>

        {/* 制限時間 */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-600 mb-2">制限時間</p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_OPTIONS.map(opt => (
              <button
                key={opt.sec}
                onClick={() => setTimeSec(opt.sec)}
                className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                  timeSec === opt.sec
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={available.length === 0}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold text-lg rounded-xl transition-colors"
        >
          試験開始
        </button>
      </div>
    </div>
  );
}
