'use client';

import React from 'react';
import { Save, FileDown, Eye, RefreshCw, Settings, Upload, Plus, School, BookOpen, FolderOpen, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { Collapsible } from '@/components/ui/Collapsible';
import { FloatingActionBar } from '@/components/ui/FloatingActionBar';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { Textarea } from '@/components/ui/Textarea';
import { Editor } from '@/components/ui/Editor';
import { Progress } from '@/components/ui/Progress';
import { TimerBadge } from '@/components/ui/TimerBadge';
import { OptionButton } from '@/components/ui/OptionButton';
import { QNode } from '@/components/ui/QNode';
import { X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash } from 'lucide-react';
import { mockQuestions } from '@/lib/mock-data';
import { ExamTable, ExamItem } from '@/components/questions/ExamTable';
import { UserTable, UserItem } from '@/components/users/UserTable';
import { cn } from '@/lib/utils';
import { UploadArea } from '@/components/ui/UploadArea';
import { OptionRadio } from '@/components/ui/OptionRadio';
import { NavigatorControls } from '@/components/ui/NavigatorControls';
import { Switch } from '@/components/ui/Switch';
import { AvatarGroup } from '@/components/ui/AvatarGroup';
import { StepItem } from '@/components/ui/StepItem';
import { LectureRowCard } from '@/components/ui/LectureRowCard';
import { InfoCard } from '@/components/ui/InfoCard';
import { ResultScoreGauge } from '@/components/ui/ResultScoreGauge';
import { QuestionMapButton } from '@/components/ui/QuestionMapButton';
import { AnswerOption } from '@/components/ui/AnswerOption';
import { HandwrittenPaper } from '@/components/ui/HandwrittenPaper';

export default function UILabPage() {
  const [selectedLabOpt, setSelectedLabOpt] = React.useState<string>('');
  const [selectedQs, setSelectedQs] = React.useState<string[]>([]);
  const [isBarOpen, setIsBarOpen] = React.useState<boolean>(false);

  const [tableTheme, setTableTheme] = React.useState<'amber' | 'blue'>('amber');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [actionLog, setActionLog] = React.useState<string>('Rê chuột lên dòng để thao tác hoặc đổi theme!');

  const [userCurrentPage, setUserCurrentPage] = React.useState<number>(1);
  const [userActionLog, setUserActionLog] = React.useState<string>('Click đổi mật khẩu, chỉnh sửa hoặc xóa dòng để test log!');
  const [loginActionLog, setLoginActionLog] = React.useState<string>('Thực hiện tương tác với các atoms đăng nhập để xem nhật ký!');

  // Section 9 State
  const [questionActionLog, setQuestionActionLog] = React.useState<string>('Thực hiện tương tác với các atoms Smart Question Creator để xem nhật ký!');
  const [activeDifficulty, setActiveDifficulty] = React.useState<string>('THÔNG HIỂU');
  const [tags, setTags] = React.useState<string[]>(['THPT Quốc gia', 'Khảo sát hàm số']);
  const [newTagInput, setNewTagInput] = React.useState<string>('');
  const [editorValue, setEditorValue] = React.useState<string>('Cho hàm số bậc hai $y = ax^2 + bx + c$ có đồ thị như hình vẽ bên. Tìm các giá trị của tham số $m$ để phương trình $|f(x)| = m$ có đúng 3 nghiệm thực phân biệt.');
  const [jsonText, setJsonText] = React.useState<string>(JSON.stringify([
    {
      "question": "Tính đạo hàm của y = x^2 + 1",
      "options": ["A. 2x", "B. x", "C. x^2", "D. 0"],
      "answer": "A"
    }
  ], null, 2));

  // Section 11 State (Bulk Question Import Simulator)
  const [bulkCurrentQ, setBulkCurrentQ] = React.useState<number>(1);
  const [bulkQuestions, setBulkQuestions] = React.useState<Array<{
    text: string;
    options: Record<string, string>;
    correctAnswer: string;
    difficulty: string;
  }>>([
    {
      text: "Cho hàm số bậc hai $y = ax^2 + bx + c$ có đồ thị như hình vẽ bên. Tìm các giá trị của tham số $m$ để phương trình $|f(x)| = m$ có đúng 3 nghiệm thực phân biệt.",
      options: { A: "m = 0", B: "m = 3", C: "m > 3", D: "0 < m < 3" },
      correctAnswer: "B",
      difficulty: "THÔNG HIỂU"
    },
    {
      text: "Tính đạo hàm của hàm số $y = x \\ln(x)$ trên khoảng $(0, +\\infty)$.",
      options: { A: "y' = \\ln(x) + 1", B: "y' = 1", C: "y' = \\ln(x)", D: "y' = \\frac{1}{x}" },
      correctAnswer: "A",
      difficulty: "NHẬN BIẾT"
    },
    {
      text: "Tìm giá trị lớn nhất của hàm số $f(x) = x^3 - 3x^2$ trên đoạn $[1, 4]$.",
      options: { A: "-4", B: "0", C: "16", D: "12" },
      correctAnswer: "C",
      difficulty: "VẬN DỤNG"
    },
    {
      text: "Có bao nhiêu giá trị nguyên của tham số $m$ để hàm số $y = \\frac{1}{3}x^3 - mx^2 + (m^2 - 4)x + 3$ đồng biến trên $\\mathbb{R}$?",
      options: { A: "3", B: "4", C: "5", D: "Vô số" },
      correctAnswer: "B",
      difficulty: "VẬN DỤNG CAO"
    },
    {
      text: "Tích phân $I = \\int_0^1 (2x + 1) e^x dx$ bằng:",
      options: { A: "e + 1", B: "2e - 1", C: "e - 1", D: "3e - 2" },
      correctAnswer: "A",
      difficulty: "THÔNG HIỂU"
    }
  ]);

  const handleOptionChange = (optionLetter: string) => {
    setBulkQuestions(prev => prev.map((q, idx) => {
      if (idx === bulkCurrentQ - 1) {
        return { ...q, correctAnswer: optionLetter };
      }
      return q;
    }));
    setQuestionActionLog(`[Simulator] Câu ${bulkCurrentQ}: Đổi đáp án đúng thành ${optionLetter}`);
  };

  const handleOptionTextChange = (optionLetter: string, text: string) => {
    setBulkQuestions(prev => prev.map((q, idx) => {
      if (idx === bulkCurrentQ - 1) {
        return {
          ...q,
          options: {
            ...q.options,
            [optionLetter]: text
          }
        };
      }
      return q;
    }));
  };

  const handleDifficultyChange = (diff: string) => {
    setBulkQuestions(prev => prev.map((q, idx) => {
      if (idx === bulkCurrentQ - 1) {
        return { ...q, difficulty: diff };
      }
      return q;
    }));
    setQuestionActionLog(`[Simulator] Câu ${bulkCurrentQ}: Đổi độ khó thành "${diff}"`);
  };

  // Section 12 State (Marketing Homepage Atoms Showcase)
  const [marketingSwitchChecked, setMarketingSwitchChecked] = React.useState<boolean>(false);
  const [marketingActionLog, setMarketingActionLog] = React.useState<string>('Thực hiện tương tác với các marketing atoms để xem nhật ký!');

  // Section 13 State (Lecture View Atoms Showcase)
  const [lectureActionLog, setLectureActionLog] = React.useState<string>('Thực hiện tương tác với các bài giảng atoms để xem nhật ký!');

  // Section 14 State (Test Result Atoms Showcase)
  const [resultActionLog, setResultActionLog] = React.useState<string>('Thực hiện tương tác với các kết quả bài thi atoms để xem nhật ký!');

  const handleQuestionDelete = () => {
    if (bulkQuestions.length <= 1) {
      alert("Không thể xóa câu hỏi duy nhất còn lại!");
      return;
    }
    const newQs = bulkQuestions.filter((_, idx) => idx !== bulkCurrentQ - 1);
    setBulkQuestions(newQs);
    setBulkCurrentQ(Math.max(1, bulkCurrentQ - 1));
    setQuestionActionLog(`[Simulator] Đã xóa Câu ${bulkCurrentQ}`);
  };

  const handleAddQuestion = () => {
    const newQ = {
      text: "Nhập nội dung câu hỏi mới...",
      options: { A: "Đáp án A", B: "Đáp án B", C: "Đáp án C", D: "Đáp án D" },
      correctAnswer: "A",
      difficulty: "THÔNG HIỂU"
    };
    setBulkQuestions([...bulkQuestions, newQ]);
    setBulkCurrentQ(bulkQuestions.length + 1);
    setQuestionActionLog(`[Simulator] Đã thêm câu hỏi nhỏ mới (Câu ${bulkQuestions.length + 1})`);
  };

  const mockExamItems: ExamItem[] = [
    {
      id: "exam1",
      name: "Kiểm tra Giữa kỳ I - Đại số 10",
      updatedText: "Cập nhật 2 giờ trước",
      grade: "10",
      questionsCount: 50,
      duration: "90 phút",
      status: "published",
      iconType: "calculate"
    },
    {
      id: "exam2",
      name: "Ôn tập Hình học Giải tích",
      updatedText: "Cập nhật Hôm qua",
      grade: "12",
      questionsCount: 35,
      duration: "60 phút",
      status: "draft",
      iconType: "square_foot"
    },
    {
      id: "exam3",
      name: "Kiểm tra 15p - Đạo hàm",
      updatedText: "Cập nhật 3 ngày trước",
      grade: "11",
      questionsCount: 20,
      duration: "15 phút",
      status: "ended",
      iconType: "timeline"
    },
    {
      id: "exam4",
      name: "Khảo sát năng lực đầu năm",
      updatedText: "Cập nhật 1 tuần trước",
      grade: "10",
      questionsCount: 40,
      duration: "60 phút",
      status: "published",
      iconType: "query_stats"
    }
  ];

  const mockUserItems: UserItem[] = [
    {
      id: "user1",
      name: "Nguyễn Văn An",
      email: "an.nguyen@student.edu.vn",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjkU3uLAVacqKFDVSrWvAchNgIwXaxak9xuK4XVCf4BYXd9yH9d5P8WTFxPrzYvQgBh_9qphd6ey_bGrjXTTvavr8JNB3vCobxaF9Xnu7IvK4VFNxuaHA4sBdKhkV4px-7l66gTHKkXV6JbFCAgoshfCRI_u_a7UoVbYZU2G0QB2fhUFkWf_Ea-gA28mwNyWwwlPzlJdnksvCWGRE1RuXYR8BtSFOwwMc7MqY06FeLavosHXYkcFJwvmkTCDgAUZPKTv2_h97XL5Eq",
      role: "student",
      grade: "Lớp 10A1",
      joinDate: "12/05/2023",
      status: "active",
      hasPulse: true
    },
    {
      id: "user2",
      name: "Trần Thị Bình",
      email: "binh.tt@mathed.vn",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOSjyIOZUILgfSFoipgpCmU0_sWtprapzUJJbdqDkjn993pE4NB53mid5rZJs6Jh8Glcwp-qtxU6OaXb4BP_Cp-2_G1axysKkjGbI_O8BIJ6xt2qN68UnWmJSvhIPK2Hm5ueRAmwQ4moMCUf9w6mH4X4A8Gt6c_l0l7tkcRP7j621vsKcoOapXa267OGqnkHgCHwu5-JpeunIpBaM3rMA82lpuZUBBqU3qNe-hNSuq8RzNuZ0gGZ-t5mDQIvdt4HXX5YfwHSMK7Syx",
      role: "teacher",
      grade: "Toán học",
      joinDate: "02/01/2023",
      status: "active",
      hasPulse: false
    },
    {
      id: "user3",
      name: "Lê Công Danh",
      email: "danh.lc@student.edu.vn",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0aPR0dT5v8nP-PM-39UXExh0YeHX4p-P5Yf-fTYseqh2z9e3ZVSZMuv6eJnZN98htW8MRDJX63P3A4kucTPhhRV2ijpuVeFWJdHypoGE_htNsXcrpgMtxm_w6ozo7vEzbPpgu2tyXge9TCd81g4DBX1006t5TrxBbUpKtOOklo7mtncO4MkvljV-9fV9ybu6IS9TtgXS6Bu_7Ad6D8HZzFLLDlXDYMVJ3_ZyCt7Oh_u9UYmXDQfuNQfrD7QnsbSeJcV1C9BFqHoBQ",
      role: "student",
      grade: "Lớp 11B2",
      joinDate: "15/08/2023",
      status: "locked",
      hasPulse: false
    },
    {
      id: "user4",
      name: "Phạm Minh Đức",
      email: "duc.pm@mathed.vn",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNJnqcgvB5CNg7alyy7McDAcMORJkg4mVGwQI6nCEmf6ecmSnfDCq1d7AaQ0nTTpEPUmsorr7TLX-VqkYh2-I0_Kg1wEYfgu-PVkJjJ4-WdKdevaJOHu3QPA1wXCPpQs-ruYP3ZTdhCQ4tw9o7QsWh_TYrmzVof7lY2xg_jD6UsGKAxM1HviTCLqlYjv11sWvC5Uav3Opt4b_y0e-Tv3-0LmPJwcokU8SkRlrRWkU6RfmYcWbOsiNf2GOZAQydxg10zspoI0TNepWW",
      role: "admin",
      grade: "—",
      joinDate: "20/12/2022",
      status: "active",
      hasPulse: false
    },
    {
      id: "user5",
      name: "Hoàng Thu Hà",
      email: "ha.ht@student.edu.vn",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu1qOUC95LwaE0AojL8_i2ICCv8vbM-6rrPNqraV43NeX9d5Wp9UHkwb17fJAbGCY9bwlKeE7j_MHiqCw6kYQvUhBnGj8TS3z3fbN3a5tHgxOHu_zPk3-9oz7Q7Gyo47P9sNRuin3goL1CLbT9-WlXHxeTKTzUlxoy91pfPQTyFZTGEMaUf7dUuYqFzxwU0QiqcEK9ZBMWMMqh8y1bLFIhIRvKrr7VqWy2sF6VtwbjfxF7Dvcdcp6-2KCzF9wj9t6LYcy1jiOcgqtT",
      role: "student",
      grade: "Lớp 12A3",
      joinDate: "10/11/2023",
      status: "active",
      hasPulse: false
    }
  ];

  const toggleQuestionSelection = (id: string) => {
    setSelectedQs(prev =>
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  React.useEffect(() => {
    setIsBarOpen(selectedQs.length > 0);
  }, [selectedQs]);

  return (
    <div className="max-w-[1440px] mx-auto p-8 space-y-12 bg-background-light min-h-screen text-slate-900 font-display pb-32">
      <div>
        <h1 className="text-3xl font-bold mb-6">UI Lab (Atomic Components)</h1>
        <p className="text-slate-500 mb-8">Kiểm thử giao diện các components Atomic trước khi ghép vào hệ thống.</p>
      </div>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">1. Buttons</h2>
        <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <Button variant="default">
            <Save size={18} />
            Lưu & Xuất bản
          </Button>
          <Button variant="secondary">
            <FileDown size={18} />
            Tải file PDF
          </Button>
          <Button variant="outline">
            <Eye size={18} />
            Xem hướng dẫn chấm
          </Button>
          <Button variant="outline-slate">
            <Upload size={18} />
            Nhập từ JSON
          </Button>
          <Button variant="default" className="shadow-md shadow-primary/20">
            <Plus size={18} />
            Tạo đề thi
          </Button>
          <Button variant="ghost">
            <RefreshCw size={18} />
            Đổi câu hỏi
          </Button>
          <Button variant="ghost-danger" size="icon" title="Xóa">
            <Trash2 size={18} />
          </Button>
          
          <div className="w-full mt-4 flex items-center gap-4 border-t pt-4 border-slate-100">
            <span className="text-sm font-semibold text-slate-500 w-24">Sizes:</span>
            <Button variant="default" size="sm">Small (sm)</Button>
            <Button variant="default" size="default">Default</Button>
            <Button variant="default" size="lg">Large (lg)</Button>
            <Button variant="outline" size="icon">
              <Settings size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Inputs & Selects */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">2. Inputs & Selects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 ml-1">Tên đề thi</label>
            <Input placeholder="Nhập tên đề thi..." defaultValue="Đề thi thử Toán THPTQG số 1" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 ml-1">Thời gian (phút)</label>
            <div className="relative">
              <Input type="number" defaultValue={90} className="pr-10" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Min</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 ml-1">Khối lớp</label>
            <Select>
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
            </Select>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">3. Badges (Generalized Semantic Variants)</h2>
        <div className="flex flex-wrap gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <Badge variant="default" size="md">Đã kiểm tra 48/50</Badge>
          <Badge variant="outline" size="md">A</Badge>
          
          <div className="w-full mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center">
            <span className="text-sm font-semibold text-slate-500 w-24">Tags (sm):</span>
            <Badge variant="primary" size="sm">LỚP 9 - GIẢI TÍCH</Badge>
            <Badge variant="success" size="sm">Nhận biết</Badge>
            <Badge variant="warning" size="sm">Thông hiểu</Badge>
            <Badge variant="danger" size="sm">Vận dụng cao</Badge>
          </div>
        </div>
      </section>

      {/* Checkboxes & Collapsibles */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">4. Checkboxes & Sidebar Collapsibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {/* Checkbox showcases */}
          <div className="space-y-4 border-r border-slate-100 pr-6">
            <h3 className="text-sm font-bold text-slate-700">Checkbox Atoms</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 text-sm cursor-pointer select-none">
                <Checkbox checkboxSize="sm" />
                <span>Small size checkbox (14px)</span>
              </label>
              <label className="flex items-center gap-3 text-sm cursor-pointer select-none">
                <Checkbox checkboxSize="md" defaultChecked />
                <span>Medium size checkbox (18px, checked)</span>
              </label>
            </div>
          </div>

          {/* Sidebar filters mockup using Collapsible and Checkbox */}
          <div className="md:col-span-2 space-y-4 pl-0 md:pl-6">
            <h3 className="text-sm font-bold text-slate-700">Sidebar Collapsible Filters Mockup</h3>
            <div className="w-72 border border-slate-100 rounded-xl bg-slate-50/50 p-3 space-y-3">
              <Collapsible title="Khối lớp" icon={<School className="h-4 w-4" />} open>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <Checkbox checkboxSize="sm" /> Lớp 6
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <Checkbox checkboxSize="sm" /> Lớp 7
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <Checkbox checkboxSize="sm" /> Lớp 8
                </label>
              </Collapsible>

              <Collapsible title="Môn học" icon={<BookOpen className="h-4 w-4" />} open>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <Checkbox checkboxSize="sm" /> Đại số
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <Checkbox checkboxSize="sm" /> Hình học
                </label>
              </Collapsible>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">5. Cards (Interactive Selection)</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-7xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Câu hỏi 1 (Click để chọn câu hỏi)</h3>
              <Button
                variant="outline-slate"
                size="sm"
                onClick={() => toggleQuestionSelection(mockQuestions[0].id)}
              >
                {selectedQs.includes(mockQuestions[0].id) ? 'Bỏ chọn' : 'Chọn câu'}
              </Button>
            </div>
            <QuestionCard 
              question={mockQuestions[0]} 
              mode="teacher" 
              onRegenerate={(qId) => console.log('Regenerated question: ', qId)} 
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Câu hỏi 2 (Click để chọn câu hỏi)</h3>
              <Button
                variant="outline-slate"
                size="sm"
                onClick={() => toggleQuestionSelection(mockQuestions[1].id)}
              >
                {selectedQs.includes(mockQuestions[1].id) ? 'Bỏ chọn' : 'Chọn câu'}
              </Button>
            </div>
            <QuestionCard 
              question={mockQuestions[1]} 
              mode="student" 
              selectedOptionId={selectedLabOpt}
              onOptionSelect={(qId, optId) => setSelectedLabOpt(optId)}
            />
          </div>
        </div>
      </section>

      {/* 6. Exam Bank Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-2">
          <h2 className="text-xl font-bold">6. Exam Bank Table (Interactive & Multi-Theme)</h2>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setTableTheme('amber')}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                tableTheme === 'amber' ? "bg-amber-700 text-white shadow-sm" : "text-slate-500 hover:text-amber-700 dark:hover:text-amber-400"
              )}
            >
              Amber Theme
            </button>
            <button
              onClick={() => setTableTheme('blue')}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                tableTheme === 'blue' ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
              )}
            >
              Blue Theme
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span><strong>Trạng thái tương tác:</strong> {actionLog}</span>
            {actionLog !== 'Rê chuột lên dòng để thao tác hoặc đổi theme!' && (
              <button 
                onClick={() => setActionLog('Rê chuột lên dòng để thao tác hoặc đổi theme!')}
                className="text-[10px] uppercase font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                Xóa Log
              </button>
            )}
          </div>

          <ExamTable
            exams={mockExamItems}
            currentPage={currentPage}
            totalPages={39}
            totalItems={156}
            itemsPerPage={4}
            theme={tableTheme}
            onPageChange={(page) => {
              setCurrentPage(page);
              setActionLog(`Đã click chuyển sang Trang ${page}`);
            }}
            onShare={(exam) => setActionLog(`Đã Click [Chia sẻ] đề thi: "${exam.name}" (ID: ${exam.id})`)}
            onCopy={(exam) => setActionLog(`Đã Click [Nhân bản] đề thi: "${exam.name}" (ID: ${exam.id})`)}
            onEdit={(exam) => setActionLog(`Đã Click [Chỉnh sửa] đề thi: "${exam.name}" (ID: ${exam.id})`)}
            onDelete={(exam) => setActionLog(`Đã Click [Xóa] đề thi: "${exam.name}" (ID: ${exam.id})`)}
          />
        </div>
      </section>

      {/* 7. User Administration Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-2">
          <h2 className="text-xl font-bold">7. User Administration Table (Extraction & Generalization)</h2>
          <span className="text-xs text-slate-500">Trích xuất pixel-perfect từ tệp code.html mẫu</span>
        </div>

        <div className="space-y-4">
          <div className="text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span><strong>Nhật ký thao tác bảng:</strong> {userActionLog}</span>
            {userActionLog !== 'Click đổi mật khẩu, chỉnh sửa hoặc xóa dòng để test log!' && (
              <button 
                onClick={() => setUserActionLog('Click đổi mật khẩu, chỉnh sửa hoặc xóa dòng để test log!')}
                className="text-[10px] uppercase font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                Xóa Log
              </button>
            )}
          </div>

          <UserTable
            users={mockUserItems}
            currentPage={userCurrentPage}
            totalPages={125}
            totalItems={1248}
            itemsPerPage={5}
            onPageChange={(page) => {
              setUserCurrentPage(page);
              setUserActionLog(`Đã chuyển sang Trang ${page}`);
            }}
            onResetPassword={(user) => setUserActionLog(`Đã Click [Đổi mật khẩu] của: "${user.name}" (${user.email})`)}
            onEdit={(user) => setUserActionLog(`Đã Click [Chỉnh sửa] thông tin của: "${user.name}"`)}
            onDelete={(user) => setUserActionLog(`Đã Click [Xóa] người dùng: "${user.name}"`)}
          />
        </div>
      </section>

      {/* 8. Login Page Atoms */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-2">
          <h2 className="text-xl font-bold">8. Login Page Atomic UI Components (Extracted & Generalized)</h2>
          <span className="text-xs text-slate-500">Trích xuất pixel-perfect từ tệp login code.html mẫu</span>
        </div>

        <div className="space-y-4">
          <div className="text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span><strong>Nhật ký tương tác Atoms:</strong> {loginActionLog}</span>
            {loginActionLog !== 'Thực hiện tương tác với các atoms đăng nhập để xem nhật ký!' && (
              <button 
                onClick={() => setLoginActionLog('Thực hiện tương tác với các atoms đăng nhập để xem nhật ký!')}
                className="text-[10px] uppercase font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                Xóa Log
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700">Inputs & PasswordInputs (Login style)</h3>
              
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Họ và Tên (variant="login")</label>
                <Input 
                  variant="login" 
                  placeholder="Nhập họ và tên của bạn" 
                  onChange={(e) => setLoginActionLog(`Tên thay đổi: "${e.target.value}"`)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Số điện thoại hoặc Email (variant="login")</label>
                <Input 
                  variant="login" 
                  placeholder="Nhập email hoặc số điện thoại" 
                  onChange={(e) => setLoginActionLog(`Identity thay đổi: "${e.target.value}"`)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">Mật khẩu (PasswordInput variant="login")</label>
                <PasswordInput 
                  variant="login" 
                  placeholder="••••••••" 
                  onChange={(e) => setLoginActionLog(`Mật khẩu thay đổi: (độ dài ${e.target.value.length})`)}
                />
              </div>
            </div>

            <div className="space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-4">Button & Social Actions</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-400">Nút Đăng nhập chính (size="lg" + shadow)</label>
                    <Button 
                      variant="default"
                      className="w-full font-bold py-[1rem] h-auto shadow-lg shadow-primary/20 text-[1.125rem]"
                      onClick={() => setLoginActionLog('Đã Click nút [Đăng nhập]')}
                    >
                      Đăng nhập
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-400">Nút Đăng nhập qua mạng xã hội (Google Style)</label>
                    <Button 
                      variant="outline-slate"
                      className="w-full flex items-center justify-center gap-[0.75rem] px-[1rem] py-[0.875rem] h-auto rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-all duration-300 group"
                      onClick={() => setLoginActionLog('Đã Click [Google Social Login]')}
                    >
                      <svg className="w-[1.25rem] h-[1.25rem] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                      </svg>
                      <span className="text-[0.875rem] font-semibold text-slate-700">Google</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Smart Question Creator Atoms */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-2">
          <h2 className="text-xl font-bold">9. Smart Question Creator Atomic UI Components (Extracted & Generalized)</h2>
          <span className="text-xs text-slate-500">Trích xuất pixel-perfect từ tệp code.html Thêm câu hỏi hàng loạt</span>
        </div>

        <div className="space-y-4">
          <div className="text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span><strong>Nhật ký tương tác Atoms:</strong> {questionActionLog}</span>
            {questionActionLog !== 'Thực hiện tương tác với các atoms Smart Question Creator để xem nhật ký!' && (
              <button 
                onClick={() => setQuestionActionLog('Thực hiện tương tác với các atoms Smart Question Creator để xem nhật ký!')}
                className="text-[10px] uppercase font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                Xóa Log
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side: Badges, Buttons, Textareas */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              {/* Badges Showcase */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700">Atomic Badges (Mockup variants)</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Red Outline Badge</span>
                    <Badge variant="red-outline">Câu hỏi chùm</Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Blue Filled Badge</span>
                    <Badge variant="blue-filled">Thông minh</Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Default Badges</span>
                    <div className="flex gap-2">
                      <Badge variant="primary">Khối 12</Badge>
                      <Badge variant="success">Hoàn thành</Badge>
                    </div>
                  </div>
                </div>

                {/* Removable Pill Badges */}
                <div className="space-y-2 pt-2">
                  <span className="block text-xs font-semibold text-slate-500">Thẻ (Removable Pill Badges)</span>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span 
                        key={tag}
                        className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest"
                      >
                        {tag}
                        <button 
                          onClick={() => {
                            setTags(tags.filter(t => t !== tag));
                            setQuestionActionLog(`Đã xóa thẻ: "${tag}"`);
                          }}
                          className="hover:text-blue-800 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative max-w-[280px] pt-1">
                    <Input 
                      placeholder="Thêm thẻ mới..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTagInput.trim()) {
                          if (!tags.includes(newTagInput.trim())) {
                            setTags([...tags, newTagInput.trim()]);
                            setQuestionActionLog(`Đã thêm thẻ mới: "${newTagInput.trim()}"`);
                          }
                          setNewTagInput('');
                        }
                      }}
                      className="py-2 pl-3 pr-8 text-xs font-medium"
                    />
                    <span 
                      onClick={() => {
                        if (newTagInput.trim()) {
                          if (!tags.includes(newTagInput.trim())) {
                            setTags([...tags, newTagInput.trim()]);
                            setQuestionActionLog(`Đã thêm thẻ mới: "${newTagInput.trim()}"`);
                          }
                          setNewTagInput('');
                        }
                      }}
                      className="absolute right-2.5 top-[14px] text-slate-400 hover:text-primary cursor-pointer transition-colors"
                    >
                      <Plus size={16} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Difficulty Buttons */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700">Difficulty Buttons (Grid variants)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['NHẬN BIẾT', 'THÔNG HIỂU', 'VẬN DỤNG', 'VẬN DỤNG CAO'].map((diff) => (
                    <Button
                      key={diff}
                      variant={activeDifficulty === diff ? 'difficulty-active' : 'difficulty-inactive'}
                      onClick={() => {
                        setActiveDifficulty(diff);
                        setQuestionActionLog(`Thay đổi độ khó thành: "${diff}"`);
                      }}
                    >
                      {diff}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Circle Add Button */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-500">Nút thêm tròn (Circular Add Button)</span>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="circle"
                    size="circle"
                    onClick={() => setQuestionActionLog('Đã Click [Thêm câu hỏi nhỏ mới]')}
                    title="Thêm câu hỏi nhỏ mới"
                  >
                    <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                  </Button>
                  <span className="text-xs text-slate-400">Click nút để test xoay hiệu ứng chuyển động nhóm</span>
                </div>
              </div>
            </div>

            {/* Right Side: Textareas, ContentEditable Editor */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              {/* Textarea Showcase */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700">Atomic Textarea (Mono variant)</h3>
                  <button 
                    onClick={() => {
                      try {
                        JSON.parse(jsonText);
                        setQuestionActionLog('Kiểm tra cú pháp JSON: OK!');
                        alert('Xử lý cú pháp JSON hoàn toàn hợp lệ!');
                      } catch (e) {
                        setQuestionActionLog('Kiểm tra cú pháp JSON: LỖI CÚ PHÁP!');
                        alert('Cú pháp JSON không hợp lệ. Vui lòng kiểm tra lại dấu đóng mở ngoặc!');
                      }
                    }}
                    className="text-xs font-bold text-primary hover:underline uppercase cursor-pointer"
                  >
                    Xử lý JSON
                  </button>
                </div>
                <Textarea 
                  variant="mono"
                  rows={4}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder='[{"question": "...", "options": [...], "answer": "A"}]'
                />
              </div>

              {/* Editor Showcase */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700">Atomic Editor (ContentEditable)</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {editorValue.replace(/<[^>]*>/g, '').length} KÝ TỰ
                  </span>
                </div>
                <Editor 
                  placeholder="Nhập nội dung câu hỏi hoặc công thức toán học..."
                  value={editorValue}
                  onValueChange={(content) => {
                    setEditorValue(content);
                    setQuestionActionLog(`Nội dung Editor thay đổi (độ dài HTML: ${content.length})`);
                  }}
                  className="min-h-[140px]"
                />
                <span className="block text-[10px] text-slate-400 font-medium">
                  Hỗ trợ công thức toán học LaTeX thông qua thẻ $...$ hoặc các công cụ soạn thảo trực quan.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Bar */}
      <FloatingActionBar
        selectedCount={selectedQs.length}
        isOpen={isBarOpen}
        onClear={() => setSelectedQs([])}
        actions={[
          {
            label: 'Lưu vào thư mục',
            icon: <FolderOpen className="h-3.5 w-3.5" />,
            onClick: () => alert(`Đang lưu ${selectedQs.length} câu hỏi...`)
          },
          {
            label: 'In đề thi',
            icon: <Printer className="h-3.5 w-3.5" />,
            onClick: () => alert(`Đang in ${selectedQs.length} câu hỏi...`)
          },
          {
            label: 'Xóa hàng loạt',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            variant: 'ghost-danger',
            onClick: () => {
              alert(`Đang xóa ${selectedQs.length} câu hỏi...`);
              setSelectedQs([]);
            }
          }
        ]}
      />

      {/* SECTION 10: Exam Interface Atoms */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="bg-primary/10 text-primary p-2 rounded-lg">10</span>
          Exam Interface Atoms (Giao diện Làm Bài Thi)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <h3 className="font-semibold text-slate-700">TimerBadge & Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-4">
                <TimerBadge timeString="15:00" />
                <TimerBadge timeString="00:30" isPulsing={false} className="border-red-300 bg-red-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Tiến độ hoàn thành: 8/10 câu</span>
                  <span>80%</span>
                </div>
                <Progress value={80} />
              </div>
            </div>
            
            <h3 className="font-semibold text-slate-700 pt-4">MathButton (Variant math)</h3>
            <div className="flex flex-wrap gap-2 bg-slate-50 p-4 border border-slate-200 rounded-lg">
              <Button variant="math" size="math">√</Button>
              <Button variant="math" size="math">π</Button>
              <Button variant="math" size="math">Δ</Button>
              <Button variant="math" size="math">⊥</Button>
              <Button variant="math" size="math">∠</Button>
              <Button variant="math" size="math">x²</Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            <h3 className="font-semibold text-slate-700">OptionButton</h3>
            <div className="space-y-3">
              <OptionButton letter="A" content="x = 2; x = 3" selected={true} />
              <OptionButton letter="B" content="x = -2; x = -3" />
            </div>

            <h3 className="font-semibold text-slate-700 pt-4">QNode (Bản đồ câu hỏi)</h3>
            <div className="grid grid-cols-5 gap-3 p-4 bg-slate-50 rounded-lg">
              <QNode number={1} status="done" />
              <QNode number={2} status="current" />
              <QNode number={3} status="flagged" />
              <QNode number={4} status="unfinished" />
              <QNode number={5} status="done" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: Bulk Question Creator Atoms & Simulator */}
      <section className="mb-24 space-y-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="bg-primary/10 text-primary p-2 rounded-lg">11</span>
          Smart Question Creator Atoms (Thêm Câu Hỏi Hàng Loạt)
        </h2>

        {/* Standalone Atoms Showcase */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-700">11.1 Các Component Atoms Mới Trích Xuất (Mẫu chuẩn)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* UploadArea Showcase */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">UploadArea (Atom kéo thả ảnh)</span>
              <UploadArea 
                label="Kéo thả hoặc Tải ảnh" 
                minHeight="min-h-[160px]"
                onFileSelect={(file) => setQuestionActionLog(`[UploadArea Showcase] Tệp đã chọn: ${file ? file.name : 'Không có'}`)}
              />
            </div>

            {/* OptionRadio Showcase */}
            <div className="space-y-2 flex flex-col justify-between">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">OptionRadio (Lựa chọn trắc nghiệm)</span>
              <div className="space-y-3">
                <OptionRadio 
                  letter="A" 
                  value="m = 3 (Checked)" 
                  checked={true} 
                  onChange={(val) => setQuestionActionLog(`[OptionRadio Showcase A] Checked: ${val}`)}
                />
                <OptionRadio 
                  letter="B" 
                  value="m = 0 (Unchecked)" 
                  checked={false} 
                  onChange={(val) => setQuestionActionLog(`[OptionRadio Showcase B] Checked: ${val}`)}
                />
              </div>
            </div>

            {/* NavigatorControls Showcase */}
            <div className="space-y-2 flex flex-col justify-center">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">NavigatorControls (Thanh điều hướng chùm)</span>
              <NavigatorControls 
                currentQuestion={1} 
                totalQuestions={12} 
                onFirst={() => setQuestionActionLog('[Navigator Showcase] Về đầu')}
                onPrev={() => setQuestionActionLog('[Navigator Showcase] Về trước')}
                onNext={() => setQuestionActionLog('[Navigator Showcase] Sang sau')}
                onLast={() => setQuestionActionLog('[Navigator Showcase] Về cuối')}
                onDelete={() => setQuestionActionLog('[Navigator Showcase] Click xóa')}
              />
            </div>
          </div>
        </div>

        {/* Full Simulator */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">
              11.2 Trình Mô Phỏng Giao Diện Thêm Câu Hỏi Chùm (Interactive Workspace)
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Active: Câu {bulkCurrentQ} / {bulkQuestions.length}
            </span>
          </div>

          {/* Simulated Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-slate-50/50 p-6 rounded-3xl border border-slate-200 shadow-inner">
            
            {/* Main Area: col-span-8 */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Quick JSON parser card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-primary text-xl">code</span>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Nhập nhanh bằng JSON</h4>
                    <Badge variant="blue-filled">Thông minh</Badge>
                  </div>
                </div>
                <div className="relative">
                  <Textarea 
                    variant="mono" 
                    rows={3} 
                    className="pb-12"
                    defaultValue={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder='[{"question": "...", "options": [...], "answer": "A"}, ...]'
                  />
                  <Button 
                    variant="default"
                    size="sm"
                    className="absolute bottom-3 right-3 shadow-md shadow-primary/30 text-xs py-2 px-4"
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(jsonText);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                          const newQs = parsed.map(item => ({
                            text: item.question || "Nội dung câu hỏi...",
                            options: {
                              A: item.options?.[0] || "Đáp án A",
                              B: item.options?.[1] || "Đáp án B",
                              C: item.options?.[2] || "Đáp án C",
                              D: item.options?.[3] || "Đáp án D",
                            },
                            correctAnswer: item.answer || "A",
                            difficulty: "THÔNG HIỂU"
                          }));
                          setBulkQuestions(newQs);
                          setBulkCurrentQ(1);
                          setQuestionActionLog(`[JSON Process] Thành công nạp ${newQs.length} câu hỏi mới!`);
                        } else {
                          alert("Dữ liệu JSON phải là một mảng danh sách câu hỏi!");
                        }
                      } catch (e) {
                        alert("Lỗi cú pháp JSON. Vui lòng kiểm tra lại cấu trúc ngoặc!");
                      }
                    }}
                  >
                    Xử lý JSON
                  </Button>
                </div>
              </div>

              {/* Navigator pagination */}
              <NavigatorControls 
                currentQuestion={bulkCurrentQ}
                totalQuestions={bulkQuestions.length}
                onFirst={() => setBulkCurrentQ(1)}
                onPrev={() => setBulkCurrentQ(Math.max(1, bulkCurrentQ - 1))}
                onNext={() => setBulkCurrentQ(Math.min(bulkQuestions.length, bulkCurrentQ + 1))}
                onLast={() => setBulkCurrentQ(bulkQuestions.length)}
                onDelete={handleQuestionDelete}
              />

              {/* Question Editor Content Card */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 px-2">
                    <span className="material-icons-outlined text-primary text-xl">quiz</span>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700">Nội dung câu hỏi {bulkCurrentQ}</h2>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hỗ trợ LaTeX ($...$)</span>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Left: upload area */}
                    <UploadArea 
                      label="Kéo thả hoặc Tải ảnh câu hỏi"
                      minHeight="min-h-[220px]"
                      onFileSelect={(file) => setQuestionActionLog(`[Simulator Q${bulkCurrentQ}] File ảnh câu hỏi: ${file ? file.name : 'Đã xóa'}`)}
                    />
                    
                    {/* Right: text editing */}
                    <div className="flex flex-col">
                      <Editor 
                        value={bulkQuestions[bulkCurrentQ - 1]?.text || ''}
                        onValueChange={(content) => {
                          setBulkQuestions(prev => prev.map((q, idx) => {
                            if (idx === bulkCurrentQ - 1) {
                              return { ...q, text: content };
                            }
                            return q;
                          }));
                        }}
                        className="flex-grow min-h-[220px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Answers block */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-icons-outlined text-primary">task_alt</span>
                    Nhập đáp án lựa chọn trắc nghiệm
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Tích chọn radio để xác định đáp án đúng</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['A', 'B', 'C', 'D'].map((letter) => (
                    <OptionRadio 
                      key={letter}
                      letter={letter}
                      value={bulkQuestions[bulkCurrentQ - 1]?.options[letter] || ''}
                      checked={bulkQuestions[bulkCurrentQ - 1]?.correctAnswer === letter}
                      onChange={() => handleOptionChange(letter)}
                      onTextChange={(val) => handleOptionTextChange(letter, val)}
                    />
                  ))}
                </div>
              </div>

              {/* Circular plus button to add small question */}
              <div className="flex justify-center">
                <Button 
                  variant="circle"
                  size="circle"
                  onClick={handleAddQuestion}
                  title="Thêm câu hỏi nhỏ mới vào chùm"
                >
                  <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </Button>
              </div>

            </div>

            {/* Sidebar Configurations: col-span-4 */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Question Config Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b pb-3 flex items-center gap-2">
                  <span className="material-icons-outlined text-primary">settings</span>
                  Thiết lập câu hỏi
                </h4>

                <div className="space-y-4">
                  {/* Select class */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Khối lớp</label>
                    <Select defaultValue="12">
                      <option value="10">Khối 10</option>
                      <option value="11">Khối 11</option>
                      <option value="12">Khối 12</option>
                    </Select>
                  </div>

                  {/* Select Topic */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Chuyên đề</label>
                    <Select defaultValue="hamsodothi">
                      <option value="hamsodothi">Hàm số & Đồ thị</option>
                      <option value="hinhkhonggian">Hình học không gian</option>
                      <option value="sophuc">Số phức</option>
                      <option value="tichphan">Đạo hàm & Tích phân</option>
                    </Select>
                  </div>

                  {/* Difficulty selector */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Độ khó câu {bulkCurrentQ}</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['NHẬN BIẾT', 'THÔNG HIỂU', 'VẬN DỤNG', 'VẬN DỤNG CAO'].map((diff) => (
                        <Button
                          key={diff}
                          variant={bulkQuestions[bulkCurrentQ - 1]?.difficulty === diff ? 'difficulty-active' : 'difficulty-inactive'}
                          onClick={() => handleDifficultyChange(diff)}
                          className="py-3 text-[9px]"
                        >
                          {diff}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guidance helper tip card */}
              <div className="bg-blue-500/5 border border-primary/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-primary text-xl">auto_fix_high</span>
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Smart Helper</h5>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Mô phỏng sử dụng các Atoms chuẩn mực. Hãy thử điều hướng giữa các câu hỏi bằng Navigator, thay đổi văn bản đáp án trắc nghiệm hoặc tải ảnh nháp để chứng kiến sự tương tác mượt mà!
                </p>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* SECTION 12: Marketing Homepage Atoms Showcase */}
      <section className="mb-24 space-y-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="bg-primary/10 text-primary p-2 rounded-lg">12</span>
          Marketing Homepage Atoms Showcase (Trang Chủ Marketing)
        </h2>

        {/* Action Log for Section 12 */}
        <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs flex items-center justify-between shadow-md">
          <span className="text-amber-400"># Action Logger:</span>
          <span>{marketingActionLog}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Buttons Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-700 border-b pb-3">12.1 Các Loại Button Atoms Mới</h3>
            
            <div className="space-y-4">
              {/* Pill Navigation Buttons */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Pill Buttons (Thanh Điều Hướng)</span>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="pill-primary" 
                    size="pill"
                    onClick={() => setMarketingActionLog("Click: Pill Primary ('Học ngay')")}
                  >
                    Học ngay
                  </Button>
                  <Button 
                    variant="pill-outline" 
                    size="pill"
                    onClick={() => setMarketingActionLog("Click: Pill Outline ('Đăng nhập')")}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>

              {/* Large Hero Buttons */}
              <div className="space-y-2 pt-2">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Large Buttons (Hero Section)</span>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="large-primary" 
                    size="large"
                    className="flex items-center gap-2"
                    onClick={() => setMarketingActionLog("Click: Large Primary ('Bắt đầu miễn phí')")}
                  >
                    Bắt đầu miễn phí
                    <span className="material-icons">arrow_forward</span>
                  </Button>
                  <Button 
                    variant="large-outline" 
                    size="large"
                    onClick={() => setMarketingActionLog("Click: Large Outline ('Xem demo')")}
                  >
                    Xem demo
                  </Button>
                </div>
              </div>

              {/* Pricing Cards Buttons */}
              <div className="space-y-2 pt-2">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Pricing Action Buttons (Thẻ Bảng Giá)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    variant="pricing-outline" 
                    size="pricing"
                    onClick={() => setMarketingActionLog("Click: Pricing Outline ('Đăng ký ngay')")}
                  >
                    Đăng ký ngay
                  </Button>
                  <Button 
                    variant="pricing-primary" 
                    size="pricing"
                    onClick={() => setMarketingActionLog("Click: Pricing Primary ('Nâng cấp Pro ngay')")}
                  >
                    Nâng cấp Pro ngay
                  </Button>
                </div>
              </div>

              {/* Floating Action Button */}
              <div className="space-y-2 pt-2">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Floating Action Button (Nút Trợ Giúp AI)</span>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="fab" 
                    size="fab"
                    onClick={() => setMarketingActionLog("Click: FAB Trợ lý AI")}
                  >
                    <span className="material-icons text-3xl">auto_awesome</span>
                  </Button>
                  <span className="text-xs text-slate-400 font-semibold italic">Ấn vào nút Tròn AI ở góc để kích hoạt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Switches, Avatars & Badges */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-sm font-bold text-slate-700 border-b pb-3">12.2 Switch, Avatar Group & Badge Atoms</h3>

            {/* Toggle Switch */}
            <div className="space-y-3">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Switch (Billing Toggle: Hàng tháng / Hàng năm)</span>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className={cn("text-xs font-bold transition-all", !marketingSwitchChecked ? "text-primary" : "text-slate-400 uppercase")}>Hàng tháng</span>
                <Switch 
                  checked={marketingSwitchChecked}
                  onChange={(checked) => {
                    setMarketingSwitchChecked(checked);
                    setMarketingActionLog(`Switch toggled: ${checked ? "Hàng năm (Tiết kiệm 20%)" : "Hàng tháng"}`);
                  }}
                />
                <span className={cn("text-xs font-bold transition-all", marketingSwitchChecked ? "text-primary" : "text-slate-400 uppercase")}>
                  Hàng năm <span className="text-primary/80 font-black">(Tiết kiệm 20%)</span>
                </span>
              </div>
            </div>

            {/* Avatar Group */}
            <div className="space-y-3">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">AvatarGroup (Danh sách học sinh tin dùng)</span>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <AvatarGroup 
                  avatars={[
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCkg2j1eQxe8m9S3Yhptdh96e6OUu_RZ-rwmBhDF5piZGVUws4S2-y8OF4EikVbhklBkU9IB6_9GrPb1F8AOblKwxq1FGUtKjOydvTMfYkLsYVL5Ape6mJ27plYyHP47fJpwLrAgtbxy-AcoLBDCdh8xGSsrd7xTjlV0zcF9QaEaTtotCSe8Cy5J_XO3WCCTnMNKNQVrXIEsl5uhPYsnSmcVzYxjUjCdwkDZNfXOkSV9HTD8QvdaxO63ZhfE0ZV4GcHm8pxX3tMEMZm",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCLLhO8u-iBzfHpy648Tt1cNuk7COYKl_yWeI7H15Y31w-DcTYEKRakeXWZPldOxjwFG6-H0FYqimLhGecYjcHLbxvGP1fnwbrHHM45u-7WeBDYBckxr5GSkWUFxLoS7nzWogEP1Ni45cd8_g-alCnQuUDJ6EnB7uPUZkEFT3h1qj10GKXTuylWvrQPEwIuX-g13g_x2YffKW2IwtKt2rI3gPnTIvbqOiTERMeO10H7Rb429QwrhIm1DlRzauvGXW037bu7r-dOYBMn",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCnYWjVSOz64s5rTjt6fGCdrHutCZKy1q7_5jx4c49sXHt8goVaMj6OWXpUwi6ZuHKiJ8QNHjRXAE0DB-NPoGp7rEkKoKmOuhufMb2fWjFXhJ5gFQR53hxiFRuL-GwXxaSVTkQqWaiqmF4_vZbFw0ioWqKnNkQZNkClbgxO3q61rU1zMOUxTlC725DMg8pmvOf5yWd0XAin_obayiDvbShW1z7kIr49gWci08wSSe4ScepETs6bRMDNJCIGGbj5KdTYxKrLty62xdsg"
                  ]}
                  totalLabel="+100k"
                  text="100,000+ Học sinh tin dùng trên toàn quốc"
                  onClick={() => setMarketingActionLog("Clicked: Avatar Group")}
                />
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-3">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Badges (Huy hiệu & Nhãn)</span>
              <div className="flex flex-wrap gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 items-center justify-around">
                {/* Pulsing Dot badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">AI-Powered Math Tutoring</span>
                </div>

                {/* Selected banner badge */}
                <div className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  Được chọn nhiều nhất
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 13: Lecture View Atoms Showcase */}
      <section className="mb-24 space-y-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="bg-primary/10 text-primary p-2 rounded-lg">13</span>
          Lecture View Atoms Showcase (Chi Tiết Bài Giảng)
        </h2>

        {/* Action Log for Section 13 */}
        <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs flex items-center justify-between shadow-md">
          <span className="text-amber-400"># Action Logger:</span>
          <span>{lectureActionLog}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: StepItem (Timeline) Showcase (Col Span 7) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-700 border-b pb-3">13.1 StepItem Atoms (Quy trình giải mẫu)</h3>
            
            <div className="space-y-2">
              <StepItem 
                stepNumber={1} 
                title="Tính diện tích đáy B (Tam giác ABC)"
                onClick={() => setLectureActionLog("Clicked: Bước 1 (Tính diện tích đáy)")}
                className="cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
              >
                <p>Vì ABC là tam giác đều cạnh a nên diện tích đáy được tính theo công thức:</p>
                <p className="mt-2 font-bold text-primary latex-font">B = S_ABC = (a²√3) / 4</p>
              </StepItem>

              <StepItem 
                stepNumber={2} 
                title="Xác định chiều cao h"
                onClick={() => setLectureActionLog("Clicked: Bước 2 (Xác định chiều cao)")}
                className="cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
              >
                <p>Theo giả thiết SA ⊥ (ABC), suy ra chiều cao h = SA = a√3.</p>
              </StepItem>

              <StepItem 
                stepNumber={3} 
                title="Áp dụng công thức tính thể tích"
                isLast
                onClick={() => setLectureActionLog("Clicked: Bước 3 (Áp dụng công thức)")}
                className="cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
              >
                <p>V = 1/3 . B . h = 1/3 . (a²√3 / 4) . a√3 = a³/4.</p>
                <p className="mt-2 font-bold text-green-600">Kết luận: Thể tích khối chóp là a³/4.</p>
              </StepItem>
            </div>
          </div>

          {/* Column 2: Side Cards, Badges & Action Buttons (Col Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Action Buttons */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-3">13.2 Sidebar Action Buttons</h3>
              
              <Button 
                variant="action-primary" 
                size="action"
                className="flex items-center justify-center gap-2"
                onClick={() => setLectureActionLog("Clicked: Tải tài liệu PDF")}
              >
                <span className="material-symbols-outlined">download</span>
                Tải tài liệu PDF
              </Button>

              <Button 
                variant="action-secondary" 
                size="action"
                className="flex items-center justify-center gap-2"
                onClick={() => setLectureActionLog("Clicked: Lưu bài viết")}
              >
                <span className="material-symbols-outlined">bookmark_add</span>
                Lưu bài viết
              </Button>
            </div>

            {/* LectureRowCard */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-3">13.3 LectureRowCard Atoms</h3>
              
              <div className="space-y-4">
                <LectureRowCard 
                  imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDFyR2dPO3YUvSW77SfHGSTI8IOvpNB9DC2Z5JAqRbn7sQ7JdcPZpzxdL2aeDGqdTbdRTiHZoCZgtHzfmwclKFK-Yba5Y1rSyaDk427_S5lXzlEW-Ui3rjJO8udm1WEHWPNitbIKbVDKY9D6SE0pVPEAsjdXjYvbIR6jVRuHCTg0_aFvKZ8Vx8O5s49UsvYP3R7dGymdZRxMlP8lYVY_s5Kg2SUNiJH8N9w4LojiL2i0pQxQviLlBZp_mmBYgnXLGFQmD7pd9rti2TG"
                  title="Thể tích khối lăng trụ đứng và lăng trụ xiên"
                  category="Hình học lớp 12"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setLectureActionLog("Clicked: Bài giảng liên quan (Khối lăng trụ)");
                  }}
                />
                
                <LectureRowCard 
                  imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDRHkSJjH-Rb63ttXabCUwd9bYLe1tPqVPnwCtM7d5nHXIWGSqh-H7IOfdH8m5XZf52Vb_WbsQWlQnoI_jPmXKVNabc0ViEeAM5GkeBhJtf8ujU-KKr-LR-819FzYdpePGwkKxmgXnZ69KEeh6wGns6zD1VkxEfCXBaLLJbkqvTfF4yuaTIaUIZ2xlyMwhi_wBTwOv1jkiQmBS_6DC7j3yZVlG6DtrvSVdVTclUEzmAwNa59Vw_LMkc68t0hjNHFtNOGZ3n05_rLGxO"
                  title="Góc và khoảng cách trong không gian 3D"
                  category="Luyện đề THPT"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setLectureActionLog("Clicked: Bài giảng liên quan (Không gian 3D)");
                  }}
                />
              </div>
            </div>

            {/* InfoCard (Teacher notes and alert boxes) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-3">13.4 InfoCard Atoms</h3>
              
              <div className="space-y-4">
                <InfoCard 
                  variant="danger" 
                  icon="warning" 
                  title="Lưu ý khi làm bài"
                  onClick={() => setLectureActionLog("Clicked: InfoCard (Lưu ý khi làm bài)")}
                  className="cursor-pointer"
                >
                  <ul className="text-xs space-y-1 list-disc pl-4">
                    <li>Cẩn thận nhầm lẫn giữa công thức diện tích và thể tích.</li>
                    <li>Quên nhân hệ số 1/3 là lỗi phổ biến nhất.</li>
                  </ul>
                </InfoCard>

                <InfoCard 
                  variant="warning" 
                  icon="bolt" 
                  title="Kinh nghiệm thi"
                  onClick={() => setLectureActionLog("Clicked: InfoCard (Kinh nghiệm thi)")}
                  className="cursor-pointer"
                >
                  <ul className="text-xs space-y-1 list-disc pl-4">
                    <li>Sử dụng phương pháp loại trừ cho các bài trắc nghiệm.</li>
                    <li>Học thuộc các bộ số diện tích đặc biệt để tính nhanh.</li>
                  </ul>
                </InfoCard>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 14: Test Result Atoms Showcase */}
      <section className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Section 14: Test Result Atoms Showcase
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Atomic components for rendering detailed student test performance, Circular Gauge metrics, Question Map statuses, Answer Choices, and Handwritten submissions.
          </p>
        </div>

        {/* Action Log for Section 14 */}
        <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs flex items-center justify-between shadow-md">
          <span className="text-amber-400"># Action Logger:</span>
          <span>{resultActionLog}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Circular Gauge & Question Map (Col Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-bold text-slate-700 border-b pb-3">14.1 Score Gauge & Question Map Map</h3>
            
            <ResultScoreGauge
              score={8.5}
              maxScore={10}
              title="Kết quả xuất sắc!"
              description="Bạn nằm trong top 5% của lớp."
              sections={[
                { name: "Trắc nghiệm", score: 5.0, maxScore: 5.0, status: "success" },
                { name: "Tự luận", score: 3.5, maxScore: 5.0, status: "warning" }
              ]}
              onClick={() => setResultActionLog("Clicked: ResultScoreGauge Card")}
              className="cursor-pointer"
            />

            {/* Question Map block */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Trắc nghiệm</p>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <QuestionMapButton
                      key={num}
                      questionNumber={num}
                      status="success"
                      onClick={() => setResultActionLog(`Clicked: Question Map MC Câu ${num} (Đúng)`)}
                    />
                  ))}
                  <QuestionMapButton
                    questionNumber={3}
                    status="error"
                    onClick={() => setResultActionLog("Clicked: Question Map MC Câu 3 (Sai)")}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tự luận</p>
                <div className="flex flex-wrap gap-2">
                  {[11, 12, 13, 15].map((num) => (
                    <QuestionMapButton
                      key={num}
                      questionNumber={num}
                      subText={num === 11 ? "(1.0đ)" : num === 12 ? "(0.5đ)" : num === 13 ? "(0.8đ)" : "(0.5đ)"}
                      status="default"
                      onClick={() => setResultActionLog(`Clicked: Question Map Essay Câu ${num}`)}
                    />
                  ))}
                  <QuestionMapButton
                    questionNumber={14}
                    subText="(0.7đ)"
                    status="warning"
                    onClick={() => setResultActionLog("Clicked: Question Map Essay Câu 14 (Có lỗi)")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: AnswerOption & HandwrittenPaper (Col Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* AnswerOption Atom Showcase */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-3">14.2 AnswerOption Atoms</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnswerOption 
                  label="A" 
                  content="0" 
                  status="default" 
                  onClick={() => setResultActionLog("Clicked: Option A (Default)")}
                />
                
                <AnswerOption 
                  label="B" 
                  content="2 (Lựa chọn của bạn)" 
                  status="wrong" 
                  onClick={() => setResultActionLog("Clicked: Option B (Lựa chọn của bạn - Sai)")}
                />
                
                <AnswerOption 
                  label="C" 
                  content="4 (Đáp án đúng)" 
                  status="correct" 
                  onClick={() => setResultActionLog("Clicked: Option C (Đáp án đúng - Đúng)")}
                />

                <AnswerOption 
                  label="D" 
                  content="-2" 
                  status="default" 
                  onClick={() => setResultActionLog("Clicked: Option D (Default)")}
                />
              </div>
            </div>

            {/* HandwrittenPaper Atom Showcase */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b pb-3">14.3 HandwrittenPaper Atoms</h3>
              
              <HandwrittenPaper
                annotations={[
                  { text: "Đúng điều kiện!", status: "success", top: "2rem", left: "60%" },
                  { icon: "check", status: "success", bottom: "2rem", right: "3rem" }
                ]}
                onClick={() => setResultActionLog("Clicked: HandwrittenPaper Canvas Area")}
                className="cursor-pointer"
              >
                <p>Điều kiện: $x-1 &gt; 0$ và $x+1 &gt; 0 \Rightarrow x &gt; 1$</p>
                <p>BPT $\Leftrightarrow log_2((x-1)(x+1)) \le 3$</p>
                <p>$\Leftrightarrow (x-1)(x+1) \le 2^3 = 8$</p>
                <p>$\Leftrightarrow x^2 - 1 \le 8$</p>
                <p>$\Leftrightarrow x^2 \le 9 \Leftrightarrow -3 \le x \le 3$</p>
                <p>Kết hợp điều kiện $x &gt; 1$, ta được tập nghiệm $S = (1; 3]$</p>
              </HandwrittenPaper>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}

