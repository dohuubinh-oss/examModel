package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/modeptrai/exam-model-backend/models"
	"gorm.io/gorm"
)

type UserController struct {
	DB *gorm.DB
}

func NewUserController(db *gorm.DB) *UserController {
	return &UserController{DB: db}
}

// GetUsers retrieves a list of users
func (uc *UserController) GetUsers(c *gin.Context) {
	var users []models.User

	if err := uc.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Status:  "error",
			Message: "Không thể lấy danh sách người dùng",
			Data:    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, APIResponse{
		Status:  "success",
		Message: "Lấy danh sách người dùng thành công",
		Data:    users,
	})
}

func ptr(s string) *string { return &s }
func ptrInt(i int) *int { return &i }

// SeedUsers seeds mock users to DB if empty
func (uc *UserController) SeedUsers(c *gin.Context) {
	users := []models.User{
		{Username: "user1", Email: ptr("an.nguyen@student.edu.vn"), FullName: "Nguyễn Văn An", Role: "student", Grade: ptrInt(9), Status: "active", PasswordHash: "123456"},
		{Username: "user2", Email: ptr("binh.tt@mathed.vn"), FullName: "Trần Thị Bình", Role: "teacher", Status: "active", PasswordHash: "123456"},
		{Username: "user3", Email: ptr("danh.lc@student.edu.vn"), FullName: "Lê Công Danh", Role: "student", Grade: ptrInt(5), Status: "blocked", PasswordHash: "123456"},
		{Username: "user4", Email: ptr("duc.pm@mathed.vn"), FullName: "Phạm Minh Đức", Role: "admin", Status: "active", PasswordHash: "123456"},
		{Username: "user5", Email: ptr("ha.ht@student.edu.vn"), FullName: "Hoàng Thu Hà", Role: "student", Grade: ptrInt(10), Status: "active", PasswordHash: "123456"},
	}

	for _, u := range users {
		uc.DB.Where(models.User{Username: u.Username}).FirstOrCreate(&u)
	}

	c.JSON(http.StatusOK, APIResponse{
		Status:  "success",
		Message: "Tạo dữ liệu mẫu người dùng thành công",
	})
}
