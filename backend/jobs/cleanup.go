package jobs

import (
	"log"
	"os"
	"path/filepath"
	"time"
)

// StartTempImageCleanupCron chạy ngầm định kỳ (12 tiếng/lần) để quét và xóa file rác
func StartTempImageCleanupCron() {
	// Khởi tạo Ticker mỗi 12 tiếng
	ticker := time.NewTicker(12 * time.Hour)
	defer ticker.Stop()

	log.Println("[CRON JOB] Đã khởi động tiến trình dọn dẹp thư mục tạm (chu kỳ 12h)")

	// Chạy vòng lặp lắng nghe channel từ ticker
	for range ticker.C {
		cleanupTempImages()
	}
}

func cleanupTempImages() {
	tempDir := "./public/images/temp"

	// Bỏ qua nếu thư mục không tồn tại
	if _, err := os.Stat(tempDir); os.IsNotExist(err) {
		return
	}

	entries, err := os.ReadDir(tempDir)
	if err != nil {
		log.Printf("[CRON JOB] Lỗi khi đọc thư mục temp: %v", err)
		return
	}

	deletedCount := 0
	currentTime := time.Now()

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		info, err := entry.Info()
		if err != nil {
			log.Printf("[CRON JOB] Lỗi khi lấy thông tin file %s: %v", entry.Name(), err)
			continue
		}

		// Nếu file đã cũ hơn 3 tiếng (tức là ảnh mồ côi do thao tác không được lưu)
		if currentTime.Sub(info.ModTime()) > 3*time.Hour {
			filePath := filepath.Join(tempDir, entry.Name())
			if err := os.Remove(filePath); err != nil {
				log.Printf("[CRON JOB] Lỗi khi xóa file rác %s: %v", entry.Name(), err)
			} else {
				deletedCount++
			}
		}
	}

	if deletedCount > 0 {
		log.Printf("[CRON JOB] Đã dọn dẹp tự động %d ảnh rác cũ hơn 3 tiếng.", deletedCount)
	}
}
