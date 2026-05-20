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
		v1.POST("/questions", questionCtrl.CreateQuestions)
		v1.PUT("/questions/:id", questionCtrl.UpdateQuestion)
		v1.DELETE("/questions/:id", questionCtrl.DeleteQuestion)
	}

	return r
}

func TestQuestionAPI(t *testing.T) {
	// Auto-migrate models
	err := testDB.AutoMigrate(&models.Topic{}, &models.Question{})
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
		testDB.Exec("TRUNCATE TABLE questions RESTART IDENTITY CASCADE")
	}()

	var singleQuestionID uint
	var groupQuestionID uint
	var childQuestionIDs []uint

	// 1. Create a single multiple-choice question (MCQ)
	t.Run("POST /api/v1/questions - Single MCQ", func(t *testing.T) {
		reqBody := map[string]interface{}{
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
		}

		jsonBytes, _ := json.Marshal(reqBody)
		req, _ := http.NewRequest("POST", "/api/v1/questions", bytes.NewBuffer(jsonBytes))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusCreated {
			t.Fatalf("expected status 201 Created, got %d. Body: %s", w.Code, w.Body.String())
		}

		var created map[string]interface{}
		if err := json.Unmarshal(w.Body.Bytes(), &created); err != nil {
			t.Fatalf("failed to unmarshal JSON response: %v", err)
		}

		singleQuestionID = uint(created["id"].(float64))
		if singleQuestionID == 0 {
			t.Errorf("expected generated question ID > 0, got %d", singleQuestionID)
		}
	})

	// 2. Create a group question (passage with nested children)
	t.Run("POST /api/v1/questions - Group Question with Children", func(t *testing.T) {
		reqBody := map[string]interface{}{
			"type_question":    "group",
			"content":          "Cho parabol $(P): y = x^2 - 2x - 3$. Trả lời các câu hỏi sau:",
			"type":             "Trắc nghiệm",
			"grade":            9,
			"topic":            "Hàm số bậc hai",
			"topic_id":         topic.ID,
			"difficulty_level": "Thông hiểu",
			"difficulty_point": 5.0,
			"point":            1.0,
			"status":           "approved",
			"solution_guide":   "Hướng dẫn giải chung cho nhóm câu hỏi.",
			"tags":             []string{"hàm số bậc hai", "đồ thị"},
			"children": []map[string]interface{}{
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
		}

		jsonBytes, _ := json.Marshal(reqBody)
		req, _ := http.NewRequest("POST", "/api/v1/questions", bytes.NewBuffer(jsonBytes))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusCreated {
			t.Fatalf("expected status 201 Created, got %d. Body: %s", w.Code, w.Body.String())
		}

		var created map[string]interface{}
		if err := json.Unmarshal(w.Body.Bytes(), &created); err != nil {
			t.Fatalf("failed to unmarshal JSON response: %v", err)
		}

		groupQuestionID = uint(created["id"].(float64))
		childrenRaw := created["children"].([]interface{})
		if len(childrenRaw) != 2 {
			t.Fatalf("expected 2 children, got %d", len(childrenRaw))
		}

		for _, ch := range childrenRaw {
			childMap := ch.(map[string]interface{})
			childQuestionIDs = append(childQuestionIDs, uint(childMap["id"].(float64)))
			parentIdVal := uint(childMap["parent_id"].(float64))
			if parentIdVal != groupQuestionID {
				t.Errorf("expected parent_id to be %d, got %d", groupQuestionID, parentIdVal)
			}
		}
	})

	// 3. Get Single Question details with preloaded relation and children
	t.Run("GET /api/v1/questions/:id - Preloads", func(t *testing.T) {
		req, _ := http.NewRequest("GET", fmt.Sprintf("/api/v1/questions/%d", groupQuestionID), nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected status 200 OK, got %d", w.Code)
		}

		var q models.Question
		if err := json.Unmarshal(w.Body.Bytes(), &q); err != nil {
			t.Fatalf("failed to unmarshal JSON response: %v", err)
		}

		if len(q.Children) != 2 {
			t.Errorf("expected 2 preloaded children, got %d", len(q.Children))
		}

		if q.TopicRel == nil || q.TopicRel.ID != topic.ID {
			t.Errorf("expected preloaded topic relation to be present, got %v", q.TopicRel)
		}
	})

	// 4. Update single question
	t.Run("PUT /api/v1/questions/:id", func(t *testing.T) {
		reqBody := map[string]interface{}{
			"content":          "Tìm tọa độ đỉnh của parabol $y = x^2 - 4x + 3$. [Đã cập nhật]",
			"tags":             []string{"hàm số", "parabol", "đỉnh", "cơ bản"},
			"difficulty_point": 3.5,
			"point":            0.3,
		}

		jsonBytes, _ := json.Marshal(reqBody)
		req, _ := http.NewRequest("PUT", fmt.Sprintf("/api/v1/questions/%d", singleQuestionID), bytes.NewBuffer(jsonBytes))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected status 200 OK, got %d. Body: %s", w.Code, w.Body.String())
		}

		var updated models.Question
		if err := json.Unmarshal(w.Body.Bytes(), &updated); err != nil {
			t.Fatalf("failed to unmarshal JSON response: %v", err)
		}

		if updated.Content != "Tìm tọa độ đỉnh của parabol $y = x^2 - 4x + 3$. [Đã cập nhật]" {
			t.Errorf("expected updated content, got %s", updated.Content)
		}

		if len(updated.Tags) != 4 || updated.Tags[3] != "cơ bản" {
			t.Errorf("expected updated tags count 4, got %v", updated.Tags)
		}
	})

	// 5. Query questions list with search keyword q, filters, and pagination
	t.Run("GET /api/v1/questions - Filters, Search & Pagination", func(t *testing.T) {
		// Search for keyword "parabol"
		req, _ := http.NewRequest("GET", "/api/v1/questions?q=parabol&grade=9&limit=5", nil)
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

		// Both single and group parent questions match "parabol" in content/tags
		if result.Pagination.Total != 2 {
			t.Errorf("expected 2 total questions, got %d", result.Pagination.Total)
		}

		if len(result.Data) != 2 {
			t.Errorf("expected 2 questions in list, got %d", len(result.Data))
		}
	})

	// 6. Delete group question (Verifies soft delete cascade)
	t.Run("DELETE /api/v1/questions/:id - Cascade Soft Delete", func(t *testing.T) {
		req, _ := http.NewRequest("DELETE", fmt.Sprintf("/api/v1/questions/%d", groupQuestionID), nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected status 200 OK, got %d", w.Code)
		}

		// Verify parent is soft-deleted (non-existent via normal query)
		var parent models.Question
		if err := testDB.First(&parent, groupQuestionID).Error; err == nil {
			t.Errorf("expected parent question to be soft-deleted, but found in normal query")
		}

		// Verify children are also soft-deleted
		for _, childID := range childQuestionIDs {
			var child models.Question
			if err := testDB.First(&child, childID).Error; err == nil {
				t.Errorf("expected child question %d to be soft-deleted, but found in normal query", childID)
			}
		}

		// Check database with Unscoped to verify soft-deleted records exist
		var unscopedParent models.Question
		if err := testDB.Unscoped().First(&unscopedParent, groupQuestionID).Error; err != nil {
			t.Errorf("expected unscoped parent question to exist, got error: %v", err)
		}

		for _, childID := range childQuestionIDs {
			var unscopedChild models.Question
			if err := testDB.Unscoped().First(&unscopedChild, childID).Error; err != nil {
				t.Errorf("expected unscoped child question %d to exist, got error: %v", childID, err)
			}
		}
	})
}
