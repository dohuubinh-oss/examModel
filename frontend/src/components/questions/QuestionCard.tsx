import React from 'react';
import { CheckCircle2, History, Edit3, Trash2, RefreshCw } from 'lucide-react';
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
  const isTeacher = mode !== 'student';

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
          </>
        )}
      </CardHeader>

      {/* Card Question Stem (Full Width Question Content) */}
      <div className="px-5 pb-4 bg-white">
        <div className="text-slate-800 leading-relaxed text-base font-normal font-display">
          <Latex text={question.content} />
        </div>
      </div>

      {/* Card Content (Choices or Solutions) */}
      <CardContent className="bg-slate-50/50 p-5 border-t border-slate-100">
        {question.type === 'cluster' ? (
          <div className="space-y-6">
            {question.subQuestions?.map((sub) => (
              <div key={sub.id} className="relative pl-6 border-l-2 border-slate-200">
                <span className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 bg-slate-300 rounded-full" />
                <div className="text-slate-800 font-display text-sm font-semibold mb-3">
                  {sub.number}. <Latex text={sub.content} />
                </div>
                {sub.type === 'multiple_choice' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sub.options?.map((opt) => {
                      const showAsCorrect = isTeacher && opt.isCorrect;
                      return (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                            showAsCorrect
                              ? 'border-primary/20 bg-primary/5 shadow-sm'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <span className={`rounded-full w-5 h-5 flex items-center justify-center p-0 shrink-0 font-bold text-[9px] transition-colors ${
                            showAsCorrect
                              ? 'bg-primary text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {opt.label}
                          </span>
                          <Latex 
                            className={`font-display text-sm transition-colors ${
                              showAsCorrect ? 'text-primary font-semibold' : 'text-slate-700'
                            }`} 
                            text={opt.content}
                          />
                          {showAsCorrect && <CheckCircle2 className="text-primary ml-auto shrink-0" size={16} />}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    {!isTeacher ? (
                      <div className="border border-dashed border-slate-300 bg-white p-3 rounded-lg text-center max-w-md">
                        <span className="text-xs text-slate-500 font-medium font-display">
                          Học sinh trình bày lời giải chi tiết vào giấy thi.
                        </span>
                      </div>
                    ) : sub.solution ? (
                      <div className="border border-dashed border-amber-300 bg-amber-50/10 p-3.5 rounded-lg space-y-1.5 max-w-xl">
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                          Hướng dẫn chấm / Lời giải mẫu:
                        </span>
                        <Latex 
                          className="text-xs text-slate-700 leading-relaxed font-display" 
                          text={sub.solution}
                        />
                      </div>
                    ) : (
                      <div className="border border-dashed border-slate-300 bg-white p-3 rounded-lg text-center max-w-md">
                        <span className="text-xs text-slate-500 font-medium font-display">
                          Học sinh trình bày lời giải chi tiết vào giấy thi.
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};
QuestionCard.displayName = "QuestionCard";
