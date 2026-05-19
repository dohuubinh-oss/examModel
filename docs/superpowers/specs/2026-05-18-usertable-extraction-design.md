# Design Specification: User Table Component Extraction & Generalization

This specification outlines the modular extraction and generalization of the **User Administration Table** from `fileExample/UserPage/code.html` into a production-grade, highly-reusable Next.js React component utilizing TypeScript and Tailwind CSS.

## 🌟 Goals & Requirements

1. **Modular Architecture:** Split the table structure into clean type-safe sub-components (`UserItem`, `RoleBadge`, `StatusIndicator`, `UserRow`, and the main `UserTable`).
2. **Pixel-Perfect Fidelity:** Replicate the exact design layouts, paddings, borders, colors, and animations from the HTML archetype:
   - Row transitions (`hover:bg-slate-50 transition-colors`).
   - Symmetrical typography, layout spacing, and borders.
   - Customized role colors (Blue for student, Purple for teacher, Slate for admin).
   - Dynamic pulsing green status dot for active users (`animate-pulse`).
3. **Generalization & API Design:** Ensure the component accepts extensible React attributes and handles all operations via strongly typed callbacks (`onResetPassword`, `onEdit`, `onDelete`, `onPageChange`).
4. **Integration in UI Lab:** Incorporate a live interactive demonstration in `ui-lab/page.tsx` showcasing dynamic paging and action click-logging.

---

## 🛠️ Proposed Changes

### 1. New Component: [UserTable.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/components/users/UserTable.tsx)

Implement the full component hierarchy inside a single robust file for maximum compilation and maintenance efficiency:

- **`UserItem` Interface:**
  - `id`: string
  - `name`: string
  - `email`: string
  - `avatarUrl`: string
  - `role`: `'student' | 'teacher' | 'admin'`
  - `grade`: string
  - `joinDate`: string
  - `status`: `'active' | 'locked'`
  - `hasPulse`?: boolean
- **`RoleBadge` Component:**
  - Maps `'student'`, `'teacher'`, and `'admin'` to their precise border, text, and background CSS combinations.
- **`StatusIndicator` Component:**
  - Renders active/locked statuses with corresponding colored dots and supports pulsing.
- **`UserRow` Component:**
  - Renders single row records with smooth transition hover effects and connects action click-handlers (`KeyRound` for reset password, `Edit3` for editing, and `Trash2` for deleting).
- **`UserTable` Component:**
  - Standard wrapper mapping over collections, displaying empty states, and mounting pagination.

### 2. File: [page.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/app/ui-lab/page.tsx)

- Add a new section: `7. User Administration Table (Extraction & Generalization)`.
- Populate a mock database of 5 users derived directly from `code.html`:
  - *Nguyen Van An* (student, Lớp 10A1, active with pulse)
  - *Tran Thi Binh* (teacher, Toán học, active)
  - *Le Cong Danh* (student, Lớp 11B2, locked)
  - *Pham Minh Duc* (admin, —, active)
  - *Hoang Thu Ha* (student, Lớp 12A3, active)
- Add interactive states (`userActionLog`, `userCurrentPage`) to display logged events instantly as the user clicks table buttons or flips pages.

---

## 🧪 Verification Plan

### Automated Verification
- Run type checks in `/frontend`:
  ```bash
  cd frontend && npx tsc --noEmit
  ```

### Manual Visual Verification
- Navigate to `http://localhost:3000/ui-lab`.
- Confirm the User Table matches the design prototype.
- Verify actions (Change Password, Edit, Delete) log events correctly.
