'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  Share2, 
  LayoutDashboard, 
  Grid, 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare, 
  HelpCircle, 
  Download, 
  Play, 
  Brain, 
  Plus, 
  BookOpen, 
  ChevronRight,
  Send,
  X,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResultScoreGauge, SectionScore } from '@/components/ui/ResultScoreGauge';
import { QuestionMapButton } from '@/components/ui/QuestionMapButton';
import { AnswerOption } from '@/components/ui/AnswerOption';
import { HandwrittenPaper, AnnotationItem } from '@/components/ui/HandwrittenPaper';
import { Latex } from '@/components/ui/Latex';

// Interfaces for component clean mapping and Gin backend compatibility
interface Option {
  label: string;
  content: string;
  status: 'default' | 'correct' | 'wrong';
}

interface Question {
  id: string;
  number: number;
  type: 'choice' | 'essay';
  difficulty: 'Dễ' | 'Trung bình' | 'Khó' | 'Vận dụng' | 'Vận dụng cao';
  text: string;
  score?: number;
  maxScore: number;
  // Multiple Choice fields
  options?: Option[];
  // Essay fields
  candidateSolution?: string[];
  annotations?: AnnotationItem[];
  teacherFeedback?: string;
  systemExplanation?: string;
  hasSvg?: boolean;
}

interface ExamResultData {
  examTitle: string;
  completionTime: string;
  durationMinutes: number;
  student: {
    name: string;
    class: string;
    avatarUrl: string;
  };
  overallScore: number;
  maxScore: number;
  sectionsBreakdown: SectionScore[];
  aiReview: string;
  questions: Question[];
}

export default function ExamResultPage() {
  // Mock Data conforming to the HTML prototype
  const [resultData] = useState<ExamResultData>({
    examTitle: "Toán Học Kỳ I",
    completionTime: "14:30 - 25/10/2023",
    durationMinutes: 85,
    student: {
      name: "Nguyễn Minh Anh",
      class: "Học sinh lớp 12A1",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6n5Rt7M7R-lZ7S1m24fQKFoV-hl4wPqby28qFCJOh-btkZEyo1sw-scBn681CIx7xgVFzSmPSgwgjGfGZWlKD2WMzU0J2s4-dAVVgQcuUVlxvMQTWF38L53UnI8GZuT0nqlyrg7m8RZzK3_9O7i5FZl_7niud47AAJeij7Z816FbCub8mDB6so3ThqE20Ewj7FuQUeGX6HqCgjyLF7KSjiPuQqHDzkdft2JvGCSF4yTxsowrounZ3pRDnnWq_fKBZYyf9uVwL3KV6"
    },
    overallScore: 8.5,
    maxScore: 10,
    sectionsBreakdown: [
      { name: "Trắc nghiệm", score: 5.0, maxScore: 5.0, status: "success" },
      { name: "Tự luận", score: 3.5, maxScore: 5.0, status: "warning" }
    ],
    aiReview: "Hãy tập trung vào phần Hình học không gian (câu 11, 14). AI nhận thấy bạn đang gặp khó khăn ở các bước chứng minh vuông góc.",
    questions: [
      // Mocked 10 MCQ Questions (Question 3 is wrong, others correct)
      { id: "q1", number: 1, type: "choice", difficulty: "Dễ", text: "Tính đạo hàm của hàm số $y = x^2 - 2x$.", maxScore: 0.5, score: 0.5, options: [{ label: "A", content: "$y' = 2x - 2$", status: "correct" }, { label: "B", content: "$y' = 2x$", status: "default" }] },
      { id: "q2", number: 2, type: "choice", difficulty: "Dễ", text: "Tìm tập xác định của hàm số $y = \\log(x)$.", maxScore: 0.5, score: 0.5, options: [{ label: "A", content: "$D = \\mathbb{R}$", status: "default" }, { label: "B", content: "$D = (0; +\\infty)$", status: "correct" }] },
      { 
        id: "q3", 
        number: 3, 
        type: "choice", 
        difficulty: "Trung bình", 
        text: "Tìm giá trị cực đại của hàm số $y = x^3 - 3x + 2$ trên đoạn $[0, 2]$.", 
        maxScore: 0.5, 
        score: 0,
        options: [
          { label: "A", content: "$0$", status: "default" },
          { label: "B", content: "$2$ (Lựa chọn của bạn)", status: "wrong" },
          { label: "C", content: "$4$ (Đáp án đúng)", status: "correct" },
          { label: "D", content: "$-2$", status: "default" }
        ],
        systemExplanation: "Để tìm giá trị lớn nhất/cực đại của hàm số trên đoạn $[0, 2]$:\n1. Ta tính đạo hàm $y' = 3x^2 - 3$.\n2. Cho $y' = 0 \\Leftrightarrow x = \\pm 1$. Do đang xét trên đoạn $[0, 2]$ nên chỉ lấy $x = 1$.\n3. Tính các giá trị: $y(0) = 2, y(1) = 0, y(2) = 4$.\n4. So sánh các giá trị, ta thấy giá trị cực đại trên đoạn $[0, 2]$ là $y(2) = 4$."
      },
      { id: "q4", number: 4, type: "choice", difficulty: "Dễ", text: "Tính thể tích $V$ của khối chóp có chiều cao $h$ và diện tích đáy $B$.", maxScore: 0.5, score: 0.5, options: [{ label: "A", content: "$V = B \\cdot h$", status: "default" }, { label: "B", content: "$V = \\frac{1}{3} B \\cdot h$", status: "correct" }] },
      { id: "q5", number: 5, type: "choice", difficulty: "Trung bình", text: "Tìm nguyên hàm của hàm số $f(x) = \\sin(x)$.", maxScore: 0.5, score: 0.5 },
      { id: "q6", number: 6, type: "choice", difficulty: "Trung bình", text: "Giải phương trình $2^x = 8$.", maxScore: 0.5, score: 0.5 },
      { id: "q7", number: 7, type: "choice", difficulty: "Khó", text: "Tính tích phân $\\int_0^1 x dx$.", maxScore: 0.5, score: 0.5 },
      { id: "q8", number: 8, type: "choice", difficulty: "Khó", text: "Tìm tiệm cận đứng của đồ thị hàm số $y = \\frac{1}{x-1}$.", maxScore: 0.5, score: 0.5 },
      { id: "q9", number: 9, type: "choice", difficulty: "Khó", text: "Phương trình mặt cầu tâm $I(1,1,1)$ bán kính $R=2$.", maxScore: 0.5, score: 0.5 },
      { id: "q10", number: 10, type: "choice", difficulty: "Vận dụng", text: "Cho hình lập phương $ABCD.A'B'C'D'$. Tính góc giữa $AB$ và $A'D$.", maxScore: 0.5, score: 0.5 },
      
      // Mocked 5 Essay Questions
      {
        id: "q11",
        number: 11,
        type: "essay",
        difficulty: "Vận dụng",
        text: "Giải bất phương trình: $\\log_2(x-1) + \\log_2(x+1) \\le 3$",
        score: 1.0,
        maxScore: 1.0,
        candidateSolution: [
          "Điều kiện: $x-1 > 0$ và $x+1 > 0 \\Rightarrow x > 1$",
          "BPT $\\Leftrightarrow \\log_2((x-1)(x+1)) \\le 3$",
          "$\\Leftrightarrow (x-1)(x+1) \\le 2^3 = 8$",
          "$\\Leftrightarrow x^2 - 1 \\le 8$",
          "$\\Leftrightarrow x^2 \\le 9 \\Leftrightarrow -3 \\le x \\le 3$",
          "Kết hợp điều kiện $x > 1$, ta được tập nghiệm $S = (1; 3]$"
        ],
        annotations: [
          { text: "Đúng điều kiện!", status: "success", top: "35px", left: "55%", icon: "done" },
          { status: "success", bottom: "40px", right: "50px", icon: "check" }
        ],
        teacherFeedback: "Trình bày rất rõ ràng và mạch lạc. Em đã nhớ đặt điều kiện xác định cho logarit - đây là lỗi mà rất nhiều bạn hay mắc phải. Tiếp tục phát huy nhé!",
        systemExplanation: "Phương pháp giải bất phương trình Logarit:\n- Bước 1: Tìm điều kiện xác định (biểu thức trong log > 0).\n- Bước 2: Sử dụng quy tắc cộng logarit $\\log_a(u) + \\log_a(v) = \\log_a(u \\cdot v)$.\n- Bước 3: Khử logarit (chú ý chiều BPT nếu cơ số $a < 1$).\n- Bước 4: Đối chiếu điều kiện và kết luận."
      },
      { id: "q12", number: 12, type: "essay", difficulty: "Vận dụng", text: "Tính giới hạn: $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$.", score: 0.5, maxScore: 0.5, systemExplanation: "Áp dụng định lý giới hạn cơ bản." },
      { id: "q13", number: 13, type: "essay", difficulty: "Vận dụng", text: "Tính đạo hàm cấp hai của hàm số $y = e^{2x}$.", score: 0.8, maxScore: 1.0, systemExplanation: "Đạo hàm liên tiếp hai lần." },
      {
        id: "q14",
        number: 14,
        type: "essay",
        difficulty: "Vận dụng cao",
        text: "Chứng minh đường thẳng $SD$ vuông góc với mặt phẳng $(AMC)$.",
        score: 0.7,
        maxScore: 1.0,
        hasSvg: true,
        candidateSolution: [
          "Ta có: $AC \\perp BD$ (tính chất hình vuông)",
          "Và $AC \\perp SO$ (do $SO \\perp (ABCD)$)",
          "$\\Rightarrow AC \\perp (SBD) \\Rightarrow AC \\perp SD$ (1)",
          "Xét $\\triangle AMC$... (thiếu bước chứng minh $SD \\perp AM$)"
        ],
        annotations: [
          { text: "Lỗi suy luận!", status: "error", top: "55%", right: "12%", icon: "close" }
        ],
        teacherFeedback: "Phần vẽ hình chính xác. Tuy nhiên ở bước chứng minh thứ 2, em chưa chỉ ra được SD vuông góc với AC dựa trên tính chất hình vuông. Bị trừ 0.3đ ở bước này.",
        systemExplanation: "Tiêu chí chấm điểm Hình học không gian:\n- Vẽ hình (0.2đ): Hình vẽ rõ ràng, đúng nét đứt/liền.\n- Lập luận 1 (0.4đ): Chứng minh được $SD$ vuông góc với một đường thẳng trong mặt phẳng $(AMC)$.\n- Lập luận 2 (0.4đ): Chứng minh được $SD$ vuông góc với đường thẳng thứ hai cắt đường thẳng thứ nhất trong $(AMC)$.\n\nGợi ý: Để chứng minh $d \\perp (P)$, ta cần chứng minh $d$ vuông góc với hai đường thẳng cắt nhau nằm trong mặt phẳng $(P)$."
      },
      { id: "q15", number: 15, type: "essay", difficulty: "Vận dụng cao", text: "Tìm giá trị lớn nhất của tham số $m$ để phương trình có nghiệm.", score: 0.5, maxScore: 1.5, systemExplanation: "Sử dụng bảng biến thiên để biện luận nghiệm." }
    ]
  });

  // State for interactive features
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('q3');
  const [aiTutorOpen, setAiTutorOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: "Chào Minh Anh! Tôi đã phân tích kết quả bài thi Toán Học Kỳ I của bạn. Bạn đạt điểm xuất sắc 8.5/10." },
    { sender: 'ai', text: "Tôi nhận thấy bạn gặp khó khăn nhỏ ở câu 3 (trắc nghiệm giá trị cực đại) và câu 14 (tự luận chứng minh vuông góc). Bạn có cần tôi hướng dẫn giải chi tiết câu nào không?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [savedFlashcards, setSavedFlashcards] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'choice' | 'essay'>('all');

  // Refs for auto-scrolling to question cards
  const questionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToQuestion = (id: string) => {
    setSelectedQuestionId(id);
    const element = questionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    // Pre-coded smart responses based on keywords
    setTimeout(() => {
      let aiText = "Tôi có thể giúp bạn giải thích tất cả các câu hỏi trong đề thi này. Hãy cho tôi biết số câu nhé (ví dụ: Câu 3 hoặc Câu 14).";
      if (userMsg.toLowerCase().includes('3')) {
        aiText = "Với Câu 3: Điểm cực đại của hàm số $y = x^3 - 3x + 2$ là điểm mà tại đó đạo hàm đổi dấu từ dương sang âm. Đạo hàm $y' = 3x^2 - 3 = 3(x-1)(x+1)$. Ta thấy $y'$ đổi dấu từ dương sang âm tại $x = -1$, tuy nhiên điểm $x = -1$ không nằm trên đoạn $[0, 2]$. Trên đoạn $[0, 2]$, hàm số đạt GTLN tại biên $x = 2$ với $y(2) = 4$. Bạn đã chọn B ($y = 2$) là giá trị cực tiểu cục bộ tại $x = 1$ ($y = 0$) hoặc nhầm lẫn với $y(0) = 2$.";
      } else if (userMsg.toLowerCase().includes('14')) {
        aiText = "Với Câu 14 (Hình học không gian): Để chứng minh $SD \\perp (AMC)$, bạn cần chứng minh $SD$ vuông góc với 2 đường thẳng giao nhau trong mặt phẳng $(AMC)$. Ở bài làm của mình, bạn đã chứng minh được $AC \\perp SD$ (do $AC \\perp (SBD)$). Tuy nhiên bạn thiếu bước chứng minh $SD$ vuông góc với một đường thẳng thứ hai như $AM$ hoặc $MC$. Bạn có thể sử dụng giả thiết thiết diện hoặc đường cao phụ để hoàn tất chứng minh này nhé.";
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
    }, 1000);
  };

  const toggleFlashcard = (qId: string) => {
    if (savedFlashcards.includes(qId)) {
      setSavedFlashcards(prev => prev.filter(id => id !== qId));
      alert("Đã xóa khỏi bộ Flashcard ôn tập.");
    } else {
      setSavedFlashcards(prev => [...prev, qId]);
      alert("Đã lưu câu hỏi này vào bộ Flashcard ôn tập thành công!");
    }
  };

  // Filter questions based on tabs
  const filteredQuestions = resultData.questions.filter(q => {
    if (activeTab === 'choice') return q.type === 'choice';
    if (activeTab === 'essay') return q.type === 'essay';
    // For 'all' tab, we highlight specific questions conforming to HTML representation (q3, q11, q14)
    // but we show all questions in the sidebar map
    return true;
  });

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen antialiased flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link className="flex items-center gap-2 text-primary hover:no-underline" href="/dashboard/student">
                <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined select-none text-white">school</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-primary">EdTech VN</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <a className="text-sm font-medium hover:text-primary transition-colors text-slate-600 dark:text-slate-300" href="#">Khóa học</a>
                <a className="text-sm font-medium hover:text-primary transition-colors text-slate-600 dark:text-slate-300" href="#">Lớp học</a>
                <a className="text-sm font-medium hover:text-primary transition-colors text-slate-600 dark:text-slate-300" href="#">Thư viện</a>
                <a className="text-sm font-medium text-primary border-b-2 border-primary pt-1 hover:no-underline" href="#">Kết quả</a>
              </nav>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => alert("Chức năng thông báo đang được phát triển.")}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
              >
                <span className="material-symbols-outlined select-none">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{resultData.student.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{resultData.student.class}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-primary/20 overflow-hidden shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Ảnh đại diện học sinh"
                    className="h-full w-full object-cover"
                    src={resultData.student.avatarUrl}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Navigation & Header Meta */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2">
            <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <Link className="hover:text-primary hover:no-underline" href="/dashboard/student">
                Trang chủ
              </Link>
              <span className="material-symbols-outlined text-xs select-none">chevron_right</span>
              <a className="hover:text-primary hover:no-underline" href="#">
                Toán học 12
              </a>
              <span className="material-symbols-outlined text-xs select-none">chevron_right</span>
              <span className="text-slate-900 dark:text-slate-100 font-medium">Kết quả bài thi</span>
            </nav>
            <h1 className="text-3xl font-black tracking-tight leading-none text-slate-900 dark:text-slate-50">
              Kết quả bài thi: {resultData.examTitle}
            </h1>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm select-none">calendar_today</span> 
              Hoàn thành lúc: {resultData.completionTime} 
              <span className="mx-2">|</span>
              <span className="material-symbols-outlined text-sm select-none">timer</span> 
              Thời gian làm bài: {resultData.durationMinutes} phút
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => alert("Đã sao chép liên kết kết quả vào clipboard!")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 transition-all text-sm font-semibold shadow-sm"
            >
              <span className="material-symbols-outlined text-lg select-none">share</span> 
              Chia sẻ
            </button>
            <Link 
              href="/dashboard/student"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm font-semibold hover:no-underline"
            >
              <span className="material-symbols-outlined text-lg select-none text-white">dashboard</span> 
              Quay lại Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Score Gauge, Question Map & Recommendations */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Score Gauge */}
            <ResultScoreGauge
              score={resultData.overallScore}
              maxScore={resultData.maxScore}
              title="Kết quả xuất sắc!"
              description="Bạn nằm trong top 5% của lớp."
              sections={resultData.sectionsBreakdown}
            />

            {/* Question Map */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <span className="material-symbols-outlined text-primary select-none">grid_view</span>
                  Bản đồ câu hỏi
                </h3>
                <span className="text-xs font-medium text-slate-400">{resultData.questions.length} Câu hỏi</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Trắc nghiệm</p>
                  <div className="flex flex-wrap gap-2">
                    {resultData.questions.filter(q => q.type === 'choice').map((q) => {
                      // Question 3 has wrong choice, others success
                      const status = q.score === 0 ? 'error' : 'success';
                      return (
                        <QuestionMapButton
                          key={q.id}
                          questionNumber={q.number}
                          status={status}
                          onClick={() => scrollToQuestion(q.id)}
                          className={cn(
                            selectedQuestionId === q.id && "ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-950"
                          )}
                        />
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tự luận</p>
                  <div className="flex flex-wrap gap-2">
                    {resultData.questions.filter(q => q.type === 'essay').map((q) => {
                      let status: 'default' | 'success' | 'warning' | 'error' = 'default';
                      if (q.score !== undefined) {
                        const ratio = q.score / q.maxScore;
                        if (ratio >= 0.9) status = 'default';
                        else if (ratio >= 0.5) status = 'warning';
                        else status = 'error';
                      }
                      return (
                        <QuestionMapButton
                          key={q.id}
                          questionNumber={q.number}
                          status={status}
                          subText={`(${q.score?.toFixed(1)}đ)`}
                          onClick={() => scrollToQuestion(q.id)}
                          className={cn(
                            selectedQuestionId === q.id && "ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-950"
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Practice Guidance Card */}
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 relative overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -mr-8 -mt-8 pointer-events-none" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="bg-primary text-white p-2 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white select-none">lightbulb</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-1 text-sm">Gợi ý ôn tập</h4>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                    {resultData.aiReview}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Questions & Detail Explanations */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 pb-px gap-4">
              <button 
                onClick={() => setActiveTab('all')}
                className={cn(
                  "pb-3 text-sm font-bold border-b-2 px-2 transition-all outline-none",
                  activeTab === 'all' ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                )}
              >
                Tất cả câu hỏi
              </button>
              <button 
                onClick={() => setActiveTab('choice')}
                className={cn(
                  "pb-3 text-sm font-bold border-b-2 px-2 transition-all outline-none",
                  activeTab === 'choice' ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                )}
              >
                Trắc nghiệm ({resultData.questions.filter(q => q.type === 'choice').length})
              </button>
              <button 
                onClick={() => setActiveTab('essay')}
                className={cn(
                  "pb-3 text-sm font-bold border-b-2 px-2 transition-all outline-none",
                  activeTab === 'essay' ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                )}
              >
                Tự luận ({resultData.questions.filter(q => q.type === 'essay').length})
              </button>
            </div>

            {/* Section 1: Multiple Choice Questions */}
            {(activeTab === 'all' || activeTab === 'choice') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <span className="material-symbols-outlined text-success select-none">done_all</span>
                    Phần 1: Trắc nghiệm (10 câu)
                  </h2>
                </div>

                <div className="space-y-6">
                  {filteredQuestions.filter(q => q.type === 'choice').map((q) => {
                    // Highlight the detailed ones, or render simpler previews for other correct ones
                    const isDetailed = q.number === 3;
                    return (
                      <div 
                        key={q.id}
                        ref={el => { questionRefs.current[q.id] = el; }}
                        className={cn(
                          "bg-white dark:bg-slate-900 rounded-xl border overflow-hidden shadow-sm transition-all duration-300",
                          selectedQuestionId === q.id 
                            ? "border-primary ring-2 ring-primary/10 dark:border-primary/60" 
                            : "border-slate-200 dark:border-slate-800"
                        )}
                        onClick={() => setSelectedQuestionId(q.id)}
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3 w-full">
                              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300">
                                {q.number}
                              </span>
                              <div className="space-y-4 w-full">
                                <p className="font-semibold text-base text-slate-800 dark:text-slate-200">
                                  <Latex text={q.text} />
                                </p>
                                
                                {q.options && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                    {q.options.map((opt, i) => (
                                      <AnswerOption
                                        key={i}
                                        label={opt.label}
                                        content={<Latex text={opt.content} />}
                                        status={opt.status}
                                        onClick={() => alert(`Lựa chọn đáp án ${opt.label}`)}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFlashcard(q.id);
                              }}
                              className={cn(
                                "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all",
                                savedFlashcards.includes(q.id)
                                  ? "bg-primary text-white border-primary"
                                  : "border-slate-200 text-slate-500 hover:text-primary hover:border-primary bg-white dark:bg-slate-900"
                              )}
                            >
                              <span className="material-symbols-outlined text-base select-none">style</span> 
                              {savedFlashcards.includes(q.id) ? 'Đã lưu' : 'Lưu Flashcard'}
                            </button>
                          </div>
                        </div>

                        {/* Extra analysis section shown for incorrect or selected detailed questions */}
                        {(isDetailed || selectedQuestionId === q.id) && q.systemExplanation && (
                          <div className="bg-slate-50 dark:bg-slate-800/30 p-5 border-t border-slate-200 dark:border-slate-800 space-y-4">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-slate-500 italic">Câu hỏi này có độ khó: {q.difficulty}</p>
                              <button 
                                onClick={() => {
                                  setAiTutorOpen(true);
                                  // Pre-seed chat message
                                  setChatMessages(prev => [
                                    ...prev, 
                                    { sender: 'user', text: `Giải thích chi tiết cho tôi câu trắc nghiệm số ${q.number}` },
                                    { sender: 'ai', text: `Dưới đây là lời giải chi tiết cho câu ${q.number}:\n\n${q.systemExplanation}` }
                                  ]);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold"
                              >
                                <span className="material-symbols-outlined text-lg select-none">psychology</span> 
                                AI Giải thích chi tiết
                              </button>
                            </div>
                            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm select-none">info</span>
                                Hướng dẫn giải chi tiết
                              </h4>
                              <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
                                <Latex text={q.systemExplanation} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Section 2: Essay Questions */}
            {(activeTab === 'all' || activeTab === 'essay') && (
              <section className="space-y-6">
                <div className="flex items-center justify-between mb-4 px-2 pt-4">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <span className="material-symbols-outlined text-warning select-none">edit_note</span>
                    Phần 2: Tự luận (5 câu)
                  </h2>
                </div>

                <div className="space-y-8">
                  {filteredQuestions.filter(q => q.type === 'essay').map((q) => {
                    const isDetailed = q.number === 11 || q.number === 14;
                    return (
                      <div 
                        key={q.id}
                        ref={el => { questionRefs.current[q.id] = el; }}
                        className={cn(
                          "bg-white dark:bg-slate-900 rounded-xl border overflow-hidden shadow-sm transition-all duration-300",
                          selectedQuestionId === q.id 
                            ? "border-primary ring-2 ring-primary/10 dark:border-primary/60" 
                            : "border-slate-200 dark:border-slate-800"
                        )}
                        onClick={() => setSelectedQuestionId(q.id)}
                      >
                        {/* Header details bar */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                              {q.number}
                            </span>
                            <h3 className="font-bold text-slate-800 dark:text-slate-200"><Latex text={q.text} /></h3>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Điểm đạt</p>
                            <p className={cn(
                              "text-lg font-black",
                              q.score === q.maxScore ? "text-primary" : "text-warning"
                            )}>
                              {q.score} / {q.maxScore}
                            </p>
                          </div>
                        </div>

                        {/* Detailed essay views (For detailed ones, or when selected) */}
                        {(isDetailed || selectedQuestionId === q.id) ? (
                          <div className="p-6 space-y-6">
                            
                            {/* Candidate's solution wrapper */}
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm select-none">draw</span>
                                Bài làm của bạn {q.number === 14 && "(Có lỗi được đánh dấu)"}
                              </p>
                              
                              {q.hasSvg ? (
                                <div className="relative rounded-xl border-2 border-error/30 overflow-hidden bg-white p-6">
                                  <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-full md:w-1/2 flex justify-center bg-slate-50 rounded-xl p-4 border border-slate-100">
                                      <svg className="w-56 h-56 text-slate-800" viewBox="0 0 200 200">
                                        <path d="M100 20 L40 140 L160 140 Z" fill="none" stroke="currentColor" strokeWidth="2"></path>
                                        <path d="M100 20 L130 140" fill="none" stroke="currentColor" strokeDasharray="4" strokeWidth="1"></path>
                                        <text className="text-[12px] font-bold fill-slate-800" x="95" y="15">S</text>
                                        <text className="text-[12px] font-bold fill-slate-800" x="30" y="150">A</text>
                                        <text className="text-[12px] font-bold fill-slate-800" x="165" y="150">C</text>
                                        <text className="text-[12px] font-bold fill-slate-800" x="125" y="155">D</text>
                                        <circle cx="100" cy="20" fill="currentColor" r="3"></circle>
                                        <circle cx="40" cy="140" fill="currentColor" r="3"></circle>
                                        <circle cx="160" cy="140" fill="currentColor" r="3"></circle>
                                        <circle cx="130" cy="140" fill="currentColor" r="3"></circle>
                                      </svg>
                                    </div>
                                    
                                    <div 
                                      className="w-full md:w-1/2 text-blue-800 space-y-3 font-semibold"
                                      style={{ fontFamily: "'Brush Script MT', 'Comic Sans MS', cursive", fontSize: '1.1rem' }}
                                    >
                                      {q.candidateSolution?.map((line, idx) => (
                                        <p key={idx}><Latex text={line} /></p>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Absolute Annotations overlay */}
                                  {q.annotations?.map((ann, idx) => (
                                    <div 
                                      key={idx}
                                      className="absolute border-2 border-error text-error bg-white/95 px-3 py-1.5 rounded-xl flex items-center justify-center gap-1 font-bold text-xs shadow-sm"
                                      style={{ top: ann.top, right: ann.right }}
                                    >
                                      <span className="material-symbols-outlined text-sm select-none">close</span>
                                      {ann.text && <span>{ann.text}</span>}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <HandwrittenPaper annotations={q.annotations}>
                                  {q.candidateSolution?.map((line, idx) => (
                                    <p key={idx}><Latex text={line} /></p>
                                  ))}
                                  {!q.candidateSolution && (
                                    <p className="italic text-slate-400">Bạn không nộp tệp bài làm tự luận cho câu này.</p>
                                  )}
                                </HandwrittenPaper>
                              )}
                            </div>

                            {/* Teacher comments and Quick Actions */}
                            {q.teacherFeedback && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={cn(
                                  "md:col-span-2 rounded-xl p-5 border-l-4 shadow-sm",
                                  q.score === q.maxScore 
                                    ? "bg-success/5 border-success text-success-800" 
                                    : "bg-warning/5 border-warning text-warning-800"
                                )}>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-sm select-none">chat_bubble</span>
                                    <h4 className="font-bold text-sm">
                                      {q.score === q.maxScore ? "Nhận xét của giáo viên" : "Góp ý từ giáo viên"}
                                    </h4>
                                  </div>
                                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                    "{q.teacherFeedback}"
                                  </p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col justify-center gap-2 shadow-inner">
                                  <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-1">Thao tác nhanh</h4>
                                  <button 
                                    onClick={() => alert("Đang tải đáp án mẫu nâng cao...")}
                                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                                  >
                                    <span className="material-symbols-outlined text-sm select-none">menu_book</span> 
                                    Xem đáp án mẫu
                                  </button>
                                  <button 
                                    onClick={() => toggleFlashcard(q.id)}
                                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:shadow-lg hover:shadow-primary/30 transition-all border-none"
                                  >
                                    <span className="material-symbols-outlined text-sm select-none text-white">add_circle</span> 
                                    {savedFlashcards.includes(q.id) ? 'Xóa khỏi Flashcard' : 'Lưu Flashcard'}
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* System generated steps breakdown */}
                            {q.systemExplanation && (
                              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2 mb-3 text-slate-600 dark:text-slate-400">
                                  <span className="material-symbols-outlined text-sm select-none">database</span>
                                  <h4 className="font-bold text-xs uppercase tracking-wider">Giải thích từ hệ thống</h4>
                                </div>
                                <div className="text-sm space-y-3 text-slate-600 dark:text-slate-400">
                                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                                    Tiêu chí chấm điểm chi tiết câu {q.number}:
                                  </p>
                                  <div className="whitespace-pre-line text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                    <Latex text={q.systemExplanation} />
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>
                        ) : (
                          // Collapsed View for non-active essay questions
                          <div className="p-4 flex items-center justify-between text-xs text-slate-400">
                            <span>Nhấn để xem chi tiết bài làm, nhận xét và lời giải của giáo viên.</span>
                            <span className="material-symbols-outlined text-sm select-none">expand_more</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-col items-center justify-center py-12 space-y-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 text-sm font-semibold">Bạn đã xem hết toàn bộ kết quả.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => alert("Bắt đầu tải file PDF học bạ kết quả bài thi...")}
                  className="px-8 py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all text-sm shadow-sm"
                >
                  Tải bản PDF
                </button>
                <button 
                  onClick={() => alert("Đang chuyển hướng sang bài học tiếp theo...")}
                  className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:shadow-xl hover:shadow-primary/40 transition-all text-sm border-none"
                >
                  Tiếp tục học bài
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Floating AI Tutor Dialog Drawer */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        {aiTutorOpen && (
          <div className="w-80 md:w-96 h-[450px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="bg-primary p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white select-none">smart_toy</span>
                <div>
                  <h4 className="font-bold text-sm">Gia sư AI 24/7</h4>
                  <p className="text-[10px] text-white/80">Đang trực tuyến • Sẵn sàng giải đáp</p>
                </div>
              </div>
              <button 
                onClick={() => setAiTutorOpen(false)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950/20">
              {chatMessages.map((msg, i) => (
                <div 
                  key={i}
                  className={cn(
                    "max-w-[80%] rounded-xl p-3 text-xs leading-relaxed font-medium shadow-sm",
                    msg.sender === 'ai'
                      ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 mr-auto border border-slate-100 dark:border-slate-700/50"
                      : "bg-primary text-white ml-auto"
                  )}
                >
                  <Latex text={msg.text} className="whitespace-pre-line" />
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="p-2 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto whitespace-nowrap bg-white dark:bg-slate-900 scrollbar-none">
              <button 
                onClick={() => {
                  setChatInput("Giải thích câu 3");
                  setTimeout(() => {
                    const btn = document.getElementById('chat-submit-btn');
                    btn?.click();
                  }, 100);
                }}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-full transition-all"
              >
                Giải thích câu 3
              </button>
              <button 
                onClick={() => {
                  setChatInput("Lỗi sai ở câu 14 là gì?");
                  setTimeout(() => {
                    const btn = document.getElementById('chat-submit-btn');
                    btn?.click();
                  }, 100);
                }}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-full transition-all"
              >
                Lỗi câu 14?
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Hỏi gia sư AI về lỗi sai của bạn..."
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs focus:ring-1 focus:ring-primary outline-none"
              />
              <button 
                id="chat-submit-btn"
                type="submit"
                className="p-2 bg-primary text-white rounded-xl hover:bg-primary/95 hover:shadow-md transition-all flex items-center justify-center shrink-0 border-none"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        )}

        <div className="relative">
          {!aiTutorOpen && (
            <div className="absolute bottom-full right-0 mb-4 w-60 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 pointer-events-none animate-bounce">
              <p className="text-xs font-bold text-primary mb-1">Gia sư AI 24/7</p>
              <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                Chào Minh Anh! Tôi đã phân tích các lỗi sai của bạn. Nhấn vào đây để tôi hướng dẫn nhé!
              </p>
              <div className="w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 absolute -bottom-1.5 right-6 rotate-45"></div>
            </div>
          )}
          
          <button 
            onClick={() => setAiTutorOpen(prev => !prev)}
            className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/40 hover:scale-110 transition-transform active:scale-95 border-none"
          >
            <span className="material-symbols-outlined text-3xl select-none text-white">smart_toy</span>
          </button>
        </div>
      </div>
      
    </div>
  );
}
