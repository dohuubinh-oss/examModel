package controllers_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/modeptrai/exam-model-backend/controllers"
	"github.com/modeptrai/exam-model-backend/models"
)

func setupQuestionRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	questionCtrl := controllers.NewQuestionController(testDB)
	v1 := r.Group("/api/v1")
	{
		v1.GET("/questions", questionCtrl.GetQuestions)
		v1.GET("/questions/:id", questionCtrl.GetQuestion)
		v1.POST("/questions/bulk", questionCtrl.HandleCreateBulkQuestions)
		v1.PUT("/questions/:id", questionCtrl.UpdateQuestion)
		v1.DELETE("/questions/:id", questionCtrl.DeleteQuestion)
		
		v1.GET("/question-groups/:id", questionCtrl.GetQuestionGroup)
		v1.PUT("/question-groups/:id", questionCtrl.UpdateQuestionGroup)
		v1.DELETE("/question-groups/:id", questionCtrl.DeleteQuestionGroup)
	}

	return r
}

func TestQuestionAPI(t *testing.T) {
	// Auto-migrate models
	err := testDB.AutoMigrate(&models.Topic{}, &models.QuestionGroup{}, &models.Question{})
	if err != nil {
		t.Fatalf("failed to auto-migrate: %v", err)
	}

	router := setupQuestionRouter()

	// Seed one topic to link questions
	topic := models.Topic{
		Name:    "Hàm số bậc hai",
		Slug:    "lop-9-ham-so-bac-hai",
		Grade:   9,
		Subject: "Toán",
	}
	if err := testDB.Create(&topic).Error; err != nil {
		t.Fatalf("failed to seed test topic: %v", err)
	}
	defer func() {
		testDB.Exec("TRUNCATE TABLE topics RESTART IDENTITY CASCADE")
		testDB.Exec("TRUNCATE TABLE question_groups RESTART IDENTITY CASCADE")
		testDB.Exec("TRUNCATE TABLE questions RESTART IDENTITY CASCADE")
	}()

	// 1. Create a bulk request
	t.Run("POST /api/v1/questions/bulk - Bulk Create", func(t *testing.T) {
		reqBody := []map[string]interface{}{
			{
				"shared_content": "Chùm câu hỏi thứ nhất",
				"questions": []map[string]interface{}{
					{
						"type_question":    "single",
						"content":          "Tìm tọa độ đỉnh của parabol $y = x^2 - 4x + 3$.",
						"type":             "Trắc nghiệm",
						"grade":            9,
						"topic":            "Hàm số bậc hai",
						"topic_id":         topic.ID,
						"difficulty_level": "Nhận biết",
						"difficulty_point": 3.0,
						"point":            0.25,
						"status":           "approved",
						"options":          []string{"A. (2, -1)", "B. (-2, 15)", "C. (2, 3)", "D. (0, 3)"},
						"correct_answer":   "A. (2, -1)",
						"solution_guide":   "Tọa độ đỉnh $I(-b/(2a), -\\Delta/(4a))$.",
						"tags":             []string{"hàm số", "parabol", "đỉnh"},
					},
				},
			},
			{
				"shared_content": "Cho parabol $(P): y = x^2 - 2x - 3$. Trả lời các câu hỏi sau:",
				"questions": []map[string]interface{}{
					{
						"type_question":    "single",
						"content":          "Trục đối xứng của parabol $(P)$ là đường thẳng nào?",
						"type":             "Trắc nghiệm",
						"grade":            9,
						"topic":            "Hàm số bậc hai",
						"topic_id":         topic.ID,
						"difficulty_level": "Nhận biết",
						"difficulty_point": 2.0,
						"point":            0.5,
						"options":          []string{"A. x = 1", "B. x = -1", "C. x = 2", "D. x = -2"},
						"correct_answer":   "A. x = 1",
						"solution_guide":   "Trục đối xứng là $x = -b/(2a) = 2/2 = 1$.",
					},
					{
						"type_question":    "single",
						"content":          "Tìm tọa độ các giao điểm của $(P)$ với trục hoành.",
						"type":             "Trắc nghiệm",
						"grade":            9,
						"topic":            "Hàm số bậc hai",
						"topic_id":         topic.ID,
						"difficulty_level": "Thông hiểu",
						"difficulty_point": 4.0,
						"point":            0.5,
						"options":          []string{"A. (-1, 0) và (3, 0)", "B. (1, 0) và (-3, 0)", "C. (0, -3)", "D. Không cắt"},
						"correct_answer":   "A. (-1, 0) và (3, 0)",
						"solution_guide":   "Giải phương trình $x^2 - 2x - 3 = 0 \\Leftrightarrow x = -1$ hoặc $x = 3$.",
					},
				},
			},
		}

		jsonBytes, _ := json.Marshal(reqBody)
		req, _ := http.NewRequest("POST", "/api/v1/questions/bulk", bytes.NewBuffer(jsonBytes))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusCreated {
			t.Fatalf("expected status 201 Created, got %d. Body: %s", w.Code, w.Body.String())
		}
	})

	var group models.QuestionGroup
	if err := testDB.Preload("Questions").First(&group).Error; err != nil {
		t.Fatalf("failed to query group: %v", err)
	}

	var firstQuestion models.Question
	if err := testDB.First(&firstQuestion).Error; err != nil {
		t.Fatalf("failed to query question: %v", err)
	}

	// 2. Query questions list with search keyword q, filters, and pagination
	t.Run("GET /api/v1/questions - Filters, Search & Pagination", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/v1/questions?grade=9&limit=5", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected status 200 OK, got %d", w.Code)
		}

		var result struct {
			Data       []models.Question `json:"data"`
			Pagination struct {
				Total      int64 `json:"total"`
				Page       int   `json:"page"`
				Limit      int   `json:"limit"`
				TotalPages int   `json:"total_pages"`
			} `json:"pagination"`
		}

		if err := json.Unmarshal(w.Body.Bytes(), &result); err != nil {
			t.Fatalf("failed to unmarshal JSON response: %v", err)
		}

		// Total of 3 questions were created
		if result.Pagination.Total != 3 {
			t.Errorf("expected 3 total questions, got %d", result.Pagination.Total)
		}
	})

	// 3. Update Question Group
	t.Run("PUT /api/v1/question-groups/:id - Update Group", func(t *testing.T) {
		reqBody := map[string]interface{}{
			"shared_content": "Chùm câu hỏi đã cập nhật",
			"questions": []map[string]interface{}{
				{
					"id":               group.Questions[0].ID,
					"type_question":    "single",
					"content":          "Câu hỏi con 1 đã cập nhật",
					"type":             "Trắc nghiệm",
					"grade":            9,
					"topic":            "Hàm số bậc hai",
					"difficulty_level": "Nhận biết",
				},
				{
					"type_question":    "single",
					"content":          "Câu hỏi con mới thêm",
					"type":             "Trắc nghiệm",
					"grade":            9,
					"topic":            "Hàm số bậc hai",
					"difficulty_level": "Thông hiểu",
				},
			},
		}

		jsonBytes, _ := json.Marshal(reqBody)
		req, _ := http.NewRequest("PUT", fmt.Sprintf("/api/v1/question-groups/%d", group.ID), bytes.NewBuffer(jsonBytes))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected status 200 OK, got %d. Body: %s", w.Code, w.Body.String())
		}

		var updatedGroup models.QuestionGroup
		if err := testDB.Preload("Questions").First(&updatedGroup, group.ID).Error; err != nil {
			t.Fatalf("failed to fetch updated group: %v", err)
		}

		if updatedGroup.SharedContent != "Chùm câu hỏi đã cập nhật" {
			t.Errorf("expected SharedContent to be updated, got %s", updatedGroup.SharedContent)
		}
		
		if len(updatedGroup.Questions) != 2 {
			t.Errorf("expected exactly 2 child questions, got %d", len(updatedGroup.Questions))
		}
	})

	// 4. Delete questions and groups with UsedCount > 0
	t.Run("DELETE /api/v1/questions/:id - Prevent Deletion if UsedCount > 0", func(t *testing.T) {
		// Set UsedCount to 1 for the first question
		testDB.Model(&firstQuestion).Update("used_count", 1)

		req, _ := http.NewRequest("DELETE", fmt.Sprintf("/api/v1/questions/%d", firstQuestion.ID), nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusBadRequest {
			t.Fatalf("expected status 400 Bad Request, got %d. Body: %s", w.Code, w.Body.String())
		}
	})

	t.Run("DELETE /api/v1/question-groups/:id - Prevent Deletion if child UsedCount > 0", func(t *testing.T) {
		req, _ := http.NewRequest("DELETE", fmt.Sprintf("/api/v1/question-groups/%d", group.ID), nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusBadRequest {
			t.Fatalf("expected status 400 Bad Request, got %d. Body: %s", w.Code, w.Body.String())
		}

		// Reset UsedCount to 0 for subsequent tests
		testDB.Model(&firstQuestion).Update("used_count", 0)
	})

	// 5. Delete group question (Verifies soft delete cascade)
	t.Run("DELETE /api/v1/question-groups/:id - Cascade Soft Delete", func(t *testing.T) {
		req, _ := http.NewRequest("DELETE", fmt.Sprintf("/api/v1/question-groups/%d", group.ID), nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected status 200 OK, got %d", w.Code)
		}

		// Verify parent is soft-deleted (non-existent via normal query)
		var checkGroup models.QuestionGroup
		if err := testDB.First(&checkGroup, group.ID).Error; err == nil {
			t.Errorf("expected group to be soft-deleted, but found in normal query")
		}

		// Verify children are also soft-deleted
		for _, child := range group.Questions {
			var checkChild models.Question
			if err := testDB.First(&checkChild, child.ID).Error; err == nil {
				t.Errorf("expected child question %d to be soft-deleted, but found in normal query", child.ID)
			}
		}
	})
}
