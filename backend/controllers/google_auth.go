package controllers

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"google.golang.org/api/idtoken"

	"github.com/modeptrai/exam-model-backend/models"
	"github.com/modeptrai/exam-model-backend/utils"
)

type GoogleLoginRequest struct {
	Token string `json:"token" binding:"required"`
}

func (ctrl *AuthController) GoogleLogin(c *gin.Context) {
	var req GoogleLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, APIResponse{
			Status:  "error",
			Message: "Dữ liệu không hợp lệ",
		})
		return
	}

	clientID := os.Getenv("GOOGLE_CLIENT_ID")

	// Verify ID token
	payload, err := idtoken.Validate(context.Background(), req.Token, clientID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, APIResponse{
			Status:  "error",
			Message: "Xác thực Google thất bại: " + err.Error(),
		})
		return
	}

	// Extract claims
	email, ok := payload.Claims["email"].(string)
	if !ok || email == "" {
		c.JSON(http.StatusUnauthorized, APIResponse{
			Status:  "error",
			Message: "Không tìm thấy email trong tài khoản Google",
		})
		return
	}
	
	name, _ := payload.Claims["name"].(string)
	if name == "" {
		name = "Google User"
	}

	// Find or Create user
	var user models.User
	db := ctrl.DB

	// Check if user with this email exists
	result := db.Where("email = ?", email).First(&user)
	if result.Error != nil {
		// User does not exist, create a new one
		// Generate random password using UUID to satisfy the PasswordHash constraint
		randomPass := uuid.New().String()
		
		user = models.User{
			Username:     email, // Use email as unique username fallback
			Email:        &email,
			FullName:     name,
			PasswordHash: randomPass, // BeforeCreate hook will hash this securely
			Role:         "student",
			Status:       "active",
		}

		if err := db.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, APIResponse{
				Status:  "error",
				Message: "Lỗi khi tạo tài khoản: " + err.Error(),
			})
			return
		}
	} else {
		// If user exists, check status
		if user.Status != "active" {
			c.JSON(http.StatusForbidden, APIResponse{
				Status:  "error",
				Message: "Tài khoản của bạn đang bị khóa hoặc không hoạt động",
			})
			return
		}
	}

	// Update LastLoginAt
	now := time.Now()
	user.LastLoginAt = &now
	db.Save(&user)

	// Generate JWT for our system
	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Status:  "error",
			Message: "Lỗi khi tạo phiên đăng nhập",
		})
		return
	}

	c.JSON(http.StatusOK, APIResponse{
		Status:  "success",
		Message: "Đăng nhập Google thành công",
		Data: map[string]interface{}{
			"token": token,
			"user":  user,
		},
	})
}
