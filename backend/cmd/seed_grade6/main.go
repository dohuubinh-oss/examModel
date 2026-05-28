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

	fmt.Println("Connected to Database. Starting seed for Grade 6 Math...")

	// 1. Delete existing Grade 6 questions
	var qGroups []models.QuestionGroup
	db.Where("id IN (SELECT question_group_id FROM questions WHERE grade = 6 AND question_group_id IS NOT NULL)").Find(&qGroups)

	res := db.Where("grade = ?", 6).Delete(&models.Question{})
	fmt.Printf("Deleted %d existing grade 6 questions.\n", res.RowsAffected)

	if len(qGroups) > 0 {
		db.Delete(&qGroups)
		fmt.Printf("Deleted %d orphaned question groups.\n", len(qGroups))
	}

	// 2. Setup Topics
	topicData := []struct {
		Name string
		Slug string
	}{
		{"Số tự nhiên", "so-tu-nhien"},
		{"Số nguyên", "so-nguyen"},
		{"Phân số", "phan-so-6"},
		{"Hình học trực quan", "hinh-hoc-truc-quan"},
		{"Xác suất thống kê", "xac-suat-thong-ke"},
	}

	topics := make(map[string]*models.Topic)
	for _, td := range topicData {
		var t models.Topic
		err := db.Where("slug = ? AND grade = ?", td.Slug, 6).First(&t).Error
		if err != nil {
			t = models.Topic{
				Name:    td.Name,
				Slug:    td.Slug,
				Grade:   6,
				Subject: "Toán",
			}
			db.Create(&t)
		}
		topics[td.Name] = &t
	}

	var allQuestions []models.Question

	// --- 3. TẠO 50 CÂU HỎI ĐA DẠNG ---

	// A. Chủ đề: Số tự nhiên (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           6,
			Topic:           "Số tự nhiên",
			TopicID:         &topics["Số tự nhiên"].ID,
			DifficultyLevel: "Nhận biết",
			DifficultyPoint: 3.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Kết quả của phép tính %d^3 là bao nhiêu?", i+1),
			Options:         buildOptions(fmt.Sprintf("%d", (i+1)*(i+1)*(i+1)), fmt.Sprintf("%d", (i+1)*3), fmt.Sprintf("%d", (i+1)*(i+1)), fmt.Sprintf("%d", (i+1)+3)),
			CorrectAnswer:   "A",
			SolutionGuide:   fmt.Sprintf("Lấy %d nhân với chính nó 3 lần.", i+1),
			Status:          "approved",
			Tags:            buildTags("Số tự nhiên", "Lũy thừa", "Lớp 6"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           6,
			Topic:           "Số tự nhiên",
			TopicID:         &topics["Số tự nhiên"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 6.5,
			Point:           2.0,
			Content:         fmt.Sprintf("Tìm Ước chung lớn nhất (ƯCLN) của %d và %d.", i*12, i*18),
			CorrectAnswer:   fmt.Sprintf("%d", i*6),
			SolutionGuide:   "Phân tích các số ra thừa số nguyên tố, sau đó chọn các thừa số chung với số mũ nhỏ nhất.",
			Status:          "approved",
			Tags:            buildTags("Số tự nhiên", "ƯCLN", "Lớp 6"),
		})
	}

	// B. Chủ đề: Số nguyên (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           6,
			Topic:           "Số nguyên",
			TopicID:         &topics["Số nguyên"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Kết quả của phép tính (-%d) + %d là:", i*5, i*12),
			Options:         buildOptions(fmt.Sprintf("%d", i*7), fmt.Sprintf("-%d", i*17), fmt.Sprintf("%d", i*17), fmt.Sprintf("-%d", i*7)),
			CorrectAnswer:   "A",
			SolutionGuide:   "Cộng hai số nguyên khác dấu: lấy số có giá trị tuyệt đối lớn hơn trừ số có giá trị tuyệt đối nhỏ hơn và đặt dấu của số có giá trị tuyệt đối lớn hơn trước kết quả.",
			Status:          "approved",
			Tags:            buildTags("Số nguyên", "Lớp 6"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           6,
			Topic:           "Số nguyên",
			TopicID:         &topics["Số nguyên"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 8.5,
			Point:           2.0,
			Content:         fmt.Sprintf("Một kho lạnh đang ở nhiệt độ -%d°C. Người quản lý giảm nhiệt độ thêm %d°C nữa. Sau đó lại tăng %d°C. Hỏi nhiệt độ hiện tại của kho lạnh là bao nhiêu?", i, i+2, i*3),
			CorrectAnswer:   fmt.Sprintf("%d°C", -i-(i+2)+(i*3)),
			SolutionGuide:   "Giảm nhiệt độ là phép trừ, tăng nhiệt độ là phép cộng.",
			Status:          "approved",
			Tags:            buildTags("Số nguyên", "Toán thực tế", "Lớp 6"),
		})
	}

	// C. Chủ đề: Phân số (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           6,
			Topic:           "Phân số",
			TopicID:         &topics["Phân số"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Rút gọn phân số %d/%d về dạng phân số tối giản.", i*4, i*12),
			Options:         buildOptions("1/3", "1/4", "1/2", "3/4"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Chia cả tử và mẫu cho Ước chung lớn nhất của chúng.",
			Status:          "approved",
			Tags:            buildTags("Phân số", "Lớp 6"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           6,
			Topic:           "Phân số",
			TopicID:         &topics["Phân số"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.0,
			Point:           2.0,
			Content:         fmt.Sprintf("Tính giá trị của biểu thức: A = (1/2 + 1/3) * %d/5", i*6),
			CorrectAnswer:   fmt.Sprintf("%g", float64(i)),
			SolutionGuide:   "Thực hiện phép tính trong ngoặc trước (quy đồng mẫu số), sau đó nhân với phân số ở ngoài.",
			Status:          "approved",
			Tags:            buildTags("Phân số", "Biểu thức", "Lớp 6"),
		})
	}

	// D. Chủ đề: Hình học trực quan (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           6,
			Topic:           "Hình học trực quan",
			TopicID:         &topics["Hình học trực quan"].ID,
			DifficultyLevel: "Nhận biết",
			DifficultyPoint: 3.5,
			Point:           1.0,
			Content:         "Trong các hình sau, hình nào có 4 cạnh bằng nhau và 4 góc vuông?",
			Options:         buildOptions("Hình vuông", "Hình chữ nhật", "Hình thoi", "Hình bình hành"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Dựa vào tính chất của hình vuông: 4 góc vuông và 4 cạnh bằng nhau.",
			Status:          "approved",
			Tags:            buildTags("Hình học trực quan", "Hình vuông", "Lớp 6"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           6,
			Topic:           "Hình học trực quan",
			TopicID:         &topics["Hình học trực quan"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.5,
			Point:           2.0,
			Content:         fmt.Sprintf("Một mảnh vườn hình lục giác đều có độ dài một cạnh là %dm. Tính chu vi mảnh vườn đó.", i*5),
			CorrectAnswer:   fmt.Sprintf("%dm", i*5*6),
			SolutionGuide:   "Chu vi lục giác đều bằng độ dài một cạnh nhân với 6.",
			Status:          "approved",
			Tags:            buildTags("Hình học trực quan", "Lục giác đều", "Lớp 6"),
		})
	}

	// E. Chủ đề: Xác suất thống kê (10 câu, bao gồm 1 câu hỏi chùm 4 câu)
	for i := 1; i <= 6; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           6,
			Topic:           "Xác suất thống kê",
			TopicID:         &topics["Xác suất thống kê"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.5,
			Point:           1.0,
			Content:         fmt.Sprintf("Khi gieo một con xúc xắc 6 mặt đồng chất, xác suất thực nghiệm để gieo được mặt %d chấm là bao nhiêu nếu gieo 1 lần duy nhất?", i),
			Options:         buildOptions("1/6", "1/2", "1/3", "1/4"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Xúc xắc có 6 mặt, mỗi mặt xuất hiện với xác suất bằng nhau là 1/6.",
			Status:          "approved",
			Tags:            buildTags("Xác suất", "Xúc xắc", "Lớp 6"),
		})
	}

	// Tạo 1 Câu hỏi chùm (Group) gồm 4 câu hỏi con
	qGroup := models.QuestionGroup{
		SharedContent: "Biểu đồ tranh dưới đây cho biết số lượng táo bán được của một cửa hàng trong 4 ngày đầu tuần. Biết rằng mỗi biểu tượng hình quả táo tương ứng với 10 kg táo, nửa quả táo tương ứng với 5 kg táo. \nNgày thứ Hai: 3 quả rưỡi \nNgày thứ Ba: 4 quả \nNgày thứ Tư: 2 quả \nNgày thứ Năm: 5 quả rưỡi",
	}
	db.Create(&qGroup)

	// 4 câu con trong chùm
	groupQuestions := []models.Question{
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Trắc nghiệm",
			Grade:           6,
			Topic:           "Xác suất thống kê",
			TopicID:         &topics["Xác suất thống kê"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 4.5,
			Point:           1.0,
			Content:         "Ngày thứ Hai cửa hàng bán được bao nhiêu kg táo?",
			Options:         buildOptions("35 kg", "30 kg", "40 kg", "25 kg"),
			CorrectAnswer:   "A",
			SolutionGuide:   "3 quả rưỡi = 3 * 10 + 5 = 35 (kg)",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Trắc nghiệm",
			Grade:           6,
			Topic:           "Xác suất thống kê",
			TopicID:         &topics["Xác suất thống kê"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.0,
			Point:           1.0,
			Content:         "Ngày nào cửa hàng bán được nhiều táo nhất?",
			Options:         buildOptions("Ngày thứ Năm", "Ngày thứ Ba", "Ngày thứ Hai", "Ngày thứ Tư"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Ngày thứ Năm có 5 quả rưỡi, là nhiều nhất.",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           6,
			Topic:           "Xác suất thống kê",
			TopicID:         &topics["Xác suất thống kê"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.0,
			Point:           2.0,
			Content:         "Tính tổng số kg táo cửa hàng bán được trong 4 ngày.",
			CorrectAnswer:   "150 kg",
			SolutionGuide:   "Tổng số biểu tượng = 3.5 + 4 + 2 + 5.5 = 15 quả. Tổng số kg = 15 * 10 = 150 (kg)",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           6,
			Topic:           "Xác suất thống kê",
			TopicID:         &topics["Xác suất thống kê"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 8.5,
			Point:           2.0,
			Content:         "Tỉ số phần trăm số lượng táo bán được ngày thứ Ba so với tổng số lượng táo bán được trong 4 ngày là bao nhiêu? (Làm tròn đến chữ số thập phân thứ nhất)",
			CorrectAnswer:   "26.7%",
			SolutionGuide:   "Táo ngày 3: 40kg. Tổng: 150kg. Tỉ số = 40 / 150 * 100% ≈ 26.666...% ≈ 26.7%",
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
		fmt.Printf("Successfully seeded %d questions for Grade 6.\n", res.RowsAffected)
	}
}
