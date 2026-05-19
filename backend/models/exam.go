package models

import (
	"time"

	"gorm.io/gorm"
)

type Exam struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
	
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Description string         `gorm:"type:text" json:"description,omitempty"`
	ExamCode    string         `gorm:"type:varchar(100);uniqueIndex;not null" json:"exam_code"`
	Duration    int            `gorm:"type:integer;not null;check:duration > 0" json:"duration"` // in minutes
	Grade       int            `gorm:"index;type:integer;not null;check:grade BETWEEN 5 AND 10" json:"grade"` // 5..10
	TotalScore  float64        `gorm:"type:decimal(4,2);not null;default:10.0" json:"total_score"`
	
	Status      string         `gorm:"type:varchar(50);not null;default:'draft';check:status IN ('draft','published','archived')" json:"status"`
	
	StartTime   *time.Time     `json:"start_time,omitempty"`
	EndTime     *time.Time     `json:"end_time,omitempty"`
	CreatedBy   string         `gorm:"type:varchar(100)" json:"created_by,omitempty"`
	
	// Many-to-many relationship using custom join table
	Questions   []Question     `gorm:"many2many:exam_questions;joinForeignKey:ExamID;joinReferences:QuestionID" json:"questions,omitempty"`
}

type ExamQuestion struct {
	ExamID      uint      `gorm:"primaryKey" json:"exam_id"`
	Exam        Exam      `gorm:"constraint:OnDelete:CASCADE;" json:"-"`
	QuestionID  uint      `gorm:"primaryKey" json:"question_id"`
	Question    Question  `gorm:"constraint:OnDelete:CASCADE;" json:"-"`
	OrderNumber int       `gorm:"type:integer;not null;check:order_number > 0" json:"order_number"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
