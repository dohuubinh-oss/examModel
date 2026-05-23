package models_test

import (
	"encoding/json"
	"testing"

	"github.com/modeptrai/exam-model-backend/models"
	"gorm.io/datatypes"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestQuestionMigrationAndCRUD(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open test database: %v", err)
	}

	err = db.AutoMigrate(&models.QuestionGroup{}, &models.Question{})
	if err != nil {
		t.Fatalf("failed to auto-migrate: %v", err)
	}

	tags, _ := json.Marshal([]string{"lôgarit", "tập xác định"})
	options, _ := json.Marshal([]string{"$D = \\mathbb{R}$", "$D = (0; +\\infty)$", "$D = [0; +\\infty)$", "$D = \\mathbb{R} \\setminus \\{0\\}$"})
	
	imageQ := "https://example.com/question1.png"
	imageS := "https://example.com/solution1.png"

	mcq := models.Question{
		TypeQuestion:    "single",
		Content:         "Tìm tập xác định của hàm số $y = \\log(x)$",
		Type:            "Trắc nghiệm",
		Grade:           10,
		Topic:           "Hàm số lôgarit",
		DifficultyLevel: "Thông hiểu",
		DifficultyPoint: 4.5,
		Point:           0.5,
		Tags:            datatypes.JSON(tags),
		Options:         datatypes.JSON(options),
		CorrectAnswer:   "B",
		SolutionGuide:   "Bước 1: Điều kiện xác định là $x > 0$. Bước 2: Vậy tập xác định $D = (0; +\\infty)$.",
		Hint:            "Lôgarit cơ số 10 chỉ xác định khi đối số dương.",
		QuickSolveTips:  "Loại ngay đáp án A và D vì chứa số âm.",
		GeneralMethod:   "Hàm số $y = \\log_a(u(x))$ xác định khi $u(x) > 0$.",
		Mistakes:        "Học sinh hay nhầm lẫn lấy cả số 0 ($x \\ge 0$).",
		ImageQuestion:   &imageQ,
		ImageSolution:   &imageS,
	}

	if err := db.Create(&mcq).Error; err != nil {
		t.Fatalf("failed to create MCQ: %v", err)
	}

	var fetchedMcq models.Question
	if err := db.First(&fetchedMcq, "id = ?", mcq.ID).Error; err != nil {
		t.Fatalf("failed to fetch MCQ: %v", err)
	}

	if fetchedMcq.Status != "draft" {
		t.Errorf("expected default status to be 'draft', got %q", fetchedMcq.Status)
	}

	// Test Question grouping (Group -> Children)
	parentGroup := models.QuestionGroup{
		SharedContent: "Đọc đoạn văn toán học sau và trả lời các câu hỏi phụ bên dưới...",
	}

	if err := db.Create(&parentGroup).Error; err != nil {
		t.Fatalf("failed to create parent group: %v", err)
	}

	child1 := models.Question{
		QuestionGroupID: &parentGroup.ID,
		TypeQuestion:    "single",
		Content:         "Câu hỏi phụ 1: Tính toán giá trị biến x từ dữ liệu trên.",
		Type:            "Tự luận",
		Grade:           9,
		Topic:           "Đọc hiểu Toán",
		DifficultyLevel: "Vận dụng",
		DifficultyPoint: 6.5,
		Point:           1.0,
		SolutionGuide:   "Áp dụng công thức thế số ta được kết quả x = 5.",
	}

	child2 := models.Question{
		QuestionGroupID: &parentGroup.ID,
		TypeQuestion:    "single",
		Content:         "Câu hỏi phụ 2: Tìm giá trị lớn nhất của biểu thức.",
		Type:            "Tự luận",
		Grade:           9,
		Topic:           "Đọc hiểu Toán",
		DifficultyLevel: "Vận dụng cao",
		DifficultyPoint: 8.5,
		Point:           1.0,
		SolutionGuide:   "Sử dụng bất đẳng thức Bunhiacopxki để chứng minh.",
	}

	if err := db.Create(&child1).Error; err != nil {
		t.Fatalf("failed to create child1: %v", err)
	}
	if err := db.Create(&child2).Error; err != nil {
		t.Fatalf("failed to create child2: %v", err)
	}

	var fetchedParent models.QuestionGroup
	if err := db.Preload("Questions").First(&fetchedParent, "id = ?", parentGroup.ID).Error; err != nil {
		t.Fatalf("failed to fetch parent with children: %v", err)
	}

	if len(fetchedParent.Questions) != 2 {
		t.Errorf("expected 2 questions preloaded, got %d", len(fetchedParent.Questions))
	}

	for _, child := range fetchedParent.Questions {
		if child.QuestionGroupID == nil || *child.QuestionGroupID != fetchedParent.ID {
			t.Errorf("expected child QuestionGroupID to point to parent ID %d", fetchedParent.ID)
		}
	}
}
