package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/modeptrai/exam-model-backend/controllers"
	"github.com/modeptrai/exam-model-backend/jobs"
	"github.com/modeptrai/exam-model-backend/models"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB    *gorm.DB
	RDB   *redis.Client
	ctx   = context.Background()
)

func main() {
	// 1. Initialize Database (PostgreSQL)
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=db user=exam_user password=exam_password dbname=exam_db port=5432 sslmode=disable"
	}
	
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	DB = db
	fmt.Println("Successfully connected to PostgreSQL")

	// Auto-migrate schema
	err = db.AutoMigrate(&models.Topic{}, &models.QuestionGroup{}, &models.Question{}, &models.User{}, &models.Exam{}, &models.ExamQuestion{}, &models.TestResult{})
	if err != nil {
		log.Fatalf("Failed to run database auto-migration: %v", err)
	}
	fmt.Println("Database auto-migration completed successfully")

	// 2. Initialize Cache (Redis)
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "cache:6379"
	}
	RDB = redis.NewClient(&redis.Options{
		Addr: redisURL,
	})
	if err := RDB.Ping(ctx).Err(); err != nil {
		log.Printf("Warning: Failed to connect to Redis: %v", err)
	} else {
		fmt.Println("Successfully connected to Redis")
	}

	// 3. Initialize Router (Gin)
	r := gin.Default()

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Static files for images
	r.Static("/images/temp", "./public/images/temp")
	r.Static("/images/questions", "./public/images/questions")

	// Routes
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
			"concurrency_ready": true,
		})
	})

	// API v1 Group
	v1 := r.Group("/api/v1")
	{
		v1.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "pong"})
		})

		// Topic endpoints
		topicCtrl := controllers.NewTopicController(DB)
		v1.GET("/topics", topicCtrl.GetTopics)
		v1.GET("/topics/:id", topicCtrl.GetTopic)
		v1.POST("/topics", topicCtrl.CreateTopic)
		v1.PUT("/topics/:id", topicCtrl.UpdateTopic)
		v1.DELETE("/topics/:id", topicCtrl.DeleteTopic)
		v1.POST("/topics/seed", topicCtrl.SeedTopics)

		// Question endpoints
		questionCtrl := controllers.NewQuestionController(DB)
		v1.GET("/questions", questionCtrl.GetQuestions)
		v1.GET("/questions/:id", questionCtrl.GetQuestion)
		v1.POST("/questions/bulk", questionCtrl.HandleCreateBulkQuestions)
		v1.PUT("/questions/:id", questionCtrl.UpdateQuestion)
		v1.DELETE("/questions/:id", questionCtrl.DeleteQuestion)

		// Question Group endpoints
		v1.GET("/question-groups/:id", questionCtrl.GetQuestionGroup)
		v1.PUT("/question-groups/:id", questionCtrl.UpdateQuestionGroup)
		v1.DELETE("/question-groups/:id", questionCtrl.DeleteQuestionGroup)

		// Upload endpoints
		uploadCtrl := controllers.NewUploadController()
		v1.POST("/upload/temp", uploadCtrl.UploadQuestionImageTemp)
	}

	// 4. Start Background Jobs
	go jobs.StartTempImageCleanupCron()

	// 5. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Server starting on port %s...\n", port)
	r.Run(":" + port)
}
