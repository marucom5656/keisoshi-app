import { useState, useCallback } from 'react';
import type { Question, ExamSession, Screen } from './types';
import questionsData from './data/questions.json';
import StartScreen from './components/StartScreen';
import ExamScreen from './components/ExamScreen';
import ResultScreen from './components/ResultScreen';

const allQuestions = questionsData as Question[];

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [session, setSession] = useState<ExamSession | null>(null);

  const handleStart = (questions: Question[], timeLimitSec: number) => {
    setSession({
      questions,
      userAnswers: new Array(questions.length).fill(null),
      startedAt: Date.now(),
      timeLimitSec,
    });
    setScreen('exam');
  };

  const handleAnswer = useCallback((index: number, choice: number) => {
    setSession(prev => {
      if (!prev) return prev;
      const userAnswers = [...prev.userAnswers];
      userAnswers[index] = choice;
      return { ...prev, userAnswers };
    });
  }, []);

  const handleFinish = useCallback(() => {
    setSession(prev => prev ? { ...prev, finishedAt: Date.now() } : prev);
    setScreen('result');
  }, []);

  const handleRetry = () => {
    setSession(null);
    setScreen('start');
  };

  if (screen === 'exam' && session) {
    return <ExamScreen session={session} onAnswer={handleAnswer} onFinish={handleFinish} />;
  }
  if (screen === 'result' && session) {
    return <ResultScreen session={session} onRetry={handleRetry} />;
  }
  return <StartScreen allQuestions={allQuestions} onStart={handleStart} />;
}
