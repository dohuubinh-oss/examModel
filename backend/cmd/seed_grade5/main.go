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

	fmt.Println("Connected to Database. Starting seed for Grade 5 Math...")

	// 1. Delete existing Grade 5 questions
	var qGroups []models.QuestionGroup
	db.Where("id IN (SELECT question_group_id FROM questions WHERE grade = 5 AND question_group_id IS NOT NULL)").Find(&qGroups)

	res := db.Where("grade = ?", 5).Delete(&models.Question{})
	fmt.Printf("Deleted %d existing grade 5 questions.\n", res.RowsAffected)

	if len(qGroups) > 0 {
		db.Delete(&qGroups)
		fmt.Printf("Deleted %d orphaned question groups.\n", len(qGroups))
	}

	// 2. Setup Topics
	topicData := []struct {
		Name string
		Slug string
	}{
		{"Số thập phân", "so-thap-phan"},
		{"Phân số", "phan-so"},
		{"Tỉ số phần trăm", "ti-so-phan-tram"},
		{"Hình học", "hinh-hoc"},
		{"Chuyển động đều", "chuyen-dong-deu"},
	}

	topics := make(map[string]*models.Topic)
	for _, td := range topicData {
		var t models.Topic
		err := db.Where("slug = ? AND grade = ?", td.Slug, 5).First(&t).Error
		if err != nil {
			t = models.Topic{
				Name:    td.Name,
				Slug:    td.Slug,
				Grade:   5,
				Subject: "Toán",
			}
			db.Create(&t)
		}
		topics[td.Name] = &t
	}

	var allQuestions []models.Question

	// --- 3. TẠO 50 CÂU HỎI ĐA DẠNG ---

	// A. Chủ đề: Số thập phân (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           5,
			Topic:           "Số thập phân",
			TopicID:         &topics["Số thập phân"].ID,
			DifficultyLevel: "Nhận biết",
			DifficultyPoint: 2.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Chữ số %d trong số thập phân 12,3%d5 có giá trị là bao nhiêu?", i, i),
			Options:         buildOptions(fmt.Sprintf("%d/100", i), fmt.Sprintf("%d/10", i), fmt.Sprintf("%d/1000", i), fmt.Sprintf("%d", i)),
			CorrectAnswer:   "A",
			SolutionGuide:   fmt.Sprintf("Chữ số %d nằm ở hàng phần trăm nên có giá trị là %d/100.", i, i),
			Status:          "approved",
			Tags:            buildTags("Số thập phân", "Lớp 5"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           5,
			Topic:           "Số thập phân",
			TopicID:         &topics["Số thập phân"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 6.0,
			Point:           2.0,
			Content:         fmt.Sprintf("Tính bằng cách thuận tiện nhất: %d,25 x 4,8 x 0,4", i),
			CorrectAnswer:   fmt.Sprintf("%g", float64(i)*0.25*4.8*0.4),
			SolutionGuide:   "Áp dụng tính chất giao hoán và kết hợp của phép nhân.",
			Status:          "approved",
			Tags:            buildTags("Số thập phân", "Tự luận", "Lớp 5"),
		})
	}

	// B. Chủ đề: Phân số (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           5,
			Topic:           "Phân số",
			TopicID:         &topics["Phân số"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 4.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Phân số nào dưới đây bằng phân số %d/%d?", i, i+2),
			Options:         buildOptions(fmt.Sprintf("%d/%d", i*2, (i+2)*2), fmt.Sprintf("%d/%d", i*3, (i+2)*2), fmt.Sprintf("%d/%d", i, (i+2)*3), fmt.Sprintf("%d/%d", i+1, i+3)),
			CorrectAnswer:   "A",
			SolutionGuide:   "Rút gọn phân số hoặc quy đồng mẫu số để so sánh.",
			Status:          "approved",
			Tags:            buildTags("Phân số", "Lớp 5"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           5,
			Topic:           "Phân số",
			TopicID:         &topics["Phân số"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 8.0,
			Point:           2.0,
			Content:         fmt.Sprintf("Một cửa hàng ngày thứ nhất bán được %d/5 số gạo, ngày thứ hai bán được 1/3 số gạo. Hỏi cửa hàng còn lại bao nhiêu phần số gạo?", i),
			CorrectAnswer:   fmt.Sprintf("Còn lại %d/15", 15-(i*3)-5),
			SolutionGuide:   "Tìm tổng số gạo bán trong hai ngày, sau đó lấy 1 trừ đi tổng đó.",
			Status:          "approved",
			Tags:            buildTags("Phân số", "Toán đố", "Lớp 5"),
		})
	}

	// C. Chủ đề: Tỉ số phần trăm (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           5,
			Topic:           "Tỉ số phần trăm",
			TopicID:         &topics["Tỉ số phần trăm"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 4.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Tìm %d%% của 200kg.", i*10),
			Options:         buildOptions(fmt.Sprintf("%dkg", i*20), fmt.Sprintf("%dkg", i*2), fmt.Sprintf("%dkg", i*10), fmt.Sprintf("%d00kg", i)),
			CorrectAnswer:   "A",
			SolutionGuide:   fmt.Sprintf("Lấy 200 chia 100 rồi nhân với %d.", i*10),
			Status:          "approved",
			Tags:            buildTags("Tỉ số phần trăm", "Lớp 5"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           5,
			Topic:           "Tỉ số phần trăm",
			TopicID:         &topics["Tỉ số phần trăm"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.0,
			Point:           2.0,
			Content:         fmt.Sprintf("Lãi suất tiết kiệm là 0,5%% một tháng. Một người gửi %d triệu đồng. Hỏi sau một tháng cả số tiền gửi và tiền lãi là bao nhiêu?", i*10),
			CorrectAnswer:   fmt.Sprintf("%g triệu đồng", float64(i*10)*1.005),
			SolutionGuide:   "Tính tiền lãi bằng cách lấy số tiền gửi nhân 0.5 chia 100, sau đó cộng với tiền gửi ban đầu.",
			Status:          "approved",
			Tags:            buildTags("Tỉ số phần trăm", "Lớp 5"),
		})
	}

	// D. Chủ đề: Hình học (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           5,
			Topic:           "Hình học",
			TopicID:         &topics["Hình học"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 6.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Diện tích hình thang có đáy lớn %dm, đáy bé %dm và chiều cao 4m là:", i+5, i),
			Options:         buildOptions(fmt.Sprintf("%dm2", (i*2+5)*2), fmt.Sprintf("%dm2", (i*2+5)*4), fmt.Sprintf("%dm2", i*5*4), fmt.Sprintf("%dm2", i+5+4)),
			CorrectAnswer:   "A",
			SolutionGuide:   "S = (a + b) x h : 2",
			Status:          "approved",
			Tags:            buildTags("Hình học", "Hình thang", "Lớp 5"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           5,
			Topic:           "Hình học",
			TopicID:         &topics["Hình học"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 9.0,
			Point:           2.0,
			Content:         fmt.Sprintf("Một mảnh đất hình chữ nhật có chu vi là %dm, chiều dài hơn chiều rộng %dm. Tính diện tích mảnh đất đó.", i*20+100, i*5),
			CorrectAnswer:   "Tính nửa chu vi, dùng bài toán tổng hiệu tìm chiều dài chiều rộng rồi nhân lại.",
			SolutionGuide:   "Nửa chu vi là tổng của chiều dài và chiều rộng. Áp dụng công thức tìm hai số khi biết tổng và hiệu.",
			Status:          "approved",
			Tags:            buildTags("Hình học", "Hình chữ nhật", "Lớp 5"),
		})
	}

	// E. Chủ đề: Chuyển động đều (10 câu, bao gồm 1 câu hỏi chùm 4 câu)
	for i := 1; i <= 6; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           5,
			Topic:           "Chuyển động đều",
			TopicID:         &topics["Chuyển động đều"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 6.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Một ô tô đi với vận tốc %d km/giờ. Quãng đường ô tô đi được trong 2,5 giờ là:", i*10+30),
			Options:         buildOptions(fmt.Sprintf("%g km", float64(i*10+30)*2.5), fmt.Sprintf("%d km", (i*10+30)*2), fmt.Sprintf("%g km", float64(i*10+30)*3.5), fmt.Sprintf("%d km", i*10+30)),
			CorrectAnswer:   "A",
			SolutionGuide:   "S = v x t",
			Status:          "approved",
			Tags:            buildTags("Chuyển động đều", "Lớp 5"),
		})
	}

	// Tạo 1 Câu hỏi chùm (Group) gồm 4 câu hỏi con
	qGroup := models.QuestionGroup{
		SharedContent: "Một người đi xe máy từ A đến B với vận tốc 40 km/giờ. Cùng lúc đó, một người đi xe đạp từ B về A với vận tốc 15 km/giờ. Quãng đường AB dài 110 km.",
	}
	db.Create(&qGroup)

	// 4 câu con trong chùm
	groupQuestions := []models.Question{
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Trắc nghiệm",
			Grade:           5,
			Topic:           "Chuyển động đều",
			TopicID:         &topics["Chuyển động đều"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 4.0,
			Point:           1.0,
			Content:         "Tổng vận tốc của hai người là bao nhiêu?",
			Options:         buildOptions("55 km/giờ", "25 km/giờ", "40 km/giờ", "15 km/giờ"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Tổng vận tốc = v1 + v2 = 40 + 15 = 55 (km/giờ)",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Trắc nghiệm",
			Grade:           5,
			Topic:           "Chuyển động đều",
			TopicID:         &topics["Chuyển động đều"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 6.0,
			Point:           1.0,
			Content:         "Sau bao lâu thì hai người gặp nhau?",
			Options:         buildOptions("2 giờ", "2,5 giờ", "3 giờ", "1,5 giờ"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Thời gian gặp nhau = Quãng đường / Tổng vận tốc = 110 / 55 = 2 (giờ)",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           5,
			Topic:           "Chuyển động đều",
			TopicID:         &topics["Chuyển động đều"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.0,
			Point:           2.0,
			Content:         "Tính quãng đường người đi xe máy đã đi được cho đến lúc gặp nhau.",
			CorrectAnswer:   "80 km",
			SolutionGuide:   "Quãng đường = Vận tốc x Thời gian = 40 x 2 = 80 (km)",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           5,
			Topic:           "Chuyển động đều",
			TopicID:         &topics["Chuyển động đều"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 9.0,
			Point:           2.0,
			Content:         "Khi hai người gặp nhau, họ cách A bao nhiêu km?",
			CorrectAnswer:   "80 km",
			SolutionGuide:   "Vị trí gặp nhau tính từ A chính là quãng đường người đi từ A (người đi xe máy) đã đi được, là 80 km.",
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
		fmt.Printf("Successfully seeded %d questions for Grade 5.\n", res.RowsAffected)
	}
}
