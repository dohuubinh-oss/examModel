# Design Specification: User Management Question Bank Layout

This specification details the layout restructuring of the **User Management Dashboard Page** at `frontend/src/app/dashboard/users/page.tsx` to align exactly with the **Question Bank** layout.

## 🌟 Goals & Requirements

1. **Identical Left Sidebar Scaffolding:** Replace the right sidebar layout with a clean left sidebar collapsible layout, using the exact structural classes from `frontend/src/app/dashboard/questions/bank/page.tsx`.
2. **Unified Branding & Grid:**
   - Sidebar placement: Left-hand side.
   - Main content area: Right-hand side.
   - Backgrounds: Solid white `bg-white` for both workspace and sidebar, with clean `border-slate-100` separators.
   - Container limits: Align all header and workspace contents to a central max-width envelope `max-w-[1440px] mx-auto w-full`.
3. **Interactive Navigation Links:** Include standard dashboard navigation links (Bảng điều khiển, Ngân hàng câu hỏi, Ngân hàng đề thi, Quản lý người dùng) with "Quản lý người dùng" selected as active.
4. **Dynamic Search and Filters:** Preserve the real-time search logic and the role/grade filter checkboxes connected directly to the central `UserTable` component.

---

## 🛠️ Proposed Layout Structure

- **Header Panel:**
  - Sticky at the top, max-width wrapper `max-w-[1440px] mx-auto w-full`.
  - Left: Back button (sparkles), Title ("Quản lý người dùng"), Subtitle ("Toán học THPT • Tổng số: 5 thành viên").
  - Right: Search input (text filter), "+ Thêm người dùng mới" CTA, and settings icon.
- **Workspace Wrapper:**
  - Responsive flex container `flex-1 w-full max-w-[1440px] mx-auto flex overflow-hidden`.
  - **Left Sidebar (`aside`):**
    - Style: `w-72 border-r border-slate-100 overflow-y-auto hidden md:block bg-white p-4 space-y-6 shrink-0 h-[calc(100vh-80px)]`.
    - Page Navigation links.
    - HR separator `border-slate-100`.
    - Detailed Filters: Collapsible "Vai trò" and Collapsible "Khối lớp".
    - "Xóa bộ lọc" Action Button.
  - **Right Content Area (`main`):**
    - Style: `flex-1 overflow-y-auto bg-white p-6 pb-32`.
    - Displays `UserTable` with filtered dynamic results.

---

## 🧪 Verification Plan

### Automated Checks
- Compile check:
  ```bash
  cd frontend && npx tsc --noEmit
  ```

### Manual Verification
- Deploy to local server and visit `http://localhost:3000/dashboard/users`.
- Verify left sidebar layout matches `/dashboard/questions/bank` exactly.
- Test role/grade checkboxes and search box.
- Capture a visual screenshot using browser automation.
