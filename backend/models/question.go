package models

import (
	"time"

	"gorm.io/gorm"
)

type Question struct {
	ID               uint           `gorm:"primaryKey" json:"id"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
	
	// Self-referencing grouping structure
	ParentID         *uint          `gorm:"index" json:"parent_id,omitempty"`
	TypeQuestion     string         `gorm:"type:varchar(50);not null;default:'single';check:type_question IN ('group','single')" json:"type_question"` // "single" or "group"
	
	// Question content and properties
	Content          string         `gorm:"type:text;not null" json:"content"` // LaTeX support
	Type             string         `gorm:"type:varchar(50);not null;check:type IN ('Trắc nghiệm','Tự luận')" json:"type"` // "Trắc nghiệm" or "Tự luận"
	Grade            int            `gorm:"index:idx_grade_topic;type:integer;not null;check:grade BETWEEN 5 AND 10" json:"grade"` // 5, 6, 7, 8, 9, 10
	Topic            string         `gorm:"index:idx_grade_topic;type:varchar(255);not null" json:"topic"`
	TopicID          *uint          `gorm:"index" json:"topic_id,omitempty"`
	TopicRel         *Topic         `gorm:"foreignKey:TopicID;constraint:OnDelete:SET NULL;" json:"topic_rel,omitempty"`
	
	// Educational settings
	DifficultyLevel  string         `gorm:"index;type:varchar(50);not null" json:"difficulty_level"` // "Nhận biết", "Thông hiểu", "Vận dụng", "Vận dụng cao"
	DifficultyPoint  float64        `gorm:"type:decimal(4,2);not null;check:difficulty_point BETWEEN 0.0 AND 10.0" json:"difficulty_point"` // 0.0 to 10.0
	Point            float64        `gorm:"type:decimal(4,2);not null" json:"point"` // Score/points weight
	
	// Lifecycle tracking
	Status           string         `gorm:"type:varchar(50);not null;default:'draft'" json:"status"` // draft, approved, archived
	UsedCount        int            `gorm:"type:integer;not null;default:0" json:"used_count"`
	CreatedBy        string         `gorm:"type:varchar(100)" json:"created_by,omitempty"`
	
	// Arrays of options and tags
	Tags             []string       `gorm:"serializer:json;type:jsonb" json:"tags,omitempty"`
	Options          []string       `gorm:"serializer:json;type:jsonb" json:"options,omitempty"`
	
	// Answers and detailed solutions
	CorrectAnswer    string         `gorm:"type:text" json:"correct_answer,omitempty"`
	SolutionGuide    string         `gorm:"type:text;not null" json:"solution_guide"`
	
	// Educational prompts
	Hint             string         `gorm:"type:text" json:"hint,omitempty"`
	QuickSolveTips   string         `gorm:"type:text" json:"quick_solve_tips,omitempty"`
	GeneralMethod    string         `gorm:"type:text" json:"general_method,omitempty"`
	Mistakes         string         `gorm:"type:text" json:"mistakes,omitempty"`
	
	// Image assets
	ImageQuestion    string         `gorm:"type:varchar(255)" json:"image_question,omitempty"`
	ImageSolution    string         `gorm:"type:varchar(255)" json:"image_solution,omitempty"`

	// Relationship mapping
	Children         []Question     `gorm:"foreignKey:ParentID" json:"children,omitempty"`
}
