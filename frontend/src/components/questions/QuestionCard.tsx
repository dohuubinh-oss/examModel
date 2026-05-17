import React from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Question } from '@/lib/mock-data';

export interface QuestionCardProps {
  question: Question;
  mode?: 'teacher' | 'student';
  selectedOptionId?: string;
  onOptionSelect?: (questionId: string, optionId: string) => void;
  onRegenerate?: (questionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  mode = 'teacher',
  selectedOptionId,
  onOptionSelect,
  onRegenerate,
}) => {
  const isTeacher = mode === 'teacher';

  return (
    <Card className="group overflow-hidden bg-white border border-slate-200 shadow-sm rounded-2xl transition-all">
      {/* Card Header */}
      <CardHeader className="flex justify-between items-start flex-row gap-4 p-5 border-b border-slate-100 bg-white">
        <div className="flex gap-3 items-start">
          <Badge variant="primary" className="shrink-0 mt-0.5">Câu {question.number}</Badge>
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
              {question.topic} • {question.level}
            </span>
            <p 
              className="mt-1 text-slate-800 leading-relaxed text-base font-normal font-display" 
              dangerouslySetInnerHTML={{ __html: question.content }}
            />
          </div>
        </div>
        
        {isTeacher && onRegenerate && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 shrink-0 flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors cursor-pointer"
            onClick={() => onRegenerate(question.id)}
          >
            <RefreshCw size={16} className="group-hover:rotate-45 transition-transform" />
            <span className="hidden sm:inline">Đổi câu hỏi</span>
          </Button>
        )}
      </CardHeader>

      {/* Card Content */}
      <CardContent className="bg-slate-50/50 p-5">
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
                  className={`flex items-center gap-3 p-3 bg-white rounded-lg border transition-all ${
                    highlight 
                      ? 'border-2 border-primary bg-blue-50/10 shadow-sm' 
                      : isTeacher 
                        ? 'border-slate-200 cursor-default opacity-85'
                        : 'border-slate-200 hover:border-primary/50 cursor-pointer'
                  }`}
                >
                  <Badge 
                    variant={highlight ? 'primary' : 'outline'} 
                    className="rounded-full w-6 h-6 flex items-center justify-center p-0 shrink-0 font-bold"
                  >
                    {opt.label}
                  </Badge>
                  <span 
                    className="text-slate-700 font-display text-sm" 
                    dangerouslySetInnerHTML={{ __html: opt.content }} 
                  />
                  {showAsCorrect && <CheckCircle2 className="text-primary ml-auto shrink-0" size={18} />}
                </div>
              );
            })}
          </div>
        ) : (
          // Essay layout showing solution/rubric directly in teacher mode
          isTeacher && question.solution ? (
            <div className="border border-dashed border-amber-300 bg-amber-50/10 p-5 rounded-xl space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                Hướng dẫn chấm / Lời giải mẫu:
              </span>
              <div 
                className="text-sm text-slate-700 leading-relaxed font-display" 
                dangerouslySetInnerHTML={{ __html: question.solution }}
              />
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 bg-white p-5 rounded-xl text-center">
              <span className="text-sm text-slate-500 font-medium font-display">
                Học sinh trình bày lời giải chi tiết vào giấy thi.
              </span>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};
