# Design Spec: Atomic Components Optimization

**Goal:** Simplify and unify the atomic components (`Button`, `Badge`) by replacing redundant, specialized variants (like `pill-primary`, `large-primary`, `pricing-primary`, `red-outline`, etc.) with core semantic variants combined with helper props (`pill`, `circle`, `fullWidth`), and extract a dedicated `Tag` component for removable metadata chips.

---

## Proposed Technical Solutions

### 1. Simplify Button API & Styles (`Button.tsx`)
Refactor `<Button>` to use clean semantic variants and sizes, shifting shape and width constraints to boolean helper props.
*   **API Interface**:
    ```typescript
    export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
      variant?: 'default' | 'secondary' | 'outline' | 'outline-slate' | 'ghost' | 'danger';
      size?: 'default' | 'sm' | 'lg' | 'icon';
      pill?: boolean;       // Applies rounded-full
      circle?: boolean;     // Applies aspect-square, rounded-full
      fullWidth?: boolean;  // Applies w-full
    }
    ```
*   **Mapping logic**:
    *   `pill` class: `rounded-full`
    *   `circle` class: `rounded-full aspect-square flex items-center justify-center p-0`
    *   `fullWidth` class: `w-full`
*   **Remove custom variants/sizes**:
    *   Remove: `pill-primary`, `pill-outline`, `large-primary`, `large-outline`, `pricing-primary`, `pricing-outline`, `action-primary`, `action-secondary`, `fab`, `difficulty-active`, `difficulty-inactive`, `math`.
    *   Remove sizes: `circle`, `math`, `pill`, `large`, `pricing`, `fab`, `action`.

### 2. Simplify Badge API & Styles (`Badge.tsx`)
Refactor `<Badge>` to restrict variants to core semantic alerts and add a helper for capsule-shaped pills.
*   **API Interface**:
    ```typescript
    export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
      variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
      size?: 'sm' | 'md';
      pill?: boolean;       // Applies rounded-full
    }
    ```
*   **Mapping logic**:
    *   `pill` class: `rounded-full px-3 py-1` (or matching custom requirements)
*   **Remove custom variants**:
    *   Remove: `red-outline`, `blue-filled`, `blue-pill`.

### 3. Extract Removable Tag Component (`Tag.tsx`)
Create a new atomic component `<Tag>` under `components/ui/Tag.tsx` to handle tag rendering with an optional close button and click callback.
*   **Component Structure**:
    ```tsx
    import React from 'react';
    import { X } from 'lucide-react';
    import { cn } from '@/lib/utils';

    export interface TagProps {
      label: string;
      onRemove?: () => void;
      className?: string;
    }

    export const Tag: React.FC<TagProps> = ({ label, onRemove, className }) => {
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest select-none",
            className
          )}
        >
          {label}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="hover:text-blue-800 transition-colors cursor-pointer focus:outline-none"
            >
              <X size={12} />
            </button>
          )}
        </span>
      );
    };
    Tag.displayName = "Tag";
    ```

### 4. Harmonize UI Lab & Import Pages
*   Refactor all references in `ui-lab/page.tsx` and `question-bank/import/page.tsx` to utilize the streamlined `<Button>`, `<Badge>`, and the newly introduced `<Tag>` component.
*   Convert inline-styled `span` elements (for tags) to `<Tag>`.
*   Convert custom difficulty button variant calls into standard variants + styling classes.

---

## Proposed File Changes

*   [MODIFY] [Button.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/components/ui/Button.tsx)
*   [MODIFY] [Badge.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/components/ui/Badge.tsx)
*   [NEW] [Tag.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/components/ui/Tag.tsx)
*   [MODIFY] [page.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/app/ui-lab/page.tsx)
*   [MODIFY] [page.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/app/question-bank/import/page.tsx)

---

## Verification Plan

### Automated Tests
- Type checking: `cd frontend && npx tsc --noEmit`
- Production compilation: `cd frontend && npm run build`

### Manual Verification
- Run Next.js development server: `cd frontend && npm run dev`
- Open web browser at `http://localhost:3000/ui-lab` and `http://localhost:3000/question-bank/import` to verify layout alignment, interaction states, and correct rendering.
