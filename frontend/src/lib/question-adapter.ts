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
  question_group_id?: number;
  question_group?: BackendQuestionGroup;
}

export interface BackendQuestionGroup {
  id: number;
  shared_content: string;
  image_shared?: string | null;
  questions?: BackendQuestionOutput[];
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

    // Helper to map options consistently
    const mapOptions = (q: BackendQuestionOutput) => {
      const isMC = q.type === 'Trắc nghiệm';
      return isMC && q.options ? q.options.map((opt: any, idx: number) => {
        const label = String.fromCharCode(65 + idx); // A, B, C, D
        const optContent = typeof opt === 'object' && opt !== null ? String(opt.text || opt.content || '') : String(opt || '');
        const isCorrect = q.correct_answer === optContent || q.correct_answer === opt || q.correct_answer?.startsWith(label);
        
        return {
          id: `${q.id}_opt_${idx}`,
          label,
          content: optContent.replace(/^[A-D]\.\s*/, ''), // Remove prefix if it exists in DB
          isCorrect
        };
      }) : [];
    };

    // If it's a group question and we have preloaded group details, render as a unified cluster
    if (backendQ.type_question === 'group' && backendQ.question_group) {
      const group = backendQ.question_group;
      return {
        id: backendQ.id.toString(), // Deduplication key
        groupId: group.id.toString(),
        number: 1,
        grade: backendQ.grade,
        topic: backendQ.TopicRel?.name || backendQ.topic || `Lớp ${backendQ.grade}`,
        level: backendQ.difficulty_level,
        difficultyPoint: backendQ.difficulty_point || 0,
        type: 'cluster',
        typeString: 'Câu hỏi chùm',
        content: group.shared_content,
        image: group.image_shared || null,
        options: [],
        solution: '',
        subQuestions: group.questions ? group.questions.map((child, idx) => ({
          id: child.id.toString(),
          number: idx + 1,
          content: child.content,
          type: child.type === 'Trắc nghiệm' ? 'multiple_choice' : 'essay',
          options: mapOptions(child),
          solution: child.solution_guide
        })) : []
      };
    }
    
    return {
      id: backendQ.id.toString(),
      groupId: backendQ.question_group_id ? backendQ.question_group_id.toString() : undefined,
      number: 1, // Will be overridden by the list map index
      grade: backendQ.grade,
      topic: backendQ.TopicRel?.name || backendQ.topic || `Lớp ${backendQ.grade}`,
      level: backendQ.difficulty_level,
      difficultyPoint: backendQ.difficulty_point || 0,
      type: backendQ.type_question === 'group' ? 'cluster' : (isMultipleChoice ? 'multiple_choice' : 'essay'),
      typeString: backendQ.type,
      content: backendQ.content,
      image: backendQ.image_question || null,
      options: mapOptions(backendQ),
      solution: backendQ.solution_guide,
      subQuestions: backendQ.children ? backendQ.children.map((child, idx) => ({
        id: child.id.toString(),
        number: idx + 1,
        content: child.content,
        type: child.type === 'Trắc nghiệm' ? 'multiple_choice' : 'essay',
        options: mapOptions(child),
        solution: child.solution_guide
      })) : []
    };
  }
}
