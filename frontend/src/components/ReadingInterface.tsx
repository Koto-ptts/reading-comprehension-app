import React, { useState, useEffect, useRef } from 'react';
import { ReadingMaterial, Question, StudentAnswer, Annotation, fetchReadingMaterial, fetchQuestions, submitAnswer, addAnnotation, fetchAnnotations, deleteAnnotation } from '../api';
import { useAutoSave } from '../hooks/useAutoSave';
import SaveStatus from './SaveStatus';
import { getTextSelection, highlightTextInElement, removeHighlight } from '../utils/textSelection';
import ProgressIndicator from './ProgressIndicator';

interface ReadingInterfaceProps {
  materialId: number;
  studentId: number;
}

const ReadingInterface: React.FC<ReadingInterfaceProps> = ({ materialId, studentId }) => {
  // ここに配置する（他のuseStateの近く）
  const textContentRef = useRef<HTMLDivElement>(null);
  
  const [material, setMaterial] = useState<ReadingMaterial | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [reasoningNotes, setReasoningNotes] = useState<{[key: number]: string}>({});
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [showText, setShowText] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [isModified, setIsModified] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  
  // 以下、残りのコード...


  // 自動保存機能
useAutoSave({
  studentId,
  questionId: currentQuestion?.id || 0,
  answerText: answers[currentQuestion?.id || 0] || '',
  reasoningNote: reasoningNotes[currentQuestion?.id || 0] || '',
});

  useEffect(() => {
    const loadData = async () => {
      try {
        const materialResponse = await fetchReadingMaterial(materialId);
        setMaterial(materialResponse.data);
        const questionsResponse = await fetchQuestions(materialId);
        setQuestions(questionsResponse.data);
        const annotationsResponse = await fetchAnnotations(materialId, studentId);
        setAnnotations(annotationsResponse.data);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
        setMaterial({
          id: 1,
          title: '石を愛でる人',
          content: '１．趣味といってもいろいろあるが、山形さんの場合は、「石」であった。「石」を愛でることであった。そのようなひとを、一般に「愛石家」と呼ぶらしい。愛猫家とか愛妻家とか、考えてみれば、世の中には何かを愛して一家を構えるほどの人が結構いる。しかしアイセキカと聞いて、即座に石を愛するひととは、ちょっと思い浮かばなかった。山形さんから「アイセキカ」友の会に入会しましたよ、と聞いたときは、えっ？愛惜？と聞き返してしまった。山形さんは、そのころ奥さんを、病気でなくしたばかりのころだったから。山形さんが、石を愛するようになったのが、奥さんをなくしたことと関係があるのかないのかは、よくわからない。２．わざわざ表明したことはないが、実はわたしも石が好きである。どこかへ行くと、自分の思い出にと、石を持ち帰ることが今までにもよくあった。３．子供のころも、海や川へ行くたびに、小石を拾っては家に持ち帰ったが、当時は石よりも、石を持ち帰るという行為そのもののほうに、特別の意味があったようだ。部屋に持ち込まれた石はきまって急速に魅力を失い、がらくたの一つになってしまった。そもそも水辺にある小石は、川や海の水に濡れているときは妙に魅力があるのに、乾いてしまうと、ただの石だ。濡れている色と乾いた色って、同じ石でも随分違う。水辺の石の魅力をつくっているものが、実は、石そのものでなく、水の力であったということなのか。４．今、わたしの机の上には、イタリアのアッシジで拾ってきた、大理石のかけらが四つある。イタリアの明るい陽に、きらきらと微妙な色の差を見せてくれた、薄紅、薄紫、ミルク色、薄茶の四つの石は、これは日本に持ち帰っても、不思議なことに色あせることがなかった。５．一人でいる夜、疲れて心がざらついているようなとき、その石をてのひらのなかでころがしてみる。石とわたしは、どこまでも混ざりあわない。あくまでも石は石。わたしはわたしである。石のなかへわたしは入れず、石もわたしに、侵入してこない。その無機質で冷たい関係が、かえってわたしに、不思議な安らぎをあたえてくれる。６．人間関係の疲労とは、行き交う言葉をめぐる疲労である。だから、言葉を持たない石のような冷やかさが、その冷たいあたたかさが、とりわけ身にしみる日々があるのだ。こうしてみると、わたしだって、充分、アイセキカの一人ではないか。',
          group: 1,
          created_by: 1,
          created_at: '2025-06-28'
        });

        setQuestions([
          {
            id: 1,
            material: 1,
            question_text: 'セクション6に「言葉を持たない石のような冷やかさが、その冷たいあたたかさが、とりわけ身にしみる」とあるが、それはどういうことか。その説明として最も適当なものを、次の①～⑤のうちから一つ選べ。',
            question_type: 'multiple_choice',
            choices: [
              '① 周囲の人の慰めや励ましより、物言わぬ石がもたらす緊張感の方が、自分が確かな存在であることを実感させ、それが人としての自信を取り戻させてくれるということ。',
              '② 石と互いに干渉せずに向き合うことは、言葉を交わす人間関係の煩わしさに疲れていらだった心を癒やし、ほっとするような孤独を感じさせてくれるということ。',
              '③ 物言わぬ石の持つきびしい拒絶感に触れることで、今では失ってしまった、周囲の人との心の通い合いの大切さがかえって切実に思えてくるということ。',
              '④ 現実の生活では時に嘘をつき自分を偽ることがあるのに対し、物言わぬ石と感覚を同化させていく時は、虚飾のない本当の自分を強く実感できるということ。',
              '⑤ 乾いて色あせてしまった水辺の石でも、距離を置いて見つめ直してみることによって、他人の言葉に傷ついたわたしを静かに慰めてくれるように思えてくるということ。'
            ],
            hide_text: false,
            order: 1
          }
        ]);
      }
    };

    loadData();
  }, [materialId, studentId]);

  useEffect(() => {
    if (currentQuestion) {
      setShowText(!currentQuestion.hide_text);
    }
  }, [currentQuestion]);

  // useEffectを追加（他のuseEffectの後に）
useEffect(() => {
  const handleDocumentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const annotationId = target.getAttribute('data-annotation-id');
    
    if (annotationId && target.classList.contains('highlight-yellow') || target.classList.contains('sticky-note')) {
      e.stopPropagation();
      e.preventDefault();
     //削除済み
    }
  };

  // ドキュメント全体にイベントリスナーを追加
  document.addEventListener('click', handleDocumentClick);

  // クリーンアップ
  return () => {
    document.removeEventListener('click', handleDocumentClick);
  };
}, [annotations]); // annotationsが変更されたら再設定

const handleTextSelection = () => {
  const selection = getTextSelection();
  if (selection) {
    setSelectedText(selection.text);
  } else {
    setSelectedText('');
  }
};

const handleTextClick = (e: React.MouseEvent) => {
  const target = e.target as HTMLElement;
  const annotationId = target.getAttribute('data-annotation-id');
  
  if (annotationId && annotationId !== '') {  // より厳密なチェック
    e.stopPropagation();
    e.preventDefault();
    
    const annotation = annotations.find(a => a.id?.toString() === annotationId);
    if (annotation) {
      const confirmDelete = window.confirm('この注釈を削除しますか？');
      if (confirmDelete) {
        removeAnnotation(annotation);
      }
    }
  }
};

const addHighlight = async () => {
  const selection = getTextSelection();
  if (selection && selectedText) {
    const newAnnotation: Annotation = {
      student: studentId,
      material: materialId,
      annotation_type: 'highlight',
      start_position: selection.startOffset,
      end_position: selection.endOffset,
      content: selectedText,
      color: '#fef3c7'
      
    };
    
    try {
      const response = await addAnnotation(newAnnotation);
      const savedAnnotation = response.data;
      
      // addHighlight関数内で
if (textContentRef.current) {
  highlightTextInElement(
    textContentRef.current,
    selection.startOffset,
    selection.endOffset,
    'highlight-yellow',
    savedAnnotation.id?.toString() || Date.now().toString()
  );
}

      
      setAnnotations([...annotations, savedAnnotation]);
      setSelectedText('');
      window.getSelection()?.removeAllRanges();
      alert('ハイライトを追加しました！');
    } catch (error) {
      console.error('ハイライトの保存に失敗しました:', error);
      const localAnnotation = { ...newAnnotation, id: Date.now() };
      
      if (textContentRef.current) {
        highlightTextInElement(
          textContentRef.current,
          selection.startOffset,
          selection.endOffset,
          'highlight-yellow',
          localAnnotation.id.toString(),
          //handleHighlightClickこれは削除したよ
        );
      }
      
      setAnnotations([...annotations, localAnnotation]);
      setSelectedText('');
      window.getSelection()?.removeAllRanges();
      alert('ハイライトを追加しました（ローカル保存）');
    }
  }
};

const addStickyNote = async () => {
  const selection = getTextSelection();
  if (selection && selectedText) {
    const note = prompt('付箋の内容を入力してください:');
    if (note) {
      const newAnnotation: Annotation = {
        student: studentId,
        material: materialId,
        annotation_type: 'sticky_note',
        start_position: selection.startOffset,
        end_position: selection.endOffset,
        content: note,
        color: '#fef3c7'
      };
      
      try {
        const response = await addAnnotation(newAnnotation);
        const savedAnnotation = response.data;
        
// addStickyNote関数内で（182行目あたり）
if (textContentRef.current) {
  highlightTextInElement(
    textContentRef.current,
    selection.startOffset,
    selection.endOffset,
    'sticky-note',
    savedAnnotation.id?.toString() || Date.now().toString()
    // 6番目の引数を削除
  );
}


        
        setAnnotations([...annotations, savedAnnotation]);
        setSelectedText('');
        window.getSelection()?.removeAllRanges();
        alert('付箋を追加しました！');
      } catch (error) {
        console.error('付箋の保存に失敗しました:', error);
        const localAnnotation = { ...newAnnotation, id: Date.now() };
        
        if (textContentRef.current) {
          highlightTextInElement(
            textContentRef.current,
            selection.startOffset,
            selection.endOffset,
            'sticky-note',
            localAnnotation.id.toString()
          );
        }
        
        setAnnotations([...annotations, localAnnotation]);
        setSelectedText('');
        window.getSelection()?.removeAllRanges();
        alert('付箋を追加しました（ローカル保存）');
      }
    }
  }
};

const handleAnswerChange = (value: string) => {
  setAnswers({
    ...answers,
    [currentQuestion.id]: value
  });
  setIsModified(true);
  
  // 保存完了後にisModifiedをfalseに
  setTimeout(() => {
    setIsModified(false);
    setLastSaved(new Date());
  }, 2000);
};


const handleReasoningChange = (value: string) => {
  setReasoningNotes({
    ...reasoningNotes,
    [currentQuestion.id]: value
  });
  setIsModified(true);
  
  // 保存完了後にisModifiedをfalseに
  setTimeout(() => {
    setIsModified(false);
    setLastSaved(new Date());
  }, 2000);
};


  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!material || !currentQuestion) {
    return <div className="p-4">読み込み中...</div>;
  }

  const removeAnnotation = async (annotation: Annotation) => {
  try {
    if (annotation.id) {
      await deleteAnnotation(annotation.id);
    }
    
    // 文章からハイライトを削除
    removeHighlight(annotation.id?.toString() || '');
    
    // stateから削除
    setAnnotations(annotations.filter(a => a.id !== annotation.id));
    
    alert('注釈を削除しました');
  } catch (error) {
    console.error('注釈の削除に失敗しました:', error);
    // エラー時もローカルでは削除
    removeHighlight(annotation.id?.toString() || '');
    setAnnotations(annotations.filter(a => a.id !== annotation.id));
    alert('注釈を削除しました（ローカル削除）');
  }
};

const handleHighlightClick = (annotationId: string) => {
  const annotation = annotations.find(a => a.id?.toString() === annotationId);
  if (annotation) {
    const confirmDelete = window.confirm('この注釈を削除しますか？');
    if (confirmDelete) {
      removeAnnotation(annotation);
    }
  }
};

const getAnsweredQuestionsCount = () => {
  return questions.filter(q => answers[q.id] && answers[q.id].trim() !== '').length;
};

const hasAnnotations = annotations.length > 0;


  return (
    <div className="flex h-screen bg-gradient-to-br from-reading-background to-primary-50">
      {/* 左側: 文章表示エリア */}
      <div className="w-1/2 bg-white/80 backdrop-blur-sm border-r border-primary-200 shadow-lg">
        <div className="p-8 h-full overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent mb-2">
              {material.title}
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
          </div>
          
          {showText ? (
<div 
  ref={textContentRef}
  className="prose prose-lg max-w-none leading-relaxed select-text font-serif text-reading-text hover:text-gray-800 transition-colors duration-200"
  onMouseUp={handleTextSelection}
  onClick={handleTextClick}  // ← この行を追加
  style={{ lineHeight: '2.0' }}
>
  <div className="bg-white/60 rounded-2xl p-6 shadow-sm border border-primary-100">
    {material.content}
  </div>
</div>
          ) : (
            <div className="flex items-center justify-center h-96 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-warning-400 to-warning-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
                  <span className="text-3xl text-white">🔒</span>
                </div>
                <p className="text-xl font-semibold text-gray-700 mb-2">文章非表示モード</p>
                <p className="text-gray-600">記憶を頼りに回答してください</p>
              </div>
            </div>
          )}

          {selectedText && (
            <div className="fixed bottom-6 left-6 bg-white p-6 border border-primary-200 rounded-2xl shadow-2xl z-50 animate-slide-up max-w-md">
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">選択中のテキスト</p>
                <p className="text-sm text-gray-600 bg-primary-50 p-3 rounded-lg border-l-4 border-primary-400">
                  "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={addHighlight}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-warning-400 to-warning-500 text-white rounded-xl hover:from-warning-500 hover:to-warning-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <span>🖍️</span>
                  <span className="font-medium">マーカー</span>
                </button>
                <button 
                  onClick={addStickyNote}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <span>📝</span>
                  <span className="font-medium">付箋</span>
                </button>
                <button 
                  onClick={() => setSelectedText('')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transform hover:scale-105 transition-all duration-200"
                >
                  <span>✕</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

     {/* 右側: 問題・回答エリア */}
<div className="w-1/2 bg-gradient-to-b from-gray-50 to-white">
  <div className="p-8 h-full overflow-y-auto">
    {/* ★ここに進捗表示を追加★ */}
    <ProgressIndicator
      currentQuestion={currentQuestionIndex + 1}
      totalQuestions={questions.length}
      answeredQuestions={getAnsweredQuestionsCount()}
      hasAnnotations={hasAnnotations}
    />
    
    {/* 問題ヘッダー */}
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">Q</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            問題 {currentQuestionIndex + 1} / {questions.length}
          </h2>
        </div>
              <div className="flex gap-2">
                <button 
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>前へ</span>
                </button>
                <button 
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>次へ</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 問題カード */}
            <div className="bg-white rounded-2xl shadow-lg border border-primary-100 p-6 mb-6 animate-fade-in">
              <div className="mb-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-600 text-sm font-bold">?</span>
                  </div>
                  <p className="text-lg leading-relaxed text-gray-800 font-medium">
                    {currentQuestion.question_text}
                  </p>
                </div>
              </div>

              {currentQuestion.question_type === 'multiple_choice' ? (
                <div className="space-y-3">
                  {currentQuestion.choices?.map((choice, index) => (
                    <label 
                      key={index} 
                      className="flex items-start space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={choice}
                        checked={answers[currentQuestion.id] === choice}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="form-radio mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900 leading-relaxed">
                        {choice}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="回答を入力してください..."
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              )}
            </div>
          </div>

{/* 思考過程ノート */}
<div className="bg-white rounded-2xl shadow-lg border border-accent-100 p-6 mb-6">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-r from-accent-400 to-accent-500 rounded-lg flex items-center justify-center">
        <span className="text-white text-sm">💭</span>
      </div>
      <h3 className="text-lg font-bold text-gray-800">思考過程のメモ</h3>
    </div>
    <SaveStatus isModified={isModified} lastSaved={lastSaved} />
  </div>
  <textarea
    value={reasoningNotes[currentQuestion.id] || ''}
    onChange={(e) => handleReasoningChange(e.target.value)}
    placeholder="なぜそう考えたのか、どの部分を根拠にしたのかをメモしてください..."
    className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200 bg-gray-50 focus:bg-white"
  />
</div>



          {/* 引用・注釈エリア */}
          <div className="bg-white rounded-2xl shadow-lg border border-success-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-success-400 to-success-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📚</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">引用・注釈</h3>
            </div>
            <div className="space-y-3">
              {annotations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-gray-400">📝</span>
                  </div>
                  <p className="text-gray-500">まだ注釈がありません</p>
                  <p className="text-sm text-gray-400">文章を選択して注釈を追加してみましょう</p>
                </div>
              ) : (
                annotations.map((annotation, index) => (
                <div 
                  key={annotation.id || index} 
                  className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-l-4 border-primary-400 animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {annotation.annotation_type === 'highlight' ? '🖍️' : '📝'}
                      </span>
                      <span className="font-semibold text-gray-700">
                        {annotation.annotation_type === 'highlight' ? 'マーカー' : '付箋'}
                      </span>
                    </div>
                    <button
                      onClick={() => removeAnnotation(annotation)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-colors"
                      title="削除"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {annotation.content && (
                    <p className="text-gray-700 leading-relaxed bg-white p-3 rounded-lg">
                      "{annotation.content}"
                    </p>
                  )}
                </div>
              ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




export default ReadingInterface;