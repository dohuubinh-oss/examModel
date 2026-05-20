package models

import (
	"time"

	"gorm.io/gorm"
)

type StudentAnswer struct {
	QuestionID             uint    `json:"question_id"`
	SelectedAnswer         string  `json:"selected_answer"`
	IsCorrect              bool    `json:"is_correct"`
	Point                  float64 `json:"point"`
	HandwrittenSolutionUrl string  `json:"handwritten_solution_url,omitempty"`
	
	// New fields for grading annotation
	TeacherComment         string  `json:"teacher_comment,omitempty"`
	AnnotationsData        string  `json:"annotations_data,omitempty"` // Serialized JSON/SVG drawing strokes
	GradedBy               string  `json:"graded_by,omitempty"`
}

type TestResult struct {
	ID                  uint           `gorm:"primaryKey" json:"id"`
	CreatedAt           time.Time      `json:"created_at"`
	UpdatedAt           time.Time      `json:"updated_at"`
	DeletedAt           gorm.DeletedAt `gorm:"index" json:"-"`
	
	UserID              uint           `gorm:"not null" json:"user_id"`
	User                User           `gorm:"constraint:OnDelete:CASCADE;" json:"-"`
	ExamID              uint           `gorm:"not null" json:"exam_id"`
	Exam                Exam           `gorm:"constraint:OnDelete:CASCADE;" json:"-"`
	
	Score               float64        `gorm:"type:decimal(4,2);not null;check:score >= 0" json:"score"`
	DurationTaken       int            `gorm:"type:integer;not null;check:duration_taken >= 0" json:"duration_taken"` // in seconds
	CorrectAnswersCount int            `gorm:"type:integer;not null;check:correct_answers_count >= 0" json:"correct_answers_count"`
	TotalQuestionsCount int            `gorm:"type:integer;not null;check:total_questions_count > 0" json:"total_questions_count"`
	
	Status              string         `gorm:"type:varchar(50);not null;default:'submitted';check:status IN ('in_progress','submitted','graded')" json:"status"`
	
	// Serialized student responses list
	Answers             []StudentAnswer `gorm:"serializer:json;type:jsonb" json:"answers"`
	
	SubmittedAt         time.Time      `json:"submitted_at"`
}
