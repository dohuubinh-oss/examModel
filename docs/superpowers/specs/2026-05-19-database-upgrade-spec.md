# Design Specification: Database Models Upgrades

This document details the database schema upgrades for the **ToanThucChien** Go backend. It includes proposals for future features as requested, as well as the immediate specifications for the `Topic` model and `StudentAnswer` enhancements.

---

## 🌟 Future Upgrades (Archived Proposals)

The following proposals are saved here for future reference when upgrading LMS capabilities:

### 1. Classroom & Student Enrollment
*   **Purpose:** Support grouping students into classrooms under a teacher.
*   **Schema Proposal:**
    ```go
    type Classroom struct {
        ID          uint           `gorm:"primaryKey" json:"id"`
        CreatedAt   time.Time      `json:"created_at"`
        UpdatedAt   time.Time      `json:"updated_at"`
        DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
        Name        string         `gorm:"type:varchar(150);not null" json:"name"`
        Grade       int            `gorm:"type:integer;not null" json:"grade"`
        InviteCode  string         `gorm:"type:varchar(50);uniqueIndex" json:"invite_code"`
        TeacherID   uint           `gorm:"not null" json:"teacher_id"`
        Teacher     User           `gorm:"constraint:OnDelete:RESTRICT;" json:"-"`
        Students    []User         `gorm:"many2many:classroom_students;" json:"students,omitempty"`
    }
    ```

### 2. Exam Assignment & Tracking
*   **Purpose:** Giao đề thi for a classroom or individual student with deadlines.
*   **Schema Proposal:**
    ```go
    type ExamAssignment struct {
        ID          uint           `gorm:"primaryKey" json:"id"`
        CreatedAt   time.Time      `json:"created_at"`
        UpdatedAt   time.Time      `json:"updated_at"`
        DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
        ExamID      uint           `gorm:"not null" json:"exam_id"`
        Exam        Exam           `gorm:"constraint:OnDelete:CASCADE;" json:"-"`
        ClassroomID *uint          `json:"classroom_id,omitempty"`
        StudentID   *uint          `json:"student_id,omitempty"`
        DueDate     time.Time      `json:"due_date"`
        MaxAttempts int            `gorm:"type:integer;default:1" json:"max_attempts"`
        Status      string         `gorm:"type:varchar(50);default:'active'" json:"status"`
    }
    ```

### 3. Question Change Log & History
*   **Purpose:** Audit trail for modifications made to questions.
*   **Schema Proposal:**
    ```go
    type QuestionHistory struct {
        ID          uint      `gorm:"primaryKey" json:"id"`
        QuestionID  uint      `gorm:"not null;index" json:"question_id"`
        Content     string    `gorm:"type:text;not null" json:"content"`
        Options     []string  `gorm:"serializer:json;type:jsonb" json:"options,omitempty"`
        EditedBy    string    `gorm:"type:varchar(100);not null" json:"edited_by"`
        EditedAt    time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"edited_at"`
        Comment     string    `gorm:"type:varchar(255)" json:"comment,omitempty"`
    }
    ```

---

## 🛠️ Immediate Upgrades (For This Iteration)

### 1. Topic / Category Model
*   **Files:**
    *   [NEW] `backend/models/topic.go`
    *   [MODIFY] `backend/models/question.go`
*   **Description:** Supports nested topics (e.g. Maths -> Algebra -> Logarithm) with a self-referencing relationship.
*   **Database Schema:**
    ```go
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

        Parent    *Topic         `gorm:"foreignKey:ParentID;constraint:OnDelete:SET NULL;" json:"parent,omitempty"`
        Children  []Topic        `gorm:"foreignKey:ParentID" json:"children,omitempty"`
    }
    ```

*   **Question Entity Modification:**
    Add `TopicID` and `TopicRel` to `models.Question` to support relational integrity. Keep the existing text-based `Topic` field as a semantic cache or fallback.
    ```go
    // In backend/models/question.go:
    type Question struct {
        // ... existing fields
        TopicID          *uint          `gorm:"index" json:"topic_id,omitempty"`
        TopicRel         *Topic         `gorm:"foreignKey:TopicID;constraint:OnDelete:SET NULL;" json:"topic_rel,omitempty"`
        // ... existing fields
    }
    ```

### 2. StudentAnswer Grading Enhancements (in `models.TestResult`)
*   **Files:**
    *   [MODIFY] `backend/models/test_result.go`
*   **Description:** Expand the inline `StudentAnswer` struct within `TestResult` to support essay grading annotations and feedback.
*   **Database Schema Change:**
    ```go
    // In backend/models/test_result.go:
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
    ```

---

## 🧪 Verification Plan

### 1. Auto-Migration & DB Schema
*   Update backend `main.go` auto-migration call to include `&models.Topic{}`.
*   Verify that `models.Question` can be successfully compiled and migrated with `TopicID`.

### 2. TDD Tests
*   **Test Case 1 (`TestTopicCRUD`):** Verify `Topic` model creation, parent-child query preloading, and Slug uniqueness.
*   **Test Case 2 (`TestStudentAnswerGradingFields`):** Verify that GORM correctly serializes and deserializes the new `TeacherComment`, `AnnotationsData`, and `GradedBy` fields inside `TestResult` answers.
