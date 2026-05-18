# QuestionCard Standardization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize the question card UI across ToanThucChien project by creating a reusable, high-fidelity `<QuestionCard>` component that supports teacher and student modes, eliminating all styling discrepancies.

**Architecture:** A unified, prop-driven, zero-footer React component. It dynamically renders multiple choice grids or essay solution rubrics based on the question type and user role, keeping UI styling perfectly consistent.

**Tech Stack:** React 19, Next.js 16 (app router), TypeScript 5, Tailwind CSS, Lucide icons.

---

## Files to Create and Modify

*   [NEW] [QuestionCard.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/components/questions/QuestionCard.tsx)
*   [MODIFY] [mock-data.ts](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/lib/mock-data.ts)
*   [MODIFY] [ui-lab/page.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/app/ui-lab/page.tsx)
*   [MODIFY] [exams/create/page.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/app/dashboard/exams/create/page.tsx)

---

## Tasks

### Task 1: Update Mock Data & Types

**Files:**
*   Modify: [mock-data.ts](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/lib/mock-data.ts)

- [ ] **Step 1: Add `solution` property to `Question` interface**
  Add the optional `solution` property of type `string` inside the `Question` interface in `mock-data.ts`.
  
  ```typescript
  export interface Question {
    id: string;
    number: number;
    topic: string;
    level: QuestionLevel;
    type: QuestionType;
    content: string;
    options?: Option[];
    solution?: string; // Add this line
  }
  ```

- [ ] **Step 2: Add mock solution to the essay question (`q3`)**
  Update the third mock question (`id: "q3"`) to include a structured LaTeX/HTML model solution.
  
  ```typescript
  {
    id: "q3",
    number: 3,
    topic: "Hình học không gian",
    level: "Vận dụng cao",
    type: "essay",
    content: "Cho hình chóp S.ABCD có đáy ABCD là hình vuông cạnh a. Cạnh bên SA vuông góc với đáy, SA = a\\sqrt{2}. Gọi M là trung điểm của BC. Tính khoảng cách từ điểm M đến mặt phẳng (SCD).",
    solution: "1. Kẻ AH \\perp SD tại H. Chứng minh được AH \\perp (SCD).<br/>2. Sử dụng hệ thức lượng trong tam giác vuông SAD: \\frac{1}{AH^2} = \\frac{1}{AS^2} + \\frac{1}{AD^2} = \\frac{1}{2a^2} + \\frac{1}{a^2} = \\frac{3}{2a^2} \\Rightarrow AH = a\\sqrt{\\frac{2}{3}}.<br/>3. Do AD // BC nên BC // (SCD) \\Rightarrow d(M, (SCD)) = d(A, (SCD)) = AH = \\frac{a\\sqrt{6}}{3}."
  }
  ```

- [ ] **Step 3: Run TypeScript compiler check**
  Run the compiler command in the frontend directory to ensure the type change does not break existing code.
  
  Run:
  ```bash
  cd /Users/modeptrai/Desktop/ToanThucChien/frontend && npx tsc --noEmit
  ```
  Expected: Success with no type errors.

- [ ] **Step 4: Commit changes**
  ```bash
  git add frontend/src/lib/mock-data.ts
  git commit -m "feat: add solution property to mock questions"
  ```

---

### Task 2: Create Reusable QuestionCard Component

**Files:**
*   Create: [QuestionCard.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/components/questions/QuestionCard.tsx)

- [ ] **Step 1: Write the complete `QuestionCard.tsx` implementation**
  Create the file `frontend/src/components/questions/QuestionCard.tsx` and write the complete component code incorporating all styling rules (teacher/student mode, trắc nghiệm grid, essay solution frame, no footer).

  ```tsx
  import React from 'react';
  import { CheckCircle2, RefreshCw } from 'lucide-react';
  import { Card, CardHeader, CardContent } from '@/components/ui/Card';
  import { Badge } from '@/components/ui/Badge';
  import { Button } from '@/components/ui/Button';
  import { Question } from '@/lib/mock-data';

  export interface QuestionCardProps {
    question: Question;
    mode?: 'teacher' | 'student';
    selectedOptionId?: string;
    onOptionSelect?: (questionId: string, optionId: string) => void;
    onRegenerate?: (questionId: string) => void;
  }

  export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    mode = 'teacher',
    selectedOptionId,
    onOptionSelect,
    onRegenerate,
  }) => {
    const isTeacher = mode === 'teacher';

    return (
      <Card className="group overflow-hidden bg-white border border-slate-200 shadow-sm rounded-2xl transition-all">
        {/* Card Header */}
        <CardHeader className="flex justify-between items-start flex-row gap-4 p-5 border-b border-slate-100 bg-white">
          <div className="flex gap-3 items-start">
            <Badge variant="primary" className="shrink-0 mt-0.5">Câu {question.number}</Badge>
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
                {question.topic} • {question.level}
              </span>
              <p 
                className="mt-1 text-slate-800 leading-relaxed text-base font-normal font-display" 
                dangerouslySetInnerHTML={{ __html: question.content }}
              />
            </div>
          </div>
          
          {isTeacher && onRegenerate && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 shrink-0 flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors cursor-pointer"
              onClick={() => onRegenerate(question.id)}
            >
              <RefreshCw size={16} className="group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">Đổi câu hỏi</span>
            </Button>
          )}
        </CardHeader>

        {/* Card Content */}
        <CardContent className="bg-slate-50/50 p-5">
          {question.type === 'multiple_choice' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options?.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const showAsCorrect = isTeacher && opt.isCorrect;
                const highlight = showAsCorrect || (!isTeacher && isSelected);

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (!isTeacher && onOptionSelect) {
                        onOptionSelect(question.id, opt.id);
                      }
                    }}
                    className={`flex items-center gap-3 p-3 bg-white rounded-lg border transition-all ${
                      highlight 
                        ? 'border-2 border-primary bg-blue-50/10 shadow-sm' 
                        : isTeacher 
                          ? 'border-slate-200 cursor-default opacity-85'
                          : 'border-slate-200 hover:border-primary/50 cursor-pointer'
                    }`}
                  >
                    <Badge 
                      variant={highlight ? 'primary' : 'outline'} 
                      className="rounded-full w-6 h-6 flex items-center justify-center p-0 shrink-0 font-bold"
                    >
                      {opt.label}
                    </Badge>
                    <span 
                      className="text-slate-700 font-display text-sm" 
                      dangerouslySetInnerHTML={{ __html: opt.content }} 
                    />
                    {showAsCorrect && <CheckCircle2 className="text-primary ml-auto shrink-0" size={18} />}
                  </div>
                );
              })}
            </div>
          ) : (
            // Essay layout showing solution/rubric directly in teacher mode
            isTeacher && question.solution ? (
              <div className="border border-dashed border-amber-300 bg-amber-50/10 p-5 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  Hướng dẫn chấm / Lời giải mẫu:
                </span>
                <div 
                  className="text-sm text-slate-700 leading-relaxed font-display" 
                  dangerouslySetInnerHTML={{ __html: question.solution }}
                />
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 bg-white p-5 rounded-xl text-center">
                <span className="text-sm text-slate-500 font-medium font-display">
                  Học sinh trình bày lời giải chi tiết vào giấy thi.
                </span>
              </div>
            )
          )}
        </CardContent>
      </Card>
    );
  };
  ```

- [ ] **Step 2: Run type check compilation**
  Run:
  ```bash
  cd /Users/modeptrai/Desktop/ToanThucChien/frontend && npx tsc --noEmit
  ```
  Expected: Success with zero compile errors.

- [ ] **Step 3: Commit component**
  ```bash
  git add frontend/src/components/questions/QuestionCard.tsx
  git commit -m "feat: implement reusable QuestionCard component"
  ```

---

### Task 3: Refactor UI Lab Showcase

**Files:**
*   Modify: [ui-lab/page.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/app/ui-lab/page.tsx)

- [ ] **Step 1: Refactor code to use QuestionCard**
  Open [ui-lab/page.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/app/ui-lab/page.tsx). Import `QuestionCard` and mock data, create local state for testing student selection, and replace the old manual card template with both **Teacher mode** and **Student mode** question cards.

  Code changes:
  ```tsx
  // Add state inside UiLab component:
  const [selectedLabOpt, setSelectedLabOpt] = React.useState<string>('');

  // Replace lines 91-122 under 4. Cards section with:
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-7xl">
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Chế độ Giáo viên (Teacher Mode)</h3>
      <QuestionCard 
        question={mockQuestions[0]} 
        mode="teacher" 
        onRegenerate={(qId) => console.log('Regenerated question: ', qId)} 
      />
    </div>
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Chế độ Học sinh (Student Mode - Clickable)</h3>
      <QuestionCard 
        question={mockQuestions[1]} 
        mode="student" 
        selectedOptionId={selectedLabOpt}
        onOptionSelect={(qId, optId) => setSelectedLabOpt(optId)}
      />
    </div>
  </div>
  ```

- [ ] **Step 2: Run type checking**
  Run:
  ```bash
  cd /Users/modeptrai/Desktop/ToanThucChien/frontend && npx tsc --noEmit
  ```
  Expected: SUCCESS.

- [ ] **Step 3: Commit changes**
  ```bash
  git add frontend/src/app/ui-lab/page.tsx
  git commit -m "refactor: update UI Lab to showcase standardized QuestionCards"
  ```

---

### Task 4: Refactor Exam Creator Page

**Files:**
*   Modify: [exams/create/page.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/app/dashboard/exams/create/page.tsx)

- [ ] **Step 1: Replace hand-coded question templates with the standardized `<QuestionCard>`**
  Import `QuestionCard` inside [exams/create/page.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/app/dashboard/exams/create/page.tsx), and clean up unnecessary icons or component imports from `lucide-react` and `@/components/ui/Card` which are no longer used on this page.
  
  Replace the rendering loops under Section 1 (Trắc nghiệm) and Section 2 (Tự luận) with the standardized component.

  For Multiple Choice (Lines 77-122):
  ```tsx
  {multipleChoiceQs.map((q) => (
    <QuestionCard
      key={q.id}
      question={q}
      mode="teacher"
      onRegenerate={(qId) => console.log('Regenerating question:', qId)}
    />
  ))}
  ```

  For Essay (Lines 132-167):
  ```tsx
  {essayQs.map((q) => (
    <QuestionCard
      key={q.id}
      question={q}
      mode="teacher"
      onRegenerate={(qId) => console.log('Regenerating question:', qId)}
    />
  ))}
  ```

- [ ] **Step 2: Clean up unused imports**
  Remove unused icon imports (`CheckCircle2`, `Eye`, `Flag`, `BookOpen`) and card component imports (`CardFooter` etc.) at the top of the file to keep the code pristine.

- [ ] **Step 3: Verify TypeScript compilation**
  Run:
  ```bash
  cd /Users/modeptrai/Desktop/ToanThucChien/frontend && npx tsc --noEmit
  ```
  Expected: Success with no compiler warnings or errors.

- [ ] **Step 4: Commit changes**
  ```bash
  git add frontend/src/app/dashboard/exams/create/page.tsx
  git commit -m "refactor: integrate standardized QuestionCard into Exam Creator page"
  ```

---

## Verification Plan

### Automated/Compilation Checks
- Run type-checker: `npx tsc --noEmit` inside `/frontend` to verify all imports and typed props compile cleanly.
- Run next production build: `npm run build` inside `/frontend` to verify Next.js static asset and route generation passes flawlessly.

### Manual Visual Verification
- Deploy local dev server (`npm run dev`) and visit `http://localhost:3000/ui-lab` to check the side-by-side rendering of Teacher vs Student modes.
- Visit `http://localhost:3000/dashboard/exams/create` to check that the list of multiple choice questions displays the correct answers highlighted with proper borders, and the list of essay questions directly outputs the model solution in a beautifully formatted amber container.
