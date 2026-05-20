package models_test

import (
	"testing"
	"time"

	"github.com/modeptrai/exam-model-backend/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestTestResultMigrationAndCascade(t *testing.T) {
	// Initialize in-memory SQLite for testing
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open test database: %v", err)
	}

	// Enable foreign key support in SQLite so ON DELETE CASCADE triggers
	db.Exec("PRAGMA foreign_keys = ON")

	// 1. Run auto-migration
	err = db.AutoMigrate(&models.Question{}, &models.User{}, &models.Exam{}, &models.TestResult{})
	if err != nil {
		t.Fatalf("failed to auto-migrate models: %v", err)
	}

	// 2. Create a User (Student)
	student := models.User{
		Username:     "student_test",
		PasswordHash: "pwd123",
		FullName:     "Học Sinh Kiểm Thử",
		Role:         "student",
	}
	if err := db.Create(&student).Error; err != nil {
		t.Fatalf("failed to create student: %v", err)
	}

	// 3. Create an Exam
	exam := models.Exam{
		Title:    "Đề kiểm tra thử kết quả",
		ExamCode: "TEST-RESULT-01",
		Duration: 45,
		Grade:    6,
	}
	if err := db.Create(&exam).Error; err != nil {
		t.Fatalf("failed to create exam: %v", err)
	}

	// 4. Create a TestResult with answers
	answers := []models.StudentAnswer{
		{
			QuestionID:     1,
			SelectedAnswer: "A",
			IsCorrect:      true,
			Point:          5.0,
		},
		{
			QuestionID:             2,
			SelectedAnswer:         "Bước 1: Giải phương trình...",
			IsCorrect:              false,
			Point:                  0.0,
			HandwrittenSolutionUrl: "https://example.com/essay_sol.png",
			TeacherComment:         "Lời giải tự luận tốt, hình vẽ rõ ràng.",
			AnnotationsData:        `{"strokes": [{"color": "red", "points": [10, 20, 30]}]}`,
			GradedBy:               "GV. Nguyễn Văn A",
		},
	}

	result := models.TestResult{
		UserID:              student.ID,
		ExamID:              exam.ID,
		Score:               5.0,
		DurationTaken:       600, // 10 minutes in seconds
		CorrectAnswersCount: 1,
		TotalQuestionsCount: 2,
		Answers:             answers,
		SubmittedAt:         time.Now(),
	}

	if err := db.Create(&result).Error; err != nil {
		t.Fatalf("failed to create test result: %v", err)
	}

	// 5. Fetch TestResult and verify GORM JSON serialization works
	var fetchedResult models.TestResult
	if err := db.First(&fetchedResult, "id = ?", result.ID).Error; err != nil {
		t.Fatalf("failed to fetch test result: %v", err)
	}

	if fetchedResult.Status != "submitted" {
		t.Errorf("expected default status to be 'submitted', got %q", fetchedResult.Status)
	}

	if len(fetchedResult.Answers) != 2 {
		t.Errorf("expected 2 answers unmarshaled, got %d", len(fetchedResult.Answers))
	}

	if fetchedResult.Answers[0].SelectedAnswer != "A" || !fetchedResult.Answers[0].IsCorrect {
		t.Errorf("expected first answer to be 'A' and correct, got %v", fetchedResult.Answers[0])
	}

	if fetchedResult.Answers[1].HandwrittenSolutionUrl != "https://example.com/essay_sol.png" {
		t.Errorf("expected second answer to contain handwritten solution URL, got %q", fetchedResult.Answers[1].HandwrittenSolutionUrl)
	}

	if fetchedResult.Answers[1].TeacherComment != "Lời giải tự luận tốt, hình vẽ rõ ràng." {
		t.Errorf("expected second answer to contain TeacherComment, got %q", fetchedResult.Answers[1].TeacherComment)
	}

	if fetchedResult.Answers[1].AnnotationsData != `{"strokes": [{"color": "red", "points": [10, 20, 30]}]}` {
		t.Errorf("expected second answer to contain AnnotationsData, got %q", fetchedResult.Answers[1].AnnotationsData)
	}

	if fetchedResult.Answers[1].GradedBy != "GV. Nguyễn Văn A" {
		t.Errorf("expected second answer to contain GradedBy, got %q", fetchedResult.Answers[1].GradedBy)
	}

	// 6. Test Cascade Delete on Exam deletion
	if err := db.Unscoped().Delete(&exam).Error; err != nil {
		t.Fatalf("failed to delete exam: %v", err)
	}

	// Verify that the TestResult record has been deleted automatically
	var examCount int64
	db.Model(&models.TestResult{}).Where("id = ?", result.ID).Count(&examCount)
	if examCount != 0 {
		t.Errorf("expected test result to be deleted after Exam delete cascade, but found %d", examCount)
	}

	// 7. Create another TestResult to test User delete cascade
	exam2 := models.Exam{
		Title:    "Đề kiểm tra thử kết quả 2",
		ExamCode: "TEST-RESULT-02",
		Duration: 45,
		Grade:    6,
	}
	if err := db.Create(&exam2).Error; err != nil {
		t.Fatalf("failed to create exam 2: %v", err)
	}

	result2 := models.TestResult{
		UserID:              student.ID,
		ExamID:              exam2.ID,
		Score:               10.0,
		DurationTaken:       300,
		CorrectAnswersCount: 2,
		TotalQuestionsCount: 2,
		Answers:             answers,
		SubmittedAt:         time.Now(),
	}
	if err := db.Create(&result2).Error; err != nil {
		t.Fatalf("failed to create test result 2: %v", err)
	}

	// Delete user
	if err := db.Unscoped().Delete(&student).Error; err != nil {
		t.Fatalf("failed to delete student user: %v", err)
	}

	// Verify that the TestResult2 record has been deleted automatically via User delete cascade
	var userCount int64
	db.Model(&models.TestResult{}).Where("id = ?", result2.ID).Count(&userCount)
	if userCount != 0 {
		t.Errorf("expected test result 2 to be deleted after User delete cascade, but found %d", userCount)
	}
}
