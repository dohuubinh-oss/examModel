'use client';

import React from 'react';
import { Save, FileDown, Eye, RefreshCw, Flag, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { mockQuestions } from '@/lib/mock-data';

export default function UILabPage() {
  const [selectedLabOpt, setSelectedLabOpt] = React.useState<string>('');

  return (
    <div className="max-w-[1440px] mx-auto p-8 space-y-12 bg-background-light min-h-screen text-slate-900 font-display">
      <div>
        <h1 className="text-3xl font-bold mb-6">UI Lab (Atomic Components)</h1>
        <p className="text-slate-500 mb-8">Kiểm thử giao diện các components Atomic trước khi ghép vào hệ thống.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">1. Buttons</h2>
        <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <Button variant="default">
            <Save size={18} />
            Lưu & Xuất bản
          </Button>
          <Button variant="secondary">
            <FileDown size={18} />
            Tải file PDF
          </Button>
          <Button variant="outline">
            <Eye size={18} />
            Xem hướng dẫn chấm
          </Button>
          <Button variant="ghost">
            <RefreshCw size={18} />
            Đổi câu hỏi khác
          </Button>
          <Button variant="ghost-danger">
            <Flag size={16} />
            Báo lỗi AI
          </Button>
          
          <div className="w-full mt-4 flex items-center gap-4 border-t pt-4 border-slate-100">
            <span className="text-sm font-semibold text-slate-500 w-24">Sizes:</span>
            <Button variant="default" size="sm">Small (sm)</Button>
            <Button variant="default" size="default">Default</Button>
            <Button variant="default" size="lg">Large (lg)</Button>
            <Button variant="outline" size="icon">
              <Settings size={20} />
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">2. Inputs & Selects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 ml-1">Tên đề thi</label>
            <Input placeholder="Nhập tên đề thi..." defaultValue="Đề thi thử Toán THPTQG số 1" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 ml-1">Thời gian (phút)</label>
            <div className="relative">
              <Input type="number" defaultValue={90} className="pr-10" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Min</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 ml-1">Khối lớp</label>
            <Select>
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
            </Select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">3. Badges</h2>
        <div className="flex flex-wrap gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <Badge variant="success">Đã kiểm tra 48/50</Badge>
          <Badge variant="default">47 câu</Badge>
          <Badge variant="primary">Câu 1</Badge>
          <Badge variant="outline">A</Badge>
          <Badge variant="primary" className="rounded-full w-6 h-6 flex items-center justify-center p-0">B</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">4. Cards</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-7xl">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chế độ Giáo viên (Teacher Mode)</h3>
            <QuestionCard 
              question={mockQuestions[0]} 
              mode="teacher" 
              onRegenerate={(qId) => console.log('Regenerated question: ', qId)} 
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Chế độ Học sinh (Student Mode - Clickable)</h3>
            <QuestionCard 
              question={mockQuestions[1]} 
              mode="student" 
              selectedOptionId={selectedLabOpt}
              onOptionSelect={(qId, optId) => setSelectedLabOpt(optId)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
