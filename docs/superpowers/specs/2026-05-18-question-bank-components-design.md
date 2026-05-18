# Design Specification: Question Bank Atomic UI Components

This specification details the architecture, generalized props, and visual design patterns for the core reusable Atoms and Molecules required by the "Ngân hàng câu hỏi" (Question Bank) layout.

---

## 🏗️ Component Specifications

### 1. `Badge` (Generalized)
- **File**: `components/ui/Badge.tsx`
- **Behavior**: Extends generic HTML attributes for `div`. Supports new semantic variants with light tints, bold typeface, and responsive sizing.
- **Props**:
  ```typescript
  export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
    size?: 'sm' | 'md';
  }
  ```
- **Styling Specs**:
  - `variant="primary"`: `bg-primary/10 text-primary border-transparent`
  - `variant="success"`: `bg-green-500/10 text-green-600 border-transparent`
  - `variant="warning"`: `bg-amber-500/10 text-amber-600 border-transparent`
  - `variant="danger"`: `bg-red-500/10 text-red-600 border-transparent`
  - `size="sm"`: `text-[10px] font-bold uppercase px-2 py-0.5 rounded` (ideal for tags)
  - `size="md"`: `text-xs font-semibold px-2.5 py-1 rounded-lg`

---

### 2. `Button` (Generalized)
- **File**: `components/ui/Button.tsx`
- **Behavior**: Extends standard HTML button attributes. Enhances flexibility for icon buttons and custom border layouts.
- **Props**:
  ```typescript
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'outline-slate' | 'ghost' | 'ghost-danger';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
  ```
- **Styling Specs**:
  - `variant="outline-slate"`: `bg-card-bg border border-slate-200 text-slate-700 hover:bg-slate-100` (perfect for secondary action blocks like "Nhập từ JSON")
  - `variant="ghost-danger"`: `text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-all`
  - `size="icon"`: `p-1.5 aspect-square rounded flex items-center justify-center`

---

### 3. `Checkbox` (New Atom)
- **File**: `components/ui/Checkbox.tsx`
- **Behavior**: Standard controlled or uncontrolled custom checkbox with primary styling. Supports custom size definitions.
- **Props**:
  ```typescript
  import React from 'react';

  export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checkboxSize?: 'sm' | 'md';
  }
  ```
- **Styling Specs**:
  - `checkboxSize="sm"`: `h-3 w-3 rounded` (ideal for sidebar filtering)
  - `checkboxSize="md"`: `h-4 w-4 rounded` (ideal for question selection)
  - CSS Core: `border-slate-300 text-primary focus:ring-primary cursor-pointer transition-all`

---

### 4. `Collapsible` (New Molecule)
- **File**: `components/ui/Collapsible.tsx`
- **Behavior**: Lightweight wrapper utilizing the native HTML `<details>` and `<summary>` elements to create expandable filters with high performance and zero external dependencies.
- **Props**:
  ```typescript
  import React from 'react';

  export interface CollapsibleProps extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
    title: string;
    iconName?: string;
  }
  ```
- **Styling Specs**:
  - Custom summaries with rotating Chevron arrows matching the standard `group-open:rotate-180` pattern.
  - Fully dynamic spacing inside the collapsible container.

---

### 5. `FloatingActionBar` (New Molecule)
- **File**: `components/ui/FloatingActionBar.tsx`
- **Behavior**: Fixed action bar at the bottom with modern glassmorphism or sleek white background. It slides up when a selection is active.
- **Props**:
  ```typescript
  import React from 'react';

  export interface FloatingAction {
    label: string;
    icon: string;
    onClick: () => void;
    variant?: 'default' | 'danger';
  }

  export interface FloatingActionBarProps {
    selectedCount: number;
    onClear: () => void;
    actions: FloatingAction[];
    isOpen: boolean;
  }
  ```
- **Styling Specs**:
  - CSS: `fixed bottom-8 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-6 z-50`

---

## 🎨 UI Lab Integration Plan
- Incorporate all these newly added/enhanced components in `frontend/src/app/ui-lab/page.tsx`.
- Create clear, dedicated interactive testing sections for:
  1. **Buttons & Icon Configurations** (showing all variants, sizes, and hover states).
  2. **Badges & Tag Semantics** (displaying multiple levels, subjects, and layouts).
  3. **Custom Checkboxes & Collapsibles** (interactive toggles and dynamic sidebar filter clones).
  4. **Floating Action Bar Controller** (a toggle button to open/close and interact with the action bar).
