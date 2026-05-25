'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, Save, FileText, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { QuestionAdapter } from '@/lib/question-adapter';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';

function CreateExamContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids');
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!idsParam) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`${apiUrl}/v1/questions?ids=${idsParam}&limit=100`);
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
            // Ưu tiên 1: typeString ('Trắc nghiệm' < 'Tự luận')
            const typeA = a.typeString === 'Trắc nghiệm' ? 0 : 1;
            const typeB = b.typeString === 'Trắc nghiệm' ? 0 : 1;
            
            if (typeA !== typeB) {
              return typeA - typeB;
            }
            
            // Ưu tiên 2: difficultyPoint (tăng dần)
            return (a.difficultyPoint || 0) - (b.difficultyPoint || 0);
          });
          
          // Update numbers sequentially after sort
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
  
  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-slate-50 font-display">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 px-4 md:px-8 py-3">
        <div className="max-w-[1000px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="bg-slate-100 p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center"
              title="Quay lại"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold leading-tight">Tạo đề thi mới</h1>
              <p className="text-xs text-slate-500">
                {questions.length > 0 ? `Đã chọn ${questions.length} câu hỏi` : 'Chưa có câu hỏi nào'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline-slate">
              <Settings size={20} />
              Cài đặt đề thi
            </Button>
            <Button variant="default" className="shadow-md shadow-primary/20">
              <Save size={20} />
              Lưu đề thi
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1000px] mx-auto p-6 pb-32">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <FileText className="text-primary" size={24} />
            Nội dung đề thi
          </h2>
          
          {loading ? (
            <div className="border border-dashed border-slate-200 bg-slate-50 p-12 rounded-xl text-center">
              <RefreshCw className="mx-auto h-6 w-6 text-primary animate-spin mb-2" />
              <span className="text-sm text-slate-500 font-medium">
                Đang tải dữ liệu câu hỏi...
              </span>
            </div>
          ) : questions.length > 0 ? (
            <div className="space-y-6">
              {questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  mode="teacher"
                />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 bg-slate-50 p-12 rounded-xl text-center flex flex-col items-center">
              <span className="text-sm text-slate-500 font-medium">
                Không có câu hỏi nào được chọn. Vui lòng chọn câu hỏi từ Ngân hàng câu hỏi.
              </span>
              <div className="mt-4">
                <Button variant="outline" onClick={() => router.push('/question-bank')}>
                  Quay lại Ngân hàng câu hỏi
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CreateExamPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><RefreshCw className="h-6 w-6 text-primary animate-spin" /></div>}>
      <CreateExamContent />
    </Suspense>
  );
}
