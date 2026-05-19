package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
	
	Username     string         `gorm:"type:varchar(100);uniqueIndex;not null" json:"username"`
	Email        *string        `gorm:"type:varchar(150);uniqueIndex" json:"email,omitempty"`
	PhoneNumber  *string        `gorm:"type:varchar(20);uniqueIndex" json:"phone_number,omitempty"`
	PasswordHash string         `gorm:"type:varchar(255);not null" json:"-"`
	FullName     string         `gorm:"type:varchar(150);not null" json:"full_name"`
	AvatarUrl    string         `gorm:"type:varchar(255)" json:"avatar_url,omitempty"`
	
	Role         string         `gorm:"type:varchar(50);not null;default:'student';check:role IN ('admin','teacher','student')" json:"role"`
	Grade        *int           `gorm:"type:integer;check:grade IS NULL OR (grade BETWEEN 5 AND 10)" json:"grade,omitempty"` // For student: 5..10
	Status       string         `gorm:"type:varchar(50);not null;default:'active';check:status IN ('active','inactive','blocked')" json:"status"`
	
	LastLoginAt  *time.Time     `json:"last_login_at,omitempty"`
}

// HashPassword hashes a raw password string using bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPasswordHash compares a raw password with u.PasswordHash
func (u *User) CheckPasswordHash(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
	return err == nil
}

// BeforeCreate GORM hook to hash password before creation
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.PasswordHash != "" {
		hashed, err := HashPassword(u.PasswordHash)
		if err != nil {
			return err
		}
		u.PasswordHash = hashed
	}
	return nil
}

// BeforeUpdate GORM hook to hash password before update if it was modified
func (u *User) BeforeUpdate(tx *gorm.DB) (err error) {
	if tx.Statement.Changed("PasswordHash") && u.PasswordHash != "" {
		hashed, err := HashPassword(u.PasswordHash)
		if err != nil {
			return err
		}
		u.PasswordHash = hashed
	}
	return nil
}
