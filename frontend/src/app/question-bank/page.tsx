'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, Plus, School, BookOpen, Signal, FolderOpen, 
  Printer, Trash2, Sparkles, LayoutDashboard, 
  Database, FileText, Users, FilterX, RefreshCw, ChevronLeft, ChevronRight, FileQuestion
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Collapsible } from '@/components/ui/Collapsible';
import { FloatingActionBar } from '@/components/ui/FloatingActionBar';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { Question } from '@/lib/mock-data';
import { QuestionAdapter } from '@/lib/question-adapter';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function QuestionBankPage() {
  const router = useRouter();
  const [selectedGrades, setSelectedGrades] = React.useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = React.useState<string[]>([]);
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [selectedQs, setSelectedQs] = React.useState<Question[]>([]);
  const [isEditMode, setIsEditMode] = React.useState(false);

  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0 });

  const [availableTopics, setAvailableTopics] = React.useState<string[]>([]);

  const fetchQuestions = React.useCallback(async (pageToFetch: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageToFetch.toString(),
        limit: pagination.limit.toString()
      });

      if (selectedGrades.length > 0) {
        // e.g., '9' instead of 'Lớp 9'
        const gradeInts = selectedGrades.map(g => g === '10' ? '10' : g).join(',');
        params.append('grade', gradeInts);
      }
      if (selectedSubjects.length > 0) {
        params.append('q', selectedSubjects.join(' ')); 
      }
      if (selectedLevels.length > 0) {
        params.append('difficulty_level', selectedLevels.join(','));
      }
      if (selectedType) {
        if (selectedType === 'Câu hỏi chùm') {
          params.append('type_question', 'group');
        } else {
          params.append('type', selectedType);
        }
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/questions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const seenGroupIds = new Set<string>();
        const mappedQs: Question[] = [];
        let index = (pageToFetch - 1) * pagination.limit;
        
        (data.data || []).forEach((q: any) => {
          const uiQ = QuestionAdapter.fromBackendToUI(q);
          if (uiQ.groupId) {
            if (seenGroupIds.has(uiQ.groupId)) {
              return;
            }
            seenGroupIds.add(uiQ.groupId);
          }
          uiQ.number = ++index;
          mappedQs.push(uiQ);
        });
        
        setQuestions(mappedQs);
        if (data.pagination) {
          setPagination(prev => ({ ...prev, ...data.pagination }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedGrades, selectedSubjects, selectedLevels, selectedType, pagination.limit]);

  React.useEffect(() => {
    fetchQuestions(1);
  }, [fetchQuestions]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const editExam = searchParams.get('editExam') === 'true';
      const qIdsParam = searchParams.get('qIds');

      if (editExam && qIdsParam) {
        setIsEditMode(true);
        fetch(`${API_BASE_URL}/api/v1/questions?ids=${qIdsParam}&limit=100`)
          .then(res => res.json())
          .then(data => {
            const mappedQs: Question[] = [];
            let idx = 0;
            (data.data || []).forEach((q: any) => {
              const uiQ = QuestionAdapter.fromBackendToUI(q);
              uiQ.number = ++idx;
              mappedQs.push(uiQ);
            });
            setSelectedQs(mappedQs);
          })
          .catch(err => console.error("Failed to fetch initial selected questions:", err));
      }
    }
  }, []);

  React.useEffect(() => {
    if (selectedGrades.length === 1) {
      const grade = selectedGrades[0] === '10' ? '10' : selectedGrades[0];
      fetch(`${API_BASE_URL}/api/v1/topics?grade=${grade}`)
        .then(res => res.json())
        .then(data => {
          const topicNames = Array.isArray(data) ? data.map((t: any) => t.name) : [];
          setAvailableTopics(Array.from(new Set(topicNames)));
        })
        .catch(err => console.error("Failed to fetch topics", err));
    } else {
      setAvailableTopics([]);
      setSelectedSubjects([]);
    }
  }, [selectedGrades]);

  const toggleGrade = (grade: string) => {
    setSelectedGrades(prev =>
      prev.includes(grade) ? [] : [grade]
    );
  };

  const toggleSubject = (subj: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
    );
  };

  const toggleLevel = (lvl: string) => {
    setSelectedLevels(prev =>
      prev.includes(lvl) ? prev.filter(l => l !== lvl) : [...prev, lvl]
    );
  };

  const toggleType = (type: string) => {
    setSelectedType(prev => prev === type ? null : type);
  };

  const toggleSelectQuestion = (q: Question) => {
    setSelectedQs(prev =>
      prev.some(item => item.id === q.id) 
        ? prev.filter(item => item.id !== q.id) 
        : [...prev, q]
    );
  };

  const handleClearFilters = () => {
    setSelectedGrades([]);
    setSelectedSubjects([]);
    setSelectedLevels([]);
    setSelectedType(null);
    setSelectedQs([]);
  };

  const handleDeleteQuestion = async (id: string, type: string, groupId?: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) return;
    
    try {
      const isCluster = type === 'cluster';
      const targetId = isCluster && groupId ? groupId : id;
      const endpoint = isCluster 
        ? `${API_BASE_URL}/api/v1/question-groups/${targetId}`
        : `${API_BASE_URL}/api/v1/questions/${targetId}`;

      const res = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Tải lại danh sách sau khi xóa thành công
        fetchQuestions(pagination.page);
        // Bỏ chọn câu hỏi nếu đang được chọn
        setSelectedQs(prev => prev.filter(item => item.id !== id));
      } else {
        alert('Có lỗi xảy ra khi xóa câu hỏi. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Failed to delete question:', error);
      alert('Có lỗi kết nối. Vui lòng kiểm tra lại mạng.');
    }
  };

  const handleCreateExam = () => {
    if (selectedQs.length < 7) {
      alert('Vui lòng chọn ít nhất 7 câu hỏi để tạo đề thi.');
      return;
    }

    const grades = new Set(selectedQs.map(q => q.grade));
    if (grades.size > 1) {
      alert('Tất cả các câu hỏi được chọn phải thuộc cùng một khối lớp (grade).');
      return;
    }

    const ids = selectedQs.map(q => q.id).join(',');
    router.push(`/dashboard/exams/create?qIds=${ids}`);
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-slate-50 font-display">
      {/* Header - Styled matching Create Exam page */}
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
              <h1 className="text-lg font-bold leading-tight">Quản lý ngân hàng câu hỏi</h1>
              <p className="text-xs text-slate-500">Toán học THCS • Tổng số: {pagination.total} câu hỏi</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline-slate"
              onClick={() => router.push('/question-bank/import')}
            >
              <Upload size={20} />
              Nhập từ JSON
            </Button>
            <Button 
              variant="default" 
              className="shadow-md shadow-primary/20"
              onClick={handleCreateExam}
            >
              <Plus size={20} />
              {isEditMode ? 'Cập nhật đề thi' : 'Tạo đề thi'}
            </Button>
          </div>
        </div>
      </header>

      {/* Workspace container below Header */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto flex overflow-hidden">
        {/* Sidebar Filters */}
        <aside className="w-72 border-r border-slate-100 overflow-y-auto hidden md:block bg-white p-4 space-y-6 shrink-0 h-[calc(100vh-80px)]">
          {/* Page Navigation Menu */}
          <div className="space-y-1">
            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer" href="#">
              <LayoutDashboard className="h-4.5 w-4.5 text-slate-400" />
              <span className="text-xs font-semibold">Bảng điều khiển</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 bg-primary/5 text-primary rounded-lg transition-all border-r-4 border-primary cursor-pointer" href="/question-bank">
              <Database className="h-4.5 w-4.5 text-primary" />
              <span className="text-xs font-bold">Ngân hàng câu hỏi</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer" href="/dashboard/questions/bank">
              <FileText className="h-4.5 w-4.5 text-slate-400" />
              <span className="text-xs font-semibold">Ngân hàng đề thi</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer" href="/dashboard/users">
              <Users className="h-4.5 w-4.5 text-slate-400" />
              <span className="text-xs font-semibold">Quản lý người dùng</span>
            </a>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-4">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Bộ lọc chi tiết</h3>
            
            <Collapsible title="Khối lớp" icon={<School className="h-4 w-4" />} open>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2">
                {['5', '6', '7', '8', '9', '10'].map(g => (
                  <label key={g} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <Checkbox
                      checkboxSize="sm"
                      className="shrink-0"
                      checked={selectedGrades.includes(g)}
                      onChange={() => toggleGrade(g)}
                    />
                    {g === '10' ? 'Luyện thi 10' : `Lớp ${g}`}
                  </label>
                ))}
              </div>
            </Collapsible>

            {availableTopics.length > 0 && (
              <Collapsible title="Chuyên đề" icon={<BookOpen className="h-4 w-4" />} open>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2">
                  {availableTopics.map(s => (
                    <label key={s} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                      <Checkbox
                        checkboxSize="sm"
                        className="shrink-0"
                        checked={selectedSubjects.includes(s)}
                        onChange={() => toggleSubject(s)}
                      />
                      <span className="truncate" title={s}>{s}</span>
                    </label>
                  ))}
                </div>
              </Collapsible>
            )}

            <Collapsible title="Loại câu hỏi" icon={<FileQuestion className="h-4 w-4" />} open>
              <div className="grid grid-cols-1 gap-y-2.5 pt-2">
                {['Trắc nghiệm', 'Tự luận', 'Câu hỏi chùm'].map(t => (
                  <label key={t} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <Checkbox
                      checkboxSize="sm"
                      className="shrink-0"
                      checked={selectedType === t}
                      onChange={() => toggleType(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </Collapsible>

            <Collapsible title="Mức độ" icon={<Signal className="h-4 w-4" />} open>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2">
                {['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'].map(l => (
                  <label key={l} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <Checkbox
                      checkboxSize="sm"
                      className="shrink-0"
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

        {/* Main Work Area */}
        <main className="flex-1 overflow-y-auto bg-transparent p-6 pb-32">
          <div className="flex flex-col gap-6 w-full">
            {/* Dynamic Question List */}
            <div className="space-y-4">
              {loading ? (
                <div className="border border-dashed border-slate-200 bg-slate-50/50 p-12 rounded-xl text-center">
                  <RefreshCw className="mx-auto h-6 w-6 text-primary animate-spin mb-2" />
                  <span className="text-sm text-slate-500 font-medium font-display">
                    Đang tải dữ liệu...
                  </span>
                </div>
              ) : questions.length > 0 ? (
                questions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    mode="teacher"
                    isChecked={selectedQs.some(item => item.id === q.id)}
                    onCheckChange={() => toggleSelectQuestion(q)}
                    onDelete={handleDeleteQuestion}
                  />
                ))
              ) : (
                <div className="border border-dashed border-slate-200 bg-slate-50/50 p-12 rounded-xl text-center">
                  <span className="text-sm text-slate-500 font-medium font-display">
                    Không tìm thấy câu hỏi phù hợp với bộ lọc đã chọn.
                  </span>
                </div>
              )}
            </div>

            {/* Pagination Mockup -> Real Pagination */}
            {!loading && questions.length > 0 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Hiển thị <span className="font-bold text-slate-800">{(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)}</span> trong số <span className="font-bold text-slate-800">{pagination.total}</span> câu hỏi
                </p>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-8 h-8 p-0" 
                    disabled={pagination.page <= 1}
                    onClick={() => fetchQuestions(pagination.page - 1)}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button variant="default" size="sm" className="w-8 h-8 p-0">{pagination.page}</Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-8 h-8 p-0"
                    disabled={pagination.page * pagination.limit >= pagination.total}
                    onClick={() => fetchQuestions(pagination.page + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Bar Selection Indicator */}
      <FloatingActionBar
        selectedCount={selectedQs.length}
        isOpen={selectedQs.length > 0}
        onClear={() => setSelectedQs([])}
        actions={[
          {
            label: 'Tạo đề thi',
            icon: <Plus className="h-3.5 w-3.5" />,
            onClick: handleCreateExam
          },
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
    </div>
  );
}
