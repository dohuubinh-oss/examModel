'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, FileDown, Upload, ListOrdered,
  SlidersHorizontal, Grid, Lightbulb
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { QuestionCard } from '@/components/questions/QuestionCard';

import { mockExamConfig, mockQuestions, mockMatrix } from '@/lib/mock-data';

import { useSearchParams } from 'next/navigation';
import { QuestionAdapter } from '@/lib/question-adapter';
import { RefreshCw } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

function ExamCreatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('qIds') || searchParams.get('ids');

  const [questions, setQuestions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  
  const [examName, setExamName] = React.useState('');
  const [examCode, setExamCode] = React.useState('');
  const [duration, setDuration] = React.useState('');

  React.useEffect(() => {
    const fetchQuestions = async () => {
      if (!idsParam) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/questions?ids=${idsParam}&limit=100`);
        if (res.ok) {
          const data = await res.json();
          const seenGroupIds = new Set<string>();
          let mappedQs: any[] = [];
          
          (data.data || []).forEach((q: any) => {
            const uiQ = QuestionAdapter.fromBackendToUI(q);
            if (uiQ.groupId) {
              if (seenGroupIds.has(uiQ.groupId)) {
                return;
              }
              seenGroupIds.add(uiQ.groupId);
            }
            mappedQs.push(uiQ);
          });
          
          // Sắp xếp: Trắc nghiệm trước Tự luận, Độ khó tăng dần
          mappedQs.sort((a: any, b: any) => {
            const typeA = a.typeString === 'Trắc nghiệm' ? 0 : 1;
            const typeB = b.typeString === 'Trắc nghiệm' ? 0 : 1;
            if (typeA !== typeB) return typeA - typeB;
            return (a.difficultyPoint || 0) - (b.difficultyPoint || 0);
          });
          
          // Đánh số thứ tự
          mappedQs = mappedQs.map((q: any, idx: number) => ({
            ...q,
            number: idx + 1
          }));
          
          setQuestions(mappedQs);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [idsParam]);

  const handleRegenerate = (qIdToRemove: string) => {
    // Keep all questions except the one being swapped out
    const remainingIds = questions.filter(q => q.id !== qIdToRemove).map(q => q.id);
    const newIdsParam = remainingIds.join(',');
    
    // Redirect to Question Bank with editExam=true
    router.push(`/question-bank?editExam=true&qIds=${newIdsParam}`);
  };

  const multipleChoiceQs = questions.filter(q => q.type === 'multiple_choice' || q.type === 'cluster');
  const essayQs = questions.filter(q => q.type === 'essay');

  const handleSaveAndPublish = async () => {
    if (!examName.trim() || !examCode.trim() || !duration) {
      alert('Vui lòng nhập Tên đề thi, Mã đề thi và Thời gian!');
      return;
    }
    
    setIsSaving(true);
    try {
      const gradeVal = questions.length > 0 ? (questions[0].grade === 'Ôn thi 10' ? 10 : parseInt(String(questions[0].grade).replace(/\D/g, '')) || 9) : 9;
      
      const payload = {
        title: examName,
        exam_code: examCode,
        duration: parseInt(duration),
        grade: gradeVal,
        total_score: examStats.totalPoints,
        question_ids: questions.map(q => parseInt(String(q.id).replace(/\D/g, '')) || 0)
      };
      
      const res = await fetch(`${API_BASE_URL}/api/v1/exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert('Lưu và xuất bản thành công!');
        router.push('/dashboard/questions/bank');
      } else {
        const errorData = await res.json();
        alert('Có lỗi xảy ra: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to save exam:', error);
      alert('Có lỗi xảy ra khi lưu đề thi');
    } finally {
      setIsSaving(false);
    }
  };

  const matrixData = React.useMemo(() => {
    const map = new Map<string, { topic: string, nb: number, th: number, vd: number, vdc: number }>();
    questions.forEach(q => {
      const topic = q.topic || 'Chưa phân loại';
      if (!map.has(topic)) {
        map.set(topic, { topic, nb: 0, th: 0, vd: 0, vdc: 0 });
      }
      const entry = map.get(topic)!;
      const level = (q.level || '').toLowerCase();
      if (level.includes('nhận biết')) entry.nb += 1;
      else if (level.includes('thông hiểu')) entry.th += 1;
      else if (level.includes('vận dụng cao')) entry.vdc += 1;
      else if (level.includes('vận dụng')) entry.vd += 1;
    });
    return Array.from(map.values());
  }, [questions]);

  const matrixTotals = React.useMemo(() => {
    return matrixData.reduce((acc, row) => {
      acc.nb += row.nb;
      acc.th += row.th;
      acc.vd += row.vd;
      acc.vdc += row.vdc;
      return acc;
    }, { nb: 0, th: 0, vd: 0, vdc: 0 });
  }, [matrixData]);

  const examStats = React.useMemo(() => {
    if (questions.length === 0) return { difficultyScore: 0, difficultyLabel: 'Chưa có', difficultyColor: 'bg-slate-200', totalPoints: 0 };
    
    // Total score
    const totalPoints = questions.reduce((sum, q) => sum + (q.point || 0), 0);
    
    // Average difficulty
    const avgDiff = questions.reduce((sum, q) => sum + (q.difficultyPoint || 0), 0) / questions.length;
    const diffScore = Number(avgDiff.toFixed(1));
    let label = 'Trung bình';
    let colorClass = 'bg-amber-500';
    if (diffScore < 5) {
      label = 'Dễ';
      colorClass = 'bg-emerald-500';
    } else if (diffScore >= 7.5) {
      label = 'Khó';
      colorClass = 'bg-red-500';
    }
    
    return { 
      difficultyScore: diffScore, 
      difficultyLabel: label, 
      difficultyColor: colorClass,
      totalPoints: Number(totalPoints.toFixed(2))
    };
  }, [questions]);

  return (
    <div className="bg-background-light text-slate-900 min-h-screen font-display pb-20 lg:pb-0">
      {/* Header */}
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
              <h1 className="text-lg font-bold leading-tight">Kiểm tra & Hoàn thiện đề thi AI</h1>
              <p className="text-xs text-slate-500">Toán học THCS • Mã đề: {examCode || 'Chưa có'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="hidden md:flex">
              <FileDown size={20} />
              Tải file PDF
            </Button>
            <Button variant="default" onClick={handleSaveAndPublish} disabled={isSaving}>
              <Upload size={20} />
              {isSaving ? 'Đang lưu...' : 'Lưu & Xuất bản'}
            </Button>
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
              Danh sách câu hỏi ({questions.length} câu)
            </h2>
          </div>

          {loading ? (
            <div className="border border-dashed border-slate-200 bg-white p-12 rounded-xl text-center">
              <RefreshCw className="mx-auto h-6 w-6 text-primary animate-spin mb-2" />
              <span className="text-sm text-slate-500 font-medium">Đang tải dữ liệu câu hỏi...</span>
            </div>
          ) : questions.length === 0 ? (
            <div className="border border-dashed border-slate-200 bg-white p-12 rounded-xl text-center">
              <span className="text-sm text-slate-500 font-medium">Không có câu hỏi nào được chọn.</span>
            </div>
          ) : (
            <>
              {/* Section 1: Trắc nghiệm & Câu hỏi chùm */}
              {multipleChoiceQs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 py-2 border-l-4 border-primary pl-4 bg-white rounded-r-xl">
                    <h3 className="text-lg font-extrabold uppercase tracking-tight">Phần 1: Trắc nghiệm</h3>
                    <Badge variant="default">{multipleChoiceQs.length} câu</Badge>
                  </div>

                  {multipleChoiceQs.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      mode="teacher"
                      onRegenerate={(qId) => handleRegenerate(qId)}
                    />
                  ))}
                </div>
              )}

              {/* Section 2: Tự luận */}
              {essayQs.length > 0 && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 py-2 border-l-4 border-amber-500 pl-4 bg-white rounded-r-xl">
                    <h3 className="text-lg font-extrabold uppercase tracking-tight">Phần 2: Tự luận</h3>
                    <Badge variant="default">{essayQs.length} câu</Badge>
                  </div>

                  {essayQs.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      mode="teacher"
                      onRegenerate={(qId) => handleRegenerate(qId)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

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
                  <Input placeholder="Nhập tên đề thi..." value={examName} onChange={e => setExamName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Mã đề thi</label>
                  <Input placeholder="Nhập mã đề thi (VD: TOAN9-01)..." value={examCode} onChange={e => setExamCode(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Khối lớp</label>
                    <Select value={questions.length > 0 ? (questions[0].grade === 'Ôn thi 10' ? '10' : String(questions[0].grade).replace(/\D/g, '')) : ""} onChange={() => {}} disabled>
                      <option value="" disabled>-- Chọn --</option>
                      {[5, 6, 7, 8, 9].map(g => (
                        <option key={g} value={g.toString()}>Lớp {g}</option>
                      ))}
                      <option value="10">Ôn thi 10</option>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Thời gian (phút)</label>
                    <div className="relative">
                      <Input type="number" placeholder="Nhập thời gian..." className="pr-10" value={duration} onChange={e => setDuration(e.target.value)} />
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
                    {matrixData.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-3 font-medium">{row.topic}</td>
                        <td className="py-3 text-center">{row.nb}</td>
                        <td className="py-3 text-center">{row.th}</td>
                        <td className="py-3 text-center">{row.vd}</td>
                        <td className="py-3 text-center">{row.vdc}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50">
                      <td className="py-3 font-bold">Tổng cộng</td>
                      <td className="py-3 text-center font-bold">{matrixTotals.nb}</td>
                      <td className="py-3 text-center font-bold">{matrixTotals.th}</td>
                      <td className="py-3 text-center font-bold">{matrixTotals.vd}</td>
                      <td className="py-3 text-center font-bold">{matrixTotals.vdc}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100 space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">
                      Độ khó: <span className={`px-1.5 py-0.5 rounded text-white ${examStats.difficultyColor}`}>{examStats.difficultyLabel}</span>
                    </span>
                    <span className="font-bold">{examStats.difficultyScore}/10</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div className={`h-full ${examStats.difficultyColor}`} style={{ width: `${Math.min(examStats.difficultyScore * 10, 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Tổng điểm:</span>
                    <span className="font-bold">{examStats.totalPoints} điểm</span>
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

export default function ExamCreatorPage() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><RefreshCw className="h-6 w-6 text-primary animate-spin" /></div>}>
      <ExamCreatorContent />
    </React.Suspense>
  );
}
