'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { AvatarGroup } from '@/components/ui/AvatarGroup';
import { cn } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  
  // Pricing toggle state (Monthly vs Yearly)
  const [isYearly, setIsYearly] = React.useState<boolean>(false);
  
  // Interactive assistant state ('initial' | 'solved' | 'dismissed')
  const [assistantState, setAssistantState] = React.useState<'initial' | 'solved' | 'dismissed'>('initial');

  // Feature list data
  const features = [
    {
      icon: "psychology",
      title: "Gia sư AI 24/7",
      description: "Giải đáp thắc mắc ngay lập tức, hướng dẫn từng bước chi tiết giúp học sinh hiểu bản chất vấn đề thay vì chỉ chép lời giải.",
      actionText: "Khám phá ngay",
      actionUrl: "/dashboard/student",
      bgColor: "bg-primary/10",
      textColor: "text-primary"
    },
    {
      icon: "sports_esports",
      title: "Học tập Game hóa",
      description: "Hệ thống Streak, điểm thưởng và bảng xếp hạng giúp học sinh duy trì động lực học tập mỗi ngày mà không thấy nhàm chán.",
      actionText: "Xem bảng xếp hạng",
      actionUrl: "/dashboard/student",
      bgColor: "bg-orange-100",
      textColor: "text-orange-500"
    },
    {
      icon: "menu_book",
      title: "Bám sát lộ trình Bộ GD",
      description: "Kho đề thi, bài tập và kiến thức trọng tâm được cập nhật liên tục theo chuẩn khung chương trình giáo dục phổ thông mới.",
      actionText: "Xem kho tài liệu",
      actionUrl: "/dashboard/student",
      bgColor: "bg-blue-100",
      textColor: "text-primary"
    }
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 selection:bg-primary/30 font-display min-h-screen">
      
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-icons text-white">functions</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Math<span className="text-primary">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium">
            <a className="hover:text-primary transition-colors text-slate-600 dark:text-slate-300" href="#features">Tính năng</a>
            <a className="hover:text-primary transition-colors text-slate-600 dark:text-slate-300" href="#pricing">Bảng giá</a>
            <a className="hover:text-primary transition-colors text-slate-600 dark:text-slate-300" href="/question-bank">Ngân hàng đề</a>
            <a className="hover:text-primary transition-colors text-slate-600 dark:text-slate-300" href="/ui-lab">UI Lab</a>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="pill-outline" 
              size="pill"
              onClick={() => router.push('/login')}
            >
              Đăng nhập
            </Button>
            <Button 
              variant="pill-primary" 
              size="pill"
              onClick={() => router.push('/dashboard/student')}
            >
              Học ngay
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Heading and CTAs */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">AI-Powered Math Tutoring</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Học Toán không còn khó với <span className="text-primary italic">trợ lý AI</span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg">
              Chương trình chuẩn Bộ Giáo dục từ lớp 6-12. Cá nhân hóa lộ trình học tập, giúp bạn tiến bộ vượt bậc chỉ sau 30 ngày.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                variant="large-primary" 
                size="large"
                className="flex items-center justify-center gap-2"
                onClick={() => router.push('/register')}
              >
                Bắt đầu miễn phí
                <span className="material-icons">arrow_forward</span>
              </Button>
              
              <Button 
                variant="large-outline" 
                size="large"
                onClick={() => {
                  const el = document.getElementById('features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Xem demo
              </Button>
            </div>

            {/* Social Proof Avatar Group */}
            <div className="flex items-center gap-4 py-6 border-t border-slate-200 dark:border-slate-800">
              <AvatarGroup
                avatars={[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCkg2j1eQxe8m9S3Yhptdh96e6OUu_RZ-rwmBhDF5piZGVUws4S2-y8OF4EikVbhklBkU9IB6_9GrPb1F8AOblKwxq1FGUtKjOydvTMfYkLsYVL5Ape6mJ27plYyHP47fJpwLrAgtbxy-AcoLBDCdh8xGSsrd7xTjlV0zcF9QaEaTtotCSe8Cy5J_XO3WCCTnMNKNQVrXIEsl5uhPYsnSmcVzYxjUjCdwkDZNfXOkSV9HTD8QvdaxO63ZhfE0ZV4GcHm8pxX3tMEMZm",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuLLhO8u-iBzfHpy648Tt1cNuk7COYKl_yWeI7H15Y31w-DcTYEKRakeXWZPldOxjwFG6-H0FYqimLhGecYjcHLbxvGP1fnwbrHHM45u-7WeBDYBckxr5GSkWUFxLoS7nzWogEP1Ni45cd8_g-alCnQuUDJ6EnB7uPUZkEFT3h1qj10GKXTuylWvrQPEwIuX-g13g_x2YffKW2IwtKt2rI3gPnTIvbqOiTERMeO10H7Rb429QwrhIm1DlRzauvGXW037bu7r-dOYBMn",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCnYWjVSOz64s5rTjt6fGCdrHutCZKy1q7_5jx4c49sXHt8goVaMj6OWXpUwi6ZuHKiJ8QNHjRXAE0DB-NPoGp7rEkKoKmOuhufMb2fWjFXhJ5gFQR53hxiFRuL-GwXxaSVTkQqWaiqmF4_vZbFw0ioWqKnNkQZNkClbgxO3q61rU1zMOUxTlC725DMg8pmvOf5yWd0XAin_obayiDvbShW1z7kIr49gWci08wSSe4ScepETs6bRMDNJCIGGbj5KdTYxKrLty62xdsg"
                ]}
                totalLabel="+100k"
                text="100,000+ Học sinh tin dùng trên toàn quốc"
              />
            </div>
          </div>

          {/* Right Column: Interactive Dashboard Preview Card */}
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
            
            <div className="relative bg-white dark:bg-surface-dark p-6 rounded-3xl soft-shadow border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold">Chào Minh! 👋</h3>
                  <p className="text-sm text-slate-500">Tiếp tục giải đề Toán 12</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full text-orange-600 font-bold">
                    <span className="material-icons text-sm">local_fire_department</span>
                    <span>12</span>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">
                    <span className="material-icons text-slate-600">notifications</span>
                  </div>
                </div>
              </div>

              {/* Progress & Badges Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase mb-1">Tiến độ tuần</p>
                  <p className="text-2xl font-bold">85%</p>
                  <div className="w-full bg-primary/10 h-1.5 rounded-full mt-2">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Huy hiệu</p>
                  <div className="flex gap-2">
                    <span className="material-icons text-yellow-500">emoji_events</span>
                    <span className="material-icons text-blue-500">verified</span>
                    <span className="material-icons text-primary">psychology</span>
                  </div>
                </div>
              </div>

              {/* Interactive Assistant Simulator */}
              <div className="bg-slate-900 rounded-2xl p-4 text-white min-h-[140px] flex flex-col justify-between transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-bounce">
                    <span className="material-icons text-xs text-white">auto_awesome</span>
                  </div>
                  <span className="text-sm font-bold">Trợ lý MathAI</span>
                </div>
                
                {assistantState === 'initial' && (
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-xl p-3 text-xs leading-relaxed">
                      "Chào bạn! Tôi thấy bạn đang gặp khó ở phần **Tích phân**. Bạn có muốn tôi hướng dẫn cách giải phương pháp từng phần không?"
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setAssistantState('solved')} 
                        className="px-3 py-2 bg-primary text-xs font-bold rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                      >
                        Giải ngay
                      </button>
                      <button 
                        onClick={() => setAssistantState('dismissed')} 
                        className="px-3 py-2 bg-white/5 text-xs font-bold rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        Để sau
                      </button>
                    </div>
                  </div>
                )}

                {assistantState === 'solved' && (
                  <div className="space-y-3">
                    <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl p-3 text-xs leading-relaxed">
                      "Tuyệt vời! Đang khởi động lộ trình hướng dẫn giải Tích phân từng phần dành riêng cho bạn..."
                    </div>
                    <button 
                      onClick={() => setAssistantState('initial')} 
                      className="text-xs text-slate-400 underline hover:text-white cursor-pointer"
                    >
                      Quay lại đề xuất
                    </button>
                  </div>
                )}

                {assistantState === 'dismissed' && (
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-xl p-3 text-xs text-slate-400 italic">
                      "Trợ lý MathAI đã được thu nhỏ. Bạn có thể nhấn vào bong bóng trò chuyện ở góc bất cứ lúc nào."
                    </div>
                    <button 
                      onClick={() => setAssistantState('initial')} 
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-lg transition-colors"
                    >
                      Bật lại trợ lý
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Float Badge Indicator */}
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold">
                <span className="material-icons">trending_up</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Tăng 2.5 điểm</p>
                <p className="text-[10px] text-slate-500">Trung bình sau 2 tuần</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-surface-dark scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6 text-slate-950 dark:text-white">Tại sao chọn chúng tôi?</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Chúng tôi kết hợp công nghệ AI hàng đầu và phương pháp gamification để biến việc học Toán thành một hành trình thú vị.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="p-8 rounded-[20px] bg-slate-50 dark:bg-background-dark border border-slate-100 dark:border-slate-800 soft-shadow hover:-translate-y-2 transition-transform duration-300 group flex flex-col justify-between h-full"
              >
                <div>
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", feature.bgColor)}>
                    <span className={cn("material-icons text-3xl", feature.textColor)}>{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-950 dark:text-white">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>
                
                <Link 
                  href={feature.actionUrl}
                  className="flex items-center gap-2 text-primary font-bold cursor-pointer group-hover:underline"
                >
                  <span>{feature.actionText}</span>
                  <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6 text-slate-950 dark:text-white">Lựa chọn gói học phù hợp</h2>
            
            {/* Toggle switch for Month vs Year */}
            <div className="flex items-center justify-center gap-4 mt-8 bg-slate-50 dark:bg-slate-800/50 w-fit mx-auto px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700">
              <span className={cn("text-sm font-bold uppercase transition-all", !isYearly ? "text-primary" : "text-slate-400")}>
                Hàng tháng
              </span>
              <Switch 
                checked={isYearly}
                onChange={setIsYearly}
              />
              <span className={cn("text-sm font-bold uppercase transition-all", isYearly ? "text-primary" : "text-slate-400")}>
                Hàng năm <span className="text-primary font-black">(Tiết kiệm 20%)</span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            
            {/* Basic Gói */}
            <div className="bg-white dark:bg-surface-dark p-10 rounded-[2rem] border border-slate-100 dark:border-slate-800 soft-shadow flex flex-col justify-between h-full">
              <div>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">Gói Cơ Bản</h3>
                  <p className="text-slate-500 dark:text-slate-400">Khám phá phương pháp học AI</p>
                </div>
                
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-slate-950 dark:text-white">0đ</span>
                  <span className="text-slate-500">/tháng</span>
                </div>

                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3">
                    <span className="material-icons text-primary text-lg">check_circle</span>
                    <span>Học liệu chuẩn lớp 6-12</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-icons text-primary text-lg">check_circle</span>
                    <span>5 câu hỏi AI mỗi ngày</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-icons text-primary text-lg">check_circle</span>
                    <span>Tham gia bảng xếp hạng</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-30">
                    <span className="material-icons text-lg">cancel</span>
                    <span className="line-through">Lộ trình học cá nhân hóa</span>
                  </li>
                </ul>
              </div>

              <Button 
                variant="pricing-outline" 
                size="pricing"
                onClick={() => router.push('/register')}
              >
                Đăng ký ngay
              </Button>
            </div>

            {/* Pro Gói */}
            <div className="relative bg-white dark:bg-surface-dark p-10 rounded-[2rem] border-2 border-primary soft-shadow flex flex-col justify-between h-full">
              <div className="absolute -top-4 right-8 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Được chọn nhiều nhất
              </div>
              
              <div>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">Gói Pro</h3>
                  <p className="text-slate-500 dark:text-slate-400">Tối ưu điểm số cùng chuyên gia AI</p>
                </div>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-slate-950 dark:text-white transition-all duration-300">
                    {isYearly ? '159k' : '199k'}
                  </span>
                  <span className="text-slate-500">/tháng</span>
                  {isYearly && (
                    <span className="text-xs text-orange-500 font-bold bg-orange-100 px-2 py-0.5 rounded ml-2">
                      Tiết kiệm ~480k/năm
                    </span>
                  )}
                </div>

                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3">
                    <span className="material-icons text-primary text-lg">check_circle</span>
                    <span className="font-bold text-slate-900 dark:text-white">Không giới hạn hỏi đáp AI</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-icons text-primary text-lg">check_circle</span>
                    <span>Lộ trình học cá nhân hóa</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-icons text-primary text-lg">check_circle</span>
                    <span>Kho 100,000+ đề thi có lời giải</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-icons text-primary text-lg">check_circle</span>
                    <span>Phân tích điểm mạnh/yếu 24/7</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-icons text-primary text-lg">check_circle</span>
                    <span>Hỗ trợ 1:1 qua hotline VIP</span>
                  </li>
                </ul>
              </div>

              <Button 
                variant="pricing-primary" 
                size="pricing"
                onClick={() => router.push('/register')}
              >
                Nâng cấp Pro ngay
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-background-dark pt-20 pb-10 border-t border-slate-200/50 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <span className="material-icons text-sm">functions</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MathAI</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                Nền tảng học Toán thông minh ứng dụng trí tuệ nhân tạo, giúp học sinh Việt Nam chinh phục mọi kỳ thi.
              </p>
              <div className="flex gap-4">
                <a className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#">
                  <span className="material-icons">facebook</span>
                </a>
                <a className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#">
                  <span className="material-icons">smart_display</span>
                </a>
                <a className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#">
                  <span className="material-icons">alternate_email</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-slate-900 dark:text-white">Liên kết</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                <li><a className="hover:text-primary transition-colors" href="#">Về chúng tôi</a></li>
                <li><a className="hover:text-primary transition-colors" href="#features">Tính năng</a></li>
                <li><a className="hover:text-primary transition-colors" href="#pricing">Bảng giá</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Đối tác</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-slate-900 dark:text-white">Hỗ trợ</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                <li><a className="hover:text-primary transition-colors" href="#">Trung tâm trợ giúp</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Chính sách bảo mật</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Điều khoản sử dụng</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Liên hệ</a></li>
              </ul>
            </div>

          </div>
          
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
            <p>© 2026 MathAI EdTech Platform. Bản quyền thuộc về Công ty TNHH Giáo dục Thông minh.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
