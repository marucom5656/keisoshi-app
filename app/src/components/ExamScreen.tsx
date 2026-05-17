import { useState, useEffect, useCallback } from 'react';
import type { ExamSession } from '../types';
import Timer from './Timer';

interface ExamScreenProps {
  session: ExamSession;
  onAnswer: (index: number, choice: number) => void;
  onFinish: () => void;
}

export default function ExamScreen({ session, onAnswer, onFinish }: ExamScreenProps) {
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(session.timeLimitSec);

  const question = session.questions[current];
  const userAnswer = session.userAnswers[current];
  const total = session.questions.length;

  const handleFinish = useCallback(() => onFinish(), [onFinish]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { handleFinish(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleFinish]);

  const LABELS = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="text-sm text-gray-500 font-medium">
          {current + 1} / {total}問
        </div>
        <div className="flex-1 mx-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
        </div>
        <Timer remainingSec={remaining} />
      </div>

      {/* 問題 */}
      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded mb-3">
            {question.subject}
          </span>
          <p className="text-gray-800 leading-relaxed font-medium">{question.text}</p>
        </div>

        <div className="space-y-3">
          {question.choices.map((choice, i) => {
            const selected = userAnswer === i;
            return (
              <button
                key={i}
                onClick={() => onAnswer(current, i)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                  selected
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
                }`}
              >
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  selected ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {LABELS[i]}
                </span>
                <span className="text-gray-700 leading-relaxed">{choice}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* フッター */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex gap-3 max-w-2xl mx-auto w-full">
        <button
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          前の問題
        </button>
        {current < total - 1 ? (
          <button
            onClick={() => setCurrent(c => c + 1)}
            className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors"
          >
            次の問題
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-colors"
          >
            試験終了
          </button>
        )}
      </div>
    </div>
  );
}
