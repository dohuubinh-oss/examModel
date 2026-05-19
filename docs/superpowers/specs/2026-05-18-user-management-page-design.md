# Design Specification: User Management Page Integration

This specification details the creation of the **User Management Dashboard Page** at `frontend/src/app/dashboard/users/page.tsx`, translating `fileExample/UserPage/code.html` into a fully dynamic Next.js page.

## 🌟 Goals & Requirements

1. **Pixel-Perfect Alignment:** Adopt all layout structures, colors, paddings, avatars, and sidebar filters exactly as defined in `code.html`.
2. **Dynamic State Management:** 
   - **Role Filters:** Checkboxes to filter users by `'student' | 'teacher' | 'admin'`.
   - **Grade Filters:** Checkboxes to filter users by grade levels.
   - **Real-Time Search:** Search bar filtering instantly by name or email.
   - **Active State Indicators:** Synchronize active and locked states dynamically.
3. **Architecture & Routing:** Create the routing structure under the dashboard scope:
   - Route path: `/dashboard/users`.
4. **Mock Database / Go-Gin Preparation:** Include a mock dataset of the 5 archetypal users, structured dynamically so it can be swapped with real fetch APIs from the Go backend.

---

## 🛠️ Proposed Changes

### 1. New Page: [page.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/app/dashboard/users/page.tsx)

Implement the full dashboard page:
- **Left Sidebar Filter Panel:**
  - Standard branding box with "functions" icon.
  - Role checkbox filters connected to `selectedRoles` state.
  - Grade checkbox filters connected to `selectedGrades` state.
  - Profile card at the bottom (Admin profile: `Admin MathEd` / `admin@mathed.vn`).
- **Header Section:**
  - Breadcrumbs navigation.
  - Search input connected to `searchQuery` state.
  - "+ Thêm người dùng mới" action button.
- **Main Panel:**
  - Renders `UserTable` with filtered users.
  - Handles page flipping (`currentPage`, `totalPages`, `totalItems` calculations).
  - Handles actions: `handleResetPassword`, `handleEdit`, `handleDelete`.

---

## 🧪 Verification Plan

### Automated Checks
- Compile verification:
  ```bash
  cd frontend && npx tsc --noEmit
  ```

### Manual Visual Verification
- Visit `/dashboard/users` in the browser.
- Verify role filters, grade filters, and search bar correctly narrow down results in real time.
- Verify layout dimensions look gorgeous and match the original HTML styling.
