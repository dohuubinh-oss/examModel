'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, FileDown, Upload, Settings, ListOrdered,
  SlidersHorizontal, Grid, Lightbulb
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { QuestionCard } from '@/components/questions/QuestionCard';

import { mockExamConfig, mockQuestions, mockMatrix } from '@/lib/mock-data';

export default function ExamCreatorPage() {
  const router = useRouter();
  const multipleChoiceQs = mockQuestions.filter(q => q.type === 'multiple_choice');
  const essayQs = mockQuestions.filter(q => q.type === 'essay');

  return (
    <div className="bg-background-light text-slate-900 min-h-screen font-display pb-20 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 px-4 md:px-8 py-3">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="bg-primary/10 p-2 rounded-lg text-primary hover:bg-primary/20 transition-colors cursor-pointer flex items-center justify-center"
              title="Quay lại trang trước"
            >
              <Sparkles size={24} />
            </button>
            <div>
              <h1 className="text-lg font-bold leading-tight">Kiểm tra & Hoàn thiện đề thi AI</h1>
              <p className="text-xs text-slate-500">Toán học THPT • Mã đề: {mockExamConfig.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="hidden md:flex">
              <FileDown size={20} />
              Tải file PDF
            </Button>
            <Button variant="default">
              <Upload size={20} />
              Lưu & Xuất bản
            </Button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (Questions) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ListOrdered className="text-primary" size={24} />
              Danh sách câu hỏi ({mockExamConfig.totalQuestions} câu)
            </h2>
          </div>

          {/* Section 1: Trắc nghiệm */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 py-2 border-l-4 border-primary pl-4 bg-white rounded-r-xl">
              <h3 className="text-lg font-extrabold uppercase tracking-tight">Phần 1: Trắc nghiệm</h3>
              <Badge variant="default">47 câu</Badge>
            </div>

            {multipleChoiceQs.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                mode="teacher"
                onRegenerate={(qId) => console.log('Regenerating question:', qId)}
              />
            ))}
          </div>

          {/* Section 2: Tự luận */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 py-2 border-l-4 border-amber-500 pl-4 bg-white rounded-r-xl">
              <h3 className="text-lg font-extrabold uppercase tracking-tight">Phần 2: Tự luận</h3>
              <Badge variant="default">3 câu</Badge>
            </div>

            {essayQs.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                mode="teacher"
                onRegenerate={(qId) => console.log('Regenerating question:', qId)}
              />
            ))}
          </div>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">

            {/* Cấu hình cơ bản */}
            <Card>
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold flex items-center gap-2">
                  <SlidersHorizontal className="text-primary" size={20} />
                  Cấu hình cơ bản
                </h3>
              </div>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Tên đề thi</label>
                  <Input defaultValue={mockExamConfig.name} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Khối lớp</label>
                    <Select defaultValue={mockExamConfig.grade}>
                      {[6, 7, 8, 9, 10, 11, 12].map(g => (
                        <option key={g} value={g.toString()}>Lớp {g}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Thời gian (phút)</label>
                    <div className="relative">
                      <Input type="number" defaultValue={mockExamConfig.duration} className="pr-10" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ma trận đề thi */}
            <Card>
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold flex items-center gap-2">
                  <Grid className="text-primary" size={20} />
                  Ma trận đề thi
                </h3>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-100">
                      <th className="py-3 font-medium">Chủ đề</th>
                      <th className="py-3 font-medium text-center">NB</th>
                      <th className="py-3 font-medium text-center">TH</th>
                      <th className="py-3 font-medium text-center">VD</th>
                      <th className="py-3 font-medium text-center">VDC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockMatrix.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-3 font-medium">{row.topic}</td>
                        <td className={`py-3 text-center ${row.highlighted === 'nb' ? 'font-bold text-primary bg-primary/5' : ''}`}>{row.nb}</td>
                        <td className={`py-3 text-center ${row.highlighted === 'th' ? 'font-bold text-primary bg-primary/5' : ''}`}>{row.th}</td>
                        <td className={`py-3 text-center ${row.highlighted === 'vd' ? 'font-bold text-primary bg-primary/5' : ''}`}>{row.vd}</td>
                        <td className={`py-3 text-center ${row.highlighted === 'vdc' ? 'font-bold text-primary bg-primary/5' : ''}`}>{row.vdc}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50">
                      <td className="py-3 font-bold">Tổng cộng</td>
                      <td className="py-3 text-center font-bold">15</td>
                      <td className="py-3 text-center font-bold">12</td>
                      <td className="py-3 text-center font-bold">12</td>
                      <td className="py-3 text-center font-bold">3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100 space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Độ khó: {mockExamConfig.difficultyLabel}</span>
                    <span className="font-bold">{mockExamConfig.difficultyScore}/10</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${mockExamConfig.difficultyScore * 10}%` }}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Gợi ý từ AI */}
            <div className="p-5 bg-gradient-to-br from-primary to-blue-700 rounded-2xl text-white shadow-lg shadow-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={20} />
                <h4 className="font-bold text-sm">Gợi ý từ AI</h4>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed mb-4">
                Đề thi hiện tại đang thiếu câu hỏi về "Khối tròn xoay" cấp độ Vận dụng cao. Bạn có muốn bổ sung 1 câu để cân bằng ma trận?
              </p>
              <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs font-bold transition-all">
                Tạo thêm câu hỏi
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex gap-3 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold">
          <Grid size={20} />
          Ma trận
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/30">
          <Upload size={20} />
          Lưu đề thi
        </button>
      </div>

    </div>
  );
}
