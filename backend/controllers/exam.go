package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/modeptrai/exam-model-backend/models"
	"gorm.io/gorm"
)

type ExamController struct {
	DB *gorm.DB
}

func NewExamController(db *gorm.DB) *ExamController {
	return &ExamController{DB: db}
}

type CreateExamInput struct {
	Title       string  `json:"title" binding:"required"`
	ExamCode    string  `json:"exam_code" binding:"required"`
	Duration    int     `json:"duration" binding:"required,gt=0"`
	Grade       int     `json:"grade" binding:"required,gte=5,lte=10"`
	TotalScore  float64 `json:"total_score"`
	QuestionIDs []uint  `json:"question_ids" binding:"required,min=1"`
}

func (ctrl *ExamController) CreateExam(c *gin.Context) {
	var input CreateExamInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Transaction to create Exam and ExamQuestions
	err := ctrl.DB.Transaction(func(tx *gorm.DB) error {
		// 1. Create Exam
		exam := models.Exam{
			Title:      input.Title,
			ExamCode:   input.ExamCode,
			Duration:   input.Duration,
			Grade:      input.Grade,
			TotalScore: input.TotalScore,
			Status:     "published",
		}

		if err := tx.Create(&exam).Error; err != nil {
			return err
		}

		// 2. Create ExamQuestions
		for i, qID := range input.QuestionIDs {
			eq := models.ExamQuestion{
				ExamID:      exam.ID,
				QuestionID:  qID,
				OrderNumber: i + 1,
			}
			if err := tx.Create(&eq).Error; err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create exam: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Exam created successfully"})
}

type ExamResponse struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	UpdatedText    string `json:"updatedText"`
	Grade          string `json:"grade"`
	QuestionsCount int    `json:"questionsCount"`
	Duration       string `json:"duration"`
	Status         string `json:"status"`
	IconType       string `json:"iconType"`
}

// GetExams returns the list of all exams
func (ctrl *ExamController) GetExams(c *gin.Context) {
	var exams []models.Exam
	// Preload Questions to count them
	if err := ctrl.DB.Preload("Questions").Order("created_at desc").Find(&exams).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch exams"})
		return
	}

	var response []ExamResponse
	for _, exam := range exams {
		response = append(response, ExamResponse{
			ID:             fmt.Sprintf("%d", exam.ID),
			Name:           exam.Title,
			UpdatedText:    "Cập nhật " + exam.UpdatedAt.Format("02/01/2006"),
			Grade:          fmt.Sprintf("%d", exam.Grade),
			QuestionsCount: len(exam.Questions),
			Duration:       fmt.Sprintf("%d phút", exam.Duration),
			Status:         exam.Status,
			IconType:       "calculate",
		})
	}

	// Make sure response is an empty array instead of null when empty
	if response == nil {
		response = []ExamResponse{}
	}

	c.JSON(http.StatusOK, response)
}

// DeleteExam soft-deletes an exam.
func (ctrl *ExamController) DeleteExam(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&models.Exam{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete exam"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Exam deleted successfully"})
}

// GetExamByID fetches a single exam and its questions
func (ctrl *ExamController) GetExamByID(c *gin.Context) {
	id := c.Param("id")
	var exam models.Exam
	if err := ctrl.DB.Preload("Questions").First(&exam, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Exam not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch exam"})
		return
	}
	c.JSON(http.StatusOK, exam)
}
