package models

import (
	"time"

	"gorm.io/gorm"
)

type Topic struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Name      string         `gorm:"type:varchar(150);not null" json:"name"`
	Slug      string         `gorm:"type:varchar(150);uniqueIndex;not null" json:"slug"`
	ParentID  *uint          `gorm:"index" json:"parent_id,omitempty"`
	Grade     int            `gorm:"type:integer;not null;check:grade BETWEEN 5 AND 10" json:"grade"`
	Subject   string         `gorm:"type:varchar(100);not null" json:"subject"`

	// Relationships
	Parent    *Topic         `gorm:"foreignKey:ParentID;constraint:OnDelete:SET NULL;" json:"parent,omitempty"`
	Children  []Topic        `gorm:"foreignKey:ParentID" json:"children,omitempty"`
}
