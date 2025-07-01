import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ReadingInterface from './components/ReadingInterface';
import LoginForm from './components/LoginForm';
import { tokenManager } from './auth';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ページ読み込み時にログイン状態をチェック
    const savedUser = tokenManager.getUser();
    const token = tokenManager.getToken();
    
    if (savedUser && token) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    const token = tokenManager.getToken();
    if (token) {
      // APIでログアウト（エラーは無視）
      fetch('http://127.0.0.1:8000/api/auth/logout/', {
        method: 'POST',
        headers: { Authorization: `Token ${token}` }
      }).catch(() => {});
    }
    
    tokenManager.removeToken();
    tokenManager.removeUser();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">読</span>
          </div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
          <Route path="/reading/:materialId" element={<ReadingPage user={user} onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
}

// Homeコンポーネントにユーザー情報とログアウト機能を追加
const Home: React.FC<{user: any, onLogout: () => void}> = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">読</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                国語読解学習システム
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user.username}</span>
                <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                  {user.user_type === 'student' ? '学生' : '教員'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 既存のメインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            深く読み、<span className="text-primary-600">考える力</span>を育む
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            文章との対話を通して、思考力と表現力を身につける新しい学習体験
          </p>
        </div>

        {/* 教材カード */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            📚 利用可能な教材
          </h3>
          
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 animate-slide-up">
              <div className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">📖</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors">
                      石を愛でる人
                    </h4>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      小池昌代の作品。石との関わりを通して人間関係を見つめ直す現代文学です。
                      物言わぬ石が語りかける、人との距離感や心の在り方について深く考察します。
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                      <span className="flex items-center space-x-1">
                        <span>📝</span>
                        <span>選択式問題</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>⏱️</span>
                        <span>約30分</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>🎯</span>
                        <span>読解・分析</span>
                      </span>
                    </div>
                    
                    <Link 
                      to="/reading/1"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <span>学習を開始</span>
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="h-2 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          </div>
        </div>

        {/* 機能紹介 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-r from-success-100 to-success-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🖍️</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">注釈機能</h4>
            <p className="text-gray-600 text-sm">文章にマーカーや付箋を貼って、重要な部分を記録</p>
          </div>
          
          <div className="text-center p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="w-16 h-16 bg-gradient-to-r from-warning-100 to-warning-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💭</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">思考記録</h4>
            <p className="text-gray-600 text-sm">なぜそう考えたのか、思考過程をメモして振り返り</p>
          </div>
          
          <div className="text-center p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="w-16 h-16 bg-gradient-to-r from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">学習分析</h4>
            <p className="text-gray-600 text-sm">学習履歴を分析して、成長を可視化</p>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500 text-sm">
            © 2025 国語読解学習システム. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const ReadingPage: React.FC<{user: any, onLogout: () => void}> = ({ user, onLogout }) => {
  const materialId = 1;

  return (
    <div className="min-h-screen bg-reading-background">
      <nav className="bg-white/95 backdrop-blur-sm border-b border-primary-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>ホームに戻る</span>
            </Link>
            
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              国語読解学習システム
            </h1>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">{user.username.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm text-gray-600">{user.username}</span>
              <button
                onClick={onLogout}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>
      <ReadingInterface materialId={materialId} studentId={user.user_id} />
    </div>
  );
};

export default App;
