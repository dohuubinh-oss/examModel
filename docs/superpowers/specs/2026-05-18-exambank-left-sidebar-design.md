# Design Specification: Left-Aligned Sidebar & Navigation Menu for Exam Bank

This specification details the layout restructuring of the **Exam Bank (Ngân hàng đề thi)** page to match the identical visual hierarchy, structural alignment, and design system of the **Question Bank (Ngân hàng câu hỏi)** page.

## 🌟 Goals & Requirements

1. **Symmetrical Left-Sidebar Layout:** Move the filters from the right column to the left column. The left sidebar will have a fixed width of `w-72` (288px) and a right border (`border-r border-slate-100`).
2. **Page Navigation Menu Integration:** Embed a unified sidebar navigation menu at the top of the left sidebar containing:
   - **Bảng điều khiển** (Inactive)
   - **Ngân hàng câu hỏi** (Inactive, linking to `/question-bank`)
   - **Ngân hàng đề thi** (Active, highlighted with primary EdTech blue background and right vertical highlight bar)
   - **Học sinh** (Inactive)
3. **Customized Filter Checkboxes:**
   - **Khối lớp:** Display grades `Lớp 5`, `Lớp 6`, `Lớp 7`, `Lớp 8`, `Lớp 9`, and `Luyện thi 10` (mapped to raw filter keys `'5', '6', '7', '8', '9', '10'`).
   - **Chuyên đề (Exam Types):** Replace subject tags with exam type selectors: `15 Phút`, `1 Tiết`, `Giữa Kì`, and `Cuối Kì`.
   - **Mức độ:** Maintain the standard categories `Nhận biết`, `Thông hiểu`, `Vận dụng`, and `Vận dụng cao`.
4. **Dynamic High-Fidelity Client-Side Filtering:** Update mock exam records and the client-side filter computation logic so that clicking any checkbox dynamically hides/shows matching records with perfect precision.

---

## 🛠️ Proposed Changes

### 1. File: [page.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/app/dashboard/questions/bank/page.tsx)

#### A. Layout Restructuring (HTML/JSX)
- Remove `rightFilterSidebar`.
- Inline a left sidebar `<aside className="w-72 border-r border-slate-100 overflow-y-auto hidden md:block bg-white p-4 space-y-6 shrink-0 h-[calc(100vh-80px)]">` on the left side of `<main>`.
- In the sidebar, insert:
  1. The **Page Navigation Menu** block, utilizing `LayoutDashboard`, `Database`, `FileText`, and `Users` from `lucide-react`. The "Ngân hàng đề thi" item is marked active.
  2. A separator `<hr className="border-slate-100" />`.
  3. The **Collapsible Filter Groups** for Grades, Exam Types, and Levels.

#### B. Mock Data Adjustment
Update `mockExams` grades and names to align perfectly with the new filter parameters:
- `grade` will be set to keys like `"5"`, `"6"`, `"7"`, `"8"`, `"9"`, `"10"`.
- Names and durations are tuned so they map easily to the Exam Types (`15 Phút`, `1 Tiết`, `Giữa Kì`, `Cuối Kì`).

#### C. Filter Matching Logic
Refine the client-side filter logic inside `React.useMemo` to evaluate categories dynamically:
```typescript
const filteredExams = React.useMemo(() => {
  return mockExams.filter(exam => {
    // 1. Grade checkbox match
    const matchGrade = selectedGrades.length === 0 || selectedGrades.includes(exam.grade);

    // 2. Exam Type match (based on name or duration characteristics)
    const matchSubject = selectedSubjects.length === 0 || selectedSubjects.some(subj => {
      if (subj === '15 Phút' && (exam.name.includes('15p') || exam.duration.includes('15'))) return true;
      if (subj === '1 Tiết' && (exam.name.includes('45p') || exam.duration.includes('45') || exam.duration.includes('30'))) return true;
      if (subj === 'Giữa Kì' && (exam.name.includes('Giữa kỳ') || exam.name.includes('Giữa Kì'))) return true;
      if (subj === 'Cuối Kì' && (exam.name.includes('Học kỳ') || exam.name.includes('Cuối Kì') || exam.name.includes('thi thử') || exam.name.includes('Tốt nghiệp'))) return true;
      return false;
    });

    // 3. Level match
    const matchLevel = selectedLevels.length === 0 || selectedLevels.some(lvl => {
      if (lvl === 'Nhận biết' && exam.questionsCount <= 20) return true;
      if (lvl === 'Thông hiểu' && exam.questionsCount > 20 && exam.questionsCount <= 35) return true;
      if (lvl === 'Vận dụng' && exam.questionsCount > 35) return true;
      return false;
    });

    return matchGrade && matchSubject && matchLevel;
  });
}, [mockExams, selectedGrades, selectedSubjects, selectedLevels]);
```

---

## 🧪 Verification Plan

### Automated Build Verification
1. Run typescript compiler check:
   ```bash
   cd frontend && npx tsc --noEmit
   ```
2. Verify Next.js dev server status and ensure zero compilation warnings or type mismatches.

### Manual Visual Verification
1. Open `http://localhost:3000/dashboard/questions/bank` in browser.
2. Confirm the sidebar correctly sits on the left of the table.
3. Verify menu navigation styling: "Ngân hàng đề thi" must be active, "Ngân hàng câu hỏi" inactive. Clicking "Ngân hàng câu hỏi" must successfully navigate to `/question-bank`.
4. Test clicking Grade 5-10, Exam Types (15 Phút, 1 Tiết...), and Levels to see records filter instantly without page jumps.
