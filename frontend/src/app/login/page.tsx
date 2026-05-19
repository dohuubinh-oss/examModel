'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sigma, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';

export default function LoginPage() {
  const router = useRouter();
  const [fullname, setFullname] = React.useState('');
  const [identity, setIdentity] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple front-end validation
    if (!fullname.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn');
      return;
    }
    if (!identity.trim()) {
      setErrorMsg('Vui lòng nhập số điện thoại hoặc email');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    // Mock API Submission (ready for Go-Gin endpoint connection)
    try {
      // Simulate Go-Gin API response delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store mock user state or token if necessary
      localStorage.setItem('user_name', fullname);
      localStorage.setItem('user_identity', identity);

      // Redirect to the generalized User dashboard
      router.push('/dashboard/users');
    } catch (err) {
      setErrorMsg('Đăng nhập thất bại. Vui lòng thử lại!');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full lg:h-screen lg:overflow-hidden font-display bg-white text-slate-800 text-[1rem]">
      {/* Left Side: Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col items-center justify-center overflow-hidden shrink-0 select-none">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-white/10 rounded-full blur-[8rem]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[60rem] h-[60rem] bg-white/5 rounded-full blur-[10rem]"></div>
        
        {/* Entrance animations for branding card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 text-center px-[3rem]"
        >
          <div className="mb-[2rem]">
            <img 
              alt="Math Education Illustration" 
              className="w-[25rem] h-auto mx-auto rounded-xl shadow-2xl border border-white/10" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGIQTcprY83xAjv0z4XyZWm9LJsRcfLVtoF31sieWB0_ENDZiYijROoNPnpz5vGkSwGaxxSASyktNOQ9uWHx6AuAatltAM5ElgGJ7-0LktQACInwqZXqIsL6UA0kmhl6dVMBbG3-j13Bm1DpE1DhLV32lX7bJ_SC3bmQ6l48iR3K1otYEDIGIJ9Uz2dCd2_-esIfj4RdzQ1Yq77y0XojJl-V_eGQPk05tHFZrT5wdn2QkFqcfIFxH358OxYKw4KdzOFB9530JdQCLh"
            />
          </div>
          <h1 className="text-[2.5rem] font-bold text-white mb-[1rem] leading-tight">Chào mừng bạn trở lại!</h1>
          <p className="text-white/80 text-[1.125rem] max-w-[32rem] mx-auto leading-relaxed">
            Cùng chinh phục môn Toán mỗi ngày với các phương pháp học hiện đại và thú vị.
          </p>
        </motion.div>
        
        {/* Small floating math symbols for aesthetics with infinite floating animations */}
        <motion.div 
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[5rem] left-[5rem] text-white/20 text-[4rem] font-bold"
        >
          ∑
        </motion.div>
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[5rem] right-[10rem] text-white/20 text-[4rem] font-bold"
        >
          π
        </motion.div>
        <motion.div 
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-[2.5rem] text-white/20 text-[3.5rem] font-bold"
        >
          √
        </motion.div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 lg:h-full flex items-center justify-center p-[2rem] lg:p-[3rem] bg-white overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[520px]"
        >
          {/* Title - Perfectly Centered */}
          <div className="mb-[1.5rem] text-center">
            <h2 className="text-[2rem] font-bold text-slate-800 mb-[0.5rem] tracking-tight">Đăng nhập</h2>
            <p className="text-slate-500 text-[1rem]">Vui lòng nhập thông tin để truy cập bài học của bạn.</p>
          </div>

          {/* Form */}
          <form className="space-y-[1rem]" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="bg-rose-50 text-rose-600 text-xs font-semibold px-4 py-3 rounded-lg border border-rose-100 transition-all">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-[0.875rem] font-semibold text-slate-700 mb-[0.5rem]" htmlFor="fullname">Họ và Tên</label>
              <Input 
                variant="login" 
                id="fullname" 
                placeholder="Nhập họ và tên của bạn" 
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                disabled={isLoading}
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-[0.875rem] font-semibold text-slate-700 mb-[0.5rem]" htmlFor="identity">Số điện thoại hoặc Email</label>
              <Input 
                variant="login" 
                id="identity" 
                placeholder="Nhập email hoặc số điện thoại" 
                type="text"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-[0.5rem]">
                <label className="block text-[0.875rem] font-semibold text-slate-700" htmlFor="password">Mật khẩu</label>
                <a className="text-[0.875rem] font-medium text-primary hover:underline transition-all duration-200" href="#">Quên mật khẩu?</a>
              </div>
              <PasswordInput 
                variant="login" 
                id="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <Button 
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full font-bold py-[1rem] h-auto shadow-lg shadow-primary/20 text-[1.125rem]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-[1.25rem]">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[0.875rem]">
              <span className="px-[1rem] bg-white text-slate-500 font-medium">Hoặc tiếp tục với</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid gap-[1rem]">
            <button 
              type="button"
              disabled={isLoading}
              onClick={() => {
                setFullname('Đăng nhập Google');
                setIdentity('google_sso@example.com');
                setPassword('google_sso_verified');
                alert('Khởi chạy cổng Đăng nhập SSO qua Google của MathGenius!');
              }}
              className="flex items-center justify-center gap-[0.75rem] px-[1rem] py-[0.875rem] border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 transition-all duration-300 group cursor-pointer"
            >
              <svg className="w-[1.25rem] h-[1.25rem] group-hover:scale-110 transition-transform duration-300 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="text-[0.875rem] font-semibold text-slate-700">Google</span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center mt-[1.5rem] text-slate-500 text-[0.875rem]">
            Bạn chưa có tài khoản? 
            <Link className="text-primary font-bold hover:underline ml-[0.25rem] transition-all duration-200" href="/register">Đăng ký ngay</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
