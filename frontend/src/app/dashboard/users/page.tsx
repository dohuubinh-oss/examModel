'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Sparkles,
  FilterX,
  School,
  UserCheck,
  LayoutDashboard,
  Database,
  FileText,
  Users
} from 'lucide-react';

// UI components
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Collapsible } from '@/components/ui/Collapsible';

// Reusable User Table components
import { UserTable, UserItem } from '@/components/users/UserTable';

export default function UserManagementPage() {
  const router = useRouter();

  // State Management for filters and pagination
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const itemsPerPage = 5;

  // Mock database of users for realistic dynamic filtering and search
  const mockUsers: UserItem[] = React.useMemo(() => [
    {
      id: "user1",
      name: "Nguyễn Văn An",
      email: "an.nguyen@student.edu.vn",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjkU3uLAVacqKFDVSrWvAchNgIwXaxak9xuK4XVCf4BYXd9yH9d5P8WTFxPrzYvQgBh_9qphd6ey_bGrjXTTvavr8JNB3vCobxaF9Xnu7IvK4VFNxuaHA4sBdKhkV4px-7l66gTHKkXV6JbFCAgoshfCRI_u_a7UoVbYZU2G0QB2fhUFkWf_Ea-gA28mwNyWwwlPzlJdnksvCWGRE1RuXYR8BtSFOwwMc7MqY06FeLavosHXYkcFJwvmkTCDgAUZPKTv2_h97XL5Eq",
      role: "student",
      grade: "Lớp 9A1",
      joinDate: "12/05/2023",
      status: "active",
      hasPulse: true
    },
    {
      id: "user2",
      name: "Trần Thị Bình",
      email: "binh.tt@mathed.vn",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOSjyIOZUILgfSFoipgpCmU0_sWtprapzUJJbdqDkjn993pE4NB53mid5rZJs6Jh8Glcwp-qtxU6OaXb4BP_Cp-2_G1axysKkjGbI_O8BIJ6xt2qN68UnWmJSvhIPK2Hm5ueRAmwQ4moMCUf9w6mH4X4A8Gt6c_l0l7tkcRP7j621vsKcoOapXa267OGqnkHgCHwu5-JpeunIpBaM3rMA82lpuZUBBqU3qNe-hNSuq8RzNuZ0gGZ-t5mDQIvdt4HXX5YfwHSMK7Syx",
      role: "teacher",
      grade: "Toán học",
      joinDate: "02/01/2023",
      status: "active",
      hasPulse: false
    },
    {
      id: "user3",
      name: "Lê Công Danh",
      email: "danh.lc@student.edu.vn",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0aPR0dT5v8nP-PM-39UXExh0YeHX4p-P5Yf-fTYseqh2z9e3ZVSZMuv6eJnZN98htW8MRDJX63P3A4kucTPhhRV2ijpuVeFWJdHypoGE_htNsXcrpgMtxm_w6ozo7vEzbPpgu2tyXge9TCd81g4DBX1006t5TrxBbUpKtOOklo7mtncO4MkvljV-9fV9ybu6IS9TtgXS6Bu_7Ad6D8HZzFLLDlXDYMVJ3_ZyCt7Oh_u9UYmXDQfuNQfrD7QnsbSeJcV1C9BFqHoBQ",
      role: "student",
      grade: "Lớp 5C",
      joinDate: "15/08/2023",
      status: "locked",
      hasPulse: false
    },
    {
      id: "user4",
      name: "Phạm Minh Đức",
      email: "duc.pm@mathed.vn",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNJnqcgvB5CNg7alyy7McDAcMORJkg4mVGwQI6nCEmf6ecmSnfDCq1d7AaQ0nTTpEPUmsorr7TLX-VqkYh2-I0_Kg1wEYfgu-PVkJjJ4-WdKdevaJOHu3QPA1wXCPpQs-ruYP3ZTdhCQ4tw9o7QsWh_TYrmzVof7lY2xg_jD6UsGKAxM1HviTCLqlYjv11sWvC5Uav3Opt4b_y0e-Tv3-0LmPJwcokU8SkRlrRWkU6RfmYcWbOsiNf2GOZAQydxg10zspoI0TNepWW",
      role: "admin",
      grade: "—",
      joinDate: "20/12/2022",
      status: "active",
      hasPulse: false
    },
    {
      id: "user5",
      name: "Hoàng Thu Hà",
      email: "ha.ht@student.edu.vn",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu1qOUC95LwaE0AojL8_i2ICCv8vbM-6rrPNqraV43NeX9d5Wp9UHkwb17fJAbGCY9bwlKeE7j_MHiqCw6kYQvUhBnGj8TS3z3fbN3a5tHgxOHu_zPk3-9oz7Q7Gyo47P9sNRuin3goL1CLbT9-WlXHxeTKTzUlxoy91pfPQTyFZTGEMaUf7dUuYqFzxwU0QiqcEK9ZBMWMMqh8y1bLFIhIRvKrr7VqWy2sF6VtwbjfxF7Dvcdcp6-2KCzF9wj9t6LYcy1jiOcgqtT",
      role: "student",
      grade: "Luyện thi 10",
      joinDate: "10/11/2023",
      status: "active",
      hasPulse: false
    }
  ], []);

  // Filter Handlers
  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
    setCurrentPage(1);
  };

  const toggleGrade = (grade: string) => {
    setSelectedGrades(prev => 
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedRoles([]);
    setSelectedGrades([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Real-time client-side filter computation
  const filteredUsers = React.useMemo(() => {
    return mockUsers.filter(user => {
      // 1. Role filter
      const matchRole = selectedRoles.length === 0 || selectedRoles.includes(user.role);

      // 2. Grade filter
      const matchGrade = selectedGrades.length === 0 || selectedGrades.some(g => {
        if (g === '5' && user.grade.includes('Lớp 5')) return true;
        if (g === '6' && user.grade.includes('Lớp 6')) return true;
        if (g === '7' && user.grade.includes('Lớp 7')) return true;
        if (g === '8' && user.grade.includes('Lớp 8')) return true;
        if (g === '9' && user.grade.includes('Lớp 9')) return true;
        if (g === '10' && (user.grade.includes('10') || user.grade.toLowerCase().includes('luyện thi'))) return true;
        return false;
      });

      // 3. Search query filter
      const matchSearch = searchQuery.trim() === '' || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      return matchRole && matchGrade && matchSearch;
    });
  }, [mockUsers, selectedRoles, selectedGrades, searchQuery]);

  // Pagination calculation
  const totalItems = filteredUsers.length;
  const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);
  const paginatedUsers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Adjust page number if it exceeds totalPages due to filtering changes
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Table actions
  const handleResetPassword = (user: UserItem) => {
    alert(`[Đổi mật khẩu] Người dùng: "${user.name}" (${user.email})`);
  };

  const handleEdit = (user: UserItem) => {
    alert(`[Chỉnh sửa] Thông tin người dùng: "${user.name}"`);
  };

  const handleDelete = (user: UserItem) => {
    alert(`[Xóa] Người dùng: "${user.name}"`);
  };

  const handleCreateUser = () => {
    alert(`[Thêm mới] Mở modal thêm người dùng mới`);
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-white font-display">
      {/* Header - Styled matching exactly the Question Bank page Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 px-4 md:px-8 py-3">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="bg-primary/10 p-2 rounded-lg text-primary hover:bg-primary/20 transition-colors cursor-pointer flex items-center justify-center"
              title="Quay lại trang trước"
            >
              <Sparkles size={24} />
            </button>
            <div>
              <h1 className="text-lg font-bold leading-tight">Quản lý người dùng</h1>
              <p className="text-xs text-slate-500">Toán học THPT • Tổng số: {mockUsers.length} thành viên</p>
            </div>
          </div>

          {/* Search bar & Add User action button */}
          <div className="flex items-center gap-3">
            <div className="relative group w-72 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5 group-focus-within:text-primary transition-colors" />
              <input 
                className="pl-10 pr-4 py-2 w-full bg-slate-100 border border-transparent focus:border-primary focus:bg-white focus:ring-0 rounded-lg text-xs transition-all text-slate-800 outline-none" 
                placeholder="Tìm kiếm theo tên, email..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="default" className="shadow-md shadow-primary/20 flex items-center gap-2 whitespace-nowrap" onClick={handleCreateUser}>
              <Plus size={18} />
              Thêm người dùng mới
            </Button>
          </div>
        </div>
      </header>

      {/* Workspace container below Header */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto flex overflow-hidden">
        {/* Sidebar Filters - Left side */}
        <aside className="w-72 border-r border-slate-100 overflow-y-auto hidden md:block bg-white p-4 space-y-6 shrink-0 h-[calc(100vh-80px)]">
          {/* Page Navigation Menu */}
          <div className="space-y-1">
            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer" href="#">
              <LayoutDashboard className="h-4.5 w-4.5 text-slate-400" />
              <span className="text-xs font-semibold">Bảng điều khiển</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer" href="/question-bank">
              <Database className="h-4.5 w-4.5 text-slate-400" />
              <span className="text-xs font-semibold">Ngân hàng câu hỏi</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all cursor-pointer" href="/dashboard/questions/bank">
              <FileText className="h-4.5 w-4.5 text-slate-400" />
              <span className="text-xs font-semibold">Ngân hàng đề thi</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 bg-primary/5 text-primary rounded-lg transition-all border-r-4 border-primary cursor-pointer" href="/dashboard/users">
              <Users className="h-4.5 w-4.5 text-primary" />
              <span className="text-xs font-bold">Quản lý người dùng</span>
            </a>
          </div>

          <hr className="border-slate-100" />

          {/* Filter list */}
          <div className="space-y-4">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Bộ lọc chi tiết</h3>
            
            {/* Vai trò filter */}
            <Collapsible title="Vai trò" icon={<UserCheck className="h-4 w-4 text-slate-400" />} open>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2">
                {[
                  { key: 'student', label: 'Học sinh' },
                  { key: 'teacher', label: 'Giáo viên' },
                  { key: 'admin', label: 'Quản trị viên' }
                ].map(role => (
                  <label key={role.key} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <Checkbox
                      checkboxSize="sm"
                      checked={selectedRoles.includes(role.key)}
                      onChange={() => toggleRole(role.key)}
                    />
                    {role.label}
                  </label>
                ))}
              </div>
            </Collapsible>

            {/* Khối lớp filter */}
            <Collapsible title="Khối lớp" icon={<School className="h-4 w-4 text-slate-400" />} open>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-2">
                {[
                  { key: '5', label: 'Lớp 5' },
                  { key: '6', label: 'Lớp 6' },
                  { key: '7', label: 'Lớp 7' },
                  { key: '8', label: 'Lớp 8' },
                  { key: '9', label: 'Lớp 9' },
                  { key: '10', label: 'Luyện thi 10' }
                ].map(grade => (
                  <label key={grade.key} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <Checkbox
                      checkboxSize="sm"
                      checked={selectedGrades.includes(grade.key)}
                      onChange={() => toggleGrade(grade.key)}
                    />
                    {grade.label}
                  </label>
                ))}
              </div>
            </Collapsible>

            {/* Reset Filters button */}
            <button 
              onClick={handleClearFilters}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-500 hover:text-primary transition-all border border-dashed border-slate-300 hover:border-primary/50 rounded-lg cursor-pointer"
            >
              <FilterX size={15} />
              Xóa bộ lọc
            </button>
          </div>
        </aside>

        {/* Main Work Area - Solid white background matching the Exam Bank template */}
        <main className="flex-1 overflow-y-auto bg-white p-6 pb-32">
          <div className="flex flex-col gap-6 w-full">
            <UserTable
              users={paginatedUsers}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onResetPassword={handleResetPassword}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
