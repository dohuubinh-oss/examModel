export type QuestionLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
export type QuestionType = 'multiple_choice' | 'essay';

export interface Option {
  id: string;
  label: string;
  content: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  number: number;
  topic: string;
  level: QuestionLevel;
  type: QuestionType;
  content: string;
  options?: Option[];
  solution?: string;
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
    topic: "Giải tích",
    level: "Vận dụng",
    type: "multiple_choice",
    content: "Tìm tất cả các giá trị thực của tham số $m$ để hàm số $y = \\frac{1}{3}x^3 - mx^2 + (m^2 - m + 1)x + 1$ đạt cực đại tại $x = 1$.",
    options: [
      { id: "opt1_a", label: "A", content: "$m = 1$", isCorrect: false },
      { id: "opt1_b", label: "B", content: "$m = 2$", isCorrect: true },
      { id: "opt1_c", label: "C", content: "$m \\in \\{1; 2\\}$", isCorrect: false },
      { id: "opt1_d", label: "D", content: "$m \\in \\emptyset$", isCorrect: false },
    ]
  },
  {
    id: "q2",
    number: 2,
    topic: "Hình học không gian",
    level: "Thông hiểu",
    type: "multiple_choice",
    content: "Cho khối chóp $S.ABC$ có đáy $ABC$ là tam giác vuông cân tại $B$, $AB = a$. Cạnh bên $SA$ vuông góc với mặt phẳng đáy và $SA = a\\sqrt{2}$. Thể tích của khối chóp đã cho bằng:",
    options: [
      { id: "opt2_a", label: "A", content: "$\\frac{a^3\\sqrt{2}}{6}$", isCorrect: true },
      { id: "opt2_b", label: "B", content: "$\\frac{a^3\\sqrt{2}}{3}$", isCorrect: false },
      { id: "opt2_c", label: "C", content: "$\\frac{a^3\\sqrt{2}}{2}$", isCorrect: false },
      { id: "opt2_d", label: "D", content: "$a^3\\sqrt{2}$", isCorrect: false },
    ]
  },
  {
    id: "q3",
    number: 3,
    topic: "Hình học không gian",
    level: "Vận dụng cao",
    type: "essay",
    content: "Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$. Cạnh bên $SA$ vuông góc với đáy, $SA = a\\sqrt{2}$. Gọi $M$ là trung điểm của $BC$. Tính khoảng cách từ điểm $M$ đến mặt phẳng $(SCD)$.",
    solution: "1. Kẻ $AH \\perp SD$ tại $H$. Chứng minh được $AH \\perp (SCD)$.<br/>2. Sử dụng hệ thức lượng trong tam giác vuông $SAD$: $\\frac{1}{AH^2} = \\frac{1}{AS^2} + \\frac{1}{AD^2} = \\frac{1}{2a^2} + \\frac{1}{a^2} = \\frac{3}{2a^2} \\Rightarrow AH = a\\sqrt{\\frac{2}{3}}$.<br/>3. Do $AD // BC$ nên $BC // (SCD) \\Rightarrow d(M, (SCD)) = d(A, (SCD)) = AH = \\frac{a\\sqrt{6}}{3}$."
  }
];

export const mockMatrix: MatrixRow[] = [
  { topic: "Hàm số", nb: 4, th: 3, vd: 2, vdc: 1, highlighted: 'vd' },
  { topic: "Mũ & Lo-ga", nb: 3, th: 2, vd: 1, vdc: 0 },
  { topic: "Nguyên hàm", nb: 3, th: 3, vd: 1, vdc: 1 },
  { topic: "Số phức", nb: 2, th: 2, vd: 1, vdc: 0 },
  { topic: "Hình không gian", nb: 3, th: 2, vd: 1, vdc: 1, highlighted: 'nb' },
];
