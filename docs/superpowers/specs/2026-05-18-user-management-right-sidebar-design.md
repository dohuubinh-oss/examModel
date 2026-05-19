# Design Specification: User Management Right Sidebar Layout

This specification details the layout restructuring of the **User Management Dashboard Page** to align with the **Exam Creation Page** standard, leveraging the `RightSidebarLayout` component.

## 🌟 Goals & Requirements

1. **Consistent Grid Scaffolding:** Replace the left side collapsible sidebar with the standardized `RightSidebarLayout` (Left: Main Workspace area `lg:col-span-9`, Right: Config/Filter Sidebar `lg:col-span-3`).
2. **Component-Driven Styling:** 
   - Wrap filters inside premium `Card` components from `@/components/ui/Card`.
   - Use `Collapsible` elements for specific filter selections.
3. **Advanced Dynamic Stats Widget:** Add a visual statistics tracker mimicking the Exam Creation's matrix/difficulty progress bars:
   - Total users counter.
   - Active vs Locked ratio displayed in a colorful premium progress bar.
4. **Branded Profile Widget:** Embed the `Admin MathEd` card at the bottom of the right config column.

---

## 🛠️ Proposed Structure

- **Header Panel:** Stays full-width at the top, containing breadcrumbs, search input, settings icon, and the "+ Thêm người dùng mới" CTA.
- **Main Area (`RightSidebarLayout`):**
  - **Left Area (`children`):** Renders the `UserTable` component.
  - **Right Area (`sidebar`):**
    - **Card 1: Bộ lọc chi tiết:**
      - Title: "Bộ lọc chi tiết" with a filter icon.
      - Collapsible: "Vai trò" (Student, Teacher, Admin checkboxes).
      - Collapsible: "Khối lớp" (Lớp 1-5, Lớp 6-9, Lớp 10, Lớp 11, Lớp 12 checkboxes).
      - Action: "Xóa bộ lọc" button.
    - **Card 2: Thống kê hệ thống:**
      - Displays total counts, active user count (pulse animation), and a dynamic active status progress bar (green gradient).
    - **Card 3: Quản trị viên:**
      - Admin profile details (Admin MathEd, admin@mathed.vn, with professional rounded avatar).

---

## 🧪 Verification Plan

### Automated Checks
- Compile verification:
  ```bash
  cd frontend && npx tsc --noEmit
  ```

### Manual Verification
- Deploy and verify page loads at `http://localhost:3000/dashboard/users`.
- Inspect layout grids on desktop and mobile devices.
- Take a screenshot using browser automation to verify visual perfection.
