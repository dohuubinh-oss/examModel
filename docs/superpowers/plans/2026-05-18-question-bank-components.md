# Question Bank UI Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, generalize, and integrate core reusable Atoms and Molecules (Button, Badge, Checkbox, Collapsible, FloatingActionBar) required by the Question Bank layout.

**Architecture:** Extend existing atomic React components in `components/ui/` and create new lightweight elements supporting custom variants and semantic styles, integrated and verified in a comprehensive interactive UI Lab page.

**Tech Stack:** Next.js (React), TypeScript, Tailwind CSS, Lucide React icons.

---

### Task 1: Generalize Badge Component

**Files:**
- Modify: `src/components/ui/Badge.tsx`

- [ ] **Step 1: Write generalized Badge component implementation**
  Replace `src/components/ui/Badge.tsx` with high-fidelity, generalized classes supporting new variants and sizes.
  ```tsx
  import React from 'react';
  import { cn } from '@/lib/utils';

  export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
    size?: 'sm' | 'md';
  }

  export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', size = 'sm', ...props }, ref) => {
      const baseStyles = "inline-flex items-center justify-center font-medium transition-colors";
      
      const variants = {
        default: "bg-slate-100 text-slate-500",
        primary: "bg-primary/10 text-primary border-transparent",
        success: "bg-green-500/10 text-green-600 border-transparent",
        warning: "bg-amber-500/10 text-amber-600 border-transparent",
        danger: "bg-red-500/10 text-red-600 border-transparent",
        outline: "border border-slate-300 text-slate-700 bg-white",
      };

      const sizes = {
        sm: "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
        md: "text-xs font-semibold px-2.5 py-1 rounded-lg h-7",
      };

      return (
        <div
          ref={ref}
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          {...props}
        />
      );
    }
  );
  Badge.displayName = "Badge";
  ```

- [ ] **Step 2: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: Command finishes with no errors.

- [ ] **Step 3: Commit changes**
  Run:
  ```bash
  git add src/components/ui/Badge.tsx
  git commit -m "feat: generalize Badge component with HSL semantic variants and custom sizes"
  ```

---

### Task 2: Generalize Button Component

**Files:**
- Modify: `src/components/ui/Button.tsx`

- [ ] **Step 1: Write generalized Button component implementation**
  Add the `outline-slate` and `ghost-danger` variants to `src/components/ui/Button.tsx`.
  ```tsx
  import React from 'react';
  import { cn } from '@/lib/utils';

  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'outline-slate' | 'ghost' | 'ghost-danger';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }

  export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
      
      const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none";
      
      const variants = {
        default: "bg-primary hover:bg-primary/90 text-white shadow-sm",
        secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
        outline: "bg-white border border-primary text-primary hover:bg-primary hover:text-white",
        "outline-slate": "bg-slate-50/50 border border-slate-200 text-slate-700 hover:bg-slate-100",
        ghost: "text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20",
        "ghost-danger": "text-slate-400 hover:text-red-500 hover:bg-red-500/10",
      };

      const sizes = {
        default: "h-10 px-5 py-2 text-sm rounded-lg",
        sm: "h-8 px-3 py-1.5 text-xs rounded-lg",
        lg: "h-12 px-8 py-3 text-base rounded-xl",
        icon: "p-1.5 rounded flex items-center justify-center aspect-square",
      };

      return (
        <button
          ref={ref}
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          {...props}
        />
      );
    }
  );
  Button.displayName = "Button";
  ```

- [ ] **Step 2: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: Command finishes with no errors.

- [ ] **Step 3: Commit changes**
  Run:
  ```bash
  git add src/components/ui/Button.tsx
  git commit -m "feat: generalize Button component with outline-slate and ghost-danger variants"
  ```

---

### Task 3: Create Checkbox Component

**Files:**
- Create: `src/components/ui/Checkbox.tsx`

- [ ] **Step 1: Write Checkbox component implementation**
  Create the new `src/components/ui/Checkbox.tsx` component.
  ```tsx
  import React from 'react';
  import { cn } from '@/lib/utils';

  export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checkboxSize?: 'sm' | 'md';
  }

  export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checkboxSize = 'md', ...props }, ref) => {
      const sizes = {
        sm: "h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer transition-all",
        md: "h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer transition-all",
      };

      return (
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "focus:ring-offset-0 focus:outline-none focus:ring-2 focus:ring-primary/20",
            sizes[checkboxSize],
            className
          )}
          {...props}
        />
      );
    }
  );
  Checkbox.displayName = "Checkbox";
  ```

- [ ] **Step 2: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: Command finishes with no errors.

- [ ] **Step 3: Commit changes**
  Run:
  ```bash
  git add src/components/ui/Checkbox.tsx
  git commit -m "feat: add Checkbox component with size options"
  ```

---

### Task 4: Create Collapsible Component

**Files:**
- Create: `src/components/ui/Collapsible.tsx`

- [ ] **Step 1: Write Collapsible component implementation**
  Create the new `src/components/ui/Collapsible.tsx` component.
  ```tsx
  'use client';

  import React from 'react';
  import { ChevronDown } from 'lucide-react';
  import { cn } from '@/lib/utils';

  export interface CollapsibleProps extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
    title: string;
    icon?: React.ReactNode;
    childrenClassName?: string;
  }

  export const Collapsible = React.forwardRef<HTMLDetailsElement, CollapsibleProps>(
    ({ className, title, icon, children, childrenClassName, ...props }, ref) => {
      return (
        <details
          ref={ref}
          className={cn("group px-3 overflow-hidden transition-all duration-300", className)}
          {...props}
        >
          <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold py-1 hover:text-primary transition-colors list-none outline-none select-none">
            <div className="flex items-center gap-2 text-slate-700 group-open:text-primary group-hover:text-primary transition-colors">
              {icon}
              <span>{title}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 group-open:rotate-180 group-open:text-primary transition-transform duration-200" />
          </summary>
          <div className={cn("mt-3 grid gap-2 pl-6 pb-2 transition-all", childrenClassName)}>
            {children}
          </div>
        </details>
      );
    }
  );
  Collapsible.displayName = "Collapsible";
  ```

- [ ] **Step 2: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: Command finishes with no errors.

- [ ] **Step 3: Commit changes**
  Run:
  ```bash
  git add src/components/ui/Collapsible.tsx
  git commit -m "feat: add Collapsible HTML5 details wrapper component"
  ```

---

### Task 5: Create FloatingActionBar Component

**Files:**
- Create: `src/components/ui/FloatingActionBar.tsx`

- [ ] **Step 1: Write FloatingActionBar component implementation**
  Create the new `src/components/ui/FloatingActionBar.tsx` component.
  ```tsx
  'use client';

  import React from 'react';
  import { X } from 'lucide-react';
  import { Button } from './Button';
  import { cn } from '@/lib/utils';

  export interface FloatingAction {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'ghost-danger';
  }

  export interface FloatingActionBarProps {
    selectedCount: number;
    onClear: () => void;
    actions: FloatingAction[];
    isOpen: boolean;
    className?: string;
  }

  export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
    selectedCount,
    onClear,
    actions,
    isOpen,
    className
  }) => {
    if (!isOpen) return null;

    return (
      <div
        className={cn(
          "fixed bottom-8 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
            {selectedCount}
          </span>
          <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            Đã chọn {selectedCount} câu hỏi
          </span>
        </div>
        <div className="h-6 w-px bg-slate-200" />
        <div className="flex items-center gap-4">
          {actions.map((act, idx) => (
            <Button
              key={idx}
              variant={act.variant || 'outline-slate'}
              size="sm"
              onClick={act.onClick}
              className="text-xs font-bold whitespace-nowrap flex items-center gap-1.5"
            >
              {act.icon}
              {act.label}
            </Button>
          ))}
        </div>
        <button
          onClick={onClear}
          className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-1 hover:bg-slate-50 rounded"
          title="Đóng thanh tác vụ"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };
  FloatingActionBar.displayName = "FloatingActionBar";
  ```

- [ ] **Step 2: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: Command finishes with no errors.

- [ ] **Step 3: Commit changes**
  Run:
  ```bash
  git add src/components/ui/FloatingActionBar.tsx
  git commit -m "feat: add FloatingActionBar interactive component"
  ```

---

### Task 6: Integrate Components in UI Lab

**Files:**
- Modify: `src/app/ui-lab/page.tsx`

- [ ] **Step 1: Write UI Lab page showcase code**
  Replace `src/app/ui-lab/page.tsx` with complete implementation below:
  ```tsx
  'use client';

  import React from 'react';
  import { Save, FileDown, Eye, RefreshCw, Flag, Settings, Upload, Plus, School, Category, FolderOpen, Printer, Trash2 } from 'lucide-react';
  import { Button } from '@/components/ui/Button';
  import { Input } from '@/components/ui/Input';
  import { Select } from '@/components/ui/Select';
  import { Badge } from '@/components/ui/Badge';
  import { Checkbox } from '@/components/ui/Checkbox';
  import { Collapsible } from '@/components/ui/Collapsible';
  import { FloatingActionBar } from '@/components/ui/FloatingActionBar';
  import { QuestionCard } from '@/components/questions/QuestionCard';
  import { mockQuestions } from '@/lib/mock-data';

  export default function UILabPage() {
    const [selectedLabOpt, setSelectedLabOpt] = React.useState<string>('');
    const [selectedQs, setSelectedQs] = React.useState<string[]>([]);
    const [isBarOpen, setIsBarOpen] = React.useState<boolean>(false);

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

            <div className="md:col-span-2 space-y-4 pl-0 md:pl-6">
              <h3 className="text-sm font-bold text-slate-700">Sidebar Collapsible Filters Mockup</h3>
              <div className="w-72 border border-slate-100 rounded-xl bg-slate-50/50 p-3 space-y-3">
                <Collapsible title="Khối lớp" icon={<School className="h-4 w-4" />} defaultOpen>
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

                <Collapsible title="Môn học" icon={<Category className="h-4 w-4" />} defaultOpen>
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
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: Command finishes with no errors.

- [ ] **Step 3: Commit changes**
  Run:
  ```bash
  git add src/app/ui-lab/page.tsx
  git commit -m "feat: integrate all new and generalized components into interactive UI Lab"
  ```
