import { useEffect, useRef } from 'react';
import { submitAnswer } from '../api';

interface UseAutoSaveProps {
  studentId: number;
  questionId: number;
  answerText: string;
  reasoningNote: string;
  delay?: number; // 自動保存の遅延時間（ミリ秒）
}

export const useAutoSave = ({
  studentId,
  questionId,
  answerText,
  reasoningNote,
  delay = 2000 // デフォルト2秒
}: UseAutoSaveProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    const currentData = JSON.stringify({ answerText, reasoningNote });
    
    // データが変更されていない場合は保存しない
    if (currentData === lastSavedRef.current) {
      return;
    }

    // 既存のタイマーをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 新しいタイマーを設定
    timeoutRef.current = setTimeout(async () => {
      try {
        if (answerText.trim() || reasoningNote.trim()) {
          await submitAnswer({
            student: studentId,
            question: questionId,
            answer_text: answerText,
            reasoning_note: reasoningNote
          });
          
          lastSavedRef.current = currentData;
          console.log('回答を自動保存しました');
        }
      } catch (error) {
        console.error('自動保存に失敗しました:', error);
      }
    }, delay);

    // クリーンアップ
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [studentId, questionId, answerText, reasoningNote, delay]);

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};
