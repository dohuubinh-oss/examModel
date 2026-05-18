# Tài liệu đặc tả thiết kế: Chuẩn hoá Component QuestionCard

Tài liệu này đặc tả thiết kế kỹ thuật cho component dùng chung `<QuestionCard>` trong hệ thống ToanThucChien, đảm bảo tính nhất quán hình ảnh tuyệt đối giữa trang **UI Lab** và trang **Tạo đề thi AI** theo ngôn ngữ thiết kế **Modern Academic (Editorial Scholarship v2)**.

---

## 1. Mục tiêu thiết kế (Design Goals)
*   **Nhất quán hình ảnh (Visual Consistency)**: Đảm bảo 100% các thẻ câu hỏi trong toàn bộ ứng dụng có chung tỷ lệ padding, lề, màu sắc và độ dày viền.
*   **Tối giản tối đa (Zero-Footer & Clean Layout)**: Gỡ bỏ hoàn toàn `CardFooter`. Hiển thị trực tiếp các thông tin và lời giải mẫu mà không cần các nút bấm trung gian.
*   **Hỗ trợ đa chế độ (Hybrid Modes)**:
    *   `teacher` (mặc định): Chế độ tĩnh phục vụ biên tập. Hiển thị sẵn đáp án đúng (đối với trắc nghiệm) hoặc hiển thị trực tiếp lời giải mẫu (đối với tự luận). Không cho phép click chọn đáp án.
    *   `student`: Chế độ tương tác làm bài. Cho phép học sinh hover và click chọn đáp án trắc nghiệm. Ẩn đáp án đúng và lời giải mẫu.

---

## 2. Đặc tả Kiểu dữ liệu & Giao diện Props (TypeScript)

Component sẽ được đặt tại đường dẫn: [frontend/src/components/questions/QuestionCard.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/components/questions/QuestionCard.tsx).

```typescript
import React from 'react';

export interface QuestionOption {
  id: string;
  label: string;    // Ví dụ: "A", "B", "C", "D"
  content: string;  // Nội dung phương án (hỗ trợ mã HTML/LaTeX)
  isCorrect?: boolean; // Xác định đáp án đúng (chế độ Teacher)
}

export interface QuestionData {
  id: string;
  number: number;
  type: 'multiple_choice' | 'essay';
  topic: string;    // Chủ đề toán học (Ví dụ: "Hình học không gian")
  level: string;    // Độ khó (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)
  content: string;  // Nội dung đề bài (hỗ trợ mã HTML/LaTeX)
  options?: QuestionOption[]; // Danh sách đáp án trắc nghiệm
  solution?: string; // Lời giải chi tiết / Hướng dẫn chấm tự luận
}

export interface QuestionCardProps {
  question: QuestionData;
  mode?: 'teacher' | 'student'; // Mặc định là 'teacher'
  
  // Dành riêng cho chế độ Học sinh làm bài (mode === 'student')
  selectedOptionId?: string; // Đáp án học sinh đang chọn
  onOptionSelect?: (questionId: string, optionId: string) => void; // Callback khi click chọn đáp án
  
  // Dành riêng cho chế độ Giáo viên (mode === 'teacher')
  onRegenerate?: (questionId: string) => void; // Đổi câu hỏi ngẫu nhiên bằng AI
}
```

---

## 3. Quy chuẩn Styling & Bố cục (Layout & Tailwind Classes)

### A. Thẻ bao ngoài (`Card`)
*   Sử dụng component nguyên tử `<Card className="group overflow-hidden">`.
*   Giữ nguyên bán kính bo góc `rounded-2xl` và viền nhẹ `border border-slate-200 shadow-sm`.

### B. Đầu thẻ (`CardHeader`)
*   Cấu trúc flex hàng ngang: `flex justify-between items-start flex-row gap-4 p-5 border-b border-slate-100`.
*   **Bên trái (Metadata & Đề bài)**:
    *   Flex container chứa `Badge` (variant="primary") hiển thị `Câu {number}`.
    *   Kèm tag text phân loại: `text-xs font-semibold text-primary uppercase tracking-wider` hiển thị `{topic} • {level}`.
    *   Đề bài: Đặt ngay bên dưới metadata, sử dụng `<p className="mt-3 text-slate-800 leading-relaxed text-base font-body font-normal" dangerouslySetInnerHTML={{ __html: question.content }} />`.
*   **Bên phải (Nút hành động AI)**:
    *   Chỉ hiển thị khi `mode === 'teacher'` và có prop `onRegenerate`.
    *   Nút đổi câu hỏi: `<Button variant="ghost" size="sm" className="h-8 shrink-0 flex items-center gap-1.5" onClick={() => onRegenerate(question.id)}>` có icon `RefreshCw` xoay nhẹ khi hover.

### C. Thân thẻ (`CardContent`)
*   Sử dụng `<CardContent className="bg-slate-50/50 p-5">` tạo nền xám dịu nhẹ tương phản tốt với phần đề bài nền trắng.
*   **Phân nhánh hiển thị theo `type`**:
    1.  **Trắc nghiệm (`multiple_choice`)**:
        *   Layout Grid: `grid grid-cols-1 md:grid-cols-2 gap-4`.
        *   Từng đáp án: `flex items-center gap-3 p-3 bg-white rounded-lg border transition-all duration-200`.
        *   *Trong chế độ `mode="teacher"`*:
            *   Đáp án đúng (`opt.isCorrect === true`): Có class `border-2 border-primary shadow-sm bg-blue-50/10` và badge đáp án màu xanh đậm (`Badge` variant="primary"), kèm icon `CheckCircle2` màu primary ở góc phải.
            *   Đáp án sai: Có class `border-slate-200 cursor-default opacity-85`.
        *   *Trong chế độ `mode="student"`*:
            *   Đáp án được chọn (`opt.id === selectedOptionId`): Có class `border-2 border-primary shadow-sm bg-blue-50/10`, badge màu xanh đậm.
            *   Đáp án chưa được chọn: Có class `border-slate-200 hover:border-primary/50 cursor-pointer`. Kích hoạt `onOptionSelect` khi click.
    2.  **Tự luận (`essay`)**:
        *   Hiển thị trực tiếp khung lời giải mẫu: `<div className="border border-dashed border-amber-300 bg-amber-50/15 p-5 rounded-xl space-y-2">`.
        *   Header lời giải: `<span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Lời giải mẫu / Hướng dẫn chấm:</span>`.
        *   Nội dung lời giải: `<div className="text-sm text-slate-700 leading-relaxed font-body" dangerouslySetInnerHTML={{ __html: question.solution }} />`.

---

## 4. Kế hoạch kiểm thử & Xác thực (Verification Plan)
*   **UI Lab Testing**: Tích hợp component `<QuestionCard>` mới vào trang [ui-lab/page.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/app/ui-lab/page.tsx) ở cả 2 chế độ `teacher` và `student` để kiểm thử giao diện trực quan.
*   **Exam Creator Integration**: Thay thế code thẻ câu hỏi viết tay trong [dashboard/exams/create/page.tsx](file:///Users/modeptrai/Desktop/ToanThucChien/frontend/src/app/dashboard/exams/create/page.tsx) bằng `<QuestionCard>` mới.
*   **TypeScript Compilation**: Chạy `npm run build` trong thư mục `frontend` để đảm bảo biên dịch thành công 100% không có bất kỳ lỗi kiểu dữ liệu hoặc cú pháp nào.
