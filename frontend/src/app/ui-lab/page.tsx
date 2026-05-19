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
    </div>
  );
}
