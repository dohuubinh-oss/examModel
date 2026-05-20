package models_test

import (
	"testing"

	"github.com/modeptrai/exam-model-backend/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestTopicMigrationAndCRUD(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open test database: %v", err)
	}

	// Run auto-migration
	err = db.AutoMigrate(&models.Topic{}, &models.Question{})
	if err != nil {
		t.Fatalf("failed to auto-migrate Topic: %v", err)
	}

	// 1. Create a parent Topic
	parent := models.Topic{
		Name:    "Giải tích",
		Slug:    "giai-tich",
		Grade:   9,
		Subject: "Toán",
	}

	if err := db.Create(&parent).Error; err != nil {
		t.Fatalf("failed to create parent Topic: %v", err)
	}

	// 2. Create a child Topic
	child := models.Topic{
		Name:     "Hàm số lũy thừa",
		Slug:     "ham-so-luy-thua",
		ParentID: &parent.ID,
		Grade:    9,
		Subject:  "Toán",
	}

	if err := db.Create(&child).Error; err != nil {
		t.Fatalf("failed to create child Topic: %v", err)
	}

	// 3. Query and preload child/parent relationship
	var fetchedParent models.Topic
	if err := db.Preload("Children").First(&fetchedParent, "id = ?", parent.ID).Error; err != nil {
		t.Fatalf("failed to fetch parent Topic: %v", err)
	}

	if len(fetchedParent.Children) != 1 {
		t.Errorf("expected 1 child topic, got %d", len(fetchedParent.Children))
	} else if fetchedParent.Children[0].Name != "Hàm số lũy thừa" {
		t.Errorf("expected child name to be 'Hàm số lũy thừa', got %q", fetchedParent.Children[0].Name)
	}

	// 4. Verify Slug uniqueness constraint
	duplicate := models.Topic{
		Name:    "Giải tích khác",
		Slug:    "giai-tich",
		Grade:   9,
		Subject: "Toán",
	}
	if err := db.Create(&duplicate).Error; err == nil {
		t.Errorf("expected error when inserting duplicate slug, but got nil")
	}

	// 5. Test Question relation with Topic
	question := models.Question{
		TypeQuestion:    "single",
		Content:         "Tính đạo hàm của $y = x^\\pi$.",
		Type:            "Trắc nghiệm",
		Grade:           9,
		Topic:           "Lũy thừa",
		TopicID:         &child.ID,
		DifficultyLevel: "Thông hiểu",
		DifficultyPoint: 5.0,
		Point:           0.4,
		SolutionGuide:   "Đạo hàm $y' = \\pi x^{\\pi-1}$.",
	}

	if err := db.Create(&question).Error; err != nil {
		t.Fatalf("failed to create question with TopicID: %v", err)
	}

	var fetchedQuestion models.Question
	if err := db.Preload("TopicRel").First(&fetchedQuestion, "id = ?", question.ID).Error; err != nil {
		t.Fatalf("failed to fetch question with preloaded TopicRel: %v", err)
	}

	if fetchedQuestion.TopicID == nil || *fetchedQuestion.TopicID != child.ID {
		t.Errorf("expected TopicID to be %d, got %v", child.ID, fetchedQuestion.TopicID)
	}

	if fetchedQuestion.TopicRel == nil || fetchedQuestion.TopicRel.Slug != "ham-so-luy-thua" {
		t.Errorf("expected preloaded TopicRel to have slug 'ham-so-luy-thua', got %v", fetchedQuestion.TopicRel)
	}
}
