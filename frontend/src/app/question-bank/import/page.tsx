'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, Code, FileText, HelpCircle, CheckSquare, 
  FileSignature, Info, Lightbulb, Rocket, Brain, Settings, 
  Plus, Trash2, ChevronsLeft, ChevronsRight, ChevronLeft, 
  ChevronRight, Sparkles, Bold, Italic, Image as ImageIcon, X 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { Textarea } from '@/components/ui/Textarea';
import { Editor } from '@/components/ui/Editor';
import { Card, CardContent } from '@/components/ui/Card';

interface QuestionData {
  id: string;
  grade: string;
  subject: string;
  level: string;
  tags: string[];
  sharedContext: string;
  sharedImage: string | null;
  content: string;
  questionImage: string | null;
  type: 'multiple-choice' | 'essay';
  options: string[];
  correctAnswer: string;
  solution: string;
  solutionImage: string | null;
  hint: string;
  quickTip: string;
  generalMethod: string;
}

export default function SmartQuestionCreatorPage() {
  const router = useRouter();

  // Set up mock database corresponding to Go-Gin API response structure
  const [questions, setQuestions] = React.useState<QuestionData[]>([
    {
      id: "q1",
      grade: "Lớp 9",
      subject: "Đại số",
      level: "THÔNG HIỂU",
      tags: ["THPT Quốc gia", "Khảo sát hàm số"],
      sharedContext: "",
      sharedImage: null,
      content: "Cho hàm số bậc hai $y = ax^2 + bx + c$ có đồ thị như hình vẽ bên. Tìm các giá trị của tham số $m$ để phương trình $|f(x)| = m$ có đúng 3 nghiệm thực phân biệt.",
      questionImage: null,
      type: "multiple-choice",
      options: ["m = 0", "m = 3", "m > 3", "0 < m < 3"],
      correctAnswer: "B",
      solution: "Đồ thị hàm số $y = |f(x)|$ được tạo thành bằng cách giữ nguyên phần đồ thị $y = f(x)$ nằm phía trên trục $Ox$ và lấy đối xứng phần phía dưới qua trục $Ox$. \n\nDựa vào hình vẽ, đường thẳng $y = m$ cắt đồ thị $|f(x)|$ tại 3 điểm phân biệt khi và chỉ khi $m = 3$.",
      solutionImage: null,
      hint: "",
      quickTip: "",
      generalMethod: ""
    }
  ]);

  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [jsonInput, setJsonInput] = React.useState<string>(JSON.stringify([
    {
      "question": "Cho hàm số bậc hai $y = ax^2 + bx + c$...",
      "options": ["m = 0", "m = 3", "m > 3", "0 < m < 3"],
      "answer": "B",
      "level": "THÔNG HIỂU",
      "grade": "Lớp 9",
      "subject": "Đại số",
      "tags": ["THPT Quốc gia", "Khảo sát hàm số"]
    }
  ], null, 2));

  const [newTagInput, setNewTagInput] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = React.useState<boolean>(false);

  const activeQuestion = questions[currentIndex] || {
    id: "temp",
    grade: "Lớp 9",
    subject: "Đại số",
    level: "NHẬN BIẾT",
    tags: [],
    sharedContext: "",
    sharedImage: null,
    content: "",
    questionImage: null,
    type: "multiple-choice",
    options: ["", "", "", ""],
    correctAnswer: "A",
    solution: "",
    solutionImage: null,
    hint: "",
    quickTip: "",
    generalMethod: ""
  };

  const updateActiveQuestion = (fields: Partial<QuestionData>) => {
    setQuestions(prev => prev.map((q, idx) => idx === currentIndex ? { ...q, ...fields } : q));
  };

  // JSON Quick Import handler matching mockup
  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        alert("Dữ liệu JSON phải là một mảng các câu hỏi!");
        return;
      }

      const importedQuestions: QuestionData[] = parsed.map((item, index) => ({
        id: `imported-${Date.now()}-${index}`,
        grade: item.grade || "Lớp 9",
        subject: item.subject || "Đại số",
        level: (item.level || "THÔNG HIỂU").toUpperCase(),
        tags: item.tags || ["Nhập nhanh"],
        sharedContext: item.sharedContext || "",
        sharedImage: null,
        content: item.question || item.content || "Nội dung câu hỏi nhập từ JSON",
        questionImage: null,
        type: item.type === "essay" ? "essay" : "multiple-choice",
        options: item.options && item.options.length >= 4 ? item.options : ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
        correctAnswer: item.answer || item.correctAnswer || "A",
        solution: item.solution || "",
        solutionImage: null,
        hint: item.hint || "",
        quickTip: item.quickTip || "",
        generalMethod: item.generalMethod || ""
      }));

      setQuestions(importedQuestions);
      setCurrentIndex(0);
      alert(`Đã bóc tách và thêm thành công ${importedQuestions.length} câu hỏi từ JSON!`);
    } catch (e) {
      alert("Định dạng JSON không hợp lệ! Vui lòng kiểm tra lại dấu phẩy và ngoặc đóng.");
    }
  };

  // Sẵn sàng cho API Go-Gin (Simulated API Save Handler)
  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Simulate real post payload to Go-Gin backend:
      const payload = {
        exam_id: "exam_chum_1",
        questions: questions.map(q => ({
          grade: q.grade,
          subject: q.subject,
          level: q.level,
          tags: q.tags,
          shared_context: q.sharedContext,
          content: q.content,
          type: q.type,
          options: q.options,
          correct_answer: q.correctAnswer,
          solution: q.solution,
          hint: q.hint,
          quick_tip: q.quickTip,
          general_method: q.generalMethod
        }))
      };

      console.log("Posting payload to /api/v1/questions (Go-Gin Server):", payload);
      
      // Simulate endpoint latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert("Không thể kết nối đến máy chủ API Go-Gin!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewQuestion = () => {
    const newQ: QuestionData = {
      id: `q-${Date.now()}`,
      grade: "Lớp 9",
      subject: "Đại số",
      level: "NHẬN BIẾT",
      tags: ["Khảo sát hàm số"],
      sharedContext: "",
      sharedImage: null,
      content: "Nhập nội dung câu hỏi mới...",
      questionImage: null,
      type: "multiple-choice",
      options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      correctAnswer: "A",
      solution: "Nhập lời giải chi tiết cho câu hỏi mới...",
      solutionImage: null,
      hint: "",
      quickTip: "",
      generalMethod: ""
    };
    setQuestions(prev => [...prev, newQ]);
    setCurrentIndex(questions.length);
  };

  const handleDeleteQuestion = () => {
    if (questions.length <= 1) {
      alert("Ngân hàng phải chứa ít nhất một câu hỏi!");
      return;
    }
    const filtered = questions.filter((_, idx) => idx !== currentIndex);
    setQuestions(filtered);
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  return (
    <div className="bg-background-light min-h-screen text-slate-900 font-display flex flex-col pb-20 lg:pb-0">
      
      {/* Header aligned exactly with exams/create layout */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 px-4 md:px-8 py-3">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="bg-primary/10 p-2 rounded-lg text-primary hover:bg-primary/20 transition-colors cursor-pointer flex items-center justify-center"
              title="Quay lại trang trước"
            >
              <Sparkles size={24} />
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold leading-tight">Smart Question Creator</h1>
              <Badge variant="danger" className="bg-red-100 text-red-600 border border-red-200">Câu hỏi chùm</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-sm">
              Xem trước
            </button>
            <Button 
              onClick={handleSaveToDatabase}
              disabled={isSaving}
              variant="default" 
              className="shadow-md shadow-primary/20 flex items-center gap-2 font-bold px-6"
            >
              {isSaving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Save size={18} />
              )}
              {isSaving ? "Đang lưu..." : "Lưu vào ngân hàng"}
            </Button>
          </div>
        </div>
      </header>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="bg-emerald-550 text-white font-semibold text-center py-2.5 px-4 text-xs tracking-wider uppercase animate-fade-in flex items-center justify-center gap-2">
          <CheckSquare size={16} />
          Đã đồng bộ hóa và lưu thành công tất cả câu hỏi vào cơ sở dữ liệu Go-Gin + PostgreSQL!
        </div>
      )}

      {/* Main Container - Sized exactly max-w-[1440px] gap-6 p-4 md:p-6 */}
      <main className="max-w-[1440px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full flex-1">
        
        {/* Left Column (Main Work Area) (8 units) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* AI / JSON Input Section */}
          <section className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-blue-400"></div>
              <div className="flex items-center justify-between mb-3 pl-2">
                <div className="flex items-center gap-2">
                  <Code className="text-primary text-xl" />
                  <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">Nhập nhanh bằng JSON</h2>
                  <Badge variant="primary" className="bg-blue-100 text-primary border-transparent">Thông minh</Badge>
                </div>
              </div>
              <div className="relative pl-2">
                <Textarea 
                  variant="mono"
                  className="min-h-[120px] pb-14"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='[{"question": "...", "options": [...], "answer": "A"}, ...]'
                />
                <Button 
                  onClick={handleJsonImport}
                  variant="default"
                  size="sm"
                  className="absolute bottom-3 right-3 font-bold text-xs flex items-center gap-2 shadow-md shadow-primary/30"
                >
                  <Sparkles size={14} />
                  Xử lý JSON
                </Button>
              </div>
            </div>

            {/* Navigation Controls Card */}
            <div className="flex justify-center">
              <div className="bg-white rounded-full border border-slate-200 px-2 py-1.5 flex items-center gap-2 shadow-sm">
                <button 
                  onClick={() => setCurrentIndex(0)}
                  disabled={currentIndex === 0}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 disabled:opacity-30 cursor-pointer flex items-center justify-center"
                  title="Trang đầu"
                >
                  <ChevronsLeft size={18} />
                </button>
                <button 
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-100 shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center"
                  title="Câu trước"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="px-4 py-1 flex items-center gap-2 border-x border-slate-100 select-none">
                  <span className="text-xs font-black text-primary uppercase tracking-widest">Câu {currentIndex + 1}</span>
                  <Badge variant="danger" className="ml-1 bg-red-100 text-red-600 border border-red-200">Câu hỏi chùm</Badge>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ {questions.length}</span>
                </div>

                <button 
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIndex === questions.length - 1}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-100 shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center"
                  title="Câu sau"
                >
                  <ChevronRight size={18} />
                </button>
                <button 
                  onClick={() => setCurrentIndex(questions.length - 1)}
                  disabled={currentIndex === questions.length - 1}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 disabled:opacity-30 cursor-pointer flex items-center justify-center"
                  title="Trang cuối"
                >
                  <ChevronsRight size={18} />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1"></div>
                <button 
                  onClick={handleDeleteQuestion}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer flex items-center justify-center" 
                  title="Xóa câu này"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* Shared Context Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-2 px-2 select-none">
                <FileText className="text-primary" size={18} />
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700">Nội dung dẫn chung (Shared Context)</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 pr-3 border-r border-slate-300">
                  <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500 hover:text-slate-900" title="In đậm"><Bold size={16} /></button>
                  <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500 hover:text-slate-900" title="In nghiêng"><Italic size={16} /></button>
                  <button className="p-1.5 hover:bg-white rounded transition-colors text-primary font-bold text-xs" title="Công thức LaTeX">Σ</button>
                  <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500 hover:text-slate-900" title="Thêm ảnh"><ImageIcon size={16} /></button>
                </div>
                <button className="text-primary text-xs font-bold hover:underline px-2 tracking-wide uppercase cursor-pointer">Hướng dẫn</button>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <div className="flex flex-col gap-4">
                  <div className="relative group border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center min-h-[200px] hover:border-primary/50 transition-colors cursor-pointer overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px]">
                    {activeQuestion.sharedImage ? (
                      <img src={activeQuestion.sharedImage} className="object-contain max-h-[190px]" alt="Shared" />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="mx-auto text-4xl text-slate-300 group-hover:text-primary transition-colors mb-2" size={36} />
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ảnh dùng chung</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <Editor 
                    placeholder="Nhập ngữ cảnh chung cho các câu hỏi nhỏ..."
                    value={activeQuestion.sharedContext}
                    onValueChange={(content) => updateActiveQuestion({ sharedContext: content })}
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Question Content Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-2 px-2 select-none">
                <HelpCircle className="text-primary" size={18} />
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700">Nội dung câu hỏi</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 pr-3 border-r border-slate-300">
                  <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500 hover:text-slate-900" title="In đậm"><Bold size={16} /></button>
                  <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500 hover:text-slate-900" title="In nghiêng"><Italic size={16} /></button>
                  <button className="p-1.5 hover:bg-white rounded transition-colors text-primary font-bold text-xs" title="Công thức LaTeX">Σ</button>
                  <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500 hover:text-slate-900" title="Thêm ảnh"><ImageIcon size={16} /></button>
                </div>
                <button className="text-primary text-xs font-bold hover:underline px-2 tracking-wide uppercase cursor-pointer">Công cụ toán</button>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <div className="flex flex-col gap-4">
                  <div className="relative group border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center min-h-[300px] hover:border-primary/50 transition-colors cursor-pointer overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px]">
                    {activeQuestion.questionImage ? (
                      <img src={activeQuestion.questionImage} className="object-contain max-h-[290px]" alt="Question" />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="mx-auto text-5xl text-slate-300 group-hover:text-primary transition-colors mb-3" size={48} />
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Kéo thả hoặc Tải ảnh</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <Editor 
                    placeholder="Nhập nội dung câu hỏi..."
                    value={activeQuestion.content}
                    onValueChange={(content) => updateActiveQuestion({ content })}
                    className="min-h-[300px]"
                  />
                  <div className="mt-3 flex items-center justify-between px-1 select-none">
                    <span className="text-[10px] text-slate-400 font-medium tracking-wide">Hỗ trợ LaTeX: $...$</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                      {activeQuestion.content.replace(/<[^>]*>/g, '').length} KÝ TỰ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold flex items-center gap-2 select-none text-slate-800">
                <CheckSquare className="text-primary" size={20} />
                Đáp án
              </h2>
              <div className="bg-slate-100 p-1 rounded-xl flex select-none">
                <button 
                  onClick={() => updateActiveQuestion({ type: 'multiple-choice' })}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    activeQuestion.type === 'multiple-choice' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Trắc nghiệm
                </button>
                <button 
                  onClick={() => updateActiveQuestion({ type: 'essay' })}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    activeQuestion.type === 'essay' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Tự luận
                </button>
              </div>
            </div>

            {activeQuestion.type === 'multiple-choice' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {['A', 'B', 'C', 'D'].map((optLabel, index) => {
                  const isCorrect = activeQuestion.correctAnswer === optLabel;
                  const optValue = activeQuestion.options[index] || "";

                  return (
                    <div key={optLabel} className="flex items-center gap-4 group">
                      <div className="flex-shrink-0">
                        <input 
                          type="radio" 
                          name={`correct-ans-${currentIndex}`}
                          checked={isCorrect}
                          onChange={() => updateActiveQuestion({ correctAnswer: optLabel })}
                          className="w-6 h-6 text-primary border-slate-300 focus:ring-primary rounded-full cursor-pointer"
                        />
                      </div>
                      <div className={`flex-grow flex items-center rounded-xl px-5 py-4 transition-all border ${
                        isCorrect 
                          ? 'bg-blue-50/30 border-2 border-primary/40 ring-4 ring-primary/5' 
                          : 'bg-slate-50 border-slate-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5'
                      }`}>
                        <span className={`font-bold mr-4 select-none ${isCorrect ? 'text-primary' : 'text-slate-400'}`}>
                          {optLabel}.
                        </span>
                        <input 
                          type="text"
                          value={optValue}
                          onChange={(e) => {
                            const updatedOpts = [...activeQuestion.options];
                            updatedOpts[index] = e.target.value;
                            updateActiveQuestion({ options: updatedOpts });
                          }}
                          placeholder="Nhập đáp án..."
                          className={`bg-transparent border-none p-0 w-full focus:ring-0 text-sm outline-none ${
                            isCorrect ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center text-slate-500 text-sm font-semibold select-none">
                Chế độ Tự luận đang hoạt động. Lời giải chi tiết bên dưới sẽ đóng vai trò làm đáp án hướng dẫn tự học.
              </div>
            )}
          </div>

          {/* Solution Section */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-2 px-2 select-none">
                <FileSignature className="text-primary" size={18} />
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700">Lời giải chi tiết</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 pr-3 border-r border-slate-300">
                  <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500 hover:text-slate-900" title="In đậm"><Bold size={16} /></button>
                  <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500 hover:text-slate-900" title="In nghiêng"><Italic size={16} /></button>
                  <button className="p-1.5 hover:bg-white rounded transition-colors text-primary font-bold text-xs" title="Công thức LaTeX">Σ</button>
                  <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500 hover:text-slate-900" title="Thêm ảnh"><ImageIcon size={16} /></button>
                </div>
                <button className="text-primary text-xs font-bold hover:underline px-2 tracking-wide uppercase cursor-pointer">Hướng dẫn LaTeX</button>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <div className="flex flex-col gap-4">
                  <div className="relative group border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center min-h-[260px] hover:border-primary/50 transition-colors cursor-pointer overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px]">
                    {activeQuestion.solutionImage ? (
                      <img src={activeQuestion.solutionImage} className="object-contain max-h-[250px]" alt="Solution" />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="mx-auto text-4xl text-slate-300 group-hover:text-primary transition-colors mb-2" size={36} />
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Ảnh minh họa lời giải</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <Editor 
                    placeholder="Nhập lời giải chi tiết..."
                    value={activeQuestion.solution}
                    onValueChange={(content) => updateActiveQuestion({ solution: content })}
                    className="min-h-[260px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Student Support Information Section */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-2 px-2 select-none">
                <Info className="text-primary" size={18} />
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700">Thông tin bổ trợ cho học sinh</h2>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 select-none">
                  <Lightbulb size={16} className="text-amber-500" /> Gợi ý
                </label>
                <Textarea 
                  placeholder="Nhập gợi ý cho học sinh..."
                  value={activeQuestion.hint}
                  onChange={(e) => updateActiveQuestion({ hint: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 select-none">
                  <Rocket size={16} className="text-indigo-500" /> Mẹo giải nhanh
                </label>
                <Textarea 
                  placeholder="Nhập các mẹo giải bài nhanh..."
                  value={activeQuestion.quickTip}
                  onChange={(e) => updateActiveQuestion({ quickTip: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 select-none">
                  <Brain size={16} className="text-pink-500" /> Phương pháp tổng quát
                </label>
                <Textarea 
                  placeholder="Nhập phương pháp giải tổng quát cho dạng bài này..."
                  value={activeQuestion.generalMethod}
                  onChange={(e) => updateActiveQuestion({ generalMethod: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {/* Manual Add Button */}
          <div className="flex justify-center pb-8">
            <Button 
              onClick={handleAddNewQuestion}
              variant="outline-slate"
              circle
              className="w-14 h-14 bg-white text-primary shadow-lg border border-slate-200 hover:scale-110 active:scale-95 group transition-all"
              title="Thêm câu hỏi nhỏ mới"
            >
              <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
            </Button>
          </div>
        </div>

        {/* Right Sidebar Column (4 units) styled exactly like the exam creator sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            
            {/* Cấu hình câu hỏi Card */}
            <Card>
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-slate-800 select-none">
                  <Settings className="text-primary animate-spin-slow" size={20} />
                  Thiết lập câu hỏi
                </h3>
              </div>
              <CardContent className="space-y-6">
                
                {/* Grade selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1 select-none">Khối lớp</label>
                  <Select 
                    value={activeQuestion.grade}
                    onChange={(e) => updateActiveQuestion({ grade: e.target.value })}
                  >
                    <option value="Lớp 5">Lớp 5</option>
                    <option value="Lớp 6">Lớp 6</option>
                    <option value="Lớp 7">Lớp 7</option>
                    <option value="Lớp 8">Lớp 8</option>
                    <option value="Lớp 9">Lớp 9</option>
                    <option value="Ôn thi 10">Ôn thi 10</option>
                  </Select>
                </div>

                {/* Subject selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1 select-none">Chuyên đề</label>
                  <Select 
                    value={activeQuestion.subject}
                    onChange={(e) => updateActiveQuestion({ subject: e.target.value })}
                  >
                    <option value="Số học">Số học</option>
                    <option value="Số hữu tỉ">Số hữu tỉ</option>
                    <option value="Đại số">Đại số</option>
                    <option value="Hằng đẳng thức">Hằng đẳng thức</option>
                    <option value="Đa thức">Đa thức</option>
                    <option value="Hình học">Hình học</option>
                    <option value="Tứ giác">Tứ giác</option>
                    <option value="Đường tròn">Đường tròn</option>
                    <option value="Giải tích">Giải tích</option>
                  </Select>
                </div>

                {/* Difficulty Buttons Grid */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-500 ml-1 select-none">Độ khó</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['NHẬN BIẾT', 'THÔNG HIỂU', 'VẬN DỤNG', 'VẬN DỤNG CAO'].map((lvl) => (
                      <Button
                        key={lvl}
                        type="button"
                        variant="outline-slate"
                        className={activeQuestion.level === lvl 
                          ? "bg-blue-50 text-primary border-blue-500/30 hover:bg-blue-50 shadow-sm text-xs font-black py-4 border rounded-xl"
                          : "bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 border border-slate-200 text-xs font-bold py-4 rounded-xl shadow-sm"
                        }
                        onClick={() => updateActiveQuestion({ level: lvl })}
                      >
                        {lvl}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tags Manager */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-500 ml-1 select-none">Thẻ (Tags)</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeQuestion.tags.map((tag) => (
                      <Tag
                        key={tag}
                        label={tag}
                        onRemove={() => {
                          const filteredTags = activeQuestion.tags.filter(t => t !== tag);
                          updateActiveQuestion({ tags: filteredTags });
                        }}
                      />
                    ))}
                  </div>
                  <div className="relative">
                    <Input 
                      placeholder="Thêm thẻ mới..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTagInput.trim()) {
                          if (!activeQuestion.tags.includes(newTagInput.trim())) {
                            updateActiveQuestion({ tags: [...activeQuestion.tags, newTagInput.trim()] });
                          }
                          setNewTagInput("");
                        }
                      }}
                      className="py-3 pl-4 pr-10 text-sm font-medium"
                    />
                    <span 
                      onClick={() => {
                        if (newTagInput.trim()) {
                          if (!activeQuestion.tags.includes(newTagInput.trim())) {
                            updateActiveQuestion({ tags: [...activeQuestion.tags, newTagInput.trim()] });
                          }
                          setNewTagInput("");
                        }
                      }}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-primary cursor-pointer transition-colors"
                    >
                      <Plus size={20} />
                    </span>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* AI Insight banner styled exactly like "Gợi ý từ AI" in the exam creator */}
            <div className="p-5 bg-gradient-to-br from-primary to-blue-700 rounded-2xl text-white shadow-lg shadow-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={20} className="text-white animate-pulse" />
                <h4 className="font-bold text-sm uppercase tracking-widest select-none">Quy trình thông minh</h4>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed font-medium">
                AI sẽ tự động bóc tách đề bài, chuyển đổi ký tự sang LaTeX, xác định cấp độ và gợi ý đáp án đúng cùng lời giải chỉ trong vài giây.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40 select-none">
        <button className="flex-1 py-4 border border-slate-200 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-colors">
          Xem trước
        </button>
        <button 
          onClick={handleSaveToDatabase}
          disabled={isSaving}
          className="flex-1 py-4 bg-primary text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
        >
          {isSaving ? "Đang lưu..." : "Lưu vào"}
        </button>
      </div>
    </div>
  );
}
