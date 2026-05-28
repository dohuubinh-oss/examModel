'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  Plus, 
  School, 
  BookOpen, 
  Signal,
  Sparkles,
  LayoutDashboard,
  Database,
  FileText,
  Users,
  FilterX
} from 'lucide-react';

// UI components
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Collapsible } from '@/components/ui/Collapsible';

// Reusable Exam Table components
import { ExamTable, ExamItem } from '@/components/questions/ExamTable';

export default function ExamBankPage() {
  const router = useRouter();

  // State Management for filters
  const [selectedGrades, setSelectedGrades] = React.useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const itemsPerPage = 5;

  // Replace mock data with state and fetch logic
  const [exams, setExams] = React.useState<ExamItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchExams = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/exams`);
        if (res.ok) {
          const data = await res.json();
          setExams(data);
        } else {
          console.error("Failed to fetch exams");
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, []);

  // Handlers for dynamic filters
  const toggleGrade = (grade: string) => {
    setSelectedGrades(prev => 
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
    setCurrentPage(1);
  };

  const toggleDuration = (dur: string) => {
    setSelectedSubjects(prev => 
      prev.includes(dur) ? prev.filter(d => d !== dur) : [...prev, dur]
    );
    setCurrentPage(1);
  };

  const toggleLevel = (lvl: string) => {
    setSelectedLevels(prev => 
      prev.includes(lvl) ? prev.filter(l => l !== lvl) : [...prev, lvl]
    );
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedGrades([]);
    setSelectedSubjects([]);
    setSelectedLevels([]);
    setCurrentPage(1);
  };

  // Real-time client-side filter computation
  const filteredExams = React.useMemo(() => {
    return exams.filter(exam => {
      // 1. Grade filter match
      const matchGrade = selectedGrades.length === 0 || selectedGrades.includes(exam.grade);

      // 2. Duration match (mapped to selectedSubjects array for convenience)
      const matchDuration = selectedSubjects.length === 0 || selectedSubjects.some(dur => {
        // Exam duration might be "90 phút". We just check if it starts with the duration number
        return exam.duration.startsWith(dur);
      });

      // 3. Level filter match
      const matchLevel = selectedLevels.length === 0 || selectedLevels.some(lvl => {
        if (lvl === 'Nhận biết' && exam.questionsCount <= 20) return true;
        if (lvl === 'Thông hiểu' && exam.questionsCount > 20 && exam.questionsCount <= 35) return true;
        if (lvl === 'Vận dụng' && exam.questionsCount > 35) return true;
        return false;
      });

      return matchGrade && matchDuration && matchLevel;
    });
  }, [exams, selectedGrades, selectedSubjects, selectedLevels]);

  // Pagination calculation
  const totalItems = filteredExams.length;
  const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);
  const paginatedExams = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExams.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExams, currentPage, itemsPerPage]);

  // Adjust page number if it exceeds totalPages due to filtering changes
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Table actions
  const handleEdit = (exam: ExamItem) => {
    alert(`[Chỉnh sửa] Đề thi: "${exam.name}" (ID: ${exam.id})`);
  };

  const handleDelete = async (exam: ExamItem) => {
    if (!confirm(`Bạn có chắc chắn muốn xoá đề thi "${exam.name}" không?`)) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/exams/${exam.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setExams(prev => prev.filter(e => e.id !== exam.id));
      } else {
        alert('Xóa đề thi thất bại!');
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi xóa đề thi!');
    }
  };

  const handleTake = (exam: ExamItem) => {
    router.push(`/dashboard/exams/take?id=${exam.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-white font-display">
      {/* Header - Styled matching exactly the Question Creation / Question Bank Header */}
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
            <div>
              <h1 className="text-lg font-bold leading-tight">Quản lý ngân hàng đề thi</h1>
              <p className="text-xs text-slate-500">Toán học THPT • Tổng số: {exams.length} đề thi</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline-slate" onClick={() => router.push('/question-bank/import')}>
              <Upload size={20} />
              Nhập từ JSON
            </Button>
            <Button variant="default" className="shadow-md shadow-primary/20" onClick={() => router.push('/question-bank')}>
              <Plus size={20} />
              Tạo đề thi
            </Button>
          </div>
        </div>
      </header>

      {/* Workspace container below Header */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto flex overflow-hidden">
        {/* Sidebar Filters - Left side */}
        <aside className="w-72 border-r border-slate-100 overflow-y-auto hidden md:block bg-white p-4 space-y-6 shrink-0 h-[calc(100vh-80px)]">
          {/* Page Navigation Menu */}
          <div className="space-y-1">
            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer" href="#">
              <LayoutDashboard className="h-4.5 w-4.5 text-slate-400" />
              <span className="text-xs font-semibold">Bảng điều khiển</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer" href="/question-bank">
              <Database className="h-4.5 w-4.5 text-slate-400" />
              <span className="text-xs font-semibold">Ngân hàng câu hỏi</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 bg-primary/5 text-primary rounded-lg transition-all border-r-4 border-primary cursor-pointer" href="/dashboard/questions/bank">
              <FileText className="h-4.5 w-4.5 text-primary" />
              <span className="text-xs font-bold">Ngân hàng đề thi</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer" href="/dashboard/users">
              <Users className="h-4.5 w-4.5 text-slate-400" />
              <span className="text-xs font-semibold">Quản lý người dùng</span>
            </a>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-4">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Bộ lọc chi tiết</h3>
            
            {/* Khối lớp filter */}
            <Collapsible title="Khối lớp" icon={<School className="h-4 w-4 text-slate-400" />} open>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2">
                {['5', '6', '7', '8', '9', '10'].map(g => (
                  <label key={g} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <Checkbox
                      checkboxSize="sm"
                      checked={selectedGrades.includes(g)}
                      onChange={() => toggleGrade(g)}
                    />
                    {g === '10' ? 'Luyện thi 10' : `Lớp ${g}`}
                  </label>
                ))}
              </div>
            </Collapsible>

            {/* Thời gian filter */}
            <Collapsible title="Thời gian" icon={<BookOpen className="h-4 w-4 text-slate-400" />} open>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2">
                {['15', '45', '60', '90', '120'].map(s => (
                  <label key={s} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <Checkbox
                      checkboxSize="sm"
                      checked={selectedSubjects.includes(s)}
                      onChange={() => toggleDuration(s)}
                    />
                    {s} phút
                  </label>
                ))}
              </div>
            </Collapsible>

            {/* Mức độ filter */}
            <Collapsible title="Mức độ" icon={<Signal className="h-4 w-4 text-slate-400" />} open>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2">
                {['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'].map(l => (
                  <label key={l} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <Checkbox
                      checkboxSize="sm"
                      checked={selectedLevels.includes(l)}
                      onChange={() => toggleLevel(l)}
                    />
                    {l}
                  </label>
                ))}
              </div>
            </Collapsible>

            {/* Reset Filters button */}
            <button 
              onClick={handleClearFilters}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-500 hover:text-primary transition-all border border-dashed border-slate-300 hover:border-primary/50 rounded-lg cursor-pointer"
            >
              <FilterX size={15} />
              Xóa bộ lọc
            </button>
          </div>
        </aside>

        {/* Main Work Area - Contains ONLY the blue themed Exam Bank Table */}
        <main className="flex-1 overflow-y-auto bg-white p-6 pb-32">
          <div className="flex flex-col gap-6 w-full">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-slate-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                Đang tải dữ liệu...
              </div>
            ) : (
              <ExamTable
                exams={paginatedExams}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                theme="blue"
                onPageChange={setCurrentPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTake={handleTake}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
