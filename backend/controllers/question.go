package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/modeptrai/exam-model-backend/models"
	"github.com/modeptrai/exam-model-backend/services"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type APIResponse struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

type QuestionController struct {
	DB *gorm.DB
}

func NewQuestionController(db *gorm.DB) *QuestionController {
	return &QuestionController{DB: db}
}

// HandleCreateBulkQuestions tiếp nhận request thêm hàng loạt câu hỏi
func (qc *QuestionController) HandleCreateBulkQuestions(c *gin.Context) {
	var payload []services.QuestionGroupRequest

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, APIResponse{
			Status:  "error",
			Message: "Dữ liệu JSON không hợp lệ hoặc sai định dạng",
			Data:    err.Error(),
		})
		return
	}

	if len(payload) == 0 {
		c.JSON(http.StatusBadRequest, APIResponse{
			Status:  "error",
			Message: "Payload trống. Yêu cầu ít nhất 1 QuestionGroup.",
		})
		return
	}

	err := services.CreateBulkQuestions(qc.DB, payload)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Status:  "error",
			Message: "Không thể lưu dữ liệu vào hệ thống do lỗi nội bộ",
			Data:    err.Error(),
		})
		return
	}

	totalQuestions := 0
	for _, group := range payload {
		totalQuestions += len(group.Questions)
	}

	c.JSON(http.StatusCreated, APIResponse{
		Status:  "success",
		Message: "Thêm mới câu hỏi hàng loạt thành công",
		Data: map[string]int{
			"groups_added":    len(payload),
			"questions_added": totalQuestions,
		},
	})
}

// GetQuestions retrieves a paginated list of questions matching filters and search term q
func (qc *QuestionController) GetQuestions(c *gin.Context) {
	var questions []models.Question
	var total int64

	dbQuery := qc.DB.Model(&models.Question{})

	// Filter by question_group_id
	groupIDQuery := c.Query("question_group_id")
	idsStr := c.Query("ids")

	if groupIDQuery != "" {
		if groupIDQuery == "null" {
			dbQuery = dbQuery.Where("question_group_id IS NULL")
		} else {
			gID, err := strconv.ParseUint(groupIDQuery, 10, 32)
			if err == nil {
				dbQuery = dbQuery.Where("question_group_id = ?", uint(gID))
			}
		}
	}

	// Filter by IDs
	if idsStr != "" {
		ids := strings.Split(idsStr, ",")
		var idInts []uint
		for _, id := range ids {
			if i, err := strconv.ParseUint(id, 10, 32); err == nil {
				idInts = append(idInts, uint(i))
			}
		}
		if len(idInts) > 0 {
			dbQuery = dbQuery.Where("id IN ?", idInts)
		}
	}

	// Filter parameters
	if gradeStr := c.Query("grade"); gradeStr != "" {
		grades := strings.Split(gradeStr, ",")
		var gradeInts []int
		for _, g := range grades {
			if gInt, err := strconv.Atoi(g); err == nil {
				gradeInts = append(gradeInts, gInt)
			}
		}
		if len(gradeInts) > 0 {
			dbQuery = dbQuery.Where("grade IN ?", gradeInts)
		}
	}
	if topicIDStr := c.Query("topic_id"); topicIDStr != "" {
		topics := strings.Split(topicIDStr, ",")
		var topicInts []uint
		for _, t := range topics {
			if tInt, err := strconv.ParseUint(t, 10, 32); err == nil {
				topicInts = append(topicInts, uint(tInt))
			}
		}
		if len(topicInts) > 0 {
			dbQuery = dbQuery.Where("topic_id IN ?", topicInts)
		}
	}
	if diffLevel := c.Query("difficulty_level"); diffLevel != "" {
		levels := strings.Split(diffLevel, ",")
		dbQuery = dbQuery.Where("difficulty_level IN ?", levels)
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
	if err := dbQuery.Preload("TopicRel").Preload("QuestionGroup.Questions").Offset(offset).Limit(limit).Find(&questions).Error; err != nil {
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

// GetQuestion retrieves a single question by ID
func (qc *QuestionController) GetQuestion(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid question ID"})
		return
	}

	var question models.Question
	if err := qc.DB.Preload("TopicRel").Preload("QuestionGroup.Questions").First(&question, uint(id)).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Question not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch question: " + err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, question)
}

type QuestionUpdateInput struct {
	QuestionGroupID  *uint           `json:"question_group_id"`
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
	ImageQuestion    *string         `json:"image_question"`
	ImageSolution    *string         `json:"image_solution"`
	Tags             []string        `json:"tags"`
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

	var input QuestionUpdateInput
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
		optionsBytes, _ := json.Marshal(input.Options)
		question.Options = datatypes.JSON(optionsBytes)
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
	if input.ImageQuestion != nil {
		question.ImageQuestion = input.ImageQuestion
	}
	if input.ImageSolution != nil {
		question.ImageSolution = input.ImageSolution
	}
	if input.Tags != nil {
		tagsBytes, _ := json.Marshal(input.Tags)
		question.Tags = datatypes.JSON(tagsBytes)
	}
	if input.QuestionGroupID != nil {
		question.QuestionGroupID = input.QuestionGroupID
	}
	if input.TypeQuestion != "" {
		question.TypeQuestion = input.TypeQuestion
	}

	if err := qc.DB.Save(&question).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update question: " + err.Error()})
		return
	}

	var responseQuestion models.Question
	if err := qc.DB.Preload("TopicRel").First(&responseQuestion, question.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load updated question: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, responseQuestion)
}

// DeleteQuestion soft-deletes a question
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

	if question.UsedCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Không thể xoá câu hỏi này vì nó đã được sử dụng trong đề thi. Vui lòng chuyển trạng thái sang 'Lưu trữ' (Archived) thay vì xóa."})
		return
	}

	if err := qc.DB.Delete(&question).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete question: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Question soft-deleted successfully"})
}

// GetQuestionGroup retrieves a question group and its questions
func (qc *QuestionController) GetQuestionGroup(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid group ID"})
		return
	}

	var group models.QuestionGroup
	if err := qc.DB.Preload("Questions").First(&group, uint(id)).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Question group not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch question group: " + err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, group)
}

// DeleteQuestionGroup soft-deletes a group and cascades to its questions
func (qc *QuestionController) DeleteQuestionGroup(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid group ID"})
		return
	}

	var group models.QuestionGroup
	if err := qc.DB.Preload("Questions").First(&group, uint(id)).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Question group not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find question group: " + err.Error()})
		}
		return
	}

	for _, q := range group.Questions {
		if q.UsedCount > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Không thể xoá nhóm câu hỏi này vì có ít nhất một câu hỏi bên trong đã được sử dụng trong đề thi. Vui lòng chuyển trạng thái sang 'Lưu trữ' (Archived)."})
			return
		}
	}

	if err := qc.DB.Select("Questions").Delete(&group).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete question group: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Question group soft-deleted successfully"})
}

// UpdateQuestionGroup updates a question group and its questions
func (qc *QuestionController) UpdateQuestionGroup(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid group ID"})
		return
	}

	var payload services.QuestionGroupRequest
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data: " + err.Error()})
		return
	}

	if err := services.UpdateQuestionGroup(qc.DB, uint(id), payload); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update question group: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Question group updated successfully"})
}
