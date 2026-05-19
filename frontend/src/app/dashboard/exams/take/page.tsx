'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Send, Info, Grid, Sparkles, X, Camera, AlertCircle, CircleDot, Keyboard, Eye, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { TimerBadge } from '@/components/ui/TimerBadge';
import { OptionButton } from '@/components/ui/OptionButton';
import { QNode, QNodeStatus } from '@/components/ui/QNode';
import { Latex } from '@/components/ui/Latex';
import dynamic from 'next/dynamic';

const MathfieldInput = dynamic(
  () => import('@/components/ui/MathfieldInput').then((mod) => mod.MathfieldInput),
  { ssr: false }
);

interface Question {
  id: string;
  number: number;
  type: 'multiple-choice' | 'essay';
  category: string;
  title: string;
  content: string;
  equation?: string;
  options?: { letter: string; content: string }[];
  hint: string;
  hintSteps: string[];
}

export default function TakeExamPage() {
  const router = useRouter();

  // Mock exam details and questions
  const examTitle = "Kiểm tra Đại số & Hình học";
  const examGrade = "Toán Lớp 9";

  const [questions, setQuestions] = React.useState<Question[]>([
    {
      id: "q1",
      number: 1,
      type: "multiple-choice",
      category: "Phương trình bậc hai",
      title: "Giải phương trình bậc hai sau:",
      content: "Tìm các nghiệm thực phân biệt của phương trình bậc hai sau đây:",
      equation: "x^2 - 5x + 6 = 0",
      options: [
        { letter: "A", content: "x = 2; x = 3" },
        { letter: "B", content: "x = -2; x = -3" },
        { letter: "C", content: "x = 1; x = 6" },
        { letter: "D", content: "x = 5; x = 6" }
      ],
      hint: "Chào bạn! Hãy thử phân tích đa thức thành nhân tử hoặc sử dụng biệt thức delta.",
      hintSteps: [
        "Hãy tìm hai số có tổng là 5 và tích là 6: (x-2)(x-3) = 0.",
        "Dùng công thức biệt thức $\\Delta = b^2 - 4ac = (-5)^2 - 4.1.6 = 1 > 0$."
      ]
    },
    {
      id: "q2",
      number: 2,
      type: "essay",
      category: "Hệ thức lượng trong tam giác",
      title: "Tính độ dài đường cao trong tam giác vuông:",
      content: "Cho tam giác $ABC$ vuông tại $A$ có đường cao $AH$. Biết rằng độ dài cạnh $AB = 6cm$ và $AC = 8cm$. Hãy giải chi tiết các yêu cầu sau:\n1. Tính độ dài cạnh huyền $BC$.\n2. Tính độ dài đường cao $AH$.\n3. Tính diện tích tam giác $ABC$.",
      hint: "Hãy sử dụng định lý Pitago và các hệ thức lượng cơ bản trong tam giác vuông.",
      hintSteps: [
        "Cạnh huyền $BC = \\sqrt{AB^2 + AC^2} = \\sqrt{6^2 + 8^2} = 10cm$.",
        "Áp dụng hệ thức lượng: $AH \\cdot BC = AB \\cdot AC \\Rightarrow AH = \\frac{6 \\cdot 8}{10} = 4.8cm$."
      ]
    },
    {
      id: "q3",
      number: 3,
      type: "multiple-choice",
      category: "Hệ thức lượng",
      title: "Tìm hệ thức đúng trong tam giác vuông:",
      content: "Cho tam giác $ABC$ vuông tại $A$ có đường cao $AH$. Hệ thức nào sau đây là hệ thức lượng đúng?",
      equation: "AH^2 = BH \\cdot CH",
      options: [
        { letter: "A", content: "AH^2 = AB \\cdot AC" },
        { letter: "B", content: "AH^2 = BH \\cdot CH" },
        { letter: "C", content: "AB^2 = BH \\cdot BC" },
        { letter: "D", content: "Cả B và C đều đúng" }
      ],
      hint: "Nhớ lại các công thức liên quan đến đường cao và hình chiếu trong tam giác vuông.",
      hintSteps: [
        "Bình phương đường cao bằng tích hai hình chiếu của hai cạnh góc vuông trên cạnh huyền.",
        "Bình phương mỗi cạnh góc vuông bằng tích của cạnh huyền và hình chiếu của cạnh góc vuông đó."
      ]
    }
  ]);

  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const activeQuestion = questions[currentIndex];

  // User answers state: questionId -> answer (string for MC, long text for essay)
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  
  // Flagged questions state: questionId -> boolean
  const [flagged, setFlagged] = React.useState<Record<string, boolean>>({});

  // Side panels toggle
  const [isAiHintOpen, setIsAiHintOpen] = React.useState<boolean>(false);
  const [isQMapOpen, setIsQMapOpen] = React.useState<boolean>(false);

  // Time remaining (in seconds, starts at 45 minutes = 2700 seconds)
  const [timeLeft, setTimeLeft] = React.useState<number>(2700);

  // Success overlays
  const [showSubmitSuccess, setShowSubmitSuccess] = React.useState<boolean>(false);
  
  // MathLive Hybrid Insertion Modal state
  const [isHybridModalOpen, setIsHybridModalOpen] = React.useState<boolean>(false);
  const [hybridFormula, setHybridFormula] = React.useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = React.useState<boolean>(false);

  // Countdown timer effect
  React.useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to determine question status for QNode
  const getQuestionStatus = (qId: string, index: number): QNodeStatus => {
    if (index === currentIndex) return 'current';
    if (flagged[qId]) return 'flagged';
    if (answers[qId] && answers[qId].trim() !== '') return 'done';
    return 'unfinished';
  };

  // Count answered questions
  const answeredCount = Object.keys(answers).filter(key => answers[key].trim() !== '').length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  // Save selected option for Multiple Choice
  const handleSelectOption = (letter: string) => {
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: letter
    }));
  };

  // Save text changes for Essay
  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: e.target.value
    }));
  };

  // Add math symbol to essay textarea at current cursor position
  const handleInsertSymbol = (symbol: string) => {
    if (activeQuestion.type !== 'essay') return;
    const textarea = document.getElementById(`essay-textarea-${activeQuestion.id}`) as HTMLTextAreaElement;
    
    if (!textarea) {
      // Fallback: append to the end of the text
      const currentAnswer = answers[activeQuestion.id] || '';
      setAnswers(prev => ({
        ...prev,
        [activeQuestion.id]: currentAnswer + symbol
      }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = answers[activeQuestion.id] || '';
    const newText = currentText.substring(0, start) + symbol + currentText.substring(end);

    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: newText
    }));

    // Re-focus and update cursor selection range in next frame
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + symbol.length, start + symbol.length);
    }, 0);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleToggleFlag = () => {
    setFlagged(prev => ({
      ...prev,
      [activeQuestion.id]: !prev[activeQuestion.id]
    }));
  };

  // Submit handler (Simulating Go-Gin API response)
  const handleSubmitExam = () => {
    const payload = {
      exam_id: "exam_test_101",
      submitted_answers: Object.keys(answers).map(qId => ({
        question_id: qId,
        answer: answers[qId]
      }))
    };
    
    console.log("Submitting exam payload to Go-Gin Backend (/api/v1/exams/submit):", payload);
    setShowSubmitSuccess(true);
  };

  return (
    <div className="h-screen md:h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      
      {/* HEADER / NAVIGATION BAR */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline-slate" 
              size="icon" 
              className="rounded-full h-9 w-9"
              onClick={() => router.push('/dashboard/exams')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">{examTitle}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">{examGrade}</p>
            </div>
          </div>

          {/* PROGRESS BAR BAR */}
          <div className="flex-1 max-w-md mx-8 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Tiến độ hoàn thành: {answeredCount}/{questions.length} câu</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} />
          </div>

          {/* TIMER */}
          <div className="flex items-center gap-2">
            <TimerBadge timeString={formatTime(timeLeft)} isPulsing={timeLeft < 300} />
          </div>
        </div>
      </nav>

      {/* MAIN WORKSPACE BODY */}
      {activeQuestion.type === 'multiple-choice' ? (
        /* BỐ CỤC TRẮC NGHIỆM: Căn giữa 1 cột, thẻ câu hỏi xếp chồng lên lưới đáp án */
        <main className="flex-grow overflow-y-auto p-6 sm:p-12 pb-24 relative w-full">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Thẻ câu hỏi với vạch xanh nổi bật bên trái */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-lg uppercase">
                      Câu hỏi {activeQuestion.number}
                    </span>
                    <span className="text-slate-400 dark:text-slate-600 text-sm italic">• {activeQuestion.category}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* NÚT TRÒN ICON DẤU CHẤM ĐỂ ĐÁNH DẤU PHÂN VÂN BÊN TRÁI NÚT GỢI Ý TỪ AI */}
                    <button
                      onClick={handleToggleFlag}
                      className={`p-2 rounded-full transition-all cursor-pointer border ${
                        flagged[activeQuestion.id]
                          ? 'bg-amber-50 border-amber-200 text-amber-500 shadow-sm dark:bg-amber-950/30 dark:border-amber-900/50'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500 dark:hover:bg-slate-800'
                      }`}
                      title={flagged[activeQuestion.id] ? 'Bỏ đánh dấu phân vân' : 'Đánh dấu phân vân'}
                    >
                      <CircleDot className={`h-4.5 w-4.5 ${flagged[activeQuestion.id] ? 'animate-pulse' : ''}`} />
                    </button>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 px-4 py-2 bg-primary text-white hover:bg-primary/95 rounded-full font-semibold text-sm border border-transparent shadow-md shadow-primary/20 transition-all active:scale-95 cursor-pointer"
                      onClick={() => setIsAiHintOpen(true)}
                    >
                      <Sparkles className="h-4 w-4" />
                      Gợi ý từ AI
                    </Button>
                  </div>
                </div>

                <h2 className="text-2xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                  {activeQuestion.title}
                </h2>

                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  <Latex text={activeQuestion.content} />
                </div>

                {activeQuestion.equation && (
                  <div className="flex justify-center py-10 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                    <span className="text-4xl font-serif italic text-slate-900 dark:text-white">
                      <Latex text={`$${activeQuestion.equation}$`} />
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Lưới đáp án trắc nghiệm dạng 2 cột */}
            {activeQuestion.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeQuestion.options.map((opt) => (
                  <OptionButton
                    key={opt.letter}
                    letter={opt.letter}
                    content={opt.content}
                    selected={answers[activeQuestion.id] === opt.letter}
                    onClick={() => handleSelectOption(opt.letter)}
                    className="w-full py-5 text-lg"
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      ) : (
        /* BỐ CỤC TỰ LUẬN: Chia đôi 50/50 bên trái đề bài & hình vẽ, bên phải bảng gõ ký tự & textarea */
        <main className="flex-grow overflow-hidden flex flex-col md:flex-row items-stretch w-full relative">
          {/* Cột trái: Đề bài, hình vẽ hình học */}
          <div className="w-full md:w-1/2 overflow-y-auto p-8 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
            <div className="max-w-xl ml-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider rounded-lg">
                    Bài tập tự luận #{activeQuestion.number}
                  </span>
                  <span className="text-slate-400 dark:text-slate-600 text-xs italic">• {activeQuestion.category}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* NÚT TRÒN ICON DẤU CHẤM ĐỂ ĐÁNH DẤU PHÂN VÂN BÊN TRÁI NÚT GỢI Ý TỪ AI */}
                  <button
                    onClick={handleToggleFlag}
                    className={`p-2 rounded-full transition-all cursor-pointer border ${
                      flagged[activeQuestion.id]
                        ? 'bg-amber-50 border-amber-200 text-amber-500 shadow-sm dark:bg-amber-950/30 dark:border-amber-900/50'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500 dark:hover:bg-slate-800'
                    }`}
                    title={flagged[activeQuestion.id] ? 'Bỏ đánh dấu phân vân' : 'Đánh dấu phân vân'}
                  >
                    <CircleDot className={`h-4.5 w-4.5 ${flagged[activeQuestion.id] ? 'animate-pulse' : ''}`} />
                  </button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 px-4 py-2 bg-primary text-white hover:bg-primary/95 rounded-full font-semibold text-xs border border-transparent shadow-md shadow-primary/20 transition-all active:scale-95 cursor-pointer"
                    onClick={() => setIsAiHintOpen(true)}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Gợi ý từ AI
                  </Button>
                </div>
              </div>

              <h1 className="text-2xl font-bold mb-6">{activeQuestion.title}</h1>
              
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                <Latex text={activeQuestion.content} />
              </div>

              {/* Vẽ sơ đồ hình học động bằng SVG */}
              {activeQuestion.id === "q2" && (
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                  <div className="w-full aspect-video relative flex items-center justify-center max-w-sm">
                    <svg className="w-full h-full text-primary" viewBox="0 0 400 300">
                      <path d="M 50 250 L 350 250 L 50 50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M 50 70 L 70 70 L 70 50" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/60" />
                      <line x1="50" y1="50" x2="158" y2="250" stroke="currentColor" strokeWidth="2" strokeDasharray="4" className="text-slate-400" />
                      <rect x="150" y="235" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(-60 158 250)" className="text-slate-400" />
                      <text x="35" y="45" fill="currentColor" className="font-semibold text-sm">A</text>
                      <text x="35" y="270" fill="currentColor" className="font-semibold text-sm">B</text>
                      <text x="360" y="270" fill="currentColor" className="font-semibold text-sm">C</text>
                      <text x="165" y="270" fill="currentColor" className="text-slate-500 font-semibold text-sm">H</text>
                      <text x="25" y="155" fill="currentColor" className="italic text-xs font-semibold text-primary/80">6cm</text>
                      <text x="200" y="140" fill="currentColor" className="italic text-xs font-semibold text-primary/80">8cm</text>
                    </svg>
                  </div>
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 italic">Hình 1.1: Mô phỏng tam giác ABC vuông tại A</p>
                </div>
              )}

              {/* ĐÁNH DẤU PHÂN VÂN HỖ TRỢ DƯỚI BẢNG CÂU HỎI */}
              <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <button 
                  className={`flex items-center gap-1.5 font-bold uppercase tracking-wider select-none transition-colors ${
                    flagged[activeQuestion.id] 
                      ? 'text-amber-500 hover:text-amber-600' 
                      : 'text-slate-400 hover:text-slate-500'
                  }`}
                  onClick={handleToggleFlag}
                >
                  <AlertCircle className="h-4 w-4" />
                  {flagged[activeQuestion.id] ? 'Đã đánh dấu phân vân' : 'Đánh dấu phân vân'}
                </button>
                <span className="text-slate-400">Tự động lưu câu trả lời</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Khu vực nhập giải, ký tự đặc biệt, Upload bài làm tay */}
          <div className="w-full md:w-1/2 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto">
            <div className="flex-grow p-8 flex flex-col max-w-xl mr-auto w-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Lời giải của bạn
                  </label>
                  <div className="flex space-x-2">
                    <span className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                      <svg className="h-4 w-4 mr-1 text-green-500 fill-current flex-shrink-0 animate-pulse" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      Đã lưu tự động
                    </span>
                  </div>
                </div>

                {/* Khung Editor */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                  {/* Math symbols toolbar */}
                  <div className="border-b border-slate-200 dark:border-slate-800 p-2 flex flex-wrap gap-2 bg-slate-50 dark:bg-slate-900/60 justify-between items-center">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {[
                        { label: '√x', value: ' $\\sqrt{x}$ ' },
                        { label: 'a/b', value: ' $\\frac{a}{b}$ ' },
                        { label: 'x²', value: ' $x^2$ ' },
                        { label: 'π', value: ' $\\pi$ ' },
                        { label: 'Δ', value: ' $\\Delta$ ' },
                        { label: '±', value: ' $\\pm$ ' },
                        { label: '∠', value: ' $\\angle$ ' },
                        { label: '≥', value: ' $\\ge$ ' },
                        { label: '≤', value: ' $\\le$ ' },
                        { label: '≠', value: ' $\\neq$ ' }
                      ].map((sym) => (
                        <Button 
                          key={sym.label} 
                          variant="math" 
                          size="math" 
                          onClick={() => handleInsertSymbol(sym.value)}
                          disabled={isPreviewMode}
                        >
                          {sym.label}
                        </Button>
                      ))}

                      <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

                      {/* Icon chèn công thức từ Bàn phím ảo MathLive (Chỉ chứa Icon, cực kỳ chuyên nghiệp) */}
                      <Button 
                        variant="math" 
                        size="math" 
                        onClick={() => {
                          setHybridFormula('');
                          setIsHybridModalOpen(true);
                        }}
                        disabled={isPreviewMode}
                        className="p-1.5 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 rounded-lg flex items-center justify-center cursor-pointer group transition-all"
                        title="Mở bàn phím ảo MathLive chuyên sâu"
                      >
                        <Keyboard className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                      </Button>
                    </div>

                    {/* Nút Xem trước / Soạn thảo chuyên nghiệp dạng Eye / PenTool */}
                    <Button
                      variant="math"
                      size="math"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className={`p-1.5 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                        isPreviewMode 
                          ? 'bg-primary text-white border-primary hover:bg-primary/95 shadow-sm shadow-primary/15 animate-all'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                      title={isPreviewMode ? "Quay lại chế độ soạn thảo" : "Xem trước công thức toán học đẹp"}
                    >
                      {isPreviewMode ? (
                        <PenTool className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Editor Body */}
                  {isPreviewMode ? (
                    <div className="p-6 min-h-[256px] text-slate-800 dark:text-slate-200 leading-relaxed text-base bg-transparent overflow-y-auto max-h-64 custom-scrollbar">
                      {answers[activeQuestion.id] ? (
                        <Latex text={answers[activeQuestion.id]} />
                      ) : (
                        <span className="text-slate-400 font-medium italic">Không có nội dung lời giải để hiển thị công thức. Vui lòng quay lại chế độ soạn thảo để nhập lời giải.</span>
                      )}
                    </div>
                  ) : (
                    <textarea
                      id={`essay-textarea-${activeQuestion.id}`}
                      value={answers[activeQuestion.id] || ''}
                      onChange={handleEssayChange}
                      placeholder="Nhập lời giải chi tiết tại đây (Sử dụng các nút công cụ hoặc bấm vào biểu tượng bàn phím để mở bàn phím công thức)..."
                      className="p-6 resize-none border-none focus:outline-none focus:ring-0 bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 leading-relaxed text-base h-64 outline-none"
                    />
                  )}

                  {/* Bottom Upload Zone */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
                    <button className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors group cursor-pointer animate-all">
                      <Camera className="h-5 w-5 text-slate-400 group-hover:text-primary mb-1" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary">
                        Tải ảnh chụp lời giải bài làm tay
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action buttons inside Essay workspace */}
              <div className="mt-6 flex flex-col space-y-4">
                <Button 
                  onClick={handleSubmitExam}
                  className="w-full py-4 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  XEM LỜI GIẢI CHI TIẾT
                  <Sparkles className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>


                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-2 font-medium">
                  <div className="flex items-center">
                    <Info className="h-3.5 w-3.5 mr-1 text-slate-400" />
                    Lưu ý: Bạn chỉ có thể xem giải sau khi đã nhập nội dung
                  </div>
                  <div className="flex items-center hover:text-primary cursor-pointer">
                    Báo cáo lỗi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 3. STICKY GLOBAL BOTTOM NAVIGATION FOOTER */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 z-40 sticky bottom-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 font-sans">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-5 py-3 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
              Câu trước
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <button 
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-2 px-5 py-3 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
            >
              Câu tiếp theo
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <p className="hidden sm:block text-slate-500 dark:text-slate-400 text-sm font-medium">
              Bạn đã trả lời {answeredCount}/{questions.length} câu hỏi
            </p>
            <button 
              onClick={handleSubmitExam}
              className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/25 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              Nộp bài
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </footer>

      {/* NÚT 4 Ô VUÔNG GỐC SÁT BÊN PHẢI GIỮA MÀN HÌNH (TRIGGER BẢN ĐỒ CÂU HỎI TRƯỢT NGANG CHUẨN XÁC) */}
      {!isQMapOpen && (
        <div className="fixed top-0 right-0 h-full flex items-center pointer-events-none z-40">
          <button
            onClick={() => setIsQMapOpen(true)}
            className="pointer-events-auto cursor-pointer flex items-center justify-center w-10 h-24 bg-white dark:bg-slate-900 border border-r-0 border-slate-200 dark:border-slate-800 rounded-l-xl shadow-lg transition-all duration-300 hover:w-12 active:scale-95 group animate-in slide-in-from-right duration-300"
            title="Mở bản đồ câu hỏi"
          >
            <Grid className="h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors select-none" />
          </button>
        </div>
      )}

      {/* SIDEBAR: AI HINT PANEL */}
      {isAiHintOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAiHintOpen(false);
          }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end cursor-pointer"
        >
          <aside className="w-80 max-w-full bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800 transition-all duration-300 cursor-default">
            <div className="p-4 bg-primary/5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-primary font-bold">
                <Sparkles className="h-4 w-4" />
                Gợi ý từ AI
              </span>
              <Button 
                variant="ghost-danger" 
                size="icon" 
                className="rounded-full h-8 w-8"
                onClick={() => setIsAiHintOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 flex-grow overflow-y-auto space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm">AI</div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl rounded-tl-none border border-slate-100 dark:border-slate-800">
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-3 font-medium">
                    {activeQuestion.hint}
                  </p>
                  <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400 font-semibold list-decimal ml-4">
                    {activeQuestion.hintSteps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <Latex text={step} />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[10px] font-bold text-primary bg-primary/5 p-2 rounded-lg text-center tracking-wider">
                    Cố gắng lên, bạn sắp tìm ra đáp án rồi! 🚀
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* SIDEBAR: QUESTION MAP PANEL */}
      {isQMapOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsQMapOpen(false);
          }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end cursor-pointer"
        >
          <aside className="w-80 max-w-full bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800 transition-all duration-300 cursor-default">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Grid className="h-4 w-4 text-primary" />
                Bản đồ câu hỏi
              </h3>
              <Button 
                variant="ghost-danger" 
                size="icon" 
                className="rounded-full h-8 w-8"
                onClick={() => setIsQMapOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 flex-grow overflow-y-auto space-y-8">
              <div className="grid grid-cols-5 gap-3">
                {questions.map((q, idx) => (
                  <QNode
                    key={q.id}
                    number={q.number}
                    status={getQuestionStatus(q.id, idx)}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsQMapOpen(false);
                    }}
                  />
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chú thích</p>
                <div className="space-y-3">
                  {[
                    { colorClass: "bg-green-100 dark:bg-green-900/30 border border-green-200", text: "Đã hoàn thành" },
                    { colorClass: "bg-primary border border-primary/20", text: "Đang làm" },
                    { colorClass: "bg-amber-100 dark:bg-amber-900/30 border border-amber-200", text: "Đang phân vân" },
                    { colorClass: "bg-slate-100 dark:bg-slate-800 border border-slate-200", text: "Chưa làm" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      <div className={`w-4 h-4 rounded ${item.colorClass}`} />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800">
              <Button 
                onClick={() => {
                  setIsQMapOpen(false);
                  handleSubmitExam();
                }}
                className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg shadow-primary/20"
              >
                Nộp bài ngay
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* OVERLAY: SUCCESS FEEDBACK ON SUBMIT */}
      {showSubmitSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800/80 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-green-500 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Nộp bài thành công!</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Bài thi của bạn đã được ghi nhận và đồng bộ trực tuyến thành công với hệ thống API máy chủ.
            </p>
            <Button 
              onClick={() => {
                setShowSubmitSuccess(false);
                router.push('/dashboard/exams');
              }}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl"
            >
              Quay lại danh sách đề thi
            </Button>
          </div>
        </div>
      )}

      {/* OVERLAY: MATHLIVE HYBRID EQUATION INSERTION DIALOG */}
      {isHybridModalOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsHybridModalOpen(false);
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col animate-in fade-in zoom-in-95 duration-200 cursor-default">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-2 text-primary font-bold text-base">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                Trình soạn công thức MathLive
              </span>
              <Button 
                variant="ghost-danger" 
                size="icon" 
                className="rounded-full h-8 w-8 cursor-pointer"
                onClick={() => setIsHybridModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="py-6 space-y-4 flex-grow">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                Sử dụng bàn phím ảo bên dưới để soạn các công thức toán học phức tạp (phân số, căn thức, tích phân,...). Công thức sẽ tự động chèn vào bài làm của bạn.
              </p>
              
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <MathfieldInput
                  value={hybridFormula}
                  onChange={(val) => setHybridFormula(val)}
                  placeholder="Gõ công thức của bạn ở đây..."
                  className="border-none"
                />
              </div>

              {hybridFormula && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                  <span className="font-bold block text-slate-500 mb-1">Mã LaTeX xem trước:</span>
                  <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-primary text-[11px] block overflow-x-auto whitespace-pre custom-scrollbar">
                    {`$${hybridFormula}$`}
                  </code>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <Button
                variant="outline-slate"
                onClick={() => setIsHybridModalOpen(false)}
                className="px-5 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={() => {
                  if (hybridFormula) {
                    handleInsertSymbol(` $${hybridFormula}$ `);
                    setHybridFormula('');
                    setIsHybridModalOpen(false);
                  }
                }}
                disabled={!hybridFormula.trim()}
                className="px-6 font-bold text-xs bg-primary hover:bg-primary/95 text-white rounded-xl shadow-md shadow-primary/10 disabled:opacity-40 cursor-pointer"
              >
                Chèn vào bài làm
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
