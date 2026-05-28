package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/modeptrai/exam-model-backend/models"
	"github.com/modeptrai/exam-model-backend/utils"
	"gorm.io/gorm"
)

type AuthController struct {
	DB *gorm.DB
}

func NewAuthController(db *gorm.DB) *AuthController {
	return &AuthController{DB: db}
}

type RegisterRequest struct {
	FullName string `json:"full_name" binding:"required"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password" binding:"required,min=6"`
}

// Register handles user registration
func (ac *AuthController) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, APIResponse{
			Status:  "error",
			Message: "Dữ liệu không hợp lệ",
			Data:    err.Error(),
		})
		return
	}

	if req.Email == "" && req.Phone == "" {
		c.JSON(http.StatusBadRequest, APIResponse{
			Status:  "error",
			Message: "Vui lòng cung cấp Email hoặc Số điện thoại",
		})
		return
	}

	// Username defaults to email or phone
	username := req.Email
	if username == "" {
		username = req.Phone
	}

	// Check if user already exists
	var existingUser models.User
	query := ac.DB.Where("username = ?", username)
	if req.Email != "" {
		query = query.Or("email = ?", req.Email)
	}
	if req.Phone != "" {
		query = query.Or("phone_number = ?", req.Phone)
	}

	if err := query.First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, APIResponse{
			Status:  "error",
			Message: "Tài khoản (Email hoặc Số điện thoại) đã tồn tại",
		})
		return
	}

	newUser := models.User{
		Username:     username,
		FullName:     req.FullName,
		PasswordHash: req.Password, // BeforeCreate hook will hash it
		Role:         "student",
		Status:       "active",
	}

	if req.Email != "" {
		newUser.Email = &req.Email
	}
	if req.Phone != "" {
		newUser.PhoneNumber = &req.Phone
	}

	if err := ac.DB.Create(&newUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Status:  "error",
			Message: "Không thể tạo tài khoản",
			Data:    err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, APIResponse{
		Status:  "success",
		Message: "Đăng ký thành công",
		Data: gin.H{
			"id":        newUser.ID,
			"username":  newUser.Username,
			"full_name": newUser.FullName,
		},
	})
}

type LoginRequest struct {
	Identity string `json:"identity" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Login handles user login
func (ac *AuthController) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, APIResponse{
			Status:  "error",
			Message: "Dữ liệu không hợp lệ",
			Data:    err.Error(),
		})
		return
	}

	var user models.User
	if err := ac.DB.Where("username = ?", req.Identity).
		Or("email = ?", req.Identity).
		Or("phone_number = ?", req.Identity).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, APIResponse{
			Status:  "error",
			Message: "Sai thông tin đăng nhập hoặc tài khoản không tồn tại",
		})
		return
	}

	if !user.CheckPasswordHash(req.Password) {
		c.JSON(http.StatusUnauthorized, APIResponse{
			Status:  "error",
			Message: "Sai mật khẩu",
		})
		return
	}

	if user.Status != "active" {
		c.JSON(http.StatusForbidden, APIResponse{
			Status:  "error",
			Message: "Tài khoản của bạn đã bị khóa hoặc chưa kích hoạt",
		})
		return
	}

	accessToken, refreshToken, err := utils.GenerateTokens(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Status:  "error",
			Message: "Lỗi sinh token",
		})
		return
	}

	// Set HttpOnly cookie cho Refresh Token (7 days)
	c.SetCookie("refresh_token", refreshToken, 7*24*3600, "/", "", false, true)

	c.JSON(http.StatusOK, APIResponse{
		Status:  "success",
		Message: "Đăng nhập thành công",
		Data: gin.H{
			"token": accessToken,
			"user": gin.H{
				"id":        user.ID,
				"username":  user.Username,
				"full_name": user.FullName,
				"role":      user.Role,
			},
		},
	})
}

// RefreshToken handles refreshing the access token
func (ac *AuthController) RefreshToken(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, APIResponse{
			Status:  "error",
			Message: "Không tìm thấy refresh token",
		})
		return
	}

	claims, err := utils.ValidateRefreshToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, APIResponse{
			Status:  "error",
			Message: "Refresh token không hợp lệ hoặc đã hết hạn",
		})
		return
	}

	newAccessToken, newRefreshToken, err := utils.GenerateTokens(claims.UserID, claims.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Status:  "error",
			Message: "Lỗi sinh token mới",
		})
		return
	}

	c.SetCookie("refresh_token", newRefreshToken, 7*24*3600, "/", "", false, true)

	c.JSON(http.StatusOK, APIResponse{
		Status:  "success",
		Message: "Làm mới token thành công",
		Data: gin.H{
			"token": newAccessToken,
		},
	})
}
