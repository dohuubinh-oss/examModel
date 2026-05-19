package models_test

import (
	"testing"

	"github.com/modeptrai/exam-model-backend/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestQuestionMigrationAndCRUD(t *testing.T) {
	// Initialize in-memory SQLite for testing
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open test database: %v", err)
	}

	// 1. Run auto-migration
	err = db.AutoMigrate(&models.Question{})
	if err != nil {
		t.Fatalf("failed to auto-migrate Question: %v", err)
	}

	// 2. Insert a Multiple Choice Question (MCQ) matching the new schema
	mcq := models.Question{
		TypeQuestion:    "single",
		Content:         "Tìm tập xác định của hàm số $y = \\log(x)$",
		Type:            "Trắc nghiệm",
		Grade:           10,
		Topic:           "Hàm số lôgarit",
		DifficultyLevel: "Thông hiểu",
		DifficultyPoint: 4.5,
		Point:           0.5,
		Tags:            []string{"lôgarit", "tập xác định"},
		Options:         []string{"$D = \\mathbb{R}$", "$D = (0; +\\infty)$", "$D = [0; +\\infty)$", "$D = \\mathbb{R} \\setminus \\{0\\}$"},
		CorrectAnswer:   "B",
		SolutionGuide:   "Bước 1: Điều kiện xác định là $x > 0$. Bước 2: Vậy tập xác định $D = (0; +\\infty)$.",
		Hint:            "Lôgarit cơ số 10 chỉ xác định khi đối số dương.",
		QuickSolveTips:  "Loại ngay đáp án A và D vì chứa số âm.",
		GeneralMethod:   "Hàm số $y = \\log_a(u(x))$ xác định khi $u(x) > 0$.",
		Mistakes:        "Học sinh hay nhầm lẫn lấy cả số 0 ($x \\ge 0$).",
		ImageQuestion:   "https://example.com/question1.png",
		ImageSolution:   "https://example.com/solution1.png",
	}

	if err := db.Create(&mcq).Error; err != nil {
		t.Fatalf("failed to create MCQ: %v", err)
	}

	// Verify defaults and data storage
	var fetchedMcq models.Question
	if err := db.First(&fetchedMcq, "id = ?", mcq.ID).Error; err != nil {
		t.Fatalf("failed to fetch MCQ: %v", err)
	}

	if fetchedMcq.Status != "draft" {
		t.Errorf("expected default status to be 'draft', got %q", fetchedMcq.Status)
	}

	if fetchedMcq.UsedCount != 0 {
		t.Errorf("expected default used_count to be 0, got %d", fetchedMcq.UsedCount)
	}

	if fetchedMcq.Grade != 10 {
		t.Errorf("expected grade to be 10, got %d", fetchedMcq.Grade)
	}

	if len(fetchedMcq.Tags) != 2 || fetchedMcq.Tags[0] != "lôgarit" {
		t.Errorf("expected tags to be stored correctly, got %v", fetchedMcq.Tags)
	}

	if fetchedMcq.DifficultyPoint != 4.5 {
		t.Errorf("expected difficulty_point to be 4.5, got %v", fetchedMcq.DifficultyPoint)
	}

	// 3. Test Question grouping (parent-child relationship)
	parentGroup := models.Question{
		TypeQuestion:    "group",
		Content:         "Đọc đoạn văn toán học sau và trả lời các câu hỏi phụ bên dưới...",
		Type:            "Tự luận",
		Grade:           9,
		Topic:           "Đọc hiểu Toán",
		DifficultyLevel: "Nhận biết",
		DifficultyPoint: 2.0,
		Point:           2.0,
		SolutionGuide:   "Đọc kỹ dữ liệu đề bài đưa ra để trả lời.",
	}

	if err := db.Create(&parentGroup).Error; err != nil {
		t.Fatalf("failed to create parent group question: %v", err)
	}

	child1 := models.Question{
		ParentID:        &parentGroup.ID,
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
		ParentID:        &parentGroup.ID,
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

	// Fetch parent group with preloaded Children
	var fetchedParent models.Question
	if err := db.Preload("Children").First(&fetchedParent, "id = ?", parentGroup.ID).Error; err != nil {
		t.Fatalf("failed to fetch parent with children: %v", err)
	}

	if fetchedParent.TypeQuestion != "group" {
		t.Errorf("expected type_question 'group', got %q", fetchedParent.TypeQuestion)
	}

	if len(fetchedParent.Children) != 2 {
		t.Errorf("expected 2 children preloaded, got %d", len(fetchedParent.Children))
	}

	// Verify child relation references parent correct ID
	for _, child := range fetchedParent.Children {
		if child.ParentID == nil || *child.ParentID != fetchedParent.ID {
			t.Errorf("expected child ParentID to point to parent ID %d, got %v", fetchedParent.ID, child.ParentID)
		}
	}
}
