# Question Bank Page Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a high-fidelity Next.js Question Bank page that integrates custom check-boxes, detailed sidebar filters, hover action elements, cluster-grouped math question cards, and bottom FloatingActionBars with real-time client-side interactive state.

**Architecture:** A unified React state manager in the page component handles queries and filters, dynamically calculating the list of displayed questions. QuestionCard is upgraded with standard multi-choice, essay, and grouped cluster rendering.

**Tech Stack:** Next.js (Client Component), TypeScript, Lucide icons, LaTeX rendering, Tailwind CSS.

---

## File Structure & Dependencies

- `frontend/src/lib/mock-data.ts`: Define enhanced `Question`, `SubQuestion` interfaces and expand lists to support cluster questions.
- `frontend/src/components/questions/QuestionCard.tsx`: Upgrade card rendering to support checkboxes, cluster unified stem, hover icons, and updated details footers.
- `frontend/src/app/question-bank/page.tsx`: Create the complete interactive dashboard page with state integrations.

---

### Task 1: Enhance Mock Data & Types
**Files:**
- Modify: `frontend/src/lib/mock-data.ts`

- [ ] **Step 1: Add new sub-question and generalized cluster question types to mock-data.ts**
Update the `Question` interface and define `SubQuestion`.
Code block to apply:
```typescript
export interface SubQuestion {
  id: string;
  number: number;
  content: string;
  type: 'multiple_choice' | 'essay';
  options?: Option[];
  solution?: string;
}

export interface Question {
  id: string;
  number: number;
  topic: string;
  level: QuestionLevel;
  type: QuestionType | 'cluster';
  content: string;
  options?: Option[];
  solution?: string;
  subQuestions?: SubQuestion[];
  lastUpdated?: string;
  author?: string;
}
```

- [ ] **Step 2: Add dynamic sample data for math cluster/grouped questions in mockQuestions array**
Add standard multi-choice limit question, cluster geometry question, and essay inequality question to test all modes.
Code block to apply:
```typescript
export const mockQuestions: Question[] = [
  {
    id: "q1",
    number: 1,
    topic: "Lớp 9 - Giải tích",
    level: "Thông hiểu",
    type: "multiple_choice",
    content: "Cho hàm số $f(x) = \\frac{x^2 - 4}{x - 2}$. Tính giá trị của giới hạn $\\lim_{x \\to 2} f(x)$.",
    options: [
      { id: "opt1_a", label: "A", content: "$\\lim_{x \\to 2} f(x) = 0$", isCorrect: false },
      { id: "opt1_b", label: "B", content: "$\\lim_{x \\to 2} f(x) = 4$", isCorrect: true },
      { id: "opt1_c", label: "C", content: "$\\lim_{x \\to 2} f(x) = 2$", isCorrect: false },
      { id: "opt1_d", label: "D", content: "Giới hạn không tồn tại", isCorrect: false },
    ],
    lastUpdated: "12/10/2023",
    author: "Admin"
  },
  {
    id: "q2",
    number: 2,
    topic: "Lớp 6 - Hình học",
    level: "Vận dụng cao",
    type: "cluster",
    content: "Cho hình chóp S.ABCD có đáy ABCD là hình thang vuông tại A và D. Biết $AD = CD = a$, $AB = 2a$. Cạnh bên $SA$ vuông góc với mặt đáy $(ABCD)$.",
    subQuestions: [
      {
        id: "q2_sub1",
        number: 1,
        content: "Tính khoảng cách từ điểm B đến mặt phẳng (SCD).",
        type: "multiple_choice",
        options: [
          { id: "q2_sub1_a", label: "A", content: "$a\\sqrt{2}$", isCorrect: false },
          { id: "q2_sub1_b", label: "B", content: "$a\\sqrt{3}/2$", isCorrect: true }
        ]
      },
      {
        id: "q2_sub2",
        number: 2,
        content: "Xác định tâm và bán kính mặt cầu ngoại tiếp hình chóp S.ABCD.",
        type: "essay"
      }
    ],
    lastUpdated: "05/11/2023",
    author: "GV. Lê Thu"
  },
  {
    id: "q3",
    number: 3,
    topic: "Lớp 7 - Đại số",
    level: "Nhận biết",
    type: "essay",
    content: "Giải bất phương trình: $x^2 - 5x + 6 > 0$",
    lastUpdated: "01/12/2023",
    author: "Admin"
  }
];
```

- [ ] **Step 3: Verify TypeScript compilation**
Run: `npx tsc --noEmit` in `frontend/`
Expected: PASS with no errors.

- [ ] **Step 4: Commit changes**
Run:
```bash
git add frontend/src/lib/mock-data.ts
git commit -m "feat: enhance mock questions data and types"
```

---

### Task 2: Upgrade QuestionCard Component
**Files:**
- Modify: `frontend/src/components/questions/QuestionCard.tsx`

- [ ] **Step 1: Expand QuestionCardProps with checkbox bindings, hover actions, and author footers**
Modify `QuestionCard.tsx` to handle standard multi-choice, essay, cluster-stem, hover history/edit/delete tools, and selection check-boxes.
Code block to apply:
```typescript
import React from 'react';
import { CheckCircle2, History, Edit3, Trash2, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { Question } from '@/lib/mock-data';
import { Latex } from '@/components/ui/Latex';

export interface QuestionCardProps {
  question: Question;
  mode?: 'teacher' | 'student';
  selectedOptionId?: string;
  onOptionSelect?: (questionId: string, optionId: string) => void;
  isChecked?: boolean;
  onCheckChange?: (checked: boolean) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  mode = 'teacher',
  selectedOptionId,
  onOptionSelect,
  isChecked = false,
  onCheckChange,
}) => {
  const isTeacher = mode === 'teacher';

  return (
    <Card className="group overflow-hidden bg-slate-50 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
      <CardHeader className="flex justify-between items-center flex-row gap-4 p-5 pb-2 bg-slate-50 border-b-0">
        <div className="flex gap-3 items-center">
          <Checkbox
            checkboxSize="sm"
            checked={isChecked}
            onChange={(e) => onCheckChange?.(e.target.checked)}
          />
          <Badge variant="primary" size="sm">{question.topic}</Badge>
          <Badge variant={question.level === 'Nhận biết' ? 'success' : question.level === 'Thông hiểu' ? 'warning' : 'danger'} size="sm">
            {question.level}
          </Badge>
          <span className="text-[10px] text-slate-400 font-medium">ID: #Q-{question.id}</span>
        </div>

        {isTeacher && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-all" title="Xem lịch sử">
              <History size={16} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-all" title="Chỉnh sửa">
              <Edit3 size={16} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-all" title="Xóa">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </CardHeader>

      <div className="px-5 pb-4 bg-slate-50">
        {question.type === 'cluster' ? (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border-l-4 border-primary shadow-sm ml-7">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Nội dung dẫn chung</h4>
              <div className="text-sm text-slate-700 italic">
                <Latex text={question.content} />
              </div>
            </div>
            <div className="space-y-6 ml-7">
              {question.subQuestions?.map((sub) => (
                <div key={sub.id} className="relative pl-6 border-l-2 border-slate-100">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-slate-300 rounded-full" />
                  <div className="text-slate-800 font-display text-sm font-semibold mb-3">
                    {sub.number}. <Latex text={sub.content} />
                  </div>
                  {sub.type === 'multiple_choice' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {sub.options?.map((opt) => (
                        <div
                          key={opt.id}
                          className={`text-sm p-2 border rounded bg-white flex justify-between items-center ${
                            opt.isCorrect ? 'border-primary text-primary font-bold' : 'border-slate-100'
                          }`}
                        >
                          <Latex text={`${opt.label}. ${opt.content}`} />
                          {opt.isCorrect && <CheckCircle2 className="text-primary" size={14} />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="italic text-xs text-slate-500">Dạng bài: Tự luận</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-slate-800 leading-relaxed text-base font-normal font-display pl-7">
            <Latex text={question.content} />
          </div>
        )}
      </div>

      {question.type !== 'cluster' && (
        <CardContent className="bg-white p-5 pl-12 border-t border-slate-100">
          {question.type === 'multiple_choice' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options?.map((opt) => (
                <div
                  key={opt.id}
                  className={`flex items-center gap-3 p-2 bg-white rounded-lg border transition-all ${
                    opt.isCorrect ? 'border-primary/20 bg-primary/5 text-primary font-semibold' : 'border-slate-100'
                  }`}
                >
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold ${
                    opt.isCorrect ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {opt.label}
                  </span>
                  <Latex className="text-sm font-display" text={opt.content} />
                  {opt.isCorrect && <CheckCircle2 className="text-primary text-sm ml-auto" size={16} />}
                </div>
              ))}
            </div>
          ) : (
            question.solution && (
              <div className="border border-dashed border-amber-200 bg-amber-50/10 p-4 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Hướng dẫn chấm:</span>
                <Latex className="text-sm text-slate-700 leading-relaxed font-display" text={question.solution} />
              </div>
            )
          )}
        </CardContent>
      )}

      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-white pl-12">
        <div className="text-[10px] text-slate-400">
          Cập nhật: {question.lastUpdated || '12/10/2023'} bởi {question.author || 'Admin'}
        </div>
        <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          Xem chi tiết
          <ArrowRight size={12} />
        </button>
      </div>
    </Card>
  );
};
QuestionCard.displayName = "QuestionCard";
```

- [ ] **Step 2: Verify TypeScript compilation**
Run: `npx tsc --noEmit` in `frontend/`
Expected: PASS with no errors.

- [ ] **Step 3: Commit changes**
Run:
```bash
git add frontend/src/components/questions/QuestionCard.tsx
git commit -m "feat: upgrade QuestionCard component supporting clusters and hover actions"
```

---

### Task 3: Create Question Bank Page
**Files:**
- Create: `frontend/src/app/question-bank/page.tsx`

- [ ] **Step 1: Write interactive question bank client component page**
Code block to apply:
```typescript
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
            </Collapsible>

            <Collapsible title="Môn học" icon={<BookOpen className="h-4 w-4" />} open>
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
            </Collapsible>

            <Collapsible title="Mức độ" icon={<Signal className="h-4 w-4" />} open>
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
```

- [ ] **Step 2: Verify TypeScript compilation**
Run: `npx tsc --noEmit` in `frontend/`
Expected: PASS with no errors.

- [ ] **Step 3: Commit changes**
Run:
```bash
git add frontend/src/app/question-bank/page.tsx
git commit -m "feat: add complete interactive Question Bank page"
```
