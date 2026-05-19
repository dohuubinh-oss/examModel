'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  User, 
  Zap, 
  Flame, 
  Trophy, 
  HelpCircle,
  Play,
  CheckCircle,
  Info
} from 'lucide-react';

// Dữ liệu mô phỏng đồng bộ cho cả Client-side Rendering và kết nối API Go-Gin sau này
interface StudentProfile {
  name: string;
  isPro: boolean;
  level: number;
  xp: number;
  xpMax: number;
  streak: number;
  avatarLetter: string;
}

interface ChapterProgress {
  title: string;
  percent: number;
  totalLessons: number;
  completedLessons: number;
  badgeToUnlock: string;
}

interface TopicItem {
  id: string;
  title: string;
  chaptersCount: number;
  lessonsCount: number;
  percentComplete: number;
  colorTheme: 'orange' | 'green' | 'purple';
  icon: string;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  avatarUrl?: string;
  avatarLetter?: string;
  isMe?: boolean;
  isPro?: boolean;
}

interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  theme: 'primary' | 'orange' | 'gold' | 'locked';
  unlocked: boolean;
}

export default function StudentDashboardPage() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');

  // 1. Mock Data Profile Học Sinh
  const [student, setStudent] = useState<StudentProfile>({
    name: "Nam",
    isPro: true,
    level: 15,
    xp: 2450,
    xpMax: 3000,
    streak: 7,
    avatarLetter: "N"
  });

  // 2. Mock Data Tiến độ chương đang học
  const [chapter, setChapter] = useState<ChapterProgress>({
    title: "Phương trình bậc hai",
    percent: 65,
    totalLessons: 5,
    completedLessons: 3,
    badgeToUnlock: "Huy hiệu Đại Số Sơ Cấp"
  });

  // 3. Mock Data Các chủ đề Toán Học
  const [topics, setTopics] = useState<TopicItem[]>([
    {
      id: "algebra",
      title: "Đại số",
      chaptersCount: 12,
      lessonsCount: 48,
      percentComplete: 40,
      colorTheme: "orange",
      icon: "square_foot"
    },
    {
      id: "geometry",
      title: "Hình học",
      chaptersCount: 8,
      lessonsCount: 32,
      percentComplete: 15,
      colorTheme: "green",
      icon: "category"
    },
    {
      id: "calculus",
      title: "Giải tích",
      chaptersCount: 6,
      lessonsCount: 24,
      percentComplete: 5,
      colorTheme: "purple",
      icon: "insights"
    }
  ]);

  // 4. Mock Data Bảng xếp hạng tuần
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([
    {
      rank: 1,
      name: "Minh Anh",
      xp: 12400,
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf3Cq_BWQCJuylLzmWpxnvQfijhX1nmEnXDY03Dc4CjQGwQ44oIa4MwzJs1v9d4Q-rNQhYcbNJQOlaDgcpBmNqVK0AVdsFcX3t76kH5Yqp0ZhNRK20h-KRV3bGfUyZmT4ufZyxpbM5667rUhkQE852kLKdceq8EOh8EpINxXuO5nqcwJg605Xw6EMDeh6n3_quPaMB2-bc3ScJyGBpIe6e3RXRgPvFDYvzdp18KBwCtIou-UWZTCex2q5y6uK41vw06DUQShBX03Dg",
      isPro: false
    },
    {
      rank: 2,
      name: "Hà Phương",
      xp: 11200,
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLyu_A5b9n0ap4nekCBxofq-YdQ24N5ygOMU71BJ9GMlmlytmeYL_7ZfcALtpW98GLpPE21IMSVtArrCR9YiJa2PJNhJXucjsBa0iQUe1xNgiBTtauc6mqenfPWcNtIIOc03VWOkpIU1PGjhHXaX9F2EDc5kP1jmLtxj6VKAyvASc-hChNzTvNHEhNoZjwNG4k8XyymrwYgUUAOuFA-peF9_rgFEiw4OA_40RH4sbtpwikkXT4UU7_MMk0RUJ1b3a6iWHvvJrhpQk_"
    },
    {
      rank: 4,
      name: "Bạn (Nam)",
      xp: 2450,
      avatarLetter: "N",
      isMe: true,
      isPro: true
    }
  ]);

  // 5. Mock Data Thành tích đạt được
  const [achievements, setAchievements] = useState<AchievementItem[]>([
    {
      id: "logic_master",
      title: "Logic Master",
      description: "Giải 50 bài đố",
      icon: "psychology",
      theme: "primary",
      unlocked: true
    },
    {
      id: "streak_100",
      title: "100 Streak",
      description: "Chăm chỉ 100 ngày",
      icon: "local_fire_department",
      theme: "orange",
      unlocked: true
    },
    {
      id: "champion",
      title: "Vô địch",
      description: "Đã mở khóa Pro",
      icon: "workspace_premium",
      theme: "gold",
      unlocked: true
    },
    {
      id: "speedster",
      title: "Siêu tốc",
      description: "Đang khóa",
      icon: "timer",
      theme: "locked",
      unlocked: false
    }
  ]);

  // 6. Thử thách hàng ngày
  const [dailyQuizzesDone, setDailyQuizzesDone] = useState<number>(1);
  const [dailyQuizzesTotal, setDailyQuizzesTotal] = useState<number>(3);

  // Nhúng Google Webfonts động cho Material Icons và Be Vietnam Pro
  useEffect(() => {
    const linkFonts = document.createElement('link');
    linkFonts.href = "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;950&family=Material+Icons&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
    linkFonts.rel = "stylesheet";
    document.head.appendChild(linkFonts);

    // Đảm bảo không bao giờ tồn tại class 'dark' trên root của học sinh
    document.documentElement.classList.remove('dark');

    return () => {
      document.head.removeChild(linkFonts);
    };
  }, []);

  return (
    <div className="min-h-screen font-display bg-slate-50 text-slate-900 transition-colors duration-300">
      
      {/* Side navigation bar (Chỉ Light Mode) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-50 transition-colors duration-300">
        
        {/* Sidebar Header Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <span className="material-icons text-xl">functions</span>
          </div>
          <h1 className="font-bold text-xl tracking-tight text-blue-600">MathMaster</h1>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 space-y-1.5 mt-6">
          <a className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-sm shadow-blue-500/10 font-bold transition-all cursor-pointer" href="#">
            <span className="material-icons text-lg">dashboard</span>
            <span className="text-sm">Trang chủ</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all cursor-pointer" href="#">
            <span className="material-icons text-lg">menu_book</span>
            <span className="text-sm font-semibold">Bài học</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all cursor-pointer" href="#">
            <span className="material-icons text-lg">quiz</span>
            <span className="text-sm font-semibold">Luyện tập</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all cursor-pointer" href="#">
            <span className="material-icons text-lg">leaderboard</span>
            <span className="text-sm font-semibold">Bảng xếp hạng</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all cursor-pointer" href="#">
            <span className="material-icons text-lg">settings</span>
            <span className="text-sm font-semibold">Cài đặt</span>
          </a>
        </nav>

        {/* Sidebar Pro Status Display */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-amber-600 text-lg fill-1">verified_user</span>
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Quyền lợi Pro</p>
            </div>
            <p className="text-xs text-amber-800/80 font-bold leading-relaxed">
              Gợi ý AI vô hạn đang kích hoạt
            </p>
          </div>
        </div>

        {/* Help Center Button */}
        <div className="p-4 pt-0">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hỗ trợ</p>
            <button className="w-full py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
              Trung tâm trợ giúp
            </button>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Window */}
      <main className="ml-64 flex-1 p-8 min-h-screen flex flex-col items-center">
        <div className="w-full max-w-[1440px] mx-auto flex-1 flex flex-col">
        
        {/* Light theme premium-gradient header exactly like dashboardStudent/code.html */}
        <header className="flex items-center justify-between mb-8 p-6 rounded-3xl border border-amber-200/30 shadow-sm relative overflow-hidden transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #fef3c7 100%)'
          }}
        >
          {/* Welcome profile */}
          <div className="flex items-center gap-4 z-10">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-black border-2 border-white shadow-md">
                {student.avatarLetter}
              </div>
              {student.isPro && (
                <div className="absolute -top-2 -right-1 text-amber-400 drop-shadow-md animate-bounce">
                  <span className="material-icons text-xl">workspace_premium</span>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-800">
                  Chào mừng trở lại, {student.name}!
                </h2>
                {student.isPro && (
                  <Badge variant="blue-filled" className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-black border-none shadow-sm uppercase py-0.5 px-2.5">
                    PRO
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-amber-700">MathApp Pro Member</span>
                <span className="text-slate-400">•</span>
                <p className="text-slate-500">Cùng chinh phục mục tiêu hôm nay nhé!</p>
              </div>
            </div>
          </div>

          {/* User statistics indicators (Level, XP, Streak) */}
          <div className="flex items-center gap-6 z-10">
            <div className="flex items-center gap-6 bg-white/70 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-sm">
              {/* Level indicator */}
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 rounded-full shadow-[0_0_15px_-3px_rgba(252,211,77,0.4)]">
                  <span className="material-icons text-amber-500 text-xl">stars</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Cấp độ</p>
                  <p className="text-lg font-black text-slate-700 leading-tight mt-0.5">{student.level}</p>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200"></div>

              {/* XP indicator */}
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-full shadow-[0_0_15px_-3px_rgba(37,99,235,0.2)]">
                  <span className="material-icons text-blue-600 text-xl">bolt</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Kinh nghiệm</p>
                  <p className="text-lg font-black text-slate-700 leading-tight mt-0.5">{student.xp.toLocaleString('en-US')} XP</p>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200"></div>

              {/* Streak indicator */}
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-full">
                  <span className="material-icons text-orange-500 text-xl">local_fire_department</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Chuỗi học</p>
                  <p className="text-lg font-black text-slate-700 leading-tight mt-0.5">{student.streak} Ngày</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Layout */}
        <div className="space-y-8">

            
            {/* Active Chapter Card */}
            <section className="relative overflow-hidden bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/10">
              <div className="relative z-10 flex justify-between items-start">
                <div className="max-w-md space-y-4">
                  <span className="px-3.5 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Đang học tiếp
                  </span>
                  
                  <div>
                    <h3 className="text-3xl font-black">{chapter.title}</h3>
                    <p className="text-white/80 text-sm font-medium mt-1 leading-relaxed">
                      Bạn đã hoàn thành {chapter.percent}% chương này. Chỉ còn {chapter.totalLessons - chapter.completedLessons} bài học nữa là đạt huy hiệu mới!
                    </p>
                  </div>

                  {/* Programmatic progress rendering */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Tiến độ chương</span>
                      <span>{chapter.percent}%</span>
                    </div>
                    <Progress value={chapter.percent} className="bg-white/20 text-white" />
                  </div>

                  <Button 
                    variant="default"
                    className="bg-white text-blue-600 hover:bg-slate-50 shadow-md shadow-blue-950/20 font-bold px-8 py-3 rounded-xl mt-2 transition-all group flex items-center gap-2 text-sm border-none"
                    onClick={() => {
                      alert(`Đang tải bài học tiếp theo của chương ${chapter.title}...`);
                    }}
                  >
                    Học tiếp ngay 
                    <span className="material-icons text-sm transition-transform group-hover:translate-x-1 duration-200">arrow_forward</span>
                  </Button>
                </div>

                <div className="hidden lg:block opacity-20 transform rotate-12 hover:rotate-6 transition-transform duration-500">
                  <span className="material-icons text-[120px]">calculate</span>
                </div>
              </div>

              {/* Decorative absolute blurred vector grids */}
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -left-16 -top-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            </section>

          {/* Bottom Widgets Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Daily Challenge Progress Card */}
            <section className="bg-gradient-to-br from-indigo-600 to-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-500/10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-icons">task_alt</span>
                <h4 className="font-bold text-sm tracking-wide uppercase">Thử thách hàng ngày</h4>
              </div>
              
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                Hoàn thành {dailyQuizzesTotal} bài kiểm tra trắc nghiệm để nhận thêm 500 XP.
              </p>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Đã xong {dailyQuizzesDone}/{dailyQuizzesTotal}</span>
                  <span>{Math.round((dailyQuizzesDone / dailyQuizzesTotal) * 100)}%</span>
                </div>
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all duration-500" 
                    style={{ width: `${(dailyQuizzesDone / dailyQuizzesTotal) * 100}%` }}
                  ></div>
                </div>
              </div>
            </section>

            {/* Leaderboard Card */}
            <section className="bg-white rounded-3xl p-6 border border-slate-150 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">Bảng xếp hạng</h3>
                <span className="material-icons text-slate-400 text-xl cursor-pointer hover:text-blue-600 transition-colors">info</span>
              </div>

              <div className="space-y-3.5">
                {leaderboard.map((user) => (
                  <div 
                    key={user.rank}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-2xl transition-all border",
                      user.isMe 
                        ? "bg-gradient-to-r from-blue-50/50 to-amber-50/50 border-amber-200/50 shadow-[0_0_15px_-3px_rgba(252,211,77,0.4)]"
                        : "bg-transparent border-transparent"
                    )}
                  >
                    {/* Rank Badge */}
                    <span className={cn(
                      "font-black w-5 text-center text-sm",
                      user.rank === 1 ? "text-amber-500 text-base" : "text-slate-400"
                    )}>
                      {user.rank}
                    </span>

                    {/* Avatar */}
                    {user.avatarUrl ? (
                      <img 
                        className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm" 
                        src={user.avatarUrl} 
                        alt={`${user.name} profile`} 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black border border-slate-100 shadow-sm">
                        {user.avatarLetter}
                      </div>
                    )}

                    {/* User info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={cn(
                          "font-bold text-sm truncate",
                          user.isMe ? "text-slate-800" : "text-slate-700"
                        )}>
                          {user.name}
                        </p>
                        {user.isPro && (
                          <span className="text-[7px] bg-gradient-to-r from-amber-400 to-amber-500 text-white font-black px-1 rounded shadow-sm">PRO</span>
                        )}
                      </div>
                      <p className={cn(
                        "text-xs font-semibold mt-0.5",
                        user.isMe ? "text-blue-600" : "text-slate-400"
                      )}>
                        {user.xp.toLocaleString('en-US')} XP
                      </p>
                    </div>

                    {/* Award icons */}
                    {user.rank === 1 ? (
                      <span className="material-icons text-amber-500 text-xl">emoji_events</span>
                    ) : user.isMe ? (
                      <span className="text-[9px] font-black text-white px-2 py-1 bg-blue-600 rounded-lg shadow-sm tracking-widest uppercase">BẠN</span>
                    ) : null}
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                Xem toàn bộ bảng xếp hạng
              </button>
            </section>

            {/* Achievements Card */}
            <section className="bg-white rounded-3xl p-6 border border-slate-150 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">Thành tích</h3>
                <a className="text-blue-600 text-xs font-bold hover:underline cursor-pointer" href="#">Tất cả</a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {achievements.map((item) => (
                  <div 
                    key={item.id}
                    className={cn(
                      "flex flex-col items-center p-4 rounded-2xl border text-center transition-all cursor-pointer select-none",
                      item.unlocked 
                        ? item.theme === 'primary' && "bg-blue-50/50 border-blue-100 shadow-[0_0_15px_-3px_rgba(37,99,235,0.1)] hover:scale-105"
                        : "opacity-40 grayscale border-dashed border-slate-200 cursor-not-allowed",
                      item.theme === 'orange' && "bg-orange-50/30 border-orange-100 hover:scale-105",
                      item.theme === 'gold' && "bg-amber-50/30 border-amber-100 shadow-[0_0_15px_-3px_rgba(252,211,77,0.1)] hover:scale-105"
                    )}
                    onClick={() => {
                      if (item.unlocked) {
                        alert(`Thành tích: ${item.title} - ${item.description}`);
                      } else {
                        alert("Thành tích này đang khóa! Hãy tiếp tục học tập để mở khóa.");
                      }
                    }}
                  >
                    <div className="w-11 h-11 bg-white rounded-full shadow-sm flex items-center justify-center mb-2.5 border border-slate-100">
                      <span className={cn(
                        "material-icons text-xl",
                        item.theme === 'primary' && "text-blue-600",
                        item.theme === 'orange' && "text-orange-500",
                        item.theme === 'gold' && "text-amber-500",
                        item.theme === 'locked' && "text-slate-400"
                      )}>
                        {item.icon}
                      </span>
                    </div>

                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-wider mb-0.5",
                      item.theme === 'primary' && "text-blue-600",
                      item.theme === 'orange' && "text-orange-600",
                      item.theme === 'gold' && "text-amber-600",
                      item.theme === 'locked' && "text-slate-400"
                    )}>
                      {item.title}
                    </p>
                    <p className="text-[9px] font-semibold text-slate-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

            {/* Subject Categories Card */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider">Chủ đề toán học</h3>
                <a className="text-blue-600 font-bold text-sm hover:underline cursor-pointer" href="#">Xem tất cả</a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topics.map((topic) => (
                  <div 
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopicId(topic.id);
                      alert(`Bạn đã chọn chủ đề: ${topic.title}`);
                    }}
                    className={cn(
                      "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer",
                      selectedTopicId === topic.id ? "border-blue-500/40 ring-4 ring-blue-500/5 bg-blue-500/[0.01]" : ""
                    )}
                  >
                    {/* Icon dynamic themed colored background */}
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300",
                      topic.colorTheme === 'orange' && "bg-orange-50 text-orange-500",
                      topic.colorTheme === 'green' && "bg-green-50 text-green-500",
                      topic.colorTheme === 'purple' && "bg-purple-50 text-purple-500"
                    )}>
                      <span className="material-icons text-2xl">{topic.icon}</span>
                    </div>

                    <h4 className="font-bold text-lg text-slate-800 mb-1">{topic.title}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">
                      {topic.chaptersCount} Chương • {topic.lessonsCount} Bài học
                    </p>

                    {/* Progress tracking */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Tiến độ</span>
                        <span>{topic.percentComplete}%</span>
                      </div>
                      <Progress 
                        value={topic.percentComplete} 
                        className={cn(
                          "h-1.5 bg-slate-100",
                          topic.colorTheme === 'orange' && "[&>div]:bg-orange-500",
                          topic.colorTheme === 'green' && "[&>div]:bg-green-500",
                          topic.colorTheme === 'purple' && "[&>div]:bg-purple-500"
                        )} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

        </div>

        </div>
      </main>
    </div>
  );
}
