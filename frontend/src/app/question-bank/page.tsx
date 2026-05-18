'use client';

import React from 'react';
import { Upload, Plus, School, BookOpen, Signal, FolderOpen, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Collapsible } from '@/components/ui/Collapsible';
import { FloatingActionBar } from '@/components/ui/FloatingActionBar';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { mockQuestions } from '@/lib/mock-data';

export default function QuestionBankPage() {
  const [selectedGrades, setSelectedGrades] = React.useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = React.useState<string[]>([]);
  const [selectedQs, setSelectedQs] = React.useState<string[]>([]);

  const toggleGrade = (grade: string) => {
    setSelectedGrades(prev =>
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
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

  const toggleSelectQuestion = (id: string) => {
    setSelectedQs(prev =>
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  // Real-time client-side filter computation
  const filteredQuestions = React.useMemo(() => {
    return mockQuestions.filter(q => {
      const matchGrade = selectedGrades.length === 0 || selectedGrades.some(g => q.topic.includes(`Lớp ${g}`));
      const matchSubject = selectedSubjects.length === 0 || selectedSubjects.some(s => q.topic.includes(s));
      const matchLevel = selectedLevels.length === 0 || selectedLevels.includes(q.level);
      return matchGrade && matchSubject && matchLevel;
    });
  }, [selectedGrades, selectedSubjects, selectedLevels]);

  const toggleSelectAll = () => {
    if (selectedQs.length === filteredQuestions.length) {
      setSelectedQs([]);
    } else {
      setSelectedQs(filteredQuestions.map(q => q.id));
    }
  };

  const isAllSelected = filteredQuestions.length > 0 && selectedQs.length === filteredQuestions.length;

  return (
    <div className="flex flex-1 overflow-hidden min-h-screen text-slate-900 bg-white font-display">
      <div className="flex w-full">
        {/* Sidebar Filters */}
        <aside className="w-72 border-r border-slate-100 overflow-y-auto hidden md:block bg-white p-4 space-y-6">
          <div className="space-y-4">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Bộ lọc chi tiết</h3>
            
            <Collapsible title="Khối lớp" icon={<School className="h-4 w-4" />} open>
              <div className="flex flex-col gap-2 pt-2">
                {['6', '7', '8', '9'].map(g => (
                  <label key={g} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <Checkbox
                      checkboxSize="sm"
                      checked={selectedGrades.includes(g)}
                      onChange={() => toggleGrade(g)}
                    />
                    Lớp {g}
                  </label>
                ))}
              </div>
            </Collapsible>

            <Collapsible title="Môn học" icon={<BookOpen className="h-4 w-4" />} open>
              <div className="flex flex-col gap-2 pt-2">
                {['Đại số', 'Hình học', 'Giải tích'].map(s => (
                  <label key={s} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <Checkbox
                      checkboxSize="sm"
                      checked={selectedSubjects.includes(s)}
                      onChange={() => toggleSubject(s)}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </Collapsible>

            <Collapsible title="Mức độ" icon={<Signal className="h-4 w-4" />} open>
              <div className="flex flex-col gap-2 pt-2">
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
          </div>
        </aside>

        {/* Main Work Area */}
        <main className="flex-1 overflow-y-auto bg-white p-6 pb-32">
          <div className="flex flex-col gap-6 max-w-6xl mx-auto">
            {/* Header / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>Admin</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-primary font-medium">Ngân hàng câu hỏi</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Danh sách câu hỏi</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline-slate">
                  <Upload size={16} />
                  Nhập từ JSON
                </Button>
                <Button variant="default" className="shadow-md shadow-primary/20">
                  <Plus size={16} />
                  Tạo đề thi
                </Button>
              </div>
            </div>

            {/* Select All Checkbox Control */}
            {filteredQuestions.length > 0 && (
              <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 rounded-xl border border-slate-100 w-fit select-none">
                <Checkbox
                  checkboxSize="sm"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
                <span className="text-xs font-semibold text-slate-600 cursor-pointer" onClick={toggleSelectAll}>
                  Chọn tất cả ({filteredQuestions.length} câu)
                </span>
              </div>
            )}

            {/* Dynamic Question List */}
            <div className="space-y-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    mode="teacher"
                    isChecked={selectedQs.includes(q.id)}
                    onCheckChange={() => toggleSelectQuestion(q.id)}
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

            {/* Pagination Mockup */}
            {filteredQuestions.length > 0 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Hiển thị <span className="font-bold text-slate-800">1 - {filteredQuestions.length}</span> trong số <span className="font-bold text-slate-800">{filteredQuestions.length}</span> câu hỏi
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="w-8 h-8 p-0" disabled>1</Button>
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
