package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/modeptrai/exam-model-backend/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type QuestionRequest struct {
	ID              *uint    `json:"id"`
	TypeQuestion    string   `json:"type_question"`
	Content         string   `json:"content"`
	Type            string   `json:"type"`
	Grade           int      `json:"grade"`
	Topic           string   `json:"topic"`
	DifficultyLevel string   `json:"difficulty_level"`
	DifficultyPoint float64  `json:"difficulty_point"`
	Point           float64  `json:"point"`
	Tags            []string `json:"tags"`
	Options         []string `json:"options"`
	CorrectAnswer   string   `json:"correct_answer"`
	SolutionGuide   string   `json:"solution_guide"`
	Hint            string   `json:"hint"`
	QuickSolveTips  string   `json:"quick_solve_tips"`
	GeneralMethod   string   `json:"general_method"`
	Mistakes        string   `json:"mistakes"`
	ImageQuestion   *string  `json:"image_question"`
	ImageSolution   *string  `json:"image_solution"`
}

type QuestionGroupRequest struct {
	SharedContent string            `json:"shared_content"`
	ImageShared   *string           `json:"image_shared"`
	Questions     []QuestionRequest `json:"questions"`
}

func CreateBulkQuestions(db *gorm.DB, payload []QuestionGroupRequest) error {
	if len(payload) == 0 {
		return errors.New("payload rỗng, không có dữ liệu để thêm")
	}

	// 1. Di chuyển ảnh từ thư mục temp sang questions và cập nhật URL
	if err := MoveImagesToPermanent(&payload); err != nil {
		return fmt.Errorf("lỗi trong quá trình di chuyển ảnh: %w", err)
	}

	// 2. Insert Database

	return db.Transaction(func(tx *gorm.DB) error {
		for i, groupReq := range payload {
			group := models.QuestionGroup{
				SharedContent: groupReq.SharedContent,
				ImageShared:   groupReq.ImageShared,
			}

			if err := tx.Create(&group).Error; err != nil {
				return fmt.Errorf("lỗi khi insert QuestionGroup tại index %d: %w", i, err)
			}

			if len(groupReq.Questions) > 0 {
				var questions []models.Question

				for _, qReq := range groupReq.Questions {
					tagsBytes, err := json.Marshal(qReq.Tags)
					if err != nil {
						return fmt.Errorf("lỗi parse Tags JSON: %w", err)
					}
					
					optionsBytes, err := json.Marshal(qReq.Options)
					if err != nil {
						return fmt.Errorf("lỗi parse Options JSON: %w", err)
					}

					question := models.Question{
						QuestionGroupID: &group.ID,
						TypeQuestion:    qReq.TypeQuestion,
						Content:         qReq.Content,
						Type:            qReq.Type,
						Grade:           qReq.Grade,
						Topic:           qReq.Topic,
						DifficultyLevel: qReq.DifficultyLevel,
						DifficultyPoint: qReq.DifficultyPoint,
						Point:           qReq.Point,
						Tags:            datatypes.JSON(tagsBytes),
						Options:         datatypes.JSON(optionsBytes),
						CorrectAnswer:   qReq.CorrectAnswer,
						SolutionGuide:   qReq.SolutionGuide,
						Hint:            qReq.Hint,
						QuickSolveTips:  qReq.QuickSolveTips,
						GeneralMethod:   qReq.GeneralMethod,
						Mistakes:        qReq.Mistakes,
						ImageQuestion:   qReq.ImageQuestion,
						ImageSolution:   qReq.ImageSolution,
					}
					
					questions = append(questions, question)
				}

				if err := tx.CreateInBatches(questions, 100).Error; err != nil {
					return fmt.Errorf("lỗi khi insert batch Questions cho Group ID %d: %w", group.ID, err)
				}
			}
		}

		return nil
	})
}

// MoveImagesToPermanent di chuyển file ảnh từ thư mục tạm sang thư mục chính thức và cập nhật lại URL trong payload
func MoveImagesToPermanent(payload *[]QuestionGroupRequest) error {
	tempDir := "./public/images/temp"
	permDir := "./public/images/questions"

	// Tự động tạo thư mục đích nếu chưa có
	if err := os.MkdirAll(permDir, os.ModePerm); err != nil {
		return fmt.Errorf("không thể tạo thư mục questions: %w", err)
	}

	// Helper di chuyển 1 file
	moveFile := func(urlPtr **string) error {
		if urlPtr == nil || *urlPtr == nil {
			return nil
		}
		url := **urlPtr
		if strings.Contains(url, "/images/temp/") {
			fileName := filepath.Base(url)
			tempPath := filepath.Join(tempDir, fileName)
			permPath := filepath.Join(permDir, fileName)

			// Di chuyển file
			if err := os.Rename(tempPath, permPath); err != nil {
				// Nếu file không tồn tại ở temp thì bỏ qua (có thể do lỗi upload db hoặc đã di chuyển trước đó)
				if !os.IsNotExist(err) {
					return fmt.Errorf("lỗi khi di chuyển file %s: %w", fileName, err)
				}
			} else {
				// Cập nhật lại URL sau khi rename thành công
				newUrl := fmt.Sprintf("/images/questions/%s", fileName)
				*urlPtr = &newUrl
			}
		}
		return nil
	}

	// Duyệt mảng payload bằng con trỏ
	for i := range *payload {
		if err := moveFile(&(*payload)[i].ImageShared); err != nil {
			return err
		}

		for j := range (*payload)[i].Questions {
			if err := moveFile(&(*payload)[i].Questions[j].ImageQuestion); err != nil {
				return err
			}
			if err := moveFile(&(*payload)[i].Questions[j].ImageSolution); err != nil {
				return err
			}
		}
	}

	return nil
}

func UpdateQuestionGroup(db *gorm.DB, groupID uint, payload QuestionGroupRequest) error {
	wrapper := []QuestionGroupRequest{payload}
	if err := MoveImagesToPermanent(&wrapper); err != nil {
		return fmt.Errorf("lỗi trong quá trình di chuyển ảnh: %w", err)
	}
	payload = wrapper[0]

	return db.Transaction(func(tx *gorm.DB) error {
		var group models.QuestionGroup
		if err := tx.First(&group, groupID).Error; err != nil {
			return err
		}

		group.SharedContent = payload.SharedContent
		if payload.ImageShared != nil {
			group.ImageShared = payload.ImageShared
		}
		if err := tx.Save(&group).Error; err != nil {
			return err
		}

		var existingQuestions []models.Question
		if err := tx.Where("question_group_id = ?", groupID).Find(&existingQuestions).Error; err != nil {
			return err
		}
		
		existingMap := make(map[uint]models.Question)
		for _, q := range existingQuestions {
			existingMap[q.ID] = q
		}

		processedIDs := make(map[uint]bool)

		for _, qReq := range payload.Questions {
			tagsBytes, _ := json.Marshal(qReq.Tags)
			optionsBytes, _ := json.Marshal(qReq.Options)

			if qReq.ID != nil && *qReq.ID != 0 {
				if existingQ, ok := existingMap[*qReq.ID]; ok {
					existingQ.TypeQuestion = qReq.TypeQuestion
					existingQ.Content = qReq.Content
					existingQ.Type = qReq.Type
					existingQ.Grade = qReq.Grade
					existingQ.Topic = qReq.Topic
					existingQ.DifficultyLevel = qReq.DifficultyLevel
					existingQ.DifficultyPoint = qReq.DifficultyPoint
					existingQ.Point = qReq.Point
					existingQ.Tags = datatypes.JSON(tagsBytes)
					existingQ.Options = datatypes.JSON(optionsBytes)
					existingQ.CorrectAnswer = qReq.CorrectAnswer
					existingQ.SolutionGuide = qReq.SolutionGuide
					existingQ.Hint = qReq.Hint
					existingQ.QuickSolveTips = qReq.QuickSolveTips
					existingQ.GeneralMethod = qReq.GeneralMethod
					existingQ.Mistakes = qReq.Mistakes
					if qReq.ImageQuestion != nil {
						existingQ.ImageQuestion = qReq.ImageQuestion
					}
					if qReq.ImageSolution != nil {
						existingQ.ImageSolution = qReq.ImageSolution
					}
					if err := tx.Save(&existingQ).Error; err != nil {
						return err
					}
					processedIDs[*qReq.ID] = true
				}
			} else {
				newQ := models.Question{
					QuestionGroupID: &group.ID,
					TypeQuestion:    qReq.TypeQuestion,
					Content:         qReq.Content,
					Type:            qReq.Type,
					Grade:           qReq.Grade,
					Topic:           qReq.Topic,
					DifficultyLevel: qReq.DifficultyLevel,
					DifficultyPoint: qReq.DifficultyPoint,
					Point:           qReq.Point,
					Tags:            datatypes.JSON(tagsBytes),
					Options:         datatypes.JSON(optionsBytes),
					CorrectAnswer:   qReq.CorrectAnswer,
					SolutionGuide:   qReq.SolutionGuide,
					Hint:            qReq.Hint,
					QuickSolveTips:  qReq.QuickSolveTips,
					GeneralMethod:   qReq.GeneralMethod,
					Mistakes:        qReq.Mistakes,
					ImageQuestion:   qReq.ImageQuestion,
					ImageSolution:   qReq.ImageSolution,
				}
				if err := tx.Create(&newQ).Error; err != nil {
					return err
				}
			}
		}

		for _, q := range existingQuestions {
			if !processedIDs[q.ID] {
				if err := tx.Delete(&q).Error; err != nil {
					return err
				}
			}
		}
		return nil
	})
}
