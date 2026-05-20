package controllers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/modeptrai/exam-model-backend/controllers"
	"github.com/modeptrai/exam-model-backend/models"
	"gorm.io/gorm"
)

func setupTestRouter(db *gorm.DB) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	topicCtrl := controllers.NewTopicController(db)
	v1 := r.Group("/api/v1")
	{
		v1.GET("/topics", topicCtrl.GetTopics)
		v1.GET("/topics/:id", topicCtrl.GetTopic)
		v1.POST("/topics", topicCtrl.CreateTopic)
		v1.PUT("/topics/:id", topicCtrl.UpdateTopic)
		v1.DELETE("/topics/:id", topicCtrl.DeleteTopic)
		v1.POST("/topics/seed", topicCtrl.SeedTopics)
	}

	return r
}

func TestTopicAPI(t *testing.T) {
	// Migrate models
	err := testDB.AutoMigrate(&models.Topic{}, &models.Question{})
	if err != nil {
		t.Fatalf("failed to auto-migrate: %v", err)
	}

	// Truncate tables to ensure a clean slate
	testDB.Exec("TRUNCATE TABLE topics RESTART IDENTITY CASCADE")

	router := setupTestRouter(testDB)

	// 1. Test Seeding
	t.Run("POST /api/v1/topics/seed", func(t *testing.T) {
		req, _ := http.NewRequest("POST", "/api/v1/topics/seed", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusCreated {
			t.Errorf("expected status 201 Created, got %d. Body: %s", w.Code, w.Body.String())
		}

		var resp map[string]interface{}
		if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
			t.Fatalf("failed to unmarshal JSON: %v", err)
		}

		if resp["message"] != "Vietnam MOET Mathematics Curriculum seeded successfully" {
			t.Errorf("unexpected seed message: %q", resp["message"])
		}

		countVal, ok := resp["seeded_count"].(float64)
		if !ok || countVal <= 0 {
			t.Errorf("expected seeded count > 0, got %v", resp["seeded_count"])
		}
	})

	// 2. Test Fetching flat list with filter
	t.Run("GET /api/v1/topics (filtered by grade)", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/v1/topics?grade=9", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected status 200 OK, got %d", w.Code)
		}

		var topics []controllers.TopicResponse
		if err := json.Unmarshal(w.Body.Bytes(), &topics); err != nil {
			t.Fatalf("failed to unmarshal JSON list: %v", err)
		}

		// Ensure all returned items have grade 9
		for _, topic := range topics {
			if topic.Grade != 9 {
				t.Errorf("expected topic grade to be 9, got %d", topic.Grade)
			}
		}
	})

	// 3. Test Fetching Tree structure
	t.Run("GET /api/v1/topics?tree=true", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/v1/topics?tree=true&grade=9", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected status 200 OK, got %d", w.Code)
		}

		var tree []*controllers.TopicResponse
		if err := json.Unmarshal(w.Body.Bytes(), &tree); err != nil {
			t.Fatalf("failed to unmarshal tree JSON: %v", err)
		}

		if len(tree) == 0 {
			t.Fatalf("expected tree roots, got empty slice")
		}

		// Verify that at least one root node has children preloaded
		hasChildren := false
		for _, root := range tree {
			if root.ParentID != nil {
				t.Errorf("root node %d has non-nil parent: %v", root.ID, root.ParentID)
			}
			if len(root.Children) > 0 {
				hasChildren = true
				// Check that child node references the parent ID correctly
				for _, child := range root.Children {
					if child.ParentID == nil || *child.ParentID != root.ID {
						t.Errorf("child parent reference mismatch: expected %d, got %v", root.ID, child.ParentID)
					}
				}
			}
		}

		if !hasChildren {
			t.Error("expected at least one root topic to have seeded child nodes, but none did")
		}
	})

	// 4. Test CRUD Operations
	t.Run("CRUD Topics", func(t *testing.T) {
		// A. Create custom topic
		reqBody := controllers.CreateTopicRequest{
			Name:    "Chuyên đề nâng cao Hình Oxy",
			Grade:   9,
			Subject: "Toán",
		}
		jsonBytes, _ := json.Marshal(reqBody)
		req, _ := http.NewRequest("POST", "/api/v1/topics", bytes.NewBuffer(jsonBytes))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusCreated {
			t.Fatalf("expected status 201 Created, got %d. Body: %s", w.Code, w.Body.String())
		}

		var created models.Topic
		json.Unmarshal(w.Body.Bytes(), &created)

		if created.Name != "Chuyên đề nâng cao Hình Oxy" || created.Slug != "chuyen-de-nang-cao-hinh-oxy" {
			t.Errorf("unexpected topic fields: Name=%q Slug=%q", created.Name, created.Slug)
		}

		// B. Read Single Topic
		req, _ = http.NewRequest("GET", "/api/v1/topics/"+strconv.Itoa(int(created.ID)), nil)
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected status 200 OK, got %d", w.Code)
		}

		var fetched models.Topic
		json.Unmarshal(w.Body.Bytes(), &fetched)
		if fetched.ID != created.ID {
			t.Errorf("expected ID %d, got %d", created.ID, fetched.ID)
		}

		// C. Update Topic
		updateBody := controllers.CreateTopicRequest{
			Name:    "Hình học Oxy nâng cao",
			Grade:   9,
			Subject: "Toán",
		}
		updateBytes, _ := json.Marshal(updateBody)
		req, _ = http.NewRequest("PUT", "/api/v1/topics/"+strconv.Itoa(int(created.ID)), bytes.NewBuffer(updateBytes))
		req.Header.Set("Content-Type", "application/json")
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected status 200 OK, got %d", w.Code)
		}

		var updated models.Topic
		json.Unmarshal(w.Body.Bytes(), &updated)
		if updated.Name != "Hình học Oxy nâng cao" || updated.Slug != "hinh-hoc-oxy-nang-cao" {
			t.Errorf("unexpected updated name: %q, slug: %q", updated.Name, updated.Slug)
		}

		// D. Delete Topic
		req, _ = http.NewRequest("DELETE", "/api/v1/topics/"+strconv.Itoa(int(created.ID)), nil)
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Errorf("expected status 200 OK, got %d", w.Code)
		}

		// E. Verify deletion (should return 404)
		req, _ = http.NewRequest("GET", "/api/v1/topics/"+strconv.Itoa(int(created.ID)), nil)
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusNotFound {
			t.Errorf("expected status 404 Not Found after deletion, got %d", w.Code)
		}
	})
}
