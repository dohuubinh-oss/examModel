'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Save, Code, FileText, HelpCircle, CheckSquare,
  FileSignature, Info, Lightbulb, Rocket, Brain, Settings,
  Plus, Trash2, ChevronsLeft, ChevronsRight, ChevronLeft, AlertCircle,
  Image as ImageIcon, CheckCircle2,
  ChevronRight, Sparkles, X, Keyboard, Library, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { Textarea } from '@/components/ui/Textarea';
import { TiptapEditor } from '@/components/ui/TiptapEditor';

import { MathfieldInput } from '@/components/ui/MathfieldInput';
import { Card, CardContent } from '@/components/ui/Card';
import { Latex } from '@/components/ui/Latex';

const JSON_PLACEHOLDER = `[{
  "shared_content": "Nội dung dẫn chung",
  "image_shared": "URL string or null",
  "questions": [{
    "type_question": "MUST be one of: 'group', 'single' (Required)",
    "content": "Nội dung câu hỏi (Mọi công thức toán: dùng LaTeX.)",
    "type": "String, MUST be one of: 'Trắc nghiệm', 'Tự luận' (Required)",
    "grade": "int, MUST be one of: 6, 7, 8, 9 (Required)",
    "topic": "tuỳ theo khối lớp và nội dung câu hỏi chọn chủ đề cho phù hợp trong TAXONOMY.txt (Required)",
    "difficulty_level": "One of: 'Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao' (Required)",
    "difficulty_point": "Float (Required) from 0.0 to 10",
    "point": "Float (Required)",
    "tags": ["Array", "of", "strings"],
    "options": ["Mảng phương án (LaTeX)"],
    "correct_answer": "đáp án đúng (LaTeX)",
    "solution_guide": "String (e.g., 'Câu A:\\n Bước 1:....\\n Bước 2: ....\\n\\n Câu B:\\n Bước 1:....\\n Bước 2: ....\\n\\n ') (Required)",
    "hint": "chỉ dẫn nhỏ, gợi nhớ công thức hoặc cách tiếp cận",
    "quick_solve_tips": "mẹo giải nhanh",
    "general_method": "tổng quát hoá 1 dạng bài toán",
    "mistakes": "lỗi sai thường gặp",
    "image_question": "URL string or null",
    "image_solution": "URL string or null"
  }]
}]`;

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function SmartQuestionCreatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Đang tải...</div>}>
      <CreatorContent />
    </Suspense>
  );
}

function CreatorContent() {
  const router = useRouter();

  const [topicsByGrade, setTopicsByGrade] = React.useState<Record<string, string[]>>({
    "Lớp 5": [],
    "Lớp 6": [],
    "Lớp 7": [],
    "Lớp 8": [],
    "Lớp 9": [],
    "Ôn thi 10": []
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const searchParams = useSearchParams();
  const editId = searchParams?.get('edit');
  const editType = searchParams?.get('type');
  const isEditMode = !!editId;

  React.useEffect(() => {
    if (isEditMode && editId) {
      const fetchEditData = async () => {
        try {
          const endpoint = editType === 'group' 
            ? `${API_BASE_URL}/api/v1/question-groups/${editId}`
            : `${API_BASE_URL}/api/v1/questions/${editId}`;
          const res = await fetch(endpoint);
          if (!res.ok) throw new Error('Failed to fetch data for editing');
          const data = await res.json();
          
          if (editType === 'group') {
            const group = data.data;
            setQuestionsGroup([{
              id: group.id,
              shared_content: group.shared_content || "",
              image_shared: group.image_shared || null,
              questions: group.Questions.map((q: any) => ({
                id: q.id,
                type_question: 'group',
                grade: q.grade || "",
                topic: q.topic || "",
                difficulty_level: q.difficulty_level || "",
                difficulty_point: q.difficulty_point || 0,
                point: q.point || 1,
                tags: typeof q.tags === 'string' ? JSON.parse(q.tags) : (q.tags || []),
                content: q.content || "",
                image_question: q.image_question || null,
                type: q.type || "Trắc nghiệm",
                options: typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || ["", "", "", ""]),
                correct_answer: q.correct_answer || "",
                solution_guide: q.solution_guide || "",
                image_solution: q.image_solution || null,
                hint: q.hint || "",
                quick_solve_tips: q.quick_solve_tips || "",
                general_method: q.general_method || "",
                mistakes: q.mistakes || ""
              }))
            }]);
          } else {
            const q = data.data;
            setQuestionsGroup([{
              id: undefined,
              shared_content: "",
              image_shared: null,
              questions: [{
                id: q.id,
                type_question: 'single',
                grade: q.grade || "",
                topic: q.topic || "",
                difficulty_level: q.difficulty_level || "",
                difficulty_point: q.difficulty_point || 0,
                point: q.point || 1,
                tags: typeof q.tags === 'string' ? JSON.parse(q.tags) : (q.tags || []),
                content: q.content || "",
                image_question: q.image_question || null,
                type: q.type || "Trắc nghiệm",
                options: typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || ["", "", "", ""]),
                correct_answer: q.correct_answer || "",
                solution_guide: q.solution_guide || "",
                image_solution: q.image_solution || null,
                hint: q.hint || "",
                quick_solve_tips: q.quick_solve_tips || "",
                general_method: q.general_method || "",
                mistakes: q.mistakes || ""
              }]
            }]);
          }
        } catch (error) {
          console.error('Error fetching edit data:', error);
          alert('Không thể tải dữ liệu câu hỏi để sửa');
        }
      };
      fetchEditData();
    }
  }, [isEditMode, editId, editType, API_BASE_URL]);

  const getImageUrl = (url?: string | null) => {
    if (!url) return '';
    if (url.startsWith('blob:') || url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/topics`);
        if (res.ok) {
          const data = await res.json();
          const grouped: Record<string, string[]> = {
            "Lớp 5": [], "Lớp 6": [], "Lớp 7": [], "Lớp 8": [], "Lớp 9": [], "Ôn thi 10": []
          };
          const topicsList = Array.isArray(data) ? data : (data.data || []);
          topicsList.forEach((topic: any) => {
            const gradeKey = topic.grade === 10 ? "Ôn thi 10" : `Lớp ${topic.grade}`;
            if (grouped[gradeKey] && !grouped[gradeKey].includes(topic.name)) {
              grouped[gradeKey].push(topic.name);
            }
          });
          if (topicsList.length > 0) {
            setTopicsByGrade(grouped);
          }
        }
      } catch (e) {
        if (e instanceof Error) {
          console.warn('Backend chưa chạy hoặc Failed to fetch topics:', e.message);
        } else {
          console.warn('Failed to fetch topics', e);
        }
      }
    };
    fetchTopics();
  }, []);

  const handleAddNewQuestion = () => {
    // Add to the end of the last group
    setQuestionsGroup(prev => {
      const newGroups = [...prev];
      if (newGroups.length === 0) {
        newGroups.push({ shared_content: "", image_shared: null, questions: [] });
      }
      const lastGroupIdx = newGroups.length - 1;
      const newGroup = { ...newGroups[lastGroupIdx] };
      newGroup.questions = [...newGroup.questions, {
        type_question: "single",
        grade: "",
        topic: "",
        difficulty_level: "",
        difficulty_point: 0,
        point: 1,
        tags: [],
        content: "",
        image_question: null,
        type: "Trắc nghiệm",
        options: ["", "", "", ""],
        correct_answer: "",
        solution_guide: "",
        image_solution: null,
        hint: "",
        quick_solve_tips: "",
        general_method: "",
        mistakes: ""
      }];
      newGroups[lastGroupIdx] = newGroup;
      return newGroups;
    });
    setCurrentIndex(totalQuestions);
  };

  const [questionsGroup, setQuestionsGroup] = React.useState<any[]>([
    {
      shared_content: "",
      image_shared: null,
      questions: [{
        type_question: "single",
        grade: "",
        topic: "",
        difficulty_level: "",
        difficulty_point: 0,
        point: 1,
        tags: [],
        content: "",
        image_question: null,
        type: "Trắc nghiệm",
        options: ["", "", "", ""],
        correct_answer: "A",
        solution_guide: "",
        image_solution: null,
        hint: "",
        quick_solve_tips: "",
        general_method: "",
        mistakes: ""
      }]
    }
  ]);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [jsonInput, setJsonInput] = React.useState<string>("");
  const [isParsed, setIsParsed] = React.useState<boolean>(false);

  const [newTagInput, setNewTagInput] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = React.useState<boolean>(false);
  
  // TipTap Math Modal State
  const [mathModalOpen, setMathModalOpen] = React.useState<boolean>(false);
  const [mathInputValue, setMathInputValue] = React.useState<string>("");
  const [mathSaveCallback, setMathSaveCallback] = React.useState<((val: string) => void) | null>(null);

  React.useEffect(() => {
    const handleOpenMathModal = (e: any) => {
      setMathInputValue(e.detail.latex);
      setMathSaveCallback(() => e.detail.onSave);
      setMathModalOpen(true);
    };
    window.addEventListener('open-math-modal', handleOpenMathModal);
    return () => window.removeEventListener('open-math-modal', handleOpenMathModal);
  }, []);

  const handleSaveMathFromModal = () => {
    if (mathSaveCallback) {
      mathSaveCallback(mathInputValue);
    }
    setMathModalOpen(false);
  };

  const getIndicesFromFlatIndex = (flatIndex: number) => {
    let count = 0;
    for (let g = 0; g < questionsGroup.length; g++) {
      const numQ = questionsGroup[g].questions.length;
      if (flatIndex < count + numQ) {
        return { groupIndex: g, questionIndex: flatIndex - count };
      }
      count += numQ;
    }
    return { groupIndex: 0, questionIndex: 0 };
  };

  const totalQuestions = questionsGroup.reduce((sum, g) => sum + g.questions.length, 0) || 1;
  const { groupIndex, questionIndex } = getIndicesFromFlatIndex(currentIndex);
  const currentGroup = questionsGroup[groupIndex] || { questions: [] };
  const currentQ = currentGroup.questions[questionIndex] || {};

  const activeQuestion = {
    id: `q-${groupIndex}-${questionIndex}`,
    typeQuestion: currentQ.type_question === 'group' ? 'group' : 'single',
    grade: currentQ.grade || "",
    subject: currentQ.topic || "",
    level: currentQ.difficulty_level || "",
    difficultyPoint: parseFloat(currentQ.difficulty_point) || 0,
    point: parseFloat(currentQ.point) || 1.0,
    tags: Array.isArray(currentQ.tags) ? currentQ.tags : [],
    sharedContext: currentGroup.shared_content || "",
    sharedImage: currentGroup.image_shared || null,
    content: currentQ.content || "",
    questionImage: currentQ.image_question || null,
    type: currentQ.type === 'Tự luận' ? 'essay' : 'multiple-choice',
    options: Array.isArray(currentQ.options) && currentQ.options.length >= 4 ? currentQ.options : ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
    correctAnswer: currentQ.correct_answer || (currentQ.type === 'Tự luận' ? '' : 'A'),
    solution: currentQ.solution_guide || "",
    solutionImage: currentQ.image_solution || null,
    hint: currentQ.hint || "",
    quickTip: currentQ.quick_solve_tips || "",
    generalMethod: currentQ.general_method || "",
    mistakes: currentQ.mistakes || ""
  };

  const updateActiveQuestion = (fields: any) => {
    setQuestionsGroup(prev => {
      const newGroups = [...prev];
      const g = { ...newGroups[groupIndex] };
      const q = { ...g.questions[questionIndex] };

      if ('sharedContext' in fields) g.shared_content = fields.sharedContext;
      if ('sharedImage' in fields) g.image_shared = fields.sharedImage;
      
      if ('content' in fields) q.content = fields.content;
      if ('questionImage' in fields) q.image_question = fields.questionImage;
      if ('solutionImage' in fields) q.image_solution = fields.solutionImage;
      if ('type' in fields) q.type = fields.type === 'essay' ? 'Tự luận' : 'Trắc nghiệm';
      if ('correctAnswer' in fields) q.correct_answer = fields.correctAnswer;
      if ('options' in fields) q.options = fields.options;
      if ('solution' in fields) q.solution_guide = fields.solution;
      if ('hint' in fields) q.hint = fields.hint;
      if ('quickTip' in fields) q.quick_solve_tips = fields.quickTip;
      if ('generalMethod' in fields) q.general_method = fields.generalMethod;
      if ('mistakes' in fields) q.mistakes = fields.mistakes;
      if ('grade' in fields) q.grade = fields.grade;
      if ('subject' in fields) q.topic = fields.subject;
      if ('level' in fields) q.difficulty_level = fields.level;
      if ('difficultyPoint' in fields) q.difficulty_point = fields.difficultyPoint;
      if ('point' in fields) q.point = fields.point;
      if ('tags' in fields) q.tags = fields.tags;
      if ('typeQuestion' in fields) q.type_question = fields.typeQuestion;

      g.questions = [...g.questions];
      g.questions[questionIndex] = q;
      newGroups[groupIndex] = g;
      return newGroups;
    });
  };

  const handleImageUpload = async (field: 'sharedImage' | 'questionImage' | 'solutionImage') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        
        try {
          const tempUrl = URL.createObjectURL(file);
          updateActiveQuestion({ [field]: tempUrl });
          
          const res = await fetch(`${API_BASE_URL}/api/v1/upload/temp`, {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          const finalUrl = data.url || data.data?.url;
          if (res.ok && finalUrl) {
            updateActiveQuestion({ [field]: finalUrl });
          } else {
            alert('Upload lỗi: ' + (data.message || 'Lỗi không xác định'));
          }
        } catch (err) {
          console.error('Lỗi upload ảnh:', err);
          alert('Upload thất bại');
        }
      }
    };
    input.click();
  };

  const handleJsonImport = () => {
    if (!jsonInput.trim()) {
      alert("Vui lòng dán nội dung JSON vào trước khi xử lý!");
      return;
    }
    try {
      const cleanedInput = jsonInput
        .replace(/(?<!\\)\\f/g, '\\\\f')
        .replace(/(?<!\\)\\b/g, '\\\\b')
        .replace(/(?<!\\)\\v/g, '\\\\v')
        .replace(/(?<!\\)\\t/g, '\\\\t')
        .replace(/(?<!\\)\\r/g, '\\\\r')
        .replace(/(?<!\\)\\n/g, '\\\\n');

      const parsed = JSON.parse(cleanedInput);
      if (!Array.isArray(parsed)) {
        alert("Dữ liệu JSON phải là một mảng (Array) các nhóm câu hỏi!");
        return;
      }
      
      let questionCount = 0;
      for (const group of parsed) {
         if (Array.isArray(group.questions)) {
            questionCount += group.questions.length;
         }
      }

      if (questionCount === 0) {
        alert("Không tìm thấy câu hỏi nào trong JSON! Vui lòng kiểm tra lại cấu trúc.");
        return;
      }

      // Xử lý transform `difficulty_level` lên UPPERCASE theo form gốc và xử lý `grade` thành format hiển thị UI
      const updatedParsed = parsed.map(group => {
         const newGroup = { ...group };
         if (Array.isArray(newGroup.questions)) {
            newGroup.questions = newGroup.questions.map((q: any) => {
               // Transform grade
               let uiGrade = q.grade;
               if (typeof q.grade === 'number' || !isNaN(Number(q.grade))) {
                 const num = Number(q.grade);
                 uiGrade = num === 10 ? "Ôn thi 10" : `Lớp ${num}`;
               }
               
               return {
                 ...q,
                 grade: uiGrade,
                 difficulty_level: (q.difficulty_level || "Nhận biết").toUpperCase()
               };
            });
         }
         return newGroup;
      });

      setQuestionsGroup(updatedParsed);
      setIsParsed(true);
      setCurrentIndex(0);
      alert(`Đã bóc tách và thêm thành công ${questionCount} câu hỏi từ JSON!`);
    } catch (e) {
      alert("Định dạng JSON không hợp lệ! Vui lòng kiểm tra lại dấu phẩy và ngoặc đóng.");
      if (e instanceof Error) {
        console.warn("Lỗi phân tích JSON từ người dùng nhập:", e.message);
      } else {
        console.warn("Lỗi phân tích JSON từ người dùng nhập:", e);
      }
    }
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Đảm bảo các trường ảnh luôn tồn tại trong output JSON, dù là null
      const finalPayload = questionsGroup.map(group => ({
        ...group,
        image_shared: group.image_shared ?? null,
        questions: Array.isArray(group.questions) ? group.questions.map((q: any) => {
          let numGrade = 0;
          if (typeof q.grade === "string") {
            if (q.grade === "Ôn thi 10") numGrade = 10;
            else {
               const match = q.grade.match(/\d+/);
               if (match) numGrade = parseInt(match[0], 10);
            }
          } else if (typeof q.grade === "number") {
            numGrade = q.grade;
          }
          return {
            ...q,
            grade: numGrade,
            image_question: q.image_question ?? null,
            image_solution: q.image_solution ?? null
          };
        }) : []
      }));

      console.log("DỮ LIỆU JSON CUỐI CÙNG CHUẨN BỊ GỬI LÊN BACKEND:", finalPayload);
      
      let res;
      if (isEditMode && editId) {
        if (editType === 'group') {
          res = await fetch(`${API_BASE_URL}/api/v1/question-groups/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalPayload[0]) // PUT group takes a single QuestionGroupRequest
          });
        } else {
          // PUT single question
          res = await fetch(`${API_BASE_URL}/api/v1/questions/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalPayload[0].questions[0]) // PUT single takes QuestionRequest
          });
        }
      } else {
        res = await fetch(`${API_BASE_URL}/api/v1/questions/bulk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(finalPayload)
        });
      }
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Đã xảy ra lỗi khi lưu vào cơ sở dữ liệu");
      }

      alert(isEditMode ? "Đã cập nhật câu hỏi thành công!" : "Đã lưu thành công các câu hỏi vào cơ sở dữ liệu!");
      setSaveSuccess(true);
      setTimeout(() => {
        if (isEditMode) {
          router.push('/question-bank');
        } else {
          window.location.reload();
        }
      }, 1500);
    } catch (e: any) {
      alert(e.message || "Đã xảy ra lỗi!");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = () => {
    if (totalQuestions <= 1) {
      alert("Ngân hàng phải chứa ít nhất một câu hỏi!");
      return;
    }
    setQuestionsGroup(prev => {
      const newGroups = [...prev];
      const g = { ...newGroups[groupIndex] };
      g.questions = [...g.questions];
      g.questions.splice(questionIndex, 1);
      
      if (g.questions.length === 0) {
        newGroups.splice(groupIndex, 1);
      } else {
        newGroups[groupIndex] = g;
      }
      return newGroups;
    });
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  return (
    <div className="bg-background-light min-h-screen text-slate-900 font-display flex flex-col pb-20 lg:pb-0">

      {/* Header aligned exactly with exams/create layout */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 px-4 md:px-8 py-3">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="p-2 h-10 w-10 shrink-0 text-slate-500 hover:text-slate-800 border border-slate-200" onClick={() => router.push('/question-bank')}>
              <ChevronLeft size={20} />
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                <Brain className="text-primary" size={20} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  {isEditMode ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi mới'}
                  {isEditMode && <Badge variant="primary" className="bg-amber-500 hover:bg-amber-600 text-white border-0 text-[10px] py-0">ĐANG SỬA</Badge>}
                </h1>
                <p className="text-xs text-slate-500 font-medium">{isEditMode ? 'Chỉnh sửa nội dung câu hỏi' : 'Tạo mới hoặc tải lên câu hỏi'}</p>
              </div>
            </div>
          </div>

          {/* Header center / tabs - HIDDEN IN EDIT MODE */}
          {!isEditMode && (
            <div className="hidden md:flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner max-w-sm w-full mx-4">
              <button
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all ${
                  !isParsed 
                    ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setIsParsed(false)}
              >
                Nhập thủ công
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-bold rounded-lg transition-all ${
                  isParsed 
                    ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
                onClick={() => setIsParsed(true)}
              >
                <Code size={14} /> Tải từ file
              </button>
            </div>
          )}

          {/* Header right */}
          <div className="flex items-center gap-3">
            <Button 
              variant="default" 
              className="gap-2 h-10 px-5 text-sm font-bold shadow-sm rounded-xl shrink-0 transition-transform active:scale-95"
              onClick={handleSaveToDatabase}
              disabled={isSaving || saveSuccess}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Đang {isEditMode ? 'cập nhật' : 'lưu'}...</span>
                </div>
              ) : saveSuccess ? (
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 size={16} />
                  <span>Đã {isEditMode ? 'cập nhật' : 'lưu'}</span>
                </div>
              ) : (
                <>
                  <Save size={16} />
                  <span className="hidden sm:inline">{isEditMode ? 'Cập nhật câu hỏi' : 'Lưu vào ngân hàng'}</span>
                  <span className="inline sm:hidden">{isEditMode ? 'Cập nhật' : 'Lưu'}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="bg-emerald-550 text-white font-semibold text-center py-2.5 px-4 text-xs tracking-wider uppercase animate-fade-in flex items-center justify-center gap-2">
          <CheckSquare size={16} />
          Đã lưu thành công vào cơ sở dữ liệu! Đang làm mới trang...
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto w-full p-4 lg:p-6 lg:pt-8 flex flex-col lg:flex-row gap-6 relative">
        {(!isParsed || isEditMode) ? (
        <div className="lg:col-span-8 space-y-6 w-full">

          {/* AI / JSON Input Section */}
          {!isEditMode && (
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
                  disabled={isParsed}
                  className={`min-h-[120px] pb-14 placeholder:whitespace-pre-wrap ${isParsed ? 'bg-slate-50 opacity-70 cursor-not-allowed' : ''}`}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={JSON_PLACEHOLDER}
                />
                {!isParsed && (
                <Button
                  onClick={handleJsonImport}
                  variant="default"
                  size="sm"
                  className="absolute bottom-3 right-3 font-bold text-xs flex items-center gap-2 shadow-md shadow-primary/30"
                >
                  <Sparkles size={14} />
                  Xử lý JSON
                </Button>
                )}
              </div>
            </div>
          </section>
          )}

          {/* Navigation Controls Card */}
          {isParsed && (
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
                  {activeQuestion.typeQuestion === 'group' && (
                    <Badge variant="danger" className="ml-1 bg-red-100 text-red-600 border border-red-200">Câu hỏi chùm</Badge>
                  )}
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ {totalQuestions}</span>
                </div>

                <button
                  onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                  disabled={currentIndex === totalQuestions - 1}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-100 shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center"
                  title="Câu sau"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => setCurrentIndex(totalQuestions - 1)}
                  disabled={currentIndex === totalQuestions - 1}
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
          )}

          {/* Shared Context Card */}
          {activeQuestion.typeQuestion === 'group' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-2 px-2 select-none">
                <FileText className="text-primary" size={18} />
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700">Câu hỏi chung</h2>
                <Badge variant="danger" className="ml-1 bg-red-100 text-red-600 border border-red-200">Câu hỏi chùm</Badge>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <div className="flex flex-col gap-4">
                  <div
                    onClick={() => handleImageUpload('sharedImage')}
                    className="relative group border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center min-h-[250px] hover:border-primary/50 transition-colors cursor-pointer overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px]"
                  >
                    {activeQuestion.sharedImage ? (
                      <img src={getImageUrl(activeQuestion.sharedImage)} className="object-contain max-h-[240px]" alt="Shared" />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="mx-auto text-4xl text-slate-300 group-hover:text-primary transition-colors mb-2" size={36} />
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ảnh dùng chung</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <TiptapEditor
                    placeholder="Nhập ngữ cảnh hoặc đoạn văn bản dùng chung cho các câu hỏi chùm..."
                    value={activeQuestion.sharedContext}
                    onValueChange={(content) => updateActiveQuestion({ sharedContext: content })}
                    className="h-full min-h-[250px]"
                  />
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Question Content Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-2 px-2 select-none">
                <HelpCircle className="text-primary" size={18} />
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700">Nội dung câu hỏi</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <div className="flex flex-col gap-4">
                  <div
                    onClick={() => handleImageUpload('questionImage')}
                    className="relative group border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center min-h-[250px] hover:border-primary/50 transition-colors cursor-pointer overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px]"
                  >
                    {activeQuestion.questionImage ? (
                      <img src={getImageUrl(activeQuestion.questionImage)} className="object-contain max-h-[240px]" alt="Question" />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="mx-auto text-5xl text-slate-300 group-hover:text-primary transition-colors mb-3" size={48} />
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Kéo thả hoặc Tải ảnh</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <TiptapEditor
                    placeholder="Nhập nội dung câu hỏi (hỗ trợ văn bản thường, công thức toán học LaTeX, v.v.)..."
                    value={activeQuestion.content}
                    onValueChange={(content) => updateActiveQuestion({ content })}
                    className="h-full min-h-[250px]"
                  />
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
                  onClick={() => updateActiveQuestion({ 
                    type: 'multiple-choice',
                    correctAnswer: ['A', 'B', 'C', 'D'].includes(activeQuestion.correctAnswer) ? activeQuestion.correctAnswer : 'A'
                  })}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeQuestion.type === 'multiple-choice' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  Trắc nghiệm
                </button>
                <button
                  onClick={() => updateActiveQuestion({ 
                    type: 'essay',
                    correctAnswer: ['A', 'B', 'C', 'D'].includes(activeQuestion.correctAnswer) ? "" : activeQuestion.correctAnswer
                  })}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeQuestion.type === 'essay' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
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
                      <div className={`flex-grow flex items-center rounded-xl px-5 py-2 transition-all border ${isCorrect
                        ? 'bg-blue-50/30 border-2 border-primary/40 ring-4 ring-primary/5'
                        : 'bg-slate-50 border-slate-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5'
                        }`}>
                        <span className={`font-bold mr-4 select-none ${isCorrect ? 'text-primary' : 'text-slate-400'}`}>
                          {optLabel}.
                        </span>
                        <TiptapEditor
                          value={optValue}
                          onValueChange={(content) => {
                            const updatedOpts = [...activeQuestion.options];
                            updatedOpts[index] = content;
                            updateActiveQuestion({ options: updatedOpts });
                          }}
                          placeholder={`Nhập đáp án ${optLabel}...`}
                          className={`bg-transparent border-none p-0 w-full focus-within:ring-0 focus-within:border-transparent shadow-none flex items-center ${isCorrect ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}
                          editorClassName="!min-h-0 prose-p:my-0"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col">
                <TiptapEditor
                  placeholder="Nhập kết quả của câu hỏi"
                  value={activeQuestion.correctAnswer}
                  onValueChange={(content) => updateActiveQuestion({ correctAnswer: content })}
                  className="min-h-[80px]"
                />
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
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <div className="flex flex-col gap-4">
                  <div
                    onClick={() => handleImageUpload('solutionImage')}
                    className="relative group border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center min-h-[250px] hover:border-primary/50 transition-colors cursor-pointer overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px]"
                  >
                    {activeQuestion.solutionImage ? (
                      <img src={getImageUrl(activeQuestion.solutionImage)} className="object-contain max-h-[240px]" alt="Solution" />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="mx-auto text-4xl text-slate-300 group-hover:text-primary transition-colors mb-2" size={36} />
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Ảnh minh họa lời giải</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <TiptapEditor
                    placeholder="Nhập lời giải chi tiết từng bước, phương pháp giải cụ thể..."
                    value={activeQuestion.solution}
                    onValueChange={(content) => updateActiveQuestion({ solution: content })}
                    className="h-full min-h-[250px]"
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
              
              {/* Field: Gợi ý */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 select-none">
                  <Lightbulb size={16} className="text-amber-500" /> Gợi ý
                </label>
                <TiptapEditor
                  placeholder="Nhập gợi ý cho học sinh (ví dụ: Sử dụng hằng đẳng thức a² - b²)..."
                  value={activeQuestion.hint}
                  onValueChange={(val) => updateActiveQuestion({ hint: val })}
                />
              </div>

              {/* Field: Mẹo giải nhanh */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 select-none">
                  <Rocket size={16} className="text-indigo-500" /> Mẹo giải nhanh
                </label>
                <TiptapEditor
                  placeholder="Nhập các mẹo giải bài nhanh (ví dụ: Bấm máy tính tìm nghiệm kép x = -b/2a)..."
                  value={activeQuestion.quickTip}
                  onValueChange={(val) => updateActiveQuestion({ quickTip: val })}
                />
              </div>

              {/* Field: Phương pháp tổng quát */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 select-none">
                  <Brain size={16} className="text-pink-500" /> Phương pháp tổng quát
                </label>
                <TiptapEditor
                  placeholder="Nhập phương pháp giải tổng quát cho dạng bài này..."
                  value={activeQuestion.generalMethod}
                  onValueChange={(val) => updateActiveQuestion({ generalMethod: val })}
                />
              </div>

              {/* Field: Các lỗi sai thường gặp */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 select-none">
                  <AlertCircle size={16} className="text-red-500" /> Các lỗi sai thường gặp
                </label>
                <TiptapEditor
                  placeholder="Nhập các lỗi sai học sinh thường mắc phải..."
                  value={activeQuestion.mistakes || ""}
                  onValueChange={(val) => updateActiveQuestion({ mistakes: val })}
                />
              </div>

            </div>
          </div>

          </div>
        ) : (!isEditMode && (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-center text-slate-500">Vui lòng nhập JSON hoặc sử dụng chế độ nhập thủ công để bắt đầu.</p>
            </div>
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
        ))}

        {/* Right Sidebar Column */}
        {(!isParsed && !isEditMode) ? null : (
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
                    value={activeQuestion.grade || ""}
                    onChange={(e) => {
                      const newGrade = e.target.value;
                      const newSubject = topicsByGrade[newGrade]?.[0] || "";
                      updateActiveQuestion({ grade: newGrade, subject: newSubject });
                    }}
                  >
                    <option value="" disabled hidden>Chọn khối lớp</option>
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
                    value={activeQuestion.subject || ""}
                    onChange={(e) => updateActiveQuestion({ subject: e.target.value })}
                  >
                    <option value="" disabled hidden>Chọn chuyên đề</option>
                    {topicsByGrade[activeQuestion.grade]?.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    )) || <option value="" disabled>Chưa có chuyên đề</option>}
                  </Select>
                </div>


                {/* Difficulty Buttons Grid */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-500 ml-1 select-none">Mức độ</label>
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

                {/* Điểm & Độ khó */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1 select-none">Điểm</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={activeQuestion.point !== undefined ? activeQuestion.point : 1.0}
                      onChange={(e) => updateActiveQuestion({ point: parseFloat(e.target.value) || 0 })}
                      placeholder="Ví dụ: 1.0"
                      className="py-3 px-4 text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1 select-none">Độ khó (0-10)</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={activeQuestion.difficultyPoint !== undefined ? activeQuestion.difficultyPoint : 0}
                      onChange={(e) => updateActiveQuestion({ difficultyPoint: parseFloat(e.target.value) || 0 })}
                      placeholder="Ví dụ: 5.5"
                      className="py-3 px-4 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Tags Manager */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-500 ml-1 select-none">Thẻ (Tags)</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeQuestion.tags.map((tag: string) => (
                      <Tag
                        key={tag}
                        label={tag}
                        onRemove={() => {
                          const filteredTags = activeQuestion.tags.filter((t: string) => t !== tag);
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

            {/* AI Insight banner */}
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
        )}

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

      {/* Math Portal Overlay Modal */}
      {mathModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-up flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-lg text-primary flex items-center justify-center">
                  <Keyboard size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Bàn phím ảo Toán học</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Sửa hoặc tạo công thức toán chuyên nghiệp</p>
                </div>
              </div>
              <button 
                onClick={() => setMathModalOpen(false)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 ml-1">Nhập công thức</label>
                <MathfieldInput
                  value={mathInputValue}
                  onChange={(val) => setMathInputValue(val)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveMathFromModal();
                    }
                  }}
                  placeholder="Nhập công thức Toán học của bạn ở đây..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Real-time Preview Area */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 ml-1">Xem trước công thức</label>
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 min-h-[100px] flex items-center justify-center overflow-x-auto bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:15px_15px]">
                  {mathInputValue.trim() ? (
                    <div className="text-center">
                      <Latex text={`$${mathInputValue}$`} className="text-lg text-slate-800 font-bold" />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic font-medium">Bắt đầu gõ để xem trước công thức...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Info size={14} className="text-primary" />
                Mẹo: Nhấn Enter để lưu
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMathModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-xs uppercase tracking-wider"
                >
                  Hủy bỏ
                </button>
                <Button
                  onClick={handleSaveMathFromModal}
                  variant="default"
                  className="shadow-md shadow-primary/20 px-6 py-2.5 flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
                >
                  <CheckCircle2 size={16} />
                  Lưu công thức
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
