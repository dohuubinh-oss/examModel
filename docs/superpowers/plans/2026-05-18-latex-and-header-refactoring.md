# QuestionCard Header Splitting & KaTeX Math Rendering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `<QuestionCard>` component to separate metadata from question content (full width display) and integrate dynamic CDN-based KaTeX math rendering, ensuring high-fidelity mathematical formulas across the whole application.

**Architecture:** Create a lightweight, high-performance client component `<Latex>` that dynamically loads KaTeX assets from jsdelivr/cdnjs. In `<QuestionCard>`, split CardHeader so only topic/level/number metadata exists at the top flex row, rendering the question content in full width below it using `<Latex>`.

**Tech Stack:** React 19, Next.js 16 (app router), TypeScript 5, Tailwind CSS, KaTeX CDN.

---

## Files to Create and Modify

*   [NEW] [Latex.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/components/ui/Latex.tsx)
*   [MODIFY] [QuestionCard.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/components/questions/QuestionCard.tsx)
*   [MODIFY] [mock-data.ts](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/lib/mock-data.ts)

---

## Tasks

### Task 1: Wrap Math Expressions in mock-data.ts

**Files:**
*   Modify: [mock-data.ts](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/lib/mock-data.ts)

- [ ] **Step 1: Wrap math equations in `mockQuestions` in `$` delimiters**
  Open `frontend/src/lib/mock-data.ts`. Wrap all inline formulas in questions `q1`, `q2`, and `q3` (content, options, and solution) inside `$` signs so they are correctly detected by KaTeX.

  Replace `mockQuestions` array with the following:
  ```typescript
  export const mockQuestions: Question[] = [
    {
      id: "q1",
      number: 1,
      topic: "Giải tích",
      level: "Vận dụng",
      type: "multiple_choice",
      content: "Tìm tất cả các giá trị thực của tham số $m$ để hàm số $y = \\frac{1}{3}x^3 - mx^2 + (m^2 - m + 1)x + 1$ đạt cực đại tại $x = 1$.",
      options: [
        { id: "opt1_a", label: "A", content: "$m = 1$", isCorrect: false },
        { id: "opt1_b", label: "B", content: "$m = 2$", isCorrect: true },
        { id: "opt1_c", label: "C", content: "$m \\in \\{1; 2\\}$", isCorrect: false },
        { id: "opt1_d", label: "D", content: "$m \\in \\emptyset$", isCorrect: false },
      ]
    },
    {
      id: "q2",
      number: 2,
      topic: "Hình học không gian",
      level: "Thông hiểu",
      type: "multiple_choice",
      content: "Cho khối chóp $S.ABC$ có đáy $ABC$ là tam giác vuông cân tại $B$, $AB = a$. Cạnh bên $SA$ vuông góc với mặt phẳng đáy và $SA = a\\sqrt{2}$. Thể tích của khối chóp đã cho bằng:",
      options: [
        { id: "opt2_a", label: "A", content: "$\\frac{a^3\\sqrt{2}}{6}$", isCorrect: true },
        { id: "opt2_b", label: "B", content: "$\\frac{a^3\\sqrt{2}}{3}$", isCorrect: false },
        { id: "opt2_c", label: "C", content: "$\\frac{a^3\\sqrt{2}}{2}$", isCorrect: false },
        { id: "opt2_d", label: "D", content: "$a^3\\sqrt{2}$", isCorrect: false },
      ]
    },
    {
      id: "q3",
      number: 3,
      topic: "Hình học không gian",
      level: "Vận dụng cao",
      type: "essay",
      content: "Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$. Cạnh bên $SA$ vuông góc với đáy, $SA = a\\sqrt{2}$. Gọi $M$ là trung điểm của $BC$. Tính khoảng cách từ điểm $M$ đến mặt phẳng $(SCD)$.",
      solution: "1. Kẻ $AH \\perp SD$ tại $H$. Chứng minh được $AH \\perp (SCD)$.<br/>2. Sử dụng hệ thức lượng trong tam giác vuông $SAD$: $\\frac{1}{AH^2} = \\frac{1}{AS^2} + \\frac{1}{AD^2} = \\frac{1}{2a^2} + \\frac{1}{a^2} = \\frac{3}{2a^2} \\Rightarrow AH = a\\sqrt{\\frac{2}{3}}$.<br/>3. Do $AD // BC$ nên $BC // (SCD) \\Rightarrow d(M, (SCD)) = d(A, (SCD)) = AH = \\frac{a\\sqrt{6}}{3}$."
    }
  ];
  ```

- [ ] **Step 2: Verify type safety compilation**
  Run:
  ```bash
  cd /Users/modeptrai/Desktop/ToanThucChien/frontend && npx tsc --noEmit
  ```
  Expected: Success with no errors.

- [ ] **Step 3: Commit Task 1 changes**
  ```bash
  git add frontend/src/lib/mock-data.ts
  git commit -m "feat: format math formulas with dollar delimiters in mock questions"
  ```

---

### Task 2: Create Dynamic `<Latex>` Component

**Files:**
*   Create: [Latex.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/components/ui/Latex.tsx)

- [ ] **Step 1: Write implementation for `Latex.tsx`**
  Create `frontend/src/components/ui/Latex.tsx` and implement dynamic KaTeX stylesheet/scripts loader and auto-render functionality.

  ```tsx
  'use client';

  import React, { useEffect, useRef, useState } from 'react';

  declare global {
    interface Window {
      katex?: any;
      renderMathInElement?: any;
    }
  }

  interface LatexProps {
    text?: string;
    className?: string;
  }

  export const Latex: React.FC<LatexProps> = ({ text = '', className = '' }) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
      if (window.katex && window.renderMathInElement) {
        setIsLoaded(true);
        return;
      }

      const cssId = 'katex-css';
      if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
        document.head.appendChild(link);
      }

      const scriptId = 'katex-js';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
        script.async = true;
        script.onload = () => {
          checkAndLoadAutoRender();
        };
        document.head.appendChild(script);
      } else {
        checkAndLoadAutoRender();
      }

      function checkAndLoadAutoRender() {
        const autoId = 'katex-auto-render';
        if (!document.getElementById(autoId)) {
          const autoScript = document.createElement('script');
          autoScript.id = autoId;
          autoScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js';
          autoScript.async = true;
          autoScript.onload = () => {
            setIsLoaded(true);
          };
          document.head.appendChild(autoScript);
        } else {
          const interval = setInterval(() => {
            if (window.renderMathInElement) {
              clearInterval(interval);
              setIsLoaded(true);
            }
          }, 50);
        }
      }
    }, []);

    useEffect(() => {
      if (isLoaded && containerRef.current && window.renderMathInElement) {
        try {
          window.renderMathInElement(containerRef.current, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        } catch (err) {
          console.error('KaTeX rendering error:', err);
        }
      }
    }, [isLoaded, text]);

    return (
      <span 
        ref={containerRef} 
        className={`latex-container inline-block ${className}`}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  };
  ```

- [ ] **Step 2: Run type checking**
  Run:
  ```bash
  cd /Users/modeptrai/Desktop/ToanThucChien/frontend && npx tsc --noEmit
  ```
  Expected: Success.

- [ ] **Step 3: Commit Task 2**
  ```bash
  git add frontend/src/components/ui/Latex.tsx
  git commit -m "feat: create dynamic Latex CDN loader component"
  ```

---

### Task 3: Split QuestionCard Header & Integrate LaTeX

**Files:**
*   Modify: [QuestionCard.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/components/questions/QuestionCard.tsx)

- [ ] **Step 1: Refactor component structure**
  Open `frontend/src/components/questions/QuestionCard.tsx`.
  - Import the `<Latex>` component from `@/components/ui/Latex`.
  - In the returned JSX, separate `<CardHeader>` so it only contains the meta elements (`Câu X` badge and `topic • level` text) and the "Đổi câu hỏi" button.
  - Insert a new question stem container `div` between `<CardHeader>` and `<CardContent>` to allow the question content to span the full width of the card.
  - Wrap `question.content` inside `<Latex text={question.content} />`.
  - Wrap multiple choice options inside `<Latex text={opt.content} />`.
  - Wrap essay model solution inside `<Latex text={question.solution} />`.

  Write the updated code:
  ```tsx
  import React from 'react';
  import { CheckCircle2, RefreshCw } from 'lucide-react';
  import { Card, CardHeader, CardContent } from '@/components/ui/Card';
  import { Badge } from '@/components/ui/Badge';
  import { Button } from '@/components/ui/Button';
  import { Question } from '@/lib/mock-data';
  import { Latex } from '@/components/ui/Latex';

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
        {/* Card Header (Meta Info Row only) */}
        <CardHeader className="flex justify-between items-center flex-row gap-4 p-5 border-b border-slate-100 bg-white">
          <div className="flex gap-3 items-center">
            <Badge variant="primary" className="shrink-0">Câu {question.number}</Badge>
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
              {question.topic} • {question.level}
            </span>
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

        {/* Card Question Stem (Full Width Question Content) */}
        <div className="p-5 pb-4 bg-white">
          <div className="text-slate-800 leading-relaxed text-base font-normal font-display">
            <Latex text={question.content} />
          </div>
        </div>

        {/* Card Content (Choices or Solutions) */}
        <CardContent className="bg-slate-50/50 p-5 border-t border-slate-100">
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
                    <Latex 
                      className="text-slate-700 font-display text-sm" 
                      text={opt.content}
                    />
                    {showAsCorrect && <CheckCircle2 className="text-primary ml-auto shrink-0" size={18} />}
                  </div>
                );
              })}
            </div>
          ) : (
            isTeacher && question.solution ? (
              <div className="border border-dashed border-amber-300 bg-amber-50/10 p-5 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  Hướng dẫn chấm / Lời giải mẫu:
                </span>
                <Latex 
                  className="text-sm text-slate-700 leading-relaxed font-display" 
                  text={question.solution}
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

- [ ] **Step 2: Run type checking**
  Run:
  ```bash
  cd /Users/modeptrai/Desktop/ToanThucChien/frontend && npx tsc --noEmit
  ```
  Expected: Success.

- [ ] **Step 3: Commit Task 3**
  ```bash
  git add frontend/src/components/questions/QuestionCard.tsx
  git commit -m "refactor: split QuestionCard header and wrap outputs in Latex component"
  ```

---

### Task 4: Verify Project Compilation & Production Build

- [ ] **Step 1: Run TypeScript compiler**
  Run:
  ```bash
  cd /Users/modeptrai/Desktop/ToanThucChien/frontend && npx tsc --noEmit
  ```
  Expected: Success with `0` errors.

- [ ] **Step 2: Run production Next build**
  Run:
  ```bash
  cd /Users/modeptrai/Desktop/ToanThucChien/frontend && npm run build
  ```
  Expected: Succeeded. All pages pre-rendered as static content successfully.

- [ ] **Step 3: Commit final build report**
  ```bash
  git add -A
  git commit -m "chore: verify successful production compilation and build"
  ```

---

## Verification Plan

- Navigate to `http://localhost:3000/ui-lab` and `http://localhost:3000/dashboard/exams/create` to manually check correct rendering of math equations (such as square roots and fractions) and the beautiful two-row card spacing.
