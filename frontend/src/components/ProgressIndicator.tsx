import React from 'react';

interface ProgressIndicatorProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
  hasAnnotations: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  hasAnnotations
}) => {
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">学習進捗</h3>
        <span className="text-sm text-gray-500">
          {answeredQuestions} / {totalQuestions} 問完了
        </span>
      </div>
      
      {/* プログレスバー */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {/* 詳細情報 */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success-400 rounded-full"></div>
          <span className="text-gray-600">回答済み: {answeredQuestions}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-warning-400 rounded-full"></div>
          <span className="text-gray-600">注釈: {hasAnnotations ? 'あり' : 'なし'}</span>
        </div>
      </div>
      
      {/* 完了メッセージ */}
      {progressPercentage === 100 && (
        <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-success-600 text-lg">🎉</span>
            <span className="text-success-700 font-medium">すべての問題に回答しました！</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
