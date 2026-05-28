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

	fmt.Println("Connected to Database. Starting seed for Grade 7 Math...")

	// 1. Delete existing Grade 7 questions
	var qGroups []models.QuestionGroup
	db.Where("id IN (SELECT question_group_id FROM questions WHERE grade = 7 AND question_group_id IS NOT NULL)").Find(&qGroups)

	res := db.Where("grade = ?", 7).Delete(&models.Question{})
	fmt.Printf("Deleted %d existing grade 7 questions.\n", res.RowsAffected)

	if len(qGroups) > 0 {
		db.Delete(&qGroups)
		fmt.Printf("Deleted %d orphaned question groups.\n", len(qGroups))
	}

	// 2. Setup Topics
	topicData := []struct {
		Name string
		Slug string
	}{
		{"Số hữu tỉ", "so-huu-ti"},
		{"Số thực", "so-thuc"},
		{"Góc và đường thẳng song song", "goc-va-duong-thang-song-song"},
		{"Tam giác bằng nhau", "tam-giac-bang-nhau"},
		{"Thống kê và Biểu đồ", "thong-ke-bieu-do"},
	}

	topics := make(map[string]*models.Topic)
	for _, td := range topicData {
		var t models.Topic
		err := db.Where("slug = ? AND grade = ?", td.Slug, 7).First(&t).Error
		if err != nil {
			t = models.Topic{
				Name:    td.Name,
				Slug:    td.Slug,
				Grade:   7,
				Subject: "Toán",
			}
			db.Create(&t)
		}
		topics[td.Name] = &t
	}

	var allQuestions []models.Question

	// --- 3. TẠO 50 CÂU HỎI ĐA DẠNG ---

	// A. Chủ đề: Số hữu tỉ (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           7,
			Topic:           "Số hữu tỉ",
			TopicID:         &topics["Số hữu tỉ"].ID,
			DifficultyLevel: "Nhận biết",
			DifficultyPoint: 3.5,
			Point:           1.0,
			Content:         fmt.Sprintf("Kết quả của phép tính (-%d/5) + (%d/5) là:", i, i+2),
			Options:         buildOptions("2/5", "-2/5", fmt.Sprintf("%d/5", 2*i), "0"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Cộng hai phân số cùng mẫu: lấy tử cộng tử, mẫu giữ nguyên.",
			Status:          "approved",
			Tags:            buildTags("Số hữu tỉ", "Lớp 7"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           7,
			Topic:           "Số hữu tỉ",
			TopicID:         &topics["Số hữu tỉ"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.0,
			Point:           2.0,
			Content:         fmt.Sprintf("Tìm x biết: x - %d/4 = 1/2", i),
			CorrectAnswer:   fmt.Sprintf("%d/4", i+2), // x = 1/2 + i/4 = 2/4 + i/4 = (i+2)/4
			SolutionGuide:   "Chuyển vế đổi dấu: x = 1/2 + i/4, sau đó quy đồng mẫu số.",
			Status:          "approved",
			Tags:            buildTags("Số hữu tỉ", "Tìm x", "Lớp 7"),
		})
	}

	// B. Chủ đề: Số thực (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           7,
			Topic:           "Số thực",
			TopicID:         &topics["Số thực"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Căn bậc hai số học của %d là bao nhiêu?", i*i*4),
			Options:         buildOptions(fmt.Sprintf("%d", i*2), fmt.Sprintf("-%d", i*2), fmt.Sprintf("±%d", i*2), fmt.Sprintf("%d", i*4)),
			CorrectAnswer:   "A",
			SolutionGuide:   "Căn bậc hai số học của một số dương a là một số dương x sao cho x^2 = a.",
			Status:          "approved",
			Tags:            buildTags("Số thực", "Căn bậc hai", "Lớp 7"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           7,
			Topic:           "Số thực",
			TopicID:         &topics["Số thực"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 8.5,
			Point:           2.0,
			Content:         fmt.Sprintf("Tính giá trị của biểu thức: M = |-%d| + √%d - (-%d)^2", i*3, i*i*16, i*2),
			CorrectAnswer:   fmt.Sprintf("%d", (i*3)+(i*4)-(i*2*i*2)),
			SolutionGuide:   "Thực hiện tính giá trị tuyệt đối, căn bậc hai và lũy thừa trước khi cộng trừ.",
			Status:          "approved",
			Tags:            buildTags("Số thực", "Biểu thức", "Lớp 7"),
		})
	}

	// C. Chủ đề: Góc và đường thẳng song song (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           7,
			Topic:           "Góc và đường thẳng song song",
			TopicID:         &topics["Góc và đường thẳng song song"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 4.5,
			Point:           1.0,
			Content:         fmt.Sprintf("Hai đường thẳng cắt nhau tạo thành một góc %d độ. Góc đối đỉnh với góc đó có số đo là bao nhiêu?", i*10+20),
			Options:         buildOptions(fmt.Sprintf("%d độ", i*10+20), fmt.Sprintf("%d độ", 180-(i*10+20)), "90 độ", "180 độ"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Hai góc đối đỉnh thì bằng nhau.",
			Status:          "approved",
			Tags:            buildTags("Hình học", "Góc đối đỉnh", "Lớp 7"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           7,
			Topic:           "Góc và đường thẳng song song",
			TopicID:         &topics["Góc và đường thẳng song song"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.0,
			Point:           2.0,
			Content:         fmt.Sprintf("Cho hai đường thẳng song song a và b, bị cắt bởi đường thẳng c tạo thành cặp góc trong cùng phía. Biết một góc bằng %d độ, tính số đo góc còn lại.", i*10+40),
			CorrectAnswer:   fmt.Sprintf("%d độ", 180-(i*10+40)),
			SolutionGuide:   "Hai góc trong cùng phía bù nhau (có tổng số đo bằng 180 độ).",
			Status:          "approved",
			Tags:            buildTags("Hình học", "Góc trong cùng phía", "Lớp 7"),
		})
	}

	// D. Chủ đề: Tam giác bằng nhau (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           7,
			Topic:           "Tam giác bằng nhau",
			TopicID:         &topics["Tam giác bằng nhau"].ID,
			DifficultyLevel: "Nhận biết",
			DifficultyPoint: 3.0,
			Point:           1.0,
			Content:         "Nếu ba cạnh của tam giác này bằng ba cạnh của tam giác kia thì hai tam giác đó bằng nhau theo trường hợp nào?",
			Options:         buildOptions("Cạnh - cạnh - cạnh (c.c.c)", "Cạnh - góc - cạnh (c.g.c)", "Góc - cạnh - góc (g.c.g)", "Cạnh huyền - góc nhọn"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Đây là định lý cơ bản về trường hợp bằng nhau thứ nhất của tam giác (c.c.c).",
			Status:          "approved",
			Tags:            buildTags("Tam giác", "c.c.c", "Lớp 7"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           7,
			Topic:           "Tam giác bằng nhau",
			TopicID:         &topics["Tam giác bằng nhau"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 8.5,
			Point:           2.0,
			Content:         fmt.Sprintf("Cho tam giác ABC cân tại A. Trên tia đối của BC lấy điểm D, trên tia đối của CB lấy điểm E sao cho BD = CE = %d cm. Chứng minh tam giác ADE là tam giác cân.", i*2),
			CorrectAnswer:   "Tam giác ADE cân tại A",
			SolutionGuide:   "Sử dụng trường hợp bằng nhau Cạnh - Góc - Cạnh (c.g.c) cho tam giác ABD và tam giác ACE để suy ra AD = AE.",
			Status:          "approved",
			Tags:            buildTags("Tam giác cân", "Chứng minh", "Lớp 7"),
		})
	}

	// E. Chủ đề: Thống kê và Biểu đồ (10 câu, bao gồm 1 câu hỏi chùm 4 câu)
	for i := 1; i <= 6; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           7,
			Topic:           "Thống kê và Biểu đồ",
			TopicID:         &topics["Thống kê và Biểu đồ"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Điểm kiểm tra của một học sinh là: 7, 8, 8, 9, %d. Số trung bình cộng của các điểm này là bao nhiêu?", i+4),
			Options:         buildOptions(fmt.Sprintf("%g", float64(7+8+8+9+i+4)/5), fmt.Sprintf("%d", (7+8+8+9+i+4)/4), "8", "7.5"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Tổng các điểm chia cho số lượng điểm (5).",
			Status:          "approved",
			Tags:            buildTags("Thống kê", "Trung bình cộng", "Lớp 7"),
		})
	}

	// Tạo 1 Câu hỏi chùm (Group) gồm 4 câu hỏi con
	qGroup := models.QuestionGroup{
		SharedContent: "Biểu đồ hình quạt tròn thể hiện tỉ lệ phần trăm các loại trái cây yêu thích của 200 học sinh khối 7: Cam (30%), Xoài (25%), Ổi (15%), Nho (20%), Còn lại là Táo.",
	}
	db.Create(&qGroup)

	// 4 câu con trong chùm
	groupQuestions := []models.Question{
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Trắc nghiệm",
			Grade:           7,
			Topic:           "Thống kê và Biểu đồ",
			TopicID:         &topics["Thống kê và Biểu đồ"].ID,
			DifficultyLevel: "Nhận biết",
			DifficultyPoint: 3.5,
			Point:           1.0,
			Content:         "Tỉ lệ phần trăm học sinh thích Táo là bao nhiêu?",
			Options:         buildOptions("10%", "15%", "5%", "20%"),
			CorrectAnswer:   "A",
			SolutionGuide:   "100% - (30% + 25% + 15% + 20%) = 10%",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Trắc nghiệm",
			Grade:           7,
			Topic:           "Thống kê và Biểu đồ",
			TopicID:         &topics["Thống kê và Biểu đồ"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 4.5,
			Point:           1.0,
			Content:         "Số học sinh thích Xoài là bao nhiêu em?",
			Options:         buildOptions("50 em", "60 em", "40 em", "30 em"),
			CorrectAnswer:   "A",
			SolutionGuide:   "25% của 200 = 200 * 25 / 100 = 50 (học sinh)",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           7,
			Topic:           "Thống kê và Biểu đồ",
			TopicID:         &topics["Thống kê và Biểu đồ"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 6.5,
			Point:           2.0,
			Content:         "Số học sinh thích Cam nhiều hơn số học sinh thích Nho là bao nhiêu em?",
			CorrectAnswer:   "20 em",
			SolutionGuide:   "Cam: 30% của 200 = 60 em. Nho: 20% của 200 = 40 em. Số lượng nhiều hơn là 60 - 40 = 20 em.",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           7,
			Topic:           "Thống kê và Biểu đồ",
			TopicID:         &topics["Thống kê và Biểu đồ"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 8.0,
			Point:           2.0,
			Content:         "Nếu chọn ngẫu nhiên một học sinh trong khối 7, tính xác suất để học sinh đó không thích Nho (dưới dạng phần trăm).",
			CorrectAnswer:   "80%",
			SolutionGuide:   "Tỉ lệ thích Nho là 20%, do đó xác suất không thích Nho là 100% - 20% = 80%.",
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
		fmt.Printf("Successfully seeded %d questions for Grade 7.\n", res.RowsAffected)
	}
}
