'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = React.useState('');
  const [identity, setIdentity] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Front-end validations
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
    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải dài tối thiểu 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);

    // API Submission
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullname.trim(),
          email: identity.includes('@') ? identity.trim() : '',
          phone: !identity.includes('@') ? identity.trim() : '',
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }
      
      setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng...');
      
      // Store registered details for convenient pre-filling
      localStorage.setItem('registered_fullname', fullname);
      localStorage.setItem('registered_identity', identity);

      // Redirect to Login page automatically
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng ký thất bại. Vui lòng thử lại!');
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/v1/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Đăng nhập Google thất bại');
      
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('user_name', data.data.user.full_name);
      localStorage.setItem('user_identity', data.data.user.username);
      localStorage.setItem('user_role', data.data.user.role);
      router.push('/dashboard/users');
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng nhập Google thất bại. Vui lòng thử lại!');
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
          <h1 className="text-[2.5rem] font-bold text-white mb-[1rem] leading-tight">Bắt đầu học ngay hôm nay!</h1>
          <p className="text-white/80 text-[1.125rem] max-w-[32rem] mx-auto leading-relaxed">
            Đăng ký tài khoản để khám phá kho tài liệu và đề thi toán học phong phú hoàn toàn miễn phí.
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

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 lg:h-full flex items-center justify-center p-[2rem] lg:p-[3rem] bg-white overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[560px] py-[1rem]"
        >
          {/* Title - Perfectly Centered */}
          <div className="mb-[1.5rem] text-center">
            <h2 className="text-[2rem] font-bold text-slate-800 mb-[0.5rem] tracking-tight">Đăng ký tài khoản</h2>
            <p className="text-slate-500 text-[1rem]">Vui lòng điền thông tin để bắt đầu học tập.</p>
          </div>

          {/* Form */}
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}>
            <form className="space-y-[1rem]" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="bg-rose-50 text-rose-600 text-xs font-semibold px-4 py-3 rounded-lg border border-rose-100 transition-all animate-pulse">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-50 text-emerald-600 text-xs font-semibold px-4 py-3 rounded-lg border border-emerald-100 transition-all">
                {successMsg}
              </div>
            )}

            {/* Row 1: Họ và Tên (Full width) */}
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

            {/* Row 2: Số điện thoại hoặc Email (Full width) */}
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

            {/* Row 3: Mật khẩu & Xác nhận mật khẩu (2 columns on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1rem]">
              <div>
                <label className="block text-[0.875rem] font-semibold text-slate-700 mb-[0.5rem]" htmlFor="password">Mật khẩu</label>
                <PasswordInput 
                  variant="login" 
                  id="password" 
                  placeholder="Tối thiểu 6 ký tự" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-[0.875rem] font-semibold text-slate-700 mb-[0.5rem]" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <PasswordInput 
                  variant="login" 
                  id="confirmPassword" 
                  placeholder="Nhập lại mật khẩu" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button 
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full font-bold py-[1rem] h-auto shadow-lg shadow-primary/20 text-[1.125rem] mt-[0.5rem]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký'
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
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrorMsg('Đăng ký Google thất bại')}
              text="signup_with"
              shape="rectangular"
              theme="outline"
              size="large"
            />
          </div>
          </GoogleOAuthProvider>

          {/* Footer */}
          <p className="text-center mt-[1.5rem] text-slate-500 text-[0.875rem]">
            Bạn đã có tài khoản? 
            <Link className="text-primary font-bold hover:underline ml-[0.25rem] transition-all duration-200" href="/login">Đăng nhập ngay</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
