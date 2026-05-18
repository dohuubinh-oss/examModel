import React from 'react';
import { CheckCircle2, History, Edit3, Trash2, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { Question } from '@/lib/mock-data';
import { Latex } from '@/components/ui/Latex';

export interface QuestionCardProps {
  question: Question;
  mode?: 'teacher' | 'student';
  selectedOptionId?: string;
  onOptionSelect?: (questionId: string, optionId: string) => void;
  isChecked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  onRegenerate?: (questionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  mode = 'teacher',
  selectedOptionId,
  onOptionSelect,
  isChecked = false,
  onCheckChange,
  onRegenerate,
}) => {
  const isTeacher = mode === 'teacher';

  return (
    <Card className="group overflow-hidden bg-slate-50 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
      <CardHeader className="flex justify-between items-center flex-row gap-4 p-5 pb-2 bg-slate-50 border-b-0">
        <div className="flex gap-3 items-center">
          <Checkbox
            checkboxSize="sm"
            checked={isChecked}
            onChange={(e) => onCheckChange?.(e.target.checked)}
          />
          <Badge variant="primary" size="sm">{question.topic}</Badge>
          <Badge variant={question.level === 'Nhận biết' ? 'success' : question.level === 'Thông hiểu' ? 'warning' : 'danger'} size="sm">
            {question.level}
          </Badge>
          <span className="text-[10px] text-slate-400 font-medium">ID: #Q-{question.id}</span>
        </div>

        {isTeacher && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-all" title="Xem lịch sử">
              <History size={16} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-all" title="Chỉnh sửa">
              <Edit3 size={16} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-all" title="Xóa">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </CardHeader>

      <div className="px-5 pb-4 bg-slate-50">
        {question.type === 'cluster' ? (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border-l-4 border-primary shadow-sm ml-7">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Nội dung dẫn chung</h4>
              <div className="text-sm text-slate-700 italic">
                <Latex text={question.content} />
              </div>
            </div>
            <div className="space-y-6 ml-7">
              {question.subQuestions?.map((sub) => (
                <div key={sub.id} className="relative pl-6 border-l-2 border-slate-100">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-slate-300 rounded-full" />
                  <div className="text-slate-800 font-display text-sm font-semibold mb-3">
                    {sub.number}. <Latex text={sub.content} />
                  </div>
                  {sub.type === 'multiple_choice' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {sub.options?.map((opt) => (
                        <div
                          key={opt.id}
                          className={`text-sm p-2 border rounded bg-white flex justify-between items-center ${
                            opt.isCorrect ? 'border-primary text-primary font-bold' : 'border-slate-100'
                          }`}
                        >
                          <Latex text={`${opt.label}. ${opt.content}`} />
                          {opt.isCorrect && <CheckCircle2 className="text-primary" size={14} />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="italic text-xs text-slate-500">Dạng bài: Tự luận</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-slate-800 leading-relaxed text-base font-normal font-display pl-7">
            <Latex text={question.content} />
          </div>
        )}
      </div>

      {question.type !== 'cluster' && (
        <CardContent className="bg-white p-5 pl-12 border-t border-slate-100">
          {question.type === 'multiple_choice' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options?.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const showAsCorrect = isTeacher && opt.isCorrect;
                const highlight = showAsCorrect || (!isTeacher && isSelected);

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (!isTeacher && onOptionSelect) {
                        onOptionSelect(question.id, opt.id);
                      }
                    }}
                    className={`flex items-center gap-3 p-2 bg-white rounded-lg border transition-all ${
                      highlight 
                        ? 'border-primary/20 bg-primary/5 text-primary font-semibold' 
                        : isTeacher 
                          ? 'border-slate-100 cursor-default opacity-85'
                          : 'border-slate-100 hover:border-primary/50 cursor-pointer'
                    }`}
                  >
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold ${
                      highlight ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {opt.label}
                    </span>
                    <Latex className="text-sm font-display" text={opt.content} />
                    {showAsCorrect && <CheckCircle2 className="text-primary text-sm ml-auto shrink-0" size={16} />}
                  </div>
                );
              })}
            </div>
          ) : (
            question.solution && (
              <div className="border border-dashed border-amber-200 bg-amber-50/10 p-4 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Hướng dẫn chấm:</span>
                <Latex className="text-sm text-slate-700 leading-relaxed font-display" text={question.solution} />
              </div>
            )
          )}
        </CardContent>
      )}

      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-white pl-12">
        <div className="text-[10px] text-slate-400">
          Cập nhật: {question.lastUpdated || '12/10/2023'} bởi {question.author || 'Admin'}
        </div>
        <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          Xem chi tiết
          <ArrowRight size={12} />
        </button>
      </div>
    </Card>
  );
};
QuestionCard.displayName = "QuestionCard";
