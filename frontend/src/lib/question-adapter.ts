export interface QuestionData {
  id: string;
  grade: string;
  subject: string;
  level: string;
  tags: string[];
  sharedContext: string;
  sharedImage: string | null;
  content: string;
  questionImage: string | null;
  type: 'multiple-choice' | 'essay';
  options: string[];
  correctAnswer: string;
  solution: string;
  solutionImage: string | null;
  hint: string;
  quickTip: string;
  generalMethod: string;
  typeQuestion?: 'group' | 'single';
  difficultyPoint?: number;
  point?: number;
  mistakes?: string;
}

export interface BackendQuestionInput {
  type_question: 'single' | 'group';
  content: string;
  type: 'Trắc nghiệm' | 'Tự luận';
  grade: number;
  topic: string;
  difficulty_level: string;
  difficulty_point?: number;
  point?: number;
  status: string;
  options?: string[];
  correct_answer?: string;
  solution_guide?: string;
  hint?: string;
  quick_solve_tips?: string;
  general_method?: string;
  mistakes?: string;
  image_question?: string;
  image_solution?: string;
  tags?: string[];
  children?: BackendQuestionInput[];
}

export interface BackendQuestionOutput {
  id: number;
  type_question: 'single' | 'group';
  content: string;
  type: 'Trắc nghiệm' | 'Tự luận';
  grade: number;
  topic?: string;
  topic_id?: number;
  TopicRel?: { name: string, grade: number };
  difficulty_level: string;
  difficulty_point?: number;
  point?: number;
  status: string;
  options?: string[];
  correct_answer?: string;
  solution_guide?: string;
  hint?: string;
  quick_solve_tips?: string;
  general_method?: string;
  mistakes?: string;
  image_question?: string;
  image_solution?: string;
  tags?: string[];
  children?: BackendQuestionOutput[];
}

export class QuestionAdapter {
  static transform(questions: QuestionData[]): BackendQuestionInput[] {
    const groupedQuestions: BackendQuestionInput[] = [];
    const groupMap = new Map<string, BackendQuestionInput>();

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      // Basic validation
      if (!q.content?.trim() && !q.sharedContext?.trim()) {
        throw new Error(`Câu hỏi ở vị trí thứ ${i + 1} thiếu nội dung (content).`);
      }
      if (q.type === 'multiple-choice' && !q.correctAnswer?.trim()) {
        throw new Error(`Câu hỏi trắc nghiệm ở vị trí thứ ${i + 1} chưa có đáp án đúng.`);
      }

      const gradeInt = q.grade === "Ôn thi 10" ? 10 : parseInt(q.grade.replace(/\D/g, '')) || 9;
      const qType = q.type === 'essay' ? 'Tự luận' : 'Trắc nghiệm';
      
      const backendQuestion: BackendQuestionInput = {
        type_question: 'single',
        content: q.content,
        type: qType,
        grade: gradeInt,
        topic: q.subject || 'Toán',
        difficulty_level: q.level || 'Nhận biết',
        difficulty_point: q.difficultyPoint,
        point: q.point,
        status: 'draft',
        options: q.type === 'multiple-choice' ? q.options.filter(o => o.trim() !== '') : [],
        correct_answer: q.correctAnswer,
        solution_guide: q.solution,
        hint: q.hint,
        quick_solve_tips: q.quickTip,
        general_method: q.generalMethod,
        mistakes: q.mistakes,
        image_question: q.questionImage || "",
        image_solution: q.solutionImage || "",
        tags: q.tags,
      };

      if (q.typeQuestion === 'group' && q.sharedContext) {
        if (!groupMap.has(q.sharedContext)) {
          const parentQ: BackendQuestionInput = {
            type_question: 'group',
            content: q.sharedContext,
            type: qType,
            grade: gradeInt,
            topic: q.subject || 'Toán',
            difficulty_level: q.level || 'Nhận biết',
            status: 'draft',
            tags: q.tags,
            image_question: q.sharedImage || "",
            children: []
          };
          groupMap.set(q.sharedContext, parentQ);
          groupedQuestions.push(parentQ);
        }
        groupMap.get(q.sharedContext)!.children!.push(backendQuestion);
      } else {
        groupedQuestions.push(backendQuestion);
      }
    }

    return groupedQuestions;
  }

  static fromBackendToUI(backendQ: BackendQuestionOutput): any {
    const isMultipleChoice = backendQ.type === 'Trắc nghiệm';
    
    return {
      id: backendQ.id.toString(),
      number: 1, // Will be overridden by the list map index
      topic: backendQ.TopicRel?.name || backendQ.topic || `Lớp ${backendQ.grade}`,
      level: backendQ.difficulty_level,
      difficultyPoint: backendQ.difficulty_point || 0,
      type: backendQ.type_question === 'group' ? 'cluster' : (isMultipleChoice ? 'multiple_choice' : 'essay'),
      typeString: backendQ.type,
      content: backendQ.content,
      options: isMultipleChoice && backendQ.options ? backendQ.options.map((opt, idx) => {
        const label = String.fromCharCode(65 + idx); // A, B, C, D
        const isCorrect = backendQ.correct_answer === opt || backendQ.correct_answer?.startsWith(label);
        return {
          id: `${backendQ.id}_opt_${idx}`,
          label,
          content: opt.replace(/^[A-D]\.\s*/, ''), // Remove prefix if it exists in DB
          isCorrect
        };
      }) : [],
      solution: backendQ.solution_guide,
      subQuestions: backendQ.children ? backendQ.children.map((child, idx) => ({
        id: child.id.toString(),
        number: idx + 1,
        content: child.content,
        type: child.type === 'Trắc nghiệm' ? 'multiple_choice' : 'essay',
        options: child.type === 'Trắc nghiệm' && child.options ? child.options.map((opt, oIdx) => {
          const label = String.fromCharCode(65 + oIdx);
          const isCorrect = child.correct_answer === opt || child.correct_answer?.startsWith(label);
          return {
            id: `${child.id}_opt_${oIdx}`,
            label,
            content: opt.replace(/^[A-D]\.\s*/, ''),
            isCorrect
          };
        }) : [],
        solution: child.solution_guide
      })) : []
    };
  }
}
