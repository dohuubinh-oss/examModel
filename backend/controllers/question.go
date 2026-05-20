package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/modeptrai/exam-model-backend/models"
	"gorm.io/gorm"
)

type QuestionController struct {
	DB *gorm.DB
}

func NewQuestionController(db *gorm.DB) *QuestionController {
	return &QuestionController{DB: db}
}

type QuestionInput struct {
	ParentID         *uint           `json:"parent_id"`
	TypeQuestion     string          `json:"type_question"`
	Content          string          `json:"content"`
	Type             string          `json:"type"`
	Grade            int             `json:"grade"`
	Topic            string          `json:"topic"`
	TopicID          *uint           `json:"topic_id"`
	DifficultyLevel  string          `json:"difficulty_level"`
	DifficultyPoint  float64         `json:"difficulty_point"`
	Point            float64         `json:"point"`
	Status           string          `json:"status"`
	Options          []string        `json:"options"`
	CorrectAnswer    string          `json:"correct_answer"`
	SolutionGuide    string          `json:"solution_guide"`
	Hint             string          `json:"hint"`
	QuickSolveTips   string          `json:"quick_solve_tips"`
	GeneralMethod    string          `json:"general_method"`
	Mistakes         string          `json:"mistakes"`
	ImageQuestion    string          `json:"image_question"`
	ImageSolution    string          `json:"image_solution"`
	Tags             []string        `json:"tags"`
	Children         []QuestionInput `json:"children"`
}

// GetQuestions retrieves a paginated list of questions matching filters and search term q
func (qc *QuestionController) GetQuestions(c *gin.Context) {
	var questions []models.Question
	var total int64

	dbQuery := qc.DB.Model(&models.Question{})

	// Filter by parent_id. If omitted, default to parent_id IS NULL to avoid listing children questions.
	parentIDQuery := c.Query("parent_id")
	if parentIDQuery == "" {
		dbQuery = dbQuery.Where("parent_id IS NULL")
	} else if parentIDQuery != "all" {
		if parentIDQuery == "null" {
			dbQuery = dbQuery.Where("parent_id IS NULL")
		} else {
			pID, err := strconv.ParseUint(parentIDQuery, 10, 32)
			if err == nil {
				dbQuery = dbQuery.Where("parent_id = ?", uint(pID))
			}
		}
	}

	// Filter parameters
	if gradeStr := c.Query("grade"); gradeStr != "" {
		if grade, err := strconv.Atoi(gradeStr); err == nil {
			dbQuery = dbQuery.Where("grade = ?", grade)
		}
	}
	if topicIDStr := c.Query("topic_id"); topicIDStr != "" {
		if topicID, err := strconv.ParseUint(topicIDStr, 10, 32); err == nil {
			dbQuery = dbQuery.Where("topic_id = ?", uint(topicID))
		}
	}
	if diffLevel := c.Query("difficulty_level"); diffLevel != "" {
		dbQuery = dbQuery.Where("difficulty_level = ?", diffLevel)
	}
	if qType := c.Query("type"); qType != "" {
		dbQuery = dbQuery.Where("type = ?", qType)
	}
	if typeQuestion := c.Query("type_question"); typeQuestion != "" {
		dbQuery = dbQuery.Where("type_question = ?", typeQuestion)
	}
	if status := c.Query("status"); status != "" {
		dbQuery = dbQuery.Where("status = ?", status)
	}

	// Search keyword q
	if q := c.Query("q"); q != "" {
		pattern := "%" + q + "%"
		dbQuery = dbQuery.Where("content ILIKE ? OR tags::text ILIKE ?", pattern, pattern)
	}

	// Count total matching records
	if err := dbQuery.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count questions: " + err.Error()})
		return
	}

	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	// Fetch data
	if err := dbQuery.Preload("TopicRel").Preload("Children").Offset(offset).Limit(limit).Find(&questions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch questions: " + err.Error()})
		return
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))
	if totalPages == 0 {
		totalPages = 1
	}

	c.JSON(http.StatusOK, gin.H{
		"data": questions,
		"pagination": gin.H{
			"total":       total,
			"page":        page,
			"limit":       limit,
			"total_pages": totalPages,
		},
	})
}

// GetQuestion retrieves a single question by ID with children and topic preloaded
func (qc *QuestionController) GetQuestion(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid question ID"})
		return
	}

	var question models.Question
	if err := qc.DB.Preload("TopicRel").Preload("Children").First(&question, uint(id)).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Question not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch question: " + err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, question)
}

// CreateQuestions creates a question (single or group package with nested children in a transaction)
func (qc *QuestionController) CreateQuestions(c *gin.Context) {
	var input QuestionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data: " + err.Error()})
		return
	}

	// Validate inputs
	if input.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Question content cannot be empty"})
		return
	}
	if input.Type != "Trắc nghiệm" && input.Type != "Tự luận" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Question type must be 'Trắc nghiệm' or 'Tự luận'"})
		return
	}
	if input.TypeQuestion == "" {
		input.TypeQuestion = "single"
	}
	if input.TypeQuestion != "single" && input.TypeQuestion != "group" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "TypeQuestion must be 'single' or 'group'"})
		return
	}
	if input.Grade < 5 || input.Grade > 10 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Grade must be between 5 and 10"})
		return
	}
	if input.DifficultyLevel == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Difficulty level is required"})
		return
	}
	if input.Status == "" {
		input.Status = "draft"
	}

	tx := qc.DB.Begin()

	parent := models.Question{
		ParentID:         input.ParentID,
		TypeQuestion:     input.TypeQuestion,
		Content:          input.Content,
		Type:             input.Type,
		Grade:            input.Grade,
		Topic:            input.Topic,
		TopicID:          input.TopicID,
		DifficultyLevel:  input.DifficultyLevel,
		DifficultyPoint:  input.DifficultyPoint,
		Point:            input.Point,
		Status:           input.Status,
		Options:          input.Options,
		CorrectAnswer:    input.CorrectAnswer,
		SolutionGuide:    input.SolutionGuide,
		Hint:             input.Hint,
		QuickSolveTips:   input.QuickSolveTips,
		GeneralMethod:    input.GeneralMethod,
		Mistakes:         input.Mistakes,
		ImageQuestion:    input.ImageQuestion,
		ImageSolution:    input.ImageSolution,
		Tags:             input.Tags,
	}

	if err := tx.Create(&parent).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create question: " + err.Error()})
		return
	}

	// Create nested children if provided
	if input.TypeQuestion == "group" && len(input.Children) > 0 {
		for _, childInput := range input.Children {
			child := models.Question{
				ParentID:         &parent.ID,
				TypeQuestion:     "single",
				Content:          childInput.Content,
				Type:             childInput.Type,
				Grade:            childInput.Grade,
				Topic:            childInput.Topic,
				TopicID:          childInput.TopicID,
				DifficultyLevel:  childInput.DifficultyLevel,
				DifficultyPoint:  childInput.DifficultyPoint,
				Point:            childInput.Point,
				Status:           parent.Status, // Inherit parent status
				Options:          childInput.Options,
				CorrectAnswer:    childInput.CorrectAnswer,
				SolutionGuide:    childInput.SolutionGuide,
				Hint:             childInput.Hint,
				QuickSolveTips:   childInput.QuickSolveTips,
				GeneralMethod:    childInput.GeneralMethod,
				Mistakes:         childInput.Mistakes,
				ImageQuestion:    childInput.ImageQuestion,
				ImageSolution:    childInput.ImageSolution,
				Tags:             childInput.Tags,
			}
			if err := tx.Create(&child).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create child question: " + err.Error()})
				return
			}
		}
	}

	tx.Commit()

	// Preload to return fully populated response
	var responseQuestion models.Question
	if err := qc.DB.Preload("TopicRel").Preload("Children").First(&responseQuestion, parent.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load created question: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, responseQuestion)
}

// UpdateQuestion updates an existing question
func (qc *QuestionController) UpdateQuestion(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid question ID"})
		return
	}

	var question models.Question
	if err := qc.DB.First(&question, uint(id)).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Question not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find question: " + err.Error()})
		}
		return
	}

	var input QuestionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data: " + err.Error()})
		return
	}

	// Update permitted fields if provided
	if input.Content != "" {
		question.Content = input.Content
	}
	if input.Type != "" {
		question.Type = input.Type
	}
	if input.Grade != 0 {
		question.Grade = input.Grade
	}
	if input.Topic != "" {
		question.Topic = input.Topic
	}
	if input.TopicID != nil {
		question.TopicID = input.TopicID
	}
	if input.DifficultyLevel != "" {
		question.DifficultyLevel = input.DifficultyLevel
	}
	if input.DifficultyPoint != 0 {
		question.DifficultyPoint = input.DifficultyPoint
	}
	if input.Point != 0 {
		question.Point = input.Point
	}
	if input.Status != "" {
		question.Status = input.Status
	}
	if input.Options != nil {
		question.Options = input.Options
	}
	if input.CorrectAnswer != "" {
		question.CorrectAnswer = input.CorrectAnswer
	}
	if input.SolutionGuide != "" {
		question.SolutionGuide = input.SolutionGuide
	}
	if input.Hint != "" {
		question.Hint = input.Hint
	}
	if input.QuickSolveTips != "" {
		question.QuickSolveTips = input.QuickSolveTips
	}
	if input.GeneralMethod != "" {
		question.GeneralMethod = input.GeneralMethod
	}
	if input.Mistakes != "" {
		question.Mistakes = input.Mistakes
	}
	if input.ImageQuestion != "" {
		question.ImageQuestion = input.ImageQuestion
	}
	if input.ImageSolution != "" {
		question.ImageSolution = input.ImageSolution
	}
	if input.Tags != nil {
		question.Tags = input.Tags
	}

	if err := qc.DB.Save(&question).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update question: " + err.Error()})
		return
	}

	// Return updated with relations preloaded
	var responseQuestion models.Question
	if err := qc.DB.Preload("TopicRel").Preload("Children").First(&responseQuestion, question.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load updated question: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, responseQuestion)
}

// DeleteQuestion soft-deletes a question and cascades to children
func (qc *QuestionController) DeleteQuestion(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid question ID"})
		return
	}

	var question models.Question
	if err := qc.DB.First(&question, uint(id)).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Question not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find question: " + err.Error()})
		}
		return
	}

	tx := qc.DB.Begin()

	// Soft delete child questions cascadingly
	if err := tx.Where("parent_id = ?", question.ID).Delete(&models.Question{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cascade delete children: " + err.Error()})
		return
	}

	// Soft delete the parent question itself
	if err := tx.Delete(&question).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete question: " + err.Error()})
		return
	}

	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "Question and its children soft-deleted successfully"})
}
