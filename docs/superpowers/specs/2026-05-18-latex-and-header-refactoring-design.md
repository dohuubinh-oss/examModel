# Design Spec: QuestionCard Header Splitting & KaTeX Math Rendering

**Goal:** Redesign the reusable `<QuestionCard>` component to support full-width, beautiful LaTeX math rendering and separate the metadata from the question content so long math strings expand without horizontal constriction.

---

## Proposed Technical Solutions

### 1. Dynamic LaTeX Component (`Latex.tsx`)
Create a client component `<Latex text={string} />` that:
- Loads KaTeX CSS stylesheet from CDN.
- Loads KaTeX JS engine and KaTeX Auto-render JS extension from CDN.
- Caches loaded state globally to avoid double loading.
- Scans its mounting container React `ref` for inline `$...$` or block `$$...$$` math strings, converting them on mount or update using:
  ```javascript
  window.renderMathInElement(container, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false }
    ],
    throwOnError: false
  });
  ```

### 2. Header and QuestionContent Separator
Refactor `<QuestionCard>` layout from:
- A flex row `CardHeader` that combines `Câu X`, `Topic • Level`, `question.content`, and `onRegenerate` button.
To:
1.  **CardHeader (Metadata Row only)**: A clean flex row containing the `Câu X` badge and `{topic} • {level}` text on the left, and the `Đổi câu hỏi` button on the right.
2.  **Question Stem Section (Full Width)**: A dedicated `div` directly under the header that renders `<Latex text={question.content} />` utilizing 100% of the card's available width.
3.  **CardContent (Choices & Solutions)**: Option buttons and essay model solutions wrapped in `<Latex />` to format math symbols beautifully.

### 3. Mock Data Formatting (`mock-data.ts`)
Wrap all inline math variables, fractions, and square roots in `mock-data.ts` inside `$` delimiters to enable clean auto-rendering.

---

## Proposed File Changes

*   [NEW] [Latex.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/components/ui/Latex.tsx)
*   [MODIFY] [QuestionCard.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/components/questions/QuestionCard.tsx)
*   [MODIFY] [mock-data.ts](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/lib/mock-data.ts)

---

## Verification Plan

- **TypeScript Compilation**: Run `npx tsc --noEmit` to verify type safety.
- **Production Build**: Run `npm run build` to verify routes generate smoothly.
- **Visual Inspection**: Run `npm run dev` and navigate to `http://localhost:3000/ui-lab` and `http://localhost:3000/dashboard/exams/create` to ensure all LaTeX formats correctly.
