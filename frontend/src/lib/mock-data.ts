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
        type: "essay"
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
    lastUpdated: "01/12/2023",
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
