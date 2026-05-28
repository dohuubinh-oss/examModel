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

	fmt.Println("Connected to Database. Starting seed for Grade 9 Math...")

	// 1. Delete existing Grade 9 questions
	var qGroups []models.QuestionGroup
	db.Where("id IN (SELECT question_group_id FROM questions WHERE grade = 9 AND question_group_id IS NOT NULL)").Find(&qGroups)

	res := db.Where("grade = ?", 9).Delete(&models.Question{})
	fmt.Printf("Deleted %d existing grade 9 questions.\n", res.RowsAffected)

	if len(qGroups) > 0 {
		db.Delete(&qGroups)
		fmt.Printf("Deleted %d orphaned question groups.\n", len(qGroups))
	}

	// 2. Setup Topics
	topicData := []struct {
		Name string
		Slug string
	}{
		{"Căn bậc hai & Căn bậc ba", "can-bac-hai-ba"},
		{"Hàm số & Đồ thị", "ham-so-do-thi"},
		{"Phương trình & Hệ phương trình", "phuong-trinh-he-phuong-trinh"},
		{"Hệ thức lượng trong tam giác vuông", "he-thuc-luong-tam-giac-vuong"},
		{"Đường tròn", "duong-tron"},
	}

	topics := make(map[string]*models.Topic)
	for _, td := range topicData {
		var t models.Topic
		err := db.Where("slug = ? AND grade = ?", td.Slug, 9).First(&t).Error
		if err != nil {
			t = models.Topic{
				Name:    td.Name,
				Slug:    td.Slug,
				Grade:   9,
				Subject: "Toán",
			}
			db.Create(&t)
		}
		topics[td.Name] = &t
	}

	var allQuestions []models.Question

	// --- 3. TẠO 50 CÂU HỎI ĐA DẠNG LỚP 9 ---

	// A. Chủ đề: Căn bậc hai & Căn bậc ba (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           9,
			Topic:           "Căn bậc hai & Căn bậc ba",
			TopicID:         &topics["Căn bậc hai & Căn bậc ba"].ID,
			DifficultyLevel: "Nhận biết",
			DifficultyPoint: 3.5,
			Point:           1.0,
			Content:         fmt.Sprintf("Điều kiện xác định của biểu thức √(x - %d) là:", i*2),
			Options:         buildOptions(fmt.Sprintf("x ≥ %d", i*2), fmt.Sprintf("x > %d", i*2), fmt.Sprintf("x ≤ %d", i*2), "x ∈ ℝ"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Biểu thức dưới dấu căn bậc hai phải lớn hơn hoặc bằng 0.",
			Status:          "approved",
			Tags:            buildTags("Căn bậc hai", "Điều kiện xác định", "Lớp 9"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           9,
			Topic:           "Căn bậc hai & Căn bậc ba",
			TopicID:         &topics["Căn bậc hai & Căn bậc ba"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.0,
			Point:           2.0,
			Content:         fmt.Sprintf("Rút gọn biểu thức: A = √(%d - %d√%d) - √%d", (i+1)*(i+1)+3, 2*(i+1), 3, 3),
			CorrectAnswer:   fmt.Sprintf("%d", i+1),
			SolutionGuide:   "Sử dụng hằng đẳng thức √(a^2) = |a| và biến đổi biểu thức dưới căn về dạng bình phương của một hiệu.",
			Status:          "approved",
			Tags:            buildTags("Căn bậc hai", "Rút gọn", "Lớp 9"),
		})
	}

	// B. Chủ đề: Hàm số & Đồ thị (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           9,
			Topic:           "Hàm số & Đồ thị",
			TopicID:         &topics["Hàm số & Đồ thị"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Đồ thị hàm số y = %dx + %d đi qua điểm nào dưới đây?", i, i*2),
			Options:         buildOptions(fmt.Sprintf("(1; %d)", i*3), fmt.Sprintf("(0; %d)", i), fmt.Sprintf("(-1; %d)", i), fmt.Sprintf("(2; %d)", i*2)),
			CorrectAnswer:   "A",
			SolutionGuide:   "Thay tọa độ các điểm vào phương trình hàm số. Tại x=1, y = i*1 + i*2 = i*3.",
			Status:          "approved",
			Tags:            buildTags("Hàm số", "Đồ thị", "Lớp 9"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           9,
			Topic:           "Hàm số & Đồ thị",
			TopicID:         &topics["Hàm số & Đồ thị"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 8.5,
			Point:           2.0,
			Content:         fmt.Sprintf("Cho parabol (P): y = x² và đường thẳng (d): y = %dx - %d. Tìm toạ độ giao điểm của (P) và (d).", i*2, i*i),
			CorrectAnswer:   fmt.Sprintf("Giao điểm duy nhất tại (%d; %d)", i, i*i),
			SolutionGuide:   "Lập phương trình hoành độ giao điểm x² - 2ix + i² = 0 <=> (x - i)² = 0.",
			Status:          "approved",
			Tags:            buildTags("Parabol", "Tương giao", "Lớp 9"),
		})
	}

	// C. Chủ đề: Phương trình & Hệ phương trình (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           9,
			Topic:           "Phương trình & Hệ phương trình",
			TopicID:         &topics["Phương trình & Hệ phương trình"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 4.5,
			Point:           1.0,
			Content:         fmt.Sprintf("Nghiệm của hệ phương trình { x + y = %d ; x - y = %d } là:", i*2, i*2-2),
			Options:         buildOptions(fmt.Sprintf("(%d; 1)", i*2-1), fmt.Sprintf("(1; %d)", i*2-1), "(0; 0)", fmt.Sprintf("(%d; -1)", i*2+1)),
			CorrectAnswer:   "A",
			SolutionGuide:   "Cộng vế theo vế: 2x = 4i-2 => x = 2i-1. Từ đó suy ra y = 1.",
			Status:          "approved",
			Tags:            buildTags("Hệ phương trình", "Lớp 9"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           9,
			Topic:           "Phương trình & Hệ phương trình",
			TopicID:         &topics["Phương trình & Hệ phương trình"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.5,
			Point:           2.0,
			Content:         fmt.Sprintf("Giải phương trình bậc hai: x² - %dx + %d = 0", i*3, (i*3)*(i*3)/4),
			CorrectAnswer:   fmt.Sprintf("x = %g", float64(i)*1.5),
			SolutionGuide:   "Tính Δ = b² - 4ac. Nhận thấy đây là hằng đẳng thức nên phương trình có nghiệm kép.",
			Status:          "approved",
			Tags:            buildTags("Phương trình bậc 2", "Giải phương trình", "Lớp 9"),
		})
	}

	// D. Chủ đề: Hệ thức lượng trong tam giác vuông (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           9,
			Topic:           "Hệ thức lượng trong tam giác vuông",
			TopicID:         &topics["Hệ thức lượng trong tam giác vuông"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.5,
			Point:           1.0,
			Content:         fmt.Sprintf("Cho tam giác ABC vuông tại A, đường cao AH. Biết BH = %d cm, HC = %d cm. Tính độ dài đường cao AH.", i*i, i*i*4),
			Options:         buildOptions(fmt.Sprintf("%d cm", i*i*2), fmt.Sprintf("%d cm", i*i*4), fmt.Sprintf("%d cm", i*i*5), fmt.Sprintf("%d cm", i*2)),
			CorrectAnswer:   "A",
			SolutionGuide:   "Áp dụng hệ thức lượng AH² = BH × HC.",
			Status:          "approved",
			Tags:            buildTags("Hệ thức lượng", "Tam giác vuông", "Lớp 9"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           9,
			Topic:           "Hệ thức lượng trong tam giác vuông",
			TopicID:         &topics["Hệ thức lượng trong tam giác vuông"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 9.0,
			Point:           2.0,
			Content:         fmt.Sprintf("Một cột đèn cao %d m. Ở một thời điểm trong ngày mặt trời chiếu tạo bóng dài %d m trên mặt đất. Hỏi lúc đó góc tạo bởi tia sáng mặt trời và mặt đất là bao nhiêu? (Làm tròn đến phút)", i*3, i*4),
			CorrectAnswer:   "Khoảng 36 độ 52 phút",
			SolutionGuide:   "Dùng tỉ số lượng giác tan(α) = đối/kề = 3/4. Suy ra góc α.",
			Status:          "approved",
			Tags:            buildTags("Lượng giác", "Toán thực tế", "Lớp 9"),
		})
	}

	// E. Chủ đề: Đường tròn (10 câu, bao gồm 1 câu hỏi chùm 4 câu)
	for i := 1; i <= 6; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           9,
			Topic:           "Đường tròn",
			TopicID:         &topics["Đường tròn"].ID,
			DifficultyLevel: "Nhận biết",
			DifficultyPoint: 3.5,
			Point:           1.0,
			Content:         fmt.Sprintf("Góc nội tiếp chắn nửa đường tròn bán kính %d cm có số đo là bao nhiêu?", i+5),
			Options:         buildOptions("90°", "180°", "45°", "60°"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Tính chất cơ bản: Góc nội tiếp chắn nửa đường tròn luôn là góc vuông (90°).",
			Status:          "approved",
			Tags:            buildTags("Đường tròn", "Góc nội tiếp", "Lớp 9"),
		})
	}

	// Tạo 1 Câu hỏi chùm (Group) gồm 4 câu hỏi con
	qGroup := models.QuestionGroup{
		SharedContent: "Từ điểm M nằm ngoài đường tròn (O; R) vẽ hai tiếp tuyến MA, MB với đường tròn (A, B là các tiếp điểm). Gọi H là giao điểm của MO và AB. Cát tuyến kẻ từ M cắt đường tròn tại C và D (C nằm giữa M và D, cát tuyến không đi qua tâm O).",
	}
	db.Create(&qGroup)

	// 4 câu con trong chùm (Các dạng bài hình học đường tròn kinh điển thi vào 10)
	groupQuestions := []models.Question{
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Trắc nghiệm",
			Grade:           9,
			Topic:           "Đường tròn",
			TopicID:         &topics["Đường tròn"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.0,
			Point:           1.0,
			Content:         "Tứ giác MAOB là hình gì?",
			Options:         buildOptions("Tứ giác nội tiếp", "Hình thoi", "Hình bình hành", "Hình chữ nhật"),
			CorrectAnswer:   "A",
			SolutionGuide:   "MA và MB là tiếp tuyến nên góc MAO = 90° và MBO = 90°. Tổng 2 góc đối bằng 180° nên tứ giác nội tiếp.",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Trắc nghiệm",
			Grade:           9,
			Topic:           "Đường tròn",
			TopicID:         &topics["Đường tròn"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 6.5,
			Point:           1.0,
			Content:         "Hệ thức nào sau đây ĐÚNG về liên hệ giữa M, C, D và M, A?",
			Options:         buildOptions("MA² = MC × MD", "MA² = MC + MD", "MA = MC × MD", "MA² = MC / MD"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Chứng minh tam giác MAC và tam giác MDA đồng dạng (g.g) suy ra MA/MD = MC/MA => MA² = MC × MD.",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           9,
			Topic:           "Đường tròn",
			TopicID:         &topics["Đường tròn"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.5,
			Point:           2.0,
			Content:         "Chứng minh MO vuông góc với AB tại H.",
			CorrectAnswer:   "MO là đường trung trực của đoạn AB.",
			SolutionGuide:   "Ta có MA=MB (tính chất 2 tiếp tuyến cắt nhau), OA=OB=R. Do đó MO là đường trung trực của đoạn AB, suy ra MO vuông góc với AB tại H.",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           9,
			Topic:           "Đường tròn",
			TopicID:         &topics["Đường tròn"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 9.5,
			Point:           2.0,
			Content:         "Chứng minh tứ giác CHOD nội tiếp đường tròn.",
			CorrectAnswer:   "Góc MHC = Góc MDO.",
			SolutionGuide:   "Ta có MC×MD = MA² = MH×MO (hệ thức lượng tam giác vuông MAO). Từ đó suy ra tam giác MHC đồng dạng tam giác MDO (c.g.c). Suy ra góc MHC = góc MDO. Suy ra tứ giác CHOD nội tiếp.",
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
		fmt.Printf("Successfully seeded %d questions for Grade 9.\n", res.RowsAffected)
	}
}
