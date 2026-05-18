'use client';

import React from 'react';
import { Save, FileDown, Eye, RefreshCw, Flag, Settings, Upload, Plus, School, BookOpen, FolderOpen, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { Collapsible } from '@/components/ui/Collapsible';
import { FloatingActionBar } from '@/components/ui/FloatingActionBar';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { mockQuestions } from '@/lib/mock-data';

export default function UILabPage() {
  const [selectedLabOpt, setSelectedLabOpt] = React.useState<string>('');
  const [selectedQs, setSelectedQs] = React.useState<string[]>([]);
  const [isBarOpen, setIsBarOpen] = React.useState<boolean>(false);

  const toggleQuestionSelection = (id: string) => {
    setSelectedQs(prev =>
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  React.useEffect(() => {
    setIsBarOpen(selectedQs.length > 0);
  }, [selectedQs]);

  return (
    <div className="max-w-[1440px] mx-auto p-8 space-y-12 bg-background-light min-h-screen text-slate-900 font-display pb-32">
      <div>
        <h1 className="text-3xl font-bold mb-6">UI Lab (Atomic Components)</h1>
        <p className="text-slate-500 mb-8">Kiểm thử giao diện các components Atomic trước khi ghép vào hệ thống.</p>
      </div>

      {/* Buttons */}
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
          <Button variant="outline-slate">
            <Upload size={18} />
            Nhập từ JSON
          </Button>
          <Button variant="default" className="shadow-md shadow-primary/20">
            <Plus size={18} />
            Tạo đề thi
          </Button>
          <Button variant="ghost">
            <RefreshCw size={18} />
            Đổi câu hỏi
          </Button>
          <Button variant="ghost-danger" size="icon" title="Xóa">
            <Trash2 size={18} />
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

      {/* Inputs & Selects */}
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

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">3. Badges (Generalized Semantic Variants)</h2>
        <div className="flex flex-wrap gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <Badge variant="default" size="md">Đã kiểm tra 48/50</Badge>
          <Badge variant="outline" size="md">A</Badge>
          
          <div className="w-full mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center">
            <span className="text-sm font-semibold text-slate-500 w-24">Tags (sm):</span>
            <Badge variant="primary" size="sm">LỚP 9 - GIẢI TÍCH</Badge>
            <Badge variant="success" size="sm">Nhận biết</Badge>
            <Badge variant="warning" size="sm">Thông hiểu</Badge>
            <Badge variant="danger" size="sm">Vận dụng cao</Badge>
          </div>
        </div>
      </section>

      {/* Checkboxes & Collapsibles */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">4. Checkboxes & Sidebar Collapsibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {/* Checkbox showcases */}
          <div className="space-y-4 border-r border-slate-100 pr-6">
            <h3 className="text-sm font-bold text-slate-700">Checkbox Atoms</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 text-sm cursor-pointer select-none">
                <Checkbox checkboxSize="sm" />
                <span>Small size checkbox (14px)</span>
              </label>
              <label className="flex items-center gap-3 text-sm cursor-pointer select-none">
                <Checkbox checkboxSize="md" defaultChecked />
                <span>Medium size checkbox (18px, checked)</span>
              </label>
            </div>
          </div>

          {/* Sidebar filters mockup using Collapsible and Checkbox */}
          <div className="md:col-span-2 space-y-4 pl-0 md:pl-6">
            <h3 className="text-sm font-bold text-slate-700">Sidebar Collapsible Filters Mockup</h3>
            <div className="w-72 border border-slate-100 rounded-xl bg-slate-50/50 p-3 space-y-3">
              <Collapsible title="Khối lớp" icon={<School className="h-4 w-4" />} open>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <Checkbox checkboxSize="sm" /> Lớp 6
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <Checkbox checkboxSize="sm" /> Lớp 7
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <Checkbox checkboxSize="sm" /> Lớp 8
                </label>
              </Collapsible>

              <Collapsible title="Môn học" icon={<BookOpen className="h-4 w-4" />} open>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <Checkbox checkboxSize="sm" /> Đại số
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <Checkbox checkboxSize="sm" /> Hình học
                </label>
              </Collapsible>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">5. Cards (Interactive Selection)</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-7xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Câu hỏi 1 (Click để chọn câu hỏi)</h3>
              <Button
                variant="outline-slate"
                size="sm"
                onClick={() => toggleQuestionSelection(mockQuestions[0].id)}
              >
                {selectedQs.includes(mockQuestions[0].id) ? 'Bỏ chọn' : 'Chọn câu'}
              </Button>
            </div>
            <QuestionCard 
              question={mockQuestions[0]} 
              mode="teacher" 
              onRegenerate={(qId) => console.log('Regenerated question: ', qId)} 
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Câu hỏi 2 (Click để chọn câu hỏi)</h3>
              <Button
                variant="outline-slate"
                size="sm"
                onClick={() => toggleQuestionSelection(mockQuestions[1].id)}
              >
                {selectedQs.includes(mockQuestions[1].id) ? 'Bỏ chọn' : 'Chọn câu'}
              </Button>
            </div>
            <QuestionCard 
              question={mockQuestions[1]} 
              mode="student" 
              selectedOptionId={selectedLabOpt}
              onOptionSelect={(qId, optId) => setSelectedLabOpt(optId)}
            />
          </div>
        </div>
      </section>

      {/* Floating Action Bar */}
      <FloatingActionBar
        selectedCount={selectedQs.length}
        isOpen={isBarOpen}
        onClear={() => setSelectedQs([])}
        actions={[
          {
            label: 'Lưu vào thư mục',
            icon: <FolderOpen className="h-3.5 w-3.5" />,
            onClick: () => alert(`Đang lưu ${selectedQs.length} câu hỏi...`)
          },
          {
            label: 'In đề thi',
            icon: <Printer className="h-3.5 w-3.5" />,
            onClick: () => alert(`Đang in ${selectedQs.length} câu hỏi...`)
          },
          {
            label: 'Xóa hàng loạt',
            icon: <Trash2 className="h-3.5 w-3.5" />,
            variant: 'ghost-danger',
            onClick: () => {
              alert(`Đang xóa ${selectedQs.length} câu hỏi...`);
              setSelectedQs([]);
            }
          }
        ]}
      />
    </div>
  );
}
