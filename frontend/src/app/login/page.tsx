'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sigma, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const router = useRouter();
  const [identity, setIdentity] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple front-end validation
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

    // API Submission
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: identity.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
      
      // Store user token and info
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('user_name', data.data.user.full_name || 'User');
      localStorage.setItem('user_identity', data.data.user.username);
      localStorage.setItem('user_role', data.data.user.role);

      // Redirect to the generalized User dashboard
      router.push('/dashboard/users');
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
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
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}>
            <form className="space-y-[1rem]" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="bg-rose-50 text-rose-600 text-xs font-semibold px-4 py-3 rounded-lg border border-rose-100 transition-all">
                {errorMsg}
              </div>
            )}



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
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrorMsg('Đăng nhập Google thất bại')}
              text="signin_with"
              shape="rectangular"
              theme="outline"
              size="large"
            />
          </div>
          </GoogleOAuthProvider>

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
