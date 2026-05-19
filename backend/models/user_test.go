package models_test

import (
	"strings"
	"testing"

	"github.com/modeptrai/exam-model-backend/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestUserMigrationAndCRUD(t *testing.T) {
	// Initialize in-memory SQLite for testing
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open test database: %v", err)
	}

	// 1. Run auto-migration
	err = db.AutoMigrate(&models.User{})
	if err != nil {
		t.Fatalf("failed to auto-migrate User: %v", err)
	}

	// Helper strings
	email1 := "student@exam.com"
	phone1 := "0912345678"
	grade10 := 10
	rawPassword := "hashed_password_123"

	// 2. Insert a valid Student
	student := models.User{
		Username:     "student1",
		Email:        &email1,
		PhoneNumber:  &phone1,
		PasswordHash: rawPassword, // Plain password input that should be hashed by hook
		FullName:     "Nguyễn Văn Học Sinh",
		Role:         "student",
		Grade:        &grade10,
	}

	if err := db.Create(&student).Error; err != nil {
		t.Fatalf("failed to create student user: %v", err)
	}

	// Fetch student and verify fields and defaults
	var fetchedStudent models.User
	if err := db.First(&fetchedStudent, "id = ?", student.ID).Error; err != nil {
		t.Fatalf("failed to fetch student user: %v", err)
	}

	if fetchedStudent.Username != "student1" {
		t.Errorf("expected username 'student1', got %q", fetchedStudent.Username)
	}

	if fetchedStudent.Status != "active" {
		t.Errorf("expected default status to be 'active', got %q", fetchedStudent.Status)
	}

	if fetchedStudent.Grade == nil || *fetchedStudent.Grade != 10 {
		t.Errorf("expected student grade to be 10, got %v", fetchedStudent.Grade)
	}

	// Verify password has been hashed (starts with $2a$ or similar bcrypt prefixes, not rawPassword)
	if fetchedStudent.PasswordHash == rawPassword {
		t.Errorf("expected password to be hashed, but it was stored as plain text %q", fetchedStudent.PasswordHash)
	}
	if !strings.HasPrefix(fetchedStudent.PasswordHash, "$2") {
		t.Errorf("expected password to be bcrypt hashed, got %q", fetchedStudent.PasswordHash)
	}

	// Verify CheckPasswordHash verification helper works
	if !fetchedStudent.CheckPasswordHash(rawPassword) {
		t.Errorf("CheckPasswordHash failed for correct password")
	}
	if fetchedStudent.CheckPasswordHash("wrong_password") {
		t.Errorf("CheckPasswordHash succeeded for incorrect password")
	}

	// 3. Insert a valid Teacher
	email2 := "teacher@exam.com"
	phone2 := "0987654321"

	teacher := models.User{
		Username:     "teacher1",
		Email:        &email2,
		PhoneNumber:  &phone2,
		PasswordHash: "hashed_password_456",
		FullName:     "Trần Thị Giáo Viên",
		Role:         "teacher",
		Grade:        nil, // Teachers do not have a grade
	}

	if err := db.Create(&teacher).Error; err != nil {
		t.Fatalf("failed to create teacher user: %v", err)
	}

	var fetchedTeacher models.User
	if err := db.First(&fetchedTeacher, "id = ?", teacher.ID).Error; err != nil {
		t.Fatalf("failed to fetch teacher user: %v", err)
	}

	if fetchedTeacher.Role != "teacher" {
		t.Errorf("expected role 'teacher', got %q", fetchedTeacher.Role)
	}

	if fetchedTeacher.Grade != nil {
		t.Errorf("expected teacher grade to be nil, got %v", fetchedTeacher.Grade)
	}

	// 4. Test Uniqueness constraint on Username
	duplicateUser := models.User{
		Username:     "student1", // Duplicate username
		PasswordHash: "hashed_dup",
		FullName:     "Duplicate Username User",
	}

	if err := db.Create(&duplicateUser).Error; err == nil {
		t.Errorf("expected error when creating duplicate username, got nil")
	}

	// 5. Test Uniqueness constraint on Email
	duplicateEmail := models.User{
		Username:     "student2",
		Email:        &email1, // Duplicate email
		PasswordHash: "hashed_dup",
		FullName:     "Duplicate Email User",
	}

	if err := db.Create(&duplicateEmail).Error; err == nil {
		t.Errorf("expected error when creating duplicate email, got nil")
	}

	// 6. Test Uniqueness constraint on Phone
	duplicatePhone := models.User{
		Username:     "student3",
		PhoneNumber:  &phone1, // Duplicate phone
		PasswordHash: "hashed_dup",
		FullName:     "Duplicate Phone User",
	}

	if err := db.Create(&duplicatePhone).Error; err == nil {
		t.Errorf("expected error when creating duplicate phone number, got nil")
	}
}
