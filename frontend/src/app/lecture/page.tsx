'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StepItem } from '@/components/ui/StepItem';
import { LectureRowCard } from '@/components/ui/LectureRowCard';
import { InfoCard } from '@/components/ui/InfoCard';
import { cn } from '@/lib/utils';

// Interfaces for clean representation and direct connection with Go-Gin backend API
interface LectureDetailData {
  title: string;
  teacher: {
    name: string;
    avatarUrl: string;
  };
  publishDate: string;
  category: string;
  breadcrumbs: string[];
  sections: {
    concept: {
      title: string;
      description1: string;
      formula: string;
      formulaCaption: string;
      description2: string;
    };
    exercise: {
      title: string;
      statement: string;
      steps: Array<{
        stepNumber: number;
        title: string;
        content: React.ReactNode;
      }>;
    };
    graphic: {
      title: string;
      caption: string;
      alt: string;
    };
  };
  notes: Array<{
    variant: 'danger' | 'warning' | 'primary';
    icon: string;
    title: string;
    items: string[];
  }>;
  relatedLectures: Array<{
    imageSrc: string;
    title: string;
    category: string;
    href: string;
  }>;
}

export default function LecturePage() {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for bookmark toggle
  const [isBookmarked, setIsBookmarked] = useState(false);
  // State for tracking download trigger
  const [downloadCount, setDownloadCount] = useState(0);

  // Dynamic state initialized with high-fidelity mock data corresponding to the HTML source
  const [lectureData] = useState<LectureDetailData>({
    title: "Chuyên đề: Thể tích khối chóp và các bài toán thực tế nâng cao",
    teacher: {
      name: "Thầy Nguyễn Văn A",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzSslrpFYTVOe7PBe90atgl3hsXwdX1HWUfxWXspmgUurRfocJ961-ft4IENBquzWrvdzEJawGjjPadrlMNnAgf5SurVoBod_tLgjpp2MCk_Wkk_6vkfCkEbfU5bOk9zekEPEtL01nlMpyVRQpqDYk1OUJby4BeEsGEIpw5nceRvR6QlzQusn_l3dHBhVag9I6EsAXPeDvmZ37j6iUPoXbYtvfzDRtqKVtT6deKmWtrXQXlCjz_wcV7al4MPpSiVnRlipHnU47Ee-N"
    },
    publishDate: "15 Tháng 5, 2024",
    category: "Hình học lớp 12",
    breadcrumbs: ["Trang chủ", "Hình học lớp 12", "Thể tích khối chóp"],
    sections: {
      concept: {
        title: "1. Giải thích khái niệm",
        description1: "Thể tích của một khối chóp bất kỳ bằng một phần ba tích của diện tích mặt đáy và chiều cao tương ứng của nó. Đây là nền tảng quan trọng trong hình học không gian.",
        formula: "V = 1/3 . B . h",
        formulaCaption: "Trong đó: B là diện tích đáy, h là chiều cao khối chóp.",
        description2: "Đối với khối chóp đều, việc tính toán trở nên đơn giản hơn nhờ các tính chất đối xứng, trong đó hình chiếu của đỉnh trùng với tâm của đa giác đáy."
      },
      exercise: {
        title: "2. Phân tích bài tập mẫu",
        statement: "Cho khối chóp S.ABC có đáy ABC là tam giác đều cạnh a. Cạnh bên SA vuông góc với đáy và SA = a√3. Tính thể tích khối chóp S.ABC.",
        steps: [
          {
            stepNumber: 1,
            title: "Tính diện tích đáy B (Tam giác ABC)",
            content: (
              <>
                <p>Vì ABC là tam giác đều cạnh a nên diện tích đáy được tính theo công thức:</p>
                <p className="mt-2 font-bold text-primary latex-font text-base">B = S_ABC = (a²√3) / 4</p>
              </>
            )
          },
          {
            stepNumber: 2,
            title: "Xác định chiều cao h",
            content: <p>Theo giả thiết SA ⊥ (ABC), suy ra chiều cao h = SA = a√3.</p>
          },
          {
            stepNumber: 3,
            title: "Áp dụng công thức tính thể tích",
            content: (
              <>
                <p>V = 1/3 . B . h = 1/3 . (a²√3 / 4) . a√3 = a³/4.</p>
                <p className="mt-3 font-bold text-green-600 dark:text-green-400">Kết luận: Thể tích khối chóp là a³/4.</p>
              </>
            )
          }
        ]
      },
      graphic: {
        title: "3. Ví dụ minh họa hình vẽ",
        caption: "Hình 1.1: Mô tả trực quan khối chóp có cạnh bên vuông góc với đáy.",
        alt: "Sơ đồ khối chóp S.ABC trong không gian 3D"
      }
    },
    notes: [
      {
        variant: "danger",
        icon: "warning",
        title: "Lưu ý khi làm bài",
        items: [
          "Cẩn thận nhầm lẫn giữa công thức diện tích và thể tích.",
          "Quên nhân hệ số 1/3 là lỗi phổ biến nhất."
        ]
      },
      {
        variant: "warning",
        icon: "bolt",
        title: "Kinh nghiệm thi",
        items: [
          "Sử dụng phương pháp loại trừ cho các bài trắc nghiệm.",
          "Học thuộc các bộ số diện tích đặc biệt để tính nhanh."
        ]
      },
      {
        variant: "primary",
        icon: "lightbulb",
        title: "Lời khuyên học tập",
        items: [
          "\"Toán học không chỉ là công thức, hãy cố gắng hình dung khối hình trong đầu để không bị phụ thuộc vào đề bài.\""
        ]
      }
    ],
    relatedLectures: [
      {
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFyR2dPO3YUvSW77SfHGSTI8IOvpNB9DC2Z5JAqRbn7sQ7JdcPZpzxdL2aeDGqdTbdRTiHZoCZgtHzfmwclKFK-Yba5Y1rSyaDk427_S5lXzlEW-Ui3rjJO8udm1WEHWPNitbIKbVDKY9D6SE0pVPEAsjdXjYvbIR6jVRuHCTg0_aFvKZ8Vx8O5s49UsvYP3R7dGymdZRxMlP8lYVY_s5Kg2SUNiJH8N9w4LojiL2i0pQxQviLlBZp_mmBYgnXLGFQmD7pd9rti2TG",
        title: "Thể tích khối lăng trụ đứng và lăng trụ xiên",
        category: "Hình học lớp 12",
        href: "#"
      },
      {
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRHkSJjH-Rb63ttXabCUwd9bYLe1tPqVPnwCtM7d5nHXIWGSqh-H7IOfdH8m5XZf52Vb_WbsQWlQnoI_jPmXKVNabc0ViEeAM5GkeBhJtf8ujU-KKr-LR-819FzYdpePGwkKxmgXnZ69KEeh6wGns6zD1VkxEfCXBaLLJbkqvTfF4yuaTIaUIZ2xlyMwhi_wBTwOv1jkiQmBS_6DC7j3yZVlG6DtrvSVdVTclUEzmAwNa59Vw_LMkc68t0hjNHFtNOGZ3n05_rLGxO",
        title: "Góc và khoảng cách trong không gian 3D",
        category: "Luyện đề THPT",
        href: "#"
      },
      {
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy737Z2c8odbCCLUBKX_d2E6ArFVSuJBUdfz8JSApeGVCugkmS8cdZEp3W7oOu9vM4jlHk1D53enZ0mL6pl6TY2Tt2fC9Kkup4adoASzZwB4fLf0zrThYe5qYNoKRwJWejTilln78agw-a8sJm6m3jUF0cP1rITQ3MUtOPMfLFtNM20vjnBuPXdMPx1KXkikIXnWBmpUQsgB3d1a5nmvvtERpA3mkRSxXbaQSvisk2bw8-vJkYGcYx8hZo89G92xFRQq3zxtB9B4pS",
        title: "Bài toán cực trị trong hình học không gian",
        category: "Nâng cao",
        href: "#"
      }
    ]
  });

  const handleDownload = () => {
    setDownloadCount(prev => prev + 1);
    alert("Đang bắt đầu tải xuống tài liệu PDF bài giảng...");
  };

  const handleSave = () => {
    setIsBookmarked(prev => !prev);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen antialiased flex flex-col font-sans">
      {/* Header / TopNavBar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link className="flex items-center gap-2 text-primary hover:no-underline" href="/dashboard/student">
                <span className="material-symbols-outlined text-3xl select-none">functions</span>
                <span className="text-xl font-bold tracking-tight text-slate-800">MathEdu</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <a className="text-sm font-semibold hover:text-primary transition-colors text-slate-600" href="#">Khóa học</a>
                <a className="text-sm font-semibold hover:text-primary transition-colors text-primary" href="#">Luyện đề</a>
                <a className="text-sm font-semibold hover:text-primary transition-colors text-slate-600" href="#">Tài liệu</a>
                <a className="text-sm font-semibold hover:text-primary transition-colors text-slate-600" href="#">Diễn đàn</a>
              </nav>
            </div>

            {/* Search bar widget */}
            <div className="flex flex-1 max-w-md mx-4 hidden lg:block">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl select-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-400"
                  placeholder="Tìm kiếm bài giảng, công thức..."
                />
              </div>
            </div>

            {/* Notification and Profile */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => alert("Chức năng thông báo đang được phát triển.")}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
              >
                <span className="material-symbols-outlined select-none">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800">Minh Anh</p>
                  <p className="text-[10px] text-slate-500 font-semibold">Học sinh lớp 12</p>
                </div>
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkP0W3XADsLurTSfsUbbKbWn5brqCedUB8Ay4ozFJlrErDtSspJr1MEa2EQXPZ3AaHHtnQMD2Nd-gKWFwwvkcEz_gyHFbRjpfbcm7wKRh-kkik1U2ELgWFk1O4o2QJFmBad68_8ia7lhcjgBUHkjHmFlxbaP0_wBTEH1dfr6YtvduGuiLXW2kQRit3luOFw1gpmf1y7KuQwcSV-yRSqYzCysygkCe3QItA5_G8C2DwHpfGsHBtJ3k6cR6vuV-XyalSzYjxstm3vO56"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link className="hover:text-primary hover:no-underline" href="/dashboard/student">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-sm select-none">chevron_right</span>
          <a className="hover:text-primary hover:no-underline" href="#">
            Hình học lớp 12
          </a>
          <span className="material-symbols-outlined text-sm select-none">chevron_right</span>
          <span className="text-slate-800 font-bold">Thể tích khối chóp</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Article Header */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                {lectureData.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <div 
                    className="size-6 rounded-full bg-slate-200 border border-slate-200 shadow-sm"
                    style={{ 
                      backgroundImage: `url('${lectureData.teacher.avatarUrl}')`, 
                      backgroundSize: 'cover' 
                    }}
                  />
                  <span className="font-semibold text-slate-700">{lectureData.teacher.name}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base select-none">calendar_today</span>
                  <span>{lectureData.publishDate}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm select-none">category</span>
                  <span>{lectureData.category}</span>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              
              {/* Concept Explanation */}
              <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200/60">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl select-none">menu_book</span>
                  <h2 className="text-xl font-bold text-slate-800">{lectureData.sections.concept.title}</h2>
                </div>
                <div className="prose max-w-none space-y-4 leading-relaxed text-slate-600 text-sm">
                  <p>{lectureData.sections.concept.description1}</p>
                  <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-6">
                    <p className="text-2xl font-bold text-center latex-font text-primary tracking-wide">
                      {lectureData.sections.concept.formula}
                    </p>
                    <p className="text-xs text-slate-500 mt-4 italic text-center font-medium">
                      {lectureData.sections.concept.formulaCaption}
                    </p>
                  </div>
                  <p>{lectureData.sections.concept.description2}</p>
                </div>
              </section>

              {/* Exercise Analysis */}
              <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200/60">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl select-none">biotech</span>
                  <h2 className="text-xl font-bold text-slate-800">{lectureData.sections.exercise.title}</h2>
                </div>
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 mb-6">
                  <p className="font-bold mb-2 text-slate-800 text-sm uppercase tracking-wider">Đề bài:</p>
                  <p className="italic text-slate-700 text-sm font-medium leading-relaxed">{lectureData.sections.exercise.statement}</p>
                </div>
                <div className="space-y-6">
                  {lectureData.sections.exercise.steps.map((step, idx) => (
                    <StepItem 
                      key={step.stepNumber}
                      stepNumber={step.stepNumber}
                      title={step.title}
                      isLast={idx === lectureData.sections.exercise.steps.length - 1}
                    >
                      <div className="mt-1.5 leading-relaxed text-slate-600">
                        {step.content}
                      </div>
                    </StepItem>
                  ))}
                </div>
              </section>

              {/* Graphic Illustration */}
              <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200/60">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl select-none">polyline</span>
                  <h2 className="text-xl font-bold text-slate-800">{lectureData.sections.graphic.title}</h2>
                </div>
                <div className="aspect-video w-full rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex flex-col items-center justify-center group relative shadow-inner">
                  <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200 relative flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <span className="material-symbols-outlined text-6xl text-slate-300 select-none">architecture</span>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{lectureData.sections.graphic.alt}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5 flex-col gap-2">
                      <button 
                        onClick={() => alert("Kích hoạt chế độ 3D tương tác...")}
                        className="bg-white/95 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-slate-200 text-slate-700"
                      >
                        <span className="material-symbols-outlined text-sm select-none">zoom_in</span>
                        Phóng to hình vẽ
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center font-semibold">{lectureData.sections.graphic.caption}</p>
              </section>

              {/* Teacher's Notes Section */}
              <section className="bg-blue-500/5 p-6 md:p-8 rounded-2xl border-2 border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-primary/10 select-none pointer-events-none">
                  <span className="material-symbols-outlined text-9xl">campaign</span>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl select-none">campaign</span>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Dặn dò của giáo viên</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {lectureData.notes.map((note) => (
                      <InfoCard
                        key={note.title}
                        variant={note.variant}
                        icon={note.icon}
                        title={note.title}
                      >
                        {note.items.length === 1 && note.title === "Lời khuyên học tập" ? (
                          <p className="italic leading-relaxed text-xs font-medium text-slate-600">
                            {note.items[0]}
                          </p>
                        ) : (
                          <ul className="space-y-2 list-disc pl-4 text-xs font-semibold text-slate-600">
                            {note.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </InfoCard>
                    ))}
                  </div>
                </div>
              </section>

            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Action Cards */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/60 space-y-4">
              <Button 
                variant="action-primary" 
                size="action"
                className="flex items-center justify-center gap-2"
                onClick={handleDownload}
              >
                <span className="material-symbols-outlined select-none">download</span>
                Tải tài liệu PDF
              </Button>
              
              <Button 
                variant="action-secondary" 
                size="action"
                className="flex items-center justify-center gap-2"
                onClick={handleSave}
              >
                <span className="material-symbols-outlined select-none">
                  {isBookmarked ? 'bookmark_remove' : 'bookmark_add'}
                </span>
                {isBookmarked ? 'Đã lưu bài viết' : 'Lưu bài viết'}
              </Button>
            </div>

            {/* Related Lessons */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/60">
              <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2 border-b pb-2">
                <span className="material-symbols-outlined text-primary select-none">local_library</span>
                Bài giảng liên quan
              </h3>
              
              <div className="space-y-4">
                {lectureData.relatedLectures.map((lecture) => (
                  <LectureRowCard
                    key={lecture.title}
                    imageSrc={lecture.imageSrc}
                    title={lecture.title}
                    category={lecture.category}
                    href={lecture.href}
                    onClick={() => alert(`Chuyển sang xem bài giảng: "${lecture.title}"`)}
                  />
                ))}
              </div>
              
              <button 
                onClick={() => alert("Đang chuyển hướng xem tất cả bài giảng...")}
                className="w-full mt-6 text-sm font-bold text-primary hover:underline flex items-center justify-center gap-1 outline-none border-none bg-transparent"
              >
                Xem tất cả bài giảng 
                <span className="material-symbols-outlined text-sm select-none">arrow_forward</span>
              </button>
            </div>

            {/* Ad/Promo Card */}
            <div className="rounded-xl bg-slate-900 p-6 text-white relative overflow-hidden group shadow-lg">
              <div className="relative z-10 space-y-4">
                <span className="bg-primary px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider">
                  Ưu đãi 50%
                </span>
                <h3 className="text-xl font-bold leading-tight tracking-tight">
                  Khóa học Luyện thi THPT Quốc gia 2024
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Hệ thống bài giảng từ cơ bản đến nâng cao cùng đội ngũ giáo viên top đầu.
                </p>
                <Button 
                  variant="pricing-primary" 
                  size="pricing"
                  className="bg-white hover:bg-slate-100 text-slate-900 hover:text-slate-900 font-bold text-sm w-full py-3 rounded-lg border-none hover:scale-100 shadow-md"
                  onClick={() => alert("Đăng ký khóa học ngay...")}
                >
                  Đăng ký ngay
                </Button>
              </div>
              
              {/* Abstract decoration */}
              <div className="absolute -bottom-10 -right-10 size-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
            </div>

          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-primary mb-4">
            <span className="material-symbols-outlined text-3xl select-none">functions</span>
            <span className="text-xl font-bold text-slate-800">MathEdu</span>
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">
            Nền tảng học toán trực tuyến hàng đầu dành cho học sinh Việt Nam. Sáng tạo - Tư duy - Thành công.
          </p>
          <div className="mt-8 flex justify-center gap-6 text-slate-400 text-sm font-semibold">
            <a className="hover:text-primary transition-colors hover:no-underline" href="#">Facebook</a>
            <a className="hover:text-primary transition-colors hover:no-underline" href="#">Youtube</a>
            <a className="hover:text-primary transition-colors hover:no-underline" href="#">TikTok</a>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-slate-400 text-xs font-semibold">© 2024 MathEdu Learning. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
