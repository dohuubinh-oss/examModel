import React from 'react';
import { useRouter } from 'next/navigation';
import { Edit3, Trash2, RefreshCw, Check } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { Question } from '@/lib/mock-data';
import { Latex } from '@/components/ui/Latex';
import { QuestionCardSingle } from './QuestionCardSingle';

export interface QuestionCardGroupProps {
  question: Question;
  mode?: 'teacher' | 'student';
  isChecked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  onRegenerate?: (questionId: string) => void;
}

export const QuestionCardGroup: React.FC<QuestionCardGroupProps> = ({
  question,
  mode = 'teacher',
  isChecked = false,
  onCheckChange,
  onRegenerate,
}) => {
  const isTeacher = mode !== 'student';
  const router = useRouter();

  const getLevelBadgeStyle = (level: string) => {
    const normalized = level.toLowerCase();
    if (normalized.includes('nhận biết')) {
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-200/40';
    }
    if (normalized.includes('thông hiểu')) {
      return 'bg-amber-500/10 text-amber-600 border-amber-200/40';
    }
    if (normalized.includes('vận dụng cao')) {
      return 'bg-red-500/10 text-red-600 border-red-200/40';
    }
    if (normalized.includes('vận dụng')) {
      return 'bg-orange-500/10 text-orange-600 border-orange-200/40';
    }
    return 'bg-slate-100 text-slate-600 border-slate-200/40';
  };

  if (question.type !== 'cluster') {
    return null; // This component is specifically for cluster questions
  }

  return (
    <Card className="group overflow-hidden bg-white border border-slate-200 shadow-sm rounded-2xl transition-all">
      {/* Card Header (Meta Info Row only) */}
      <CardHeader className="flex justify-between items-center flex-row gap-4 p-5 pb-2 bg-white border-b-0">
        {onRegenerate ? (
          /* Exam Builder Page Card Style: 'Câu X' Badge + 'Đổi câu hỏi' Action */
          <>
            <div className="flex gap-2 items-center flex-wrap">
              <Badge variant="primary" className="shrink-0 font-bold bg-primary text-white text-[10px] px-2 py-0.5 rounded uppercase">
                Câu {question.number}
              </Badge>
              {question.grade && (
                <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200/50 text-[10px] font-bold uppercase py-0.5 px-2 rounded tracking-normal shrink-0">
                  {question.grade === 10 ? 'Luyện thi 10' : `Lớp ${question.grade}`}
                </Badge>
              )}
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[10px] font-bold uppercase py-0.5 px-2 rounded tracking-normal shrink-0">
                {question.topic}
              </Badge>
              <Badge variant="outline" className={`${getLevelBadgeStyle(question.level)} text-[10px] font-bold uppercase py-0.5 px-2 rounded tracking-normal shrink-0`}>
                {question.level}
              </Badge>
              <span className="text-[10px] text-slate-400 font-medium shrink-0">ID: #Q-{question.id}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRegenerate(question.id);
              }}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 hover:border-primary/30 transition-all cursor-pointer shrink-0"
              title="Đổi câu hỏi khác ngẫu nhiên bằng AI"
            >
              <RefreshCw size={12} className="animate-spin-slow" />
              <span>Đổi câu hỏi khác</span>
            </button>
          </>
        ) : (
          /* Question Bank Page Card Style: Checkbox + Edit/Delete Actions */
          <>
            <div className="flex gap-2 items-center flex-wrap">
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onCheckChange?.(!isChecked);
                }} 
                className="flex items-center justify-center cursor-pointer shrink-0"
              >
                <Checkbox
                  checkboxSize="sm"
                  checked={isChecked}
                  readOnly
                  className="rounded"
                />
              </div>
              {question.grade && (
                <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200/50 text-[10px] font-bold uppercase py-0.5 px-2 rounded tracking-normal shrink-0">
                  {question.grade === 10 ? 'Luyện thi 10' : `Lớp ${question.grade}`}
                </Badge>
              )}
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[10px] font-bold uppercase py-0.5 px-2 rounded tracking-normal shrink-0">
                {question.topic}
              </Badge>
              <Badge variant="outline" className={`${getLevelBadgeStyle(question.level)} text-[10px] font-bold uppercase py-0.5 px-2 rounded tracking-normal shrink-0`}>
                {question.level}
              </Badge>
              <span className="text-[10px] text-slate-400 font-medium shrink-0">ID: #Q-{question.id}</span>
            </div>

            {isTeacher && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const editType = 'group';
                    const editId = question.groupId || question.id;
                    router.push(`/question-bank/import?edit=${editId}&type=${editType}`);
                  }}
                  className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-all" title="Chỉnh sửa">
                  <Edit3 size={16} />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-all" title="Xóa">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </CardHeader>

      {/* Card Question Stem (Full Width Question Content) */}
      <div className="px-5 pb-4 bg-white">
        <div className="bg-white p-4 rounded-lg border-l-4 border-primary shadow-sm mb-6 ml-7">
          <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Nội dung dẫn chung</h4>
          <div className="font-display text-base text-slate-700 italic">
            {question.image ? (
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img src={question.image} alt="Question figure" className="w-full sm:w-1/3 object-contain rounded-xl border border-slate-200" />
                <div className="flex-1">
                  <Latex text={question.content} />
                </div>
              </div>
            ) : (
              <Latex text={question.content} />
            )}
          </div>
        </div>

        {/* Card Content for Cluster Sub-questions */}
        <div className="space-y-6 ml-7">
          {question.subQuestions?.map((sub) => (
            <div key={sub.id} className="relative pl-6 border-l-2 border-slate-100">
              <span className="absolute -left-[5px] top-1.5 w-2 h-2 bg-slate-300 rounded-full" />
              <QuestionCardSingle 
                question={sub as any} 
                mode={mode} 
                isSubQuestion={true} 
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
