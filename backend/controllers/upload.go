package controllers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// UploadController xử lý các logic liên quan đến upload file
type UploadController struct{}

// NewUploadController khởi tạo UploadController mới
func NewUploadController() *UploadController {
	return &UploadController{}
}

// UploadQuestionImageTemp xử lý tải lên ảnh vào thư mục TẠM (temp)
func (uc *UploadController) UploadQuestionImageTemp(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, APIResponse{
			Status:  "error",
			Message: "Không tìm thấy file tải lên",
			Data:    err.Error(),
		})
		return
	}

	if file.Size > 5*1024*1024 {
		c.JSON(http.StatusBadRequest, APIResponse{
			Status:  "error",
			Message: "Kích thước file quá lớn (Tối đa 5MB)",
		})
		return
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	allowedExts := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
		".gif":  true,
	}
	if !allowedExts[ext] {
		c.JSON(http.StatusBadRequest, APIResponse{
			Status:  "error",
			Message: "Định dạng file không được hỗ trợ",
		})
		return
	}

	// 1. Lưu vào thư mục temp
	tempDir := "./public/images/temp"
	if err := os.MkdirAll(tempDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Status:  "error",
			Message: "Không thể tạo thư mục lưu trữ ảnh tạm",
			Data:    err.Error(),
		})
		return
	}

	// 2. Tạo tên file duy nhất
	newFileName := uuid.New().String() + ext
	savePath := filepath.Join(tempDir, newFileName)

	// 3. Lưu file vào ổ cứng
	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Status:  "error",
			Message: "Không thể lưu file ảnh",
			Data:    err.Error(),
		})
		return
	}

	// 4. Trả về URL tạm
	fileURL := fmt.Sprintf("/images/temp/%s", newFileName)

	c.JSON(http.StatusOK, APIResponse{
		Status:  "success",
		Message: "Tải ảnh lên thư mục tạm thành công",
		Data: map[string]string{
			"url": fileURL,
		},
	})
}
