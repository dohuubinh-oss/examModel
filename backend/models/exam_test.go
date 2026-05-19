package models_test

import (
	"testing"
	"time"

	"github.com/modeptrai/exam-model-backend/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestExamMigrationAndPreloading(t *testing.T) {
	// Initialize in-memory SQLite for testing
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open test database: %v", err)
	}

	// Enable foreign key support in SQLite so ON DELETE CASCADE triggers
	db.Exec("PRAGMA foreign_keys = ON")

	// 1. Run auto-migration
	err = db.AutoMigrate(&models.Question{}, &models.Exam{}, &models.ExamQuestion{})
	if err != nil {
		t.Fatalf("failed to auto-migrate models: %v", err)
	}

	// 2. Create questions to link
	q1 := models.Question{
		Content:       "Câu 1: $1 + 1 = ?$",
		Type:          "Trắc nghiệm",
		Grade:         5,
		Topic:         "Cơ bản",
		SolutionGuide: "Lời giải câu 1",
	}
	q2 := models.Question{
		Content:       "Câu 2: $2 + 2 = ?$",
		Type:          "Trắc nghiệm",
		Grade:         5,
		Topic:         "Cơ bản",
		SolutionGuide: "Lời giải câu 2",
	}

	if err := db.Create(&q1).Error; err != nil {
		t.Fatalf("failed to create question 1: %v", err)
	}
	if err := db.Create(&q2).Error; err != nil {
		t.Fatalf("failed to create question 2: %v", err)
	}

	// 3. Create an Exam
	startTime := time.Now().Add(1 * time.Hour)
	endTime := time.Now().Add(3 * time.Hour)

	exam := models.Exam{
		Title:       "Đề thi học kỳ 1 Toán lớp 5",
		Description: "Đề chính thức",
		ExamCode:    "HK1-MATH-5",
		Duration:    90,
		Grade:       5,
		TotalScore:  10.0,
		StartTime:   &startTime,
		EndTime:     &endTime,
	}

	if err := db.Create(&exam).Error; err != nil {
		t.Fatalf("failed to create exam: %v", err)
	}

	// Verify defaults and metadata
	var fetchedExam models.Exam
	if err := db.First(&fetchedExam, "id = ?", exam.ID).Error; err != nil {
		t.Fatalf("failed to fetch exam: %v", err)
	}

	if fetchedExam.Status != "draft" {
		t.Errorf("expected default status to be 'draft', got %q", fetchedExam.Status)
	}

	if fetchedExam.TotalScore != 10.0 {
		t.Errorf("expected default total_score to be 10.0, got %v", fetchedExam.TotalScore)
	}

	// 4. Link questions to the exam with order number (Many-to-Many join table)
	link1 := models.ExamQuestion{
		ExamID:      exam.ID,
		QuestionID:  q2.ID,
		OrderNumber: 1,
	}
	link2 := models.ExamQuestion{
		ExamID:      exam.ID,
		QuestionID:  q1.ID,
		OrderNumber: 2,
	}

	if err := db.Create(&link1).Error; err != nil {
		t.Fatalf("failed to link question 2: %v", err)
	}
	if err := db.Create(&link2).Error; err != nil {
		t.Fatalf("failed to link question 1: %v", err)
	}

	// 5. Fetch exam and preload questions sorted by order_number
	var finalExam models.Exam
	err = db.Preload("Questions", func(tx *gorm.DB) *gorm.DB {
		return tx.Joins("JOIN exam_questions ON exam_questions.question_id = questions.id").
			Where("exam_questions.exam_id = ?", exam.ID).
			Order("exam_questions.order_number ASC")
	}).First(&finalExam, "id = ?", exam.ID).Error

	if err != nil {
		t.Fatalf("failed to preload questions for exam: %v", err)
	}

	if len(finalExam.Questions) != 2 {
		t.Errorf("expected 2 preloaded questions, got %d", len(finalExam.Questions))
	}

	if finalExam.Questions[0].ID != q2.ID {
		t.Errorf("expected first preloaded question to be q2 (ID %d), got ID %d", q2.ID, finalExam.Questions[0].ID)
	}

	if finalExam.Questions[1].ID != q1.ID {
		t.Errorf("expected second preloaded question to be q1 (ID %d), got ID %d", q1.ID, finalExam.Questions[1].ID)
	}

	// 6. Test Cascading delete
	// Since Exam has DeletedAt (GORM soft delete), we need to do a hard delete to trigger actual DB cascade constraints,
	// or perform a GORM Unscoped delete.
	if err := db.Unscoped().Delete(&exam).Error; err != nil {
		t.Fatalf("failed to delete exam: %v", err)
	}

	// Verify that the link records in exam_questions have been deleted automatically via ON DELETE CASCADE
	var linkCount int64
	db.Model(&models.ExamQuestion{}).Where("exam_id = ?", exam.ID).Count(&linkCount)
	if linkCount != 0 {
		t.Errorf("expected 0 link records left due to CASCADE delete, but found %d", linkCount)
	}
}
