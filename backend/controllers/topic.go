package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/modeptrai/exam-model-backend/models"
	"github.com/gosimple/slug"
	"gorm.io/gorm"
)

type TopicController struct {
	DB *gorm.DB
}

func NewTopicController(db *gorm.DB) *TopicController {
	return &TopicController{DB: db}
}

// TopicResponse is a sanitized, client-friendly JSON representation of the Topic model supporting tree recursion.
type TopicResponse struct {
	ID        uint             `json:"id"`
	Name      string           `json:"name"`
	Slug      string           `json:"slug"`
	ParentID  *uint            `json:"parent_id,omitempty"`
	Grade     int              `json:"grade"`
	Subject   string           `json:"subject"`
	Children  []*TopicResponse `json:"children,omitempty"`
}

// CreateTopicRequest handles inputs for creating/updating a topic
type CreateTopicRequest struct {
	Name     string `json:"name" binding:"required"`
	ParentID *uint  `json:"parent_id"`
	Grade    int    `json:"grade" binding:"required,min=5,max=10"`
	Subject  string `json:"subject" binding:"required"`
}

// GetTopics returns all topics, filtered by grade and subject.
// Supports "?tree=true" query parameter to return a nested hierarchy.
func (tc *TopicController) GetTopics(c *gin.Context) {
	gradeStr := c.Query("grade")
	subject := c.Query("subject")
	treeStr := c.Query("tree")

	query := tc.DB.Model(&models.Topic{})

	if gradeStr != "" {
		grade, err := strconv.Atoi(gradeStr)
		if err == nil {
			query = query.Where("grade = ?", grade)
		}
	}
	if subject != "" {
		query = query.Where("subject = ?", subject)
	}

	var dbTopics []models.Topic
	if err := query.Order("id ASC").Find(&dbTopics).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch topics: " + err.Error()})
		return
	}

	// If hierarchical layout is not requested, return flat response
	if treeStr != "true" {
		flatList := make([]TopicResponse, len(dbTopics))
		for i, t := range dbTopics {
			flatList[i] = TopicResponse{
				ID:       t.ID,
				Name:     t.Name,
				Slug:     t.Slug,
				ParentID: t.ParentID,
				Grade:    t.Grade,
				Subject:  t.Subject,
			}
		}
		c.JSON(http.StatusOK, flatList)
		return
	}

	// Construct hierarchical tree
	nodes := make(map[uint]*TopicResponse)
	for _, t := range dbTopics {
		nodes[t.ID] = &TopicResponse{
			ID:       t.ID,
			Name:     t.Name,
			Slug:     t.Slug,
			ParentID: t.ParentID,
			Grade:    t.Grade,
			Subject:  t.Subject,
			Children: []*TopicResponse{},
		}
	}

	var roots []*TopicResponse
	for _, t := range dbTopics {
		node := nodes[t.ID]
		if t.ParentID == nil {
			roots = append(roots, node)
		} else {
			parentNode, exists := nodes[*t.ParentID]
			if exists {
				parentNode.Children = append(parentNode.Children, node)
			} else {
				// Parent is not in the loaded dataset (possibly due to filters), treat as root
				roots = append(roots, node)
			}
		}
	}

	c.JSON(http.StatusOK, roots)
}

// GetTopic returns a single topic by ID.
func (tc *TopicController) GetTopic(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid topic ID"})
		return
	}

	var topic models.Topic
	if err := tc.DB.Preload("Parent").Preload("Children").First(&topic, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, topic)
}

// CreateTopic creates a new topic.
func (tc *TopicController) CreateTopic(c *gin.Context) {
	var req CreateTopicRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate parent ID if provided
	if req.ParentID != nil {
		var parent models.Topic
		if err := tc.DB.First(&parent, *req.ParentID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Parent topic not found"})
			return
		}
	}

	topicSlug := slug.Make(req.Name)
	topic := models.Topic{
		Name:     req.Name,
		Slug:     topicSlug,
		ParentID: req.ParentID,
		Grade:    req.Grade,
		Subject:  req.Subject,
	}

	if err := tc.DB.Create(&topic).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create topic: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, topic)
}

// UpdateTopic updates an existing topic.
func (tc *TopicController) UpdateTopic(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid topic ID"})
		return
	}

	var topic models.Topic
	if err := tc.DB.First(&topic, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
		return
	}

	var req CreateTopicRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Prevent self-referencing hierarchy
	if req.ParentID != nil && uint(*req.ParentID) == topic.ID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "A topic cannot be its own parent"})
		return
	}

	// Validate parent ID if provided
	if req.ParentID != nil {
		var parent models.Topic
		if err := tc.DB.First(&parent, *req.ParentID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Parent topic not found"})
			return
		}
	}

	topic.Name = req.Name
	topic.Slug = slug.Make(req.Name)
	topic.ParentID = req.ParentID
	topic.Grade = req.Grade
	topic.Subject = req.Subject

	if err := tc.DB.Save(&topic).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update topic: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, topic)
}

// DeleteTopic deletes a topic by ID.
func (tc *TopicController) DeleteTopic(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid topic ID"})
		return
	}

	var topic models.Topic
	if err := tc.DB.First(&topic, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
		return
	}

	// Hard delete to trigger DB constraint checks
	if err := tc.DB.Unscoped().Delete(&topic).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete topic: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Topic deleted successfully"})
}

// SeedTopics seeds default math topics for Grades 5 to 10.
func (tc *TopicController) SeedTopics(c *gin.Context) {
	var count int64
	if err := tc.DB.Model(&models.Topic{}).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count existing topics: " + err.Error()})
		return
	}

	if count > 0 {
		c.JSON(http.StatusOK, gin.H{"message": "Database already contains topic records, seeding skipped", "count": count})
		return
	}

	// Structural mapping of Vietnam MOET Math Curriculum for Grades 5 to 10.
	curriculum := map[int][]struct {
		ParentName string
		Children   []string
	}{
		9: {
			{ParentName: "Phương trình và hệ hai phương trình bậc nhất hai ẩn", Children: []string{"Phương trình bậc nhất hai ẩn", "Hệ hai phương trình bậc nhất hai ẩn"}},
			{ParentName: "Hàm số bậc hai và đồ thị cơ bản", Children: []string{"Hàm số y = ax^2 (a khác 0)", "Đồ thị hàm số bậc hai đơn giản"}},
			{ParentName: "Phương trình bậc hai một ẩn", Children: []string{"Công thức nghiệm phương trình bậc hai", "Định lý Viète và ứng dụng"}},
			{ParentName: "Hệ thức lượng trong tam giác vuông", Children: []string{"Tỉ số lượng giác của góc nhọn", "Hệ thức giữa cạnh và góc"}},
			{ParentName: "Đường tròn", Children: []string{"Sự xác định đường tròn và vị trí tương đối", "Góc với đường tròn (Góc nội tiếp, góc ở tâm)"}},
			{ParentName: "Hình học không gian cơ bản", Children: []string{"Hình trụ", "Hình nón", "Hình cầu"}},
		},
		8: {
			{ParentName: "Đa thức", Children: []string{"Đơn thức và đa thức nhiều biến", "Các phép tính với đa thức", "Hằng đẳng thức đáng nhớ"}},
			{ParentName: "Phân thức đại số", Children: []string{"Khái niệm phân thức", "Các phép toán cộng, trừ, nhân, chia phân thức"}},
			{ParentName: "Hàm số bậc nhất và đồ thị", Children: []string{"Khái niệm hàm số", "Hàm số bậc nhất y = ax + b", "Hệ số góc của đường thẳng"}},
			{ParentName: "Phương trình bậc nhất một ẩn", Children: []string{"Cách giải phương trình bậc nhất một ẩn", "Giải bài toán bằng cách lập phương trình"}},
			{ParentName: "Định lý Thalès trong tam giác", Children: []string{"Định lý Thalès thuận và đảo", "Đường trung bình của tam giác"}},
			{ParentName: "Tam giác đồng dạng", Children: []string{"Các trường hợp đồng dạng của tam giác", "Tam giác vuông đồng dạng"}},
			{ParentName: "Hình khối trực quan nâng cao", Children: []string{"Hình chóp tam giác đều", "Hình chóp tứ giác đều"}},
		},
		7: {
			{ParentName: "Số hữu tỉ và số thực", Children: []string{"Tập hợp số hữu tỉ", "Căn bậc hai số học và số thực"}},
			{ParentName: "Tỉ lệ thức và đại lượng tỉ lệ", Children: []string{"Tỉ lệ thức và tính chất dãy tỉ số bằng nhau", "Đại lượng tỉ lệ thuận, tỉ lệ nghịch"}},
			{ParentName: "Biểu thức đại số và đa thức một biến", Children: []string{"Biểu thức đại số", "Đa thức một biến và nghiệm của đa thức"}},
			{ParentName: "Góc và đường thẳng song song", Children: []string{"Hai góc kề bù, đối đỉnh", "Dấu hiệu hai đường thẳng song song"}},
			{ParentName: "Hình học phẳng về tam giác", Children: []string{"Tổng các góc trong một tam giác", "Tam giác bằng nhau (c.c.c, c.g.c, g.c.g)", "Tam giác cân và định lý Pythagoras"}},
			{ParentName: "Xác suất của biến cố", Children: []string{"Làm quen với xác suất của biến cố ngẫu nhiên"}},
		},
		6: {
			{ParentName: "Số tự nhiên và Số nguyên", Children: []string{"Tập hợp số tự nhiên", "Tính chất chia hết và ước số", "Tập hợp số nguyên và phép tính"}},
			{ParentName: "Phân số và số thập phân", Children: []string{"Phân số bằng nhau và rút gọn", "Các phép tính với số thập phân"}},
			{ParentName: "Hình học trực quan", Children: []string{"Hình vuông, tam giác đều, lục giác đều", "Hình chữ nhật, hình thoi, hình bình hành"}},
			{ParentName: "Tính đối xứng của hình phẳng", Children: []string{"Hình có trục đối xứng", "Hình có tâm đối xứng"}},
			{ParentName: "Hình học phẳng cơ bản", Children: []string{"Điểm, đường thẳng, đoạn thẳng", "Trung điểm của đoạn thẳng", "Góc và số đo góc"}},
		},
		5: {
			{ParentName: "Hệ thống số và Phép tính", Children: []string{"Phân số thập phân và hỗn số", "Số thập phân và các phép toán cộng, trừ, nhân, chia"}},
			{ParentName: "Hình học phẳng và đo lường", Children: []string{"Diện tích hình tam giác, hình thang", "Chu vi và diện tích hình tròn"}},
			{ParentName: "Hình khối và đo lường thể tích", Children: []string{"Hình hộp chữ nhật, hình lập phương", "Hình trụ, hình cầu", "Đo thể tích và chuyển đổi đơn vị"}},
			{ParentName: "Giải toán thực tế", Children: []string{"Toán chuyển động đều", "Giải toán tỉ số phần trăm"}},
		},
	}

	tx := tc.DB.Begin()
	var seededCount int

	for grade, sections := range curriculum {
		for _, sec := range sections {
			// 1. Create parent topic
			parentSlug := fmt.Sprintf("lop-%d-%s", grade, slug.Make(sec.ParentName))
			parent := models.Topic{
				Name:    sec.ParentName,
				Slug:    parentSlug,
				Grade:   grade,
				Subject: "Toán",
			}
			if err := tx.Create(&parent).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to seed parent topic '" + sec.ParentName + "': " + err.Error()})
				return
			}
			seededCount++

			// 2. Create child topics
			for _, childName := range sec.Children {
				childSlug := fmt.Sprintf("lop-%d-%s", grade, slug.Make(childName))
				child := models.Topic{
					Name:     childName,
					Slug:     childSlug,
					ParentID: &parent.ID,
					Grade:    grade,
					Subject:  "Toán",
				}
				if err := tx.Create(&child).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to seed child topic '" + childName + "': " + err.Error()})
					return
				}
				seededCount++
			}
		}
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":      "Vietnam MOET Mathematics Curriculum seeded successfully",
		"seeded_count": seededCount,
		"grades":       []int{5, 6, 7, 8, 9},
	})
}
