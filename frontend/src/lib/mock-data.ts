export type QuestionLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
export type QuestionType = 'multiple_choice' | 'essay';

export interface Option {
  id: string;
  label: string;
  content: string;
  isCorrect: boolean;
}

export interface SubQuestion {
  id: string;
  number: number;
  content: string;
  type: 'multiple_choice' | 'essay';
  options?: Option[];
  solution?: string;
}

export interface Question {
  id: string;
  number: number;
  topic: string;
  level: QuestionLevel;
  type: QuestionType | 'cluster';
  content: string;
  options?: Option[];
  solution?: string;
  subQuestions?: SubQuestion[];
  lastUpdated?: string;
  author?: string;
}

export interface MatrixRow {
  topic: string;
  nb: number;
  th: number;
  vd: number;
  vdc: number;
  highlighted?: 'nb' | 'th' | 'vd' | 'vdc';
}

export const mockExamConfig = {
  name: "Đề thi thử Toán THPTQG số 1",
  grade: "12",
  duration: 90,
  code: "AI-2024-MATH",
  totalChecked: 48,
  totalQuestions: 50,
  difficultyScore: 6.8,
  difficultyLabel: "Trung bình",
};

export const mockQuestions: Question[] = [
  {
    id: "q1",
    number: 1,
    topic: "Lớp 9 - Giải tích",
    level: "Thông hiểu",
    type: "multiple_choice",
    content: "Cho hàm số $f(x) = \\frac{x^2 - 4}{x - 2}$. Tính giá trị của giới hạn $\\lim_{x \\to 2} f(x)$.",
    options: [
      { id: "opt1_a", label: "A", content: "$\\lim_{x \\to 2} f(x) = 0$", isCorrect: false },
      { id: "opt1_b", label: "B", content: "$\\lim_{x \\to 2} f(x) = 4$", isCorrect: true },
      { id: "opt1_c", label: "C", content: "$\\lim_{x \\to 2} f(x) = 2$", isCorrect: false },
      { id: "opt1_d", label: "D", content: "Giới hạn không tồn tại", isCorrect: false },
    ],
    lastUpdated: "12/10/2023",
    author: "Admin"
  },
  {
    id: "q2",
    number: 2,
    topic: "Lớp 6 - Hình học",
    level: "Vận dụng cao",
    type: "cluster",
    content: "Cho hình chóp S.ABCD có đáy ABCD là hình thang vuông tại A và D. Biết $AD = CD = a$, $AB = 2a$. Cạnh bên $SA$ vuông góc với mặt đáy $(ABCD)$.",
    subQuestions: [
      {
        id: "q2_sub1",
        number: 1,
        content: "Tính khoảng cách từ điểm B đến mặt phẳng (SCD).",
        type: "multiple_choice",
        options: [
          { id: "q2_sub1_a", label: "A", content: "$a\\sqrt{2}$", isCorrect: false },
          { id: "q2_sub1_b", label: "B", content: "$a\\sqrt{3}/2$", isCorrect: true }
        ]
      },
      {
        id: "q2_sub2",
        number: 2,
        content: "Xác định tâm và bán kính mặt cầu ngoại tiếp hình chóp S.ABCD.",
        type: "essay",
        solution: "Gọi $M$ là trung điểm của $AB$. Do $AD = CD = a, AB = 2a$ nên $AMCD$ là hình vuông cạnh $a$ và $BC = a\\sqrt{2}$. Gọi $O$ là trung điểm của $SC$. Ta có $OS = OC = OA = OB = OD$, do đó $O$ chính là tâm mặt cầu ngoại tiếp hình chóp $S.ABCD$. Bán kính mặt cầu là $R = SC/2 = \\frac{\\sqrt{SA^2 + 2a^2}}{2}$."
      }
    ],
    lastUpdated: "05/11/2023",
    author: "GV. Lê Thu"
  },
  {
    id: "q3",
    number: 3,
    topic: "Lớp 7 - Đại số",
    level: "Nhận biết",
    type: "essay",
    content: "Giải bất phương trình: $x^2 - 5x + 6 > 0$",
    solution: "Ta biến đổi bất phương trình: $x^2 - 5x + 6 > 0 \\Leftrightarrow (x-2)(x-3) > 0$. Xét dấu của tam thức bậc hai, ta thu được tập nghiệm: $S = (-\\infty, 2) \\cup (3, +\\infty)$.",
    lastUpdated: "01/12/2023",
    author: "Admin"
  },
  {
    id: "q4",
    number: 4,
    topic: "Lớp 5 - Số học",
    level: "Nhận biết",
    type: "multiple_choice",
    content: "Tính giá trị của biểu thức: $A = 1.25 \\times 4 + 2.5 \\times 2$.",
    options: [
      { id: "opt4_a", label: "A", content: "$A = 10$", isCorrect: true },
      { id: "opt4_b", label: "B", content: "$A = 15$", isCorrect: false },
      { id: "opt4_c", label: "C", content: "$A = 5$", isCorrect: false },
      { id: "opt4_d", label: "D", content: "$A = 12.5$", isCorrect: false },
    ],
    lastUpdated: "15/02/2024",
    author: "GV. Minh"
  },
  {
    id: "q5",
    number: 5,
    topic: "Lớp 10 - Giải tích",
    level: "Thông hiểu",
    type: "multiple_choice",
    content: "Tìm tập nghiệm $S$ của bất phương trình bậc hai: $x^2 - 4x + 3 \\le 0$.",
    options: [
      { id: "opt5_a", label: "A", content: "$S = [1, 3]$", isCorrect: true },
      { id: "opt5_b", label: "B", content: "$S = (1, 3)$", isCorrect: false },
      { id: "opt5_c", label: "C", content: "$S = (-\\infty, 1] \\cup [3, +\\infty)$", isCorrect: false },
      { id: "opt5_d", label: "D", content: "$S = \\varnothing$", isCorrect: false },
    ],
    lastUpdated: "20/03/2024",
    author: "Admin"
  }
];

export const mockMatrix: MatrixRow[] = [
  { topic: "Hàm số", nb: 4, th: 3, vd: 2, vdc: 1, highlighted: 'vd' },
  { topic: "Mũ & Lo-ga", nb: 3, th: 2, vd: 1, vdc: 0 },
  { topic: "Nguyên hàm", nb: 3, th: 3, vd: 1, vdc: 1 },
  { topic: "Số phức", nb: 2, th: 2, vd: 1, vdc: 0 },
  { topic: "Hình không gian", nb: 3, th: 2, vd: 1, vdc: 1, highlighted: 'nb' },
];
