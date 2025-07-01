import React, { useState, useEffect } from 'react';

interface SaveStatusProps {
  isModified: boolean;
  lastSaved?: Date;
}

const SaveStatus: React.FC<SaveStatusProps> = ({ isModified, lastSaved }) => {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (lastSaved && !isModified) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved, isModified]);

  if (showSaved) {
    return (
      <div className="flex items-center space-x-2 text-success-600 animate-fade-in">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm font-medium">自動保存済み</span>
      </div>
    );
  }

  if (isModified) {
    return (
      <div className="flex items-center space-x-2 text-warning-600">
        <div className="w-2 h-2 bg-warning-500 rounded-full animate-pulse"></div>
        <span className="text-sm">未保存の変更があります</span>
      </div>
    );
  }

  return null;
};

export default SaveStatus;
