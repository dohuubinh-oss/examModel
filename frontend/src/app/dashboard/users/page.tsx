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
  Users,
  RefreshCw
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

  const [users, setUsers] = React.useState<UserItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const res = await fetch(`${API_BASE_URL}/api/v1/users`);
        if (res.ok) {
          const data = await res.json();
          const mappedUsers = (data.data || []).map((u: any) => ({
            id: u.id.toString(),
            name: u.full_name,
            email: u.email || '',
            avatarUrl: u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name)}&background=random`,
            role: u.role,
            grade: u.grade ? `Lớp ${u.grade}` : (u.role === 'teacher' ? 'Giáo viên' : '—'),
            joinDate: new Date(u.created_at).toLocaleDateString('vi-VN'),
            status: u.status,
            hasPulse: u.status === 'active'
          }));
          setUsers(mappedUsers);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
    return users.filter(user => {
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
  }, [users, selectedRoles, selectedGrades, searchQuery]);

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
              <p className="text-xs text-slate-500">Toán học THPT • Tổng số: {users.length} thành viên</p>
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
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-sm font-semibold">Đang tải danh sách người dùng...</p>
              </div>
            ) : (
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
