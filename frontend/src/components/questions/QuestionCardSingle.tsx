import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, History, Edit3, Trash2, RefreshCw, Check } from 'lucide-react';
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
  isSubQuestion?: boolean;
}

export const QuestionCardSingle: React.FC<QuestionCardProps> = ({
  question,
  mode = 'teacher',
  selectedOptionId,
  onOptionSelect,
  isChecked = false,
  onCheckChange,
  onRegenerate,
  isSubQuestion = false,
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

  if (isSubQuestion) {
    return (
      <div className="w-full space-y-3">
        {/* Card Question Stem (Full Width Question Content) */}
        <div className="mb-3">
          <div className="text-slate-800 leading-relaxed text-base font-normal font-display">
            {question.image ? (
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img src={question.image} alt="Question figure" className="w-full sm:w-1/3 object-contain rounded-xl border border-slate-200" />
                <div className="flex-1">
                  {isSubQuestion && <span className="font-semibold mr-1">{question.number}.</span>}
                  <Latex text={question.content} />
                </div>
              </div>
            ) : (
              <div>
                {isSubQuestion && <span className="font-semibold mr-1">{question.number}.</span>}
                <Latex text={question.content} />
              </div>
            )}
          </div>
        </div>

        {/* Card Content for Single Questions (Choices or Solutions) */}
        <div>
          {question.type === 'multiple_choice' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {question.options?.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const showAsCorrect = isTeacher && opt.isCorrect;
                const highlight = showAsCorrect || (!isTeacher && isSelected);

                return (
                  <div
                    key={opt.id}
                    className={`text-sm p-3 border border-slate-100 rounded bg-white transition-all flex items-center justify-between ${
                      showAsCorrect ? 'font-bold text-primary' : 'text-slate-700'
                    }`}
                  >
                    <span className="flex-1 flex gap-1">
                      <span>{opt.label}.</span> <Latex text={opt.content} />
                    </span>
                    {showAsCorrect && <Check className="text-primary shrink-0" size={16} />}
                  </div>
                );
              })}
            </div>
          ) : (
            !isTeacher && (
              <div className="border border-dashed border-slate-300 bg-white p-5 rounded-xl text-center">
                <span className="text-sm text-slate-500 font-medium font-display">
                  Học sinh trình bày lời giải chi tiết vào giấy thi.
                </span>
              </div>
            )
          )}

          {/* Display Solution for Teachers if present (both MC and Essay!) */}
          {isTeacher && question.solution && (
            <div className="border border-dashed border-amber-300 bg-white p-4 rounded-xl space-y-2 mt-4 max-w-3xl">
              <span className="text-[12px] font-bold text-amber-700 uppercase tracking-wider block">
                HƯỚNG DẪN CHẤM / LỜI GIẢI MẪU:
              </span>
              <Latex 
                className="text-base text-slate-700 leading-relaxed font-display" 
                text={question.solution}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  const containerClasses = "group overflow-hidden bg-white border border-slate-200 shadow-sm rounded-2xl transition-all";

  return (
    <Card className={containerClasses}>
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
          /* Question Bank Page Card Style: Checkbox + 3 Actions (Edit, Delete, History) */
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
                    router.push(`/question-bank/import?edit=${question.id}&type=single`);
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
        <div className="text-slate-800 leading-relaxed text-base font-normal font-display pl-7">
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

      {/* Card Content for Single Questions (Choices or Solutions) */}
        <CardContent className="bg-slate-50/50 p-5 border-t border-slate-100">
          <>
            {question.type === 'multiple_choice' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        highlight 
                          ? 'border-primary/20 bg-primary/5 shadow-sm' 
                          : isTeacher 
                            ? 'border-slate-200 cursor-default opacity-85 bg-white'
                            : 'border-slate-200 hover:border-primary/50 cursor-pointer bg-white'
                      }`}
                    >
                      <span className={`rounded-full w-6 h-6 flex items-center justify-center p-0 shrink-0 font-bold text-[10px] transition-colors ${
                        highlight 
                          ? 'bg-primary text-white' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {opt.label}
                      </span>
                      <Latex 
                        className={`font-display text-sm transition-colors ${
                          highlight ? 'text-primary font-semibold' : 'text-slate-700'
                        }`} 
                        text={opt.content}
                      />
                      {showAsCorrect && <CheckCircle2 className="text-primary ml-auto shrink-0 animate-fade-in" size={18} />}
                    </div>
                  );
                })}
              </div>
            ) : (
              !isTeacher && (
                <div className="border border-dashed border-slate-300 bg-white p-5 rounded-xl text-center">
                  <span className="text-sm text-slate-500 font-medium font-display">
                    Học sinh trình bày lời giải chi tiết vào giấy thi.
                  </span>
                </div>
              )
            )}

            {/* Display Solution for Teachers if present (both MC and Essay!) */}
            {isTeacher && question.solution && (
              <div className="border border-dashed border-amber-300 bg-amber-50/10 p-5 rounded-xl space-y-2 mt-4">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  Hướng dẫn chấm / Lời giải mẫu:
                </span>
                <Latex 
                  className="text-sm text-slate-700 leading-relaxed font-display" 
                  text={question.solution}
                />
              </div>
            )}
          </>
        </CardContent>
    </Card>
  );
};
QuestionCardSingle.displayName = "QuestionCardSingle";
