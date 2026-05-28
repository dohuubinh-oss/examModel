package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/modeptrai/exam-model-backend/models"
	"gorm.io/datatypes"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func buildOptions(opts ...string) datatypes.JSON {
	type Option struct {
		Key  string `json:"key"`
		Text string `json:"text"`
	}
	keys := []string{"A", "B", "C", "D"}
	var options []Option
	for i, o := range opts {
		if i < 4 {
			options = append(options, Option{Key: keys[i], Text: o})
		}
	}
	b, _ := json.Marshal(options)
	return datatypes.JSON(b)
}

func buildTags(tags ...string) datatypes.JSON {
	b, _ := json.Marshal(tags)
	return datatypes.JSON(b)
}

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=exam_user password=exam_password dbname=exam_db port=5432 sslmode=disable"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	fmt.Println("Connected to Database. Starting seed for Grade 8 Math...")

	// 1. Delete existing Grade 8 questions
	var qGroups []models.QuestionGroup
	db.Where("id IN (SELECT question_group_id FROM questions WHERE grade = 8 AND question_group_id IS NOT NULL)").Find(&qGroups)

	res := db.Where("grade = ?", 8).Delete(&models.Question{})
	fmt.Printf("Deleted %d existing grade 8 questions.\n", res.RowsAffected)

	if len(qGroups) > 0 {
		db.Delete(&qGroups)
		fmt.Printf("Deleted %d orphaned question groups.\n", len(qGroups))
	}

	// 2. Setup Topics
	topicData := []struct {
		Name string
		Slug string
	}{
		{"Đa thức", "da-thuc"},
		{"Phân thức đại số", "phan-thuc-dai-so"},
		{"Tứ giác", "tu-giac"},
		{"Định lí Thalès & Tam giác đồng dạng", "thales-tam-giac-dong-dang"},
		{"Hình học không gian & Xác suất", "hinh-hoc-khong-gian-xac-suat"},
	}

	topics := make(map[string]*models.Topic)
	for _, td := range topicData {
		var t models.Topic
		err := db.Where("slug = ? AND grade = ?", td.Slug, 8).First(&t).Error
		if err != nil {
			t = models.Topic{
				Name:    td.Name,
				Slug:    td.Slug,
				Grade:   8,
				Subject: "Toán",
			}
			db.Create(&t)
		}
		topics[td.Name] = &t
	}

	var allQuestions []models.Question

	// --- 3. TẠO 50 CÂU HỎI ĐA DẠNG ---

	// A. Chủ đề: Đa thức (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           8,
			Topic:           "Đa thức",
			TopicID:         &topics["Đa thức"].ID,
			DifficultyLevel: "Nhận biết",
			DifficultyPoint: 3.5,
			Point:           1.0,
			Content:         fmt.Sprintf("Khai triển hằng đẳng thức (x + %d)^2 ta được:", i),
			Options:         buildOptions(fmt.Sprintf("x^2 + %dx + %d", i*2, i*i), fmt.Sprintf("x^2 - %dx + %d", i*2, i*i), fmt.Sprintf("x^2 + %dx + %d", i, i*i), fmt.Sprintf("x^2 + %d", i*i)),
			CorrectAnswer:   "A",
			SolutionGuide:   "Sử dụng hằng đẳng thức bình phương của một tổng: (a+b)^2 = a^2 + 2ab + b^2",
			Status:          "approved",
			Tags:            buildTags("Đa thức", "Hằng đẳng thức", "Lớp 8"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           8,
			Topic:           "Đa thức",
			TopicID:         &topics["Đa thức"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.5,
			Point:           2.0,
			Content:         fmt.Sprintf("Phân tích đa thức sau thành nhân tử: x^2 - %dx + %d", i*2, i*i),
			CorrectAnswer:   fmt.Sprintf("(x - %d)^2", i),
			SolutionGuide:   "Nhận thấy đây là dạng của hằng đẳng thức bình phương của một hiệu: a^2 - 2ab + b^2 = (a-b)^2",
			Status:          "approved",
			Tags:            buildTags("Đa thức", "Phân tích đa thức", "Lớp 8"),
		})
	}

	// B. Chủ đề: Phân thức đại số (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           8,
			Topic:           "Phân thức đại số",
			TopicID:         &topics["Phân thức đại số"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.5,
			Point:           1.0,
			Content:         fmt.Sprintf("Điều kiện xác định của phân thức %dx / (x - %d) là:", i*3, i+1),
			Options:         buildOptions(fmt.Sprintf("x ≠ %d", i+1), fmt.Sprintf("x ≠ -%d", i+1), "x ≠ 0", fmt.Sprintf("x > %d", i+1)),
			CorrectAnswer:   "A",
			SolutionGuide:   "Phân thức xác định khi mẫu thức khác 0.",
			Status:          "approved",
			Tags:            buildTags("Phân thức", "Điều kiện xác định", "Lớp 8"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           8,
			Topic:           "Phân thức đại số",
			TopicID:         &topics["Phân thức đại số"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 8.5,
			Point:           2.0,
			Content:         fmt.Sprintf("Rút gọn biểu thức P = (%dx^2 - %d) / (x + %d)", i, i, 1),
			CorrectAnswer:   fmt.Sprintf("%d(x - 1)", i),
			SolutionGuide:   "Rút nhân tử chung ở tử số, sau đó áp dụng hằng đẳng thức hiệu hai bình phương (x^2 - 1) = (x-1)(x+1), và rút gọn với mẫu số.",
			Status:          "approved",
			Tags:            buildTags("Phân thức", "Rút gọn biểu thức", "Lớp 8"),
		})
	}

	// C. Chủ đề: Tứ giác (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           8,
			Topic:           "Tứ giác",
			TopicID:         &topics["Tứ giác"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 4.5,
			Point:           1.0,
			Content:         "Một tứ giác lồi có 3 góc lần lượt là 70°, 80°, 100°. Số đo góc còn lại là:",
			Options:         buildOptions("110°", "100°", "90°", "120°"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Tổng 4 góc của một tứ giác là 360°. Góc thứ tư = 360° - (70° + 80° + 100°) = 110°.",
			Status:          "approved",
			Tags:            buildTags("Hình học", "Tứ giác", "Lớp 8"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           8,
			Topic:           "Tứ giác",
			TopicID:         &topics["Tứ giác"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.0,
			Point:           2.0,
			Content:         fmt.Sprintf("Cho hình bình hành ABCD có AB = %d cm, chu vi bằng %d cm. Tính độ dài cạnh BC.", i*2+5, (i*2+5)*2+20),
			CorrectAnswer:   "10 cm",
			SolutionGuide:   "Chu vi hình bình hành = 2*(AB + BC). Thay số để tìm BC.",
			Status:          "approved",
			Tags:            buildTags("Hình học", "Hình bình hành", "Lớp 8"),
		})
	}

	// D. Chủ đề: Định lí Thalès & Tam giác đồng dạng (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           8,
			Topic:           "Định lí Thalès & Tam giác đồng dạng",
			TopicID:         &topics["Định lí Thalès & Tam giác đồng dạng"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 6.5,
			Point:           1.0,
			Content:         fmt.Sprintf("Cho tam giác ABC. Đường thẳng d song song với BC, cắt AB tại D và AC tại E. Biết AD/AB = 1/%d. Tỉ số AE/AC bằng bao nhiêu?", i+1),
			Options:         buildOptions(fmt.Sprintf("1/%d", i+1), fmt.Sprintf("%d/1", i+1), fmt.Sprintf("1/%d", i+2), "Không thể tính được"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Theo định lí Thalès thuận: Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ. Do đó AE/AC = AD/AB.",
			Status:          "approved",
			Tags:            buildTags("Thalès", "Tam giác đồng dạng", "Lớp 8"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           8,
			Topic:           "Định lí Thalès & Tam giác đồng dạng",
			TopicID:         &topics["Định lí Thalès & Tam giác đồng dạng"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 9.0,
			Point:           2.0,
			Content:         fmt.Sprintf("Cho tam giác vuông ABC vuông tại A, có đường cao AH. Biết BH = %d cm, CH = %d cm. Tính độ dài AH.", i*4, i*9),
			CorrectAnswer:   fmt.Sprintf("%d cm", i*6),
			SolutionGuide:   "Sử dụng hệ thức lượng hoặc chứng minh hai tam giác vuông AHB và CHA đồng dạng, từ đó suy ra AH^2 = BH * CH.",
			Status:          "approved",
			Tags:            buildTags("Tam giác đồng dạng", "Hệ thức lượng", "Lớp 8"),
		})
	}

	// E. Chủ đề: Hình học không gian & Xác suất (10 câu, bao gồm 1 câu hỏi chùm 4 câu)
	for i := 1; i <= 6; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           8,
			Topic:           "Hình học không gian & Xác suất",
			TopicID:         &topics["Hình học không gian & Xác suất"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Một hình chóp tứ giác đều có độ dài cạnh đáy là %d cm, chiều cao của hình chóp là %d cm. Thể tích hình chóp đó là bao nhiêu?", i*3, i*4),
			Options:         buildOptions(fmt.Sprintf("%d cm³", (i*3)*(i*3)*(i*4)/3), fmt.Sprintf("%d cm³", (i*3)*(i*3)*(i*4)), fmt.Sprintf("%d cm³", (i*3)*(i*4)/3), fmt.Sprintf("%d cm³", (i*3)*4*(i*4)/3)),
			CorrectAnswer:   "A",
			SolutionGuide:   "Thể tích hình chóp đều = 1/3 * Diện tích đáy * Chiều cao = 1/3 * a^2 * h.",
			Status:          "approved",
			Tags:            buildTags("Hình chóp", "Thể tích", "Lớp 8"),
		})
	}

	// Tạo 1 Câu hỏi chùm (Group) gồm 4 câu hỏi con
	qGroup := models.QuestionGroup{
		SharedContent: "Một hộp chứa 50 viên bi có cùng kích thước, trong đó có 15 viên bi xanh, 20 viên bi đỏ và 15 viên bi vàng. Bạn An lấy ngẫu nhiên 1 viên bi từ hộp.",
	}
	db.Create(&qGroup)

	// 4 câu con trong chùm
	groupQuestions := []models.Question{
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Trắc nghiệm",
			Grade:           8,
			Topic:           "Hình học không gian & Xác suất",
			TopicID:         &topics["Hình học không gian & Xác suất"].ID,
			DifficultyLevel: "Nhận biết",
			DifficultyPoint: 3.5,
			Point:           1.0,
			Content:         "Xác suất thực nghiệm để An lấy được viên bi màu xanh là bao nhiêu?",
			Options:         buildOptions("3/10", "1/5", "2/5", "1/3"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Số bi xanh là 15. Tổng số bi là 50. Xác suất = 15/50 = 3/10.",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Trắc nghiệm",
			Grade:           8,
			Topic:           "Hình học không gian & Xác suất",
			TopicID:         &topics["Hình học không gian & Xác suất"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 4.5,
			Point:           1.0,
			Content:         "Biến cố 'An lấy được viên bi màu đỏ' có xác suất bằng bao nhiêu?",
			Options:         buildOptions("2/5", "3/10", "1/2", "4/5"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Số bi đỏ là 20. Xác suất = 20/50 = 2/5.",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           8,
			Topic:           "Hình học không gian & Xác suất",
			TopicID:         &topics["Hình học không gian & Xác suất"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 6.5,
			Point:           2.0,
			Content:         "Biến cố 'An không lấy được viên bi màu vàng' có xác suất bằng bao nhiêu phần trăm?",
			CorrectAnswer:   "70%",
			SolutionGuide:   "Số bi không phải vàng (tức là xanh hoặc đỏ) là 15 + 20 = 35. Xác suất = 35/50 = 70/100 = 70%.",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           8,
			Topic:           "Hình học không gian & Xác suất",
			TopicID:         &topics["Hình học không gian & Xác suất"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 8.5,
			Point:           2.0,
			Content:         "Sau lần lấy đầu tiên (và không trả lại viên bi vào hộp), An lấy tiếp viên bi thứ hai. Nếu viên đầu tiên là bi màu đỏ, tính xác suất viên thứ hai cũng là bi màu đỏ.",
			CorrectAnswer:   "19/49",
			SolutionGuide:   "Sau khi lấy 1 bi đỏ, số bi đỏ còn lại là 19, tổng số bi trong hộp còn 49. Xác suất = 19/49.",
			Status:          "approved",
		},
	}
	allQuestions = append(allQuestions, groupQuestions...)

	// Insert tất cả các câu hỏi
	if len(allQuestions) > 0 {
		res := db.Create(&allQuestions)
		if res.Error != nil {
			log.Fatalf("Error inserting questions: %v", res.Error)
		}
		fmt.Printf("Successfully seeded %d questions for Grade 8.\n", res.RowsAffected)
	}
}
