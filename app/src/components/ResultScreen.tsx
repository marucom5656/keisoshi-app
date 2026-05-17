import { useState } from 'react';
import type { ExamSession, Subject } from '../types';

interface ResultScreenProps {
  session: ExamSession;
  onRetry: () => void;
}

const SUBJECTS: Subject[] = ['計装一般', '計測', '制御', '計装工事', '法規・規格'];
const PASS_RATE = 0.6;
const LABELS = ['A', 'B', 'C', 'D'];

export default function ResultScreen({ session, onRetry }: ResultScreenProps) {
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong'>('all');

  const { questions, userAnswers } = session;
  const correct = questions.filter((q, i) => userAnswers[i] === q.answer).length;
  const rate = correct / questions.length;
  const passed = rate >= PASS_RATE;

  const elapsed = session.finishedAt
    ? Math.floor((session.finishedAt - session.startedAt) / 1000)
    : session.timeLimitSec;
  const elapsedMin = Math.floor(elapsed / 60);
  const elapsedSec = elapsed % 60;

  const subjectStats = SUBJECTS.map(sub => {
    const qs = questions.filter(q => q.subject === sub);
    if (qs.length === 0) return null;
    const ok = qs.filter(q => userAnswers[questions.indexOf(q)] === q.answer).length;
    return { subject: sub, correct: ok, total: qs.length };
  }).filter(Boolean) as { subject: Subject; correct: number; total: number }[];

  const reviewed = questions
    .map((q, i) => ({ q, i, userAnswer: userAnswers[i] }))
    .filter(({ q, userAnswer }) => reviewFilter === 'all' || userAnswer !== q.answer);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">

        {/* スコアカード */}
        <div className={`rounded-2xl p-6 mb-4 text-white text-center shadow-lg ${passed ? 'bg-green-500' : 'bg-red-400'}`}>
          <p className="text-4xl font-extrabold mb-1">
            {correct} / {questions.length}
          </p>
          <p className="text-xl font-semibold mb-2">
            {Math.round(rate * 100)}点
          </p>
          <p className="text-2xl font-bold">
            {passed ? '合格ライン達成！' : 'もう一息！'}
          </p>
          <p className="text-sm opacity-80 mt-1">
            所要時間: {elapsedMin}分{elapsedSec}秒
          </p>
        </div>

        {/* 科目別 */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <h2 className="font-bold text-gray-700 mb-4">科目別正答率</h2>
          <div className="space-y-3">
            {subjectStats.map(({ subject, correct: ok, total }) => (
              <div key={subject}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{subject}</span>
                  <span className="font-semibold text-gray-800">{ok}/{total} ({Math.round(ok/total*100)}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${ok/total >= PASS_RATE ? 'bg-green-400' : 'bg-red-400'}`}
                    style={{ width: `${(ok/total)*100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ボタン */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={onRetry}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
          >
            もう一度
          </button>
          <button
            onClick={() => setShowReview(r => !r)}
            className="flex-1 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
          >
            {showReview ? '解説を閉じる' : '解説を見る'}
          </button>
        </div>

        {/* 解説 */}
        {showReview && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex gap-2 mb-4">
              {(['all', 'wrong'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setReviewFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    reviewFilter === f
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'text-gray-500 border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  {f === 'all' ? '全問' : '間違えた問題'}
                </button>
              ))}
            </div>
            <div className="space-y-6">
              {reviewed.map(({ q, i, userAnswer }) => {
                const isCorrect = userAnswer === q.answer;
                return (
                  <div key={q.id} className={`rounded-xl p-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500">問{i + 1}｜{q.subject}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCorrect ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                        {isCorrect ? '正解' : '不正解'}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium mb-3 text-sm">{q.text}</p>
                    <div className="space-y-1.5">
                      {q.choices.map((c, ci) => (
                        <div
                          key={ci}
                          className={`flex items-start gap-2 text-sm p-2 rounded-lg ${
                            ci === q.answer
                              ? 'bg-green-100 text-green-800 font-semibold'
                              : ci === userAnswer && !isCorrect
                              ? 'bg-red-100 text-red-700 line-through'
                              : 'text-gray-500'
                          }`}
                        >
                          <span className="font-bold">{LABELS[ci]}.</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 mb-1">解説</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
