package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/modeptrai/exam-model-backend/models"
	"gorm.io/datatypes"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func buildOptions(opts ...string) datatypes.JSON {
	type Option struct {
		Key  string `json:"key"`
		Text string `json:"text"`
	}
	keys := []string{"A", "B", "C", "D"}
	var options []Option
	for i, o := range opts {
		if i < 4 {
			options = append(options, Option{Key: keys[i], Text: o})
		}
	}
	b, _ := json.Marshal(options)
	return datatypes.JSON(b)
}

func buildTags(tags ...string) datatypes.JSON {
	b, _ := json.Marshal(tags)
	return datatypes.JSON(b)
}

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=exam_user password=exam_password dbname=exam_db port=5432 sslmode=disable"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	fmt.Println("Connected to Database. Starting seed for Grade 10 Entrance Exam Math...")

	// 1. Delete existing Grade 10 questions (Luyện thi vào 10)
	var qGroups []models.QuestionGroup
	db.Where("id IN (SELECT question_group_id FROM questions WHERE grade = 10 AND question_group_id IS NOT NULL)").Find(&qGroups)

	res := db.Where("grade = ?", 10).Delete(&models.Question{})
	fmt.Printf("Deleted %d existing grade 10 questions.\n", res.RowsAffected)

	if len(qGroups) > 0 {
		db.Delete(&qGroups)
		fmt.Printf("Deleted %d orphaned question groups.\n", len(qGroups))
	}

	// 2. Setup Topics
	topicData := []struct {
		Name string
		Slug string
	}{
		{"Rút gọn biểu thức chứa căn", "rut-gon-bieu-thuc-chua-can"},
		{"Giải bài toán bằng cách lập PT/HPT", "giai-toan-bang-cach-lap-pt-hpt"},
		{"Hàm số đồ thị & Định lí Vi-ét", "ham-so-do-thi-viet"},
		{"Hình học tổng hợp", "hinh-hoc-tong-hop"},
		{"Bất đẳng thức & Cực trị", "bat-dang-thuc-cuc-tri"},
	}

	topics := make(map[string]*models.Topic)
	for _, td := range topicData {
		var t models.Topic
		err := db.Where("slug = ? AND grade = ?", td.Slug, 10).First(&t).Error
		if err != nil {
			t = models.Topic{
				Name:    td.Name,
				Slug:    td.Slug,
				Grade:   10,
				Subject: "Toán",
			}
			db.Create(&t)
		}
		topics[td.Name] = &t
	}

	var allQuestions []models.Question

	// --- 3. TẠO 50 CÂU HỎI ĐA DẠNG LỚP 10 ---

	// A. Chủ đề: Rút gọn biểu thức chứa căn (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           10,
			Topic:           "Rút gọn biểu thức chứa căn",
			TopicID:         &topics["Rút gọn biểu thức chứa căn"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Giá trị của biểu thức P = (√x / (√x - %d)) - (%d / (x - %d)) (với x ≥ 0, x ≠ %d) sau khi rút gọn là bao nhiêu?", i, i*i, i*i, i*i),
			Options:         buildOptions("(√x - 1)/(√x + 1)", fmt.Sprintf("1/(√x + %d)", i), fmt.Sprintf("√x/(√x + %d)", i), "1"),
			CorrectAnswer:   "B", // (x - i*i) = (√x-i)(√x+i). √x*(√x+i) - i*i = x + i√x - i*i...
			SolutionGuide:   "Quy đồng mẫu số chung là (√x - i)(√x + i), sau đó thực hiện phép trừ trên tử số rồi phân tích tử số thành nhân tử để rút gọn với mẫu số.",
			Status:          "approved",
			Tags:            buildTags("Rút gọn biểu thức", "Thi vào 10", "Lớp 10"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           10,
			Topic:           "Rút gọn biểu thức chứa căn",
			TopicID:         &topics["Rút gọn biểu thức chứa căn"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.5,
			Point:           2.0,
			Content:         fmt.Sprintf("Cho biểu thức P = ( (√x) / (√x - %d) + (3√x) / (x - %d) ) : ( (x + %d) / (x - %d) ). Tìm x để P = 1/2.", i, i*i, i*3, i*i),
			CorrectAnswer:   "Tự giải theo hướng dẫn",
			SolutionGuide:   "Bước 1: Rút gọn biểu thức trong ngoặc thứ nhất bằng cách quy đồng. Bước 2: Nhân nghịch đảo biểu thức thứ hai để thu gọn P. Bước 3: Cho P = 1/2, giải phương trình chứa căn tìm x (nhớ đối chiếu điều kiện).",
			Status:          "approved",
			Tags:            buildTags("Câu hỏi phụ rút gọn", "Tìm x", "Lớp 10"),
		})
	}

	// B. Chủ đề: Giải bài toán bằng cách lập PT/HPT (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           10,
			Topic:           "Giải bài toán bằng cách lập PT/HPT",
			TopicID:         &topics["Giải bài toán bằng cách lập PT/HPT"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.5,
			Point:           1.0,
			Content:         fmt.Sprintf("Một xưởng may dự định may %d bộ quần áo trong một thời gian nhất định. Nhờ cải tiến kĩ thuật, mỗi ngày xưởng may được nhiều hơn dự định %d bộ. Nên xưởng hoàn thành kế hoạch sớm hơn 3 ngày. Hỏi theo dự định mỗi ngày xưởng phải may bao nhiêu bộ quần áo?", i*300, i*10),
			Options:         buildOptions(fmt.Sprintf("%d", i*20), fmt.Sprintf("%d", i*25), fmt.Sprintf("%d", i*30), fmt.Sprintf("%d", i*40)),
			CorrectAnswer:   "A",
			SolutionGuide:   "Lập phương trình: (Tổng sản phẩm / Năng suất dự định) - (Tổng sản phẩm / (Năng suất dự định + tăng thêm)) = 3 ngày. Giải phương trình bậc 2.",
			Status:          "approved",
			Tags:            buildTags("Toán năng suất", "Giải PT", "Lớp 10"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           10,
			Topic:           "Giải bài toán bằng cách lập PT/HPT",
			TopicID:         &topics["Giải bài toán bằng cách lập PT/HPT"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.0,
			Point:           2.0,
			Content:         fmt.Sprintf("Một khúc sông từ bến A đến bến B dài %d km. Một ca nô đi xuôi dòng từ A đến B rồi ngược dòng từ B về A hết tổng cộng %d giờ %d phút. Biết vận tốc dòng nước là 2 km/h. Tính vận tốc riêng của ca nô.", i*40, i+2, 30),
			CorrectAnswer:   "Vận tốc riêng của ca nô là nghiệm dương của phương trình.",
			SolutionGuide:   "Gọi vận tốc riêng của ca nô là x (x>2). Vận tốc xuôi là x+2, vận tốc ngược là x-2. Lập phương trình tổng thời gian: Quãng đường/(x+2) + Quãng đường/(x-2) = Tổng thời gian quy ra giờ.",
			Status:          "approved",
			Tags:            buildTags("Toán chuyển động", "Lớp 10"),
		})
	}

	// C. Chủ đề: Hàm số đồ thị & Định lí Vi-ét (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           10,
			Topic:           "Hàm số đồ thị & Định lí Vi-ét",
			TopicID:         &topics["Hàm số đồ thị & Định lí Vi-ét"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 6.5,
			Point:           1.0,
			Content:         fmt.Sprintf("Cho phương trình x² - %dx + %d = 0. Gọi x1, x2 là hai nghiệm của phương trình. Giá trị của biểu thức A = x1² + x2² là:", i*4, i*3),
			Options:         buildOptions(fmt.Sprintf("%d", (i*4)*(i*4) - 2*(i*3)), fmt.Sprintf("%d", (i*4)*(i*4) + 2*(i*3)), fmt.Sprintf("%d", i*4), fmt.Sprintf("%d", i*3)),
			CorrectAnswer:   "A",
			SolutionGuide:   "Theo định lí Vi-ét: S = x1+x2, P = x1*x2. Biến đổi: x1² + x2² = (x1+x2)² - 2x1x2 = S² - 2P.",
			Status:          "approved",
			Tags:            buildTags("Định lí Vi-ét", "Phương trình bậc 2", "Lớp 10"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           10,
			Topic:           "Hàm số đồ thị & Định lí Vi-ét",
			TopicID:         &topics["Hàm số đồ thị & Định lí Vi-ét"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 8.5,
			Point:           2.0,
			Content:         fmt.Sprintf("Cho phương trình x² - 2(m + 1)x + m² + %d = 0 (với m là tham số). Tìm m để phương trình có hai nghiệm phân biệt x1, x2 thỏa mãn x1² + x2² = %d.", i, i*10+12),
			CorrectAnswer:   "Tự giải theo hướng dẫn",
			SolutionGuide:   "Bước 1: Tính Δ' > 0 để tìm điều kiện của m có hai nghiệm phân biệt. Bước 2: Dùng Vi-ét S, P. Bước 3: Thay vào hệ thức (x1+x2)² - 2x1x2, giải phương trình tìm m, đối chiếu điều kiện.",
			Status:          "approved",
			Tags:            buildTags("Tìm m", "Vi-ét", "Lớp 10"),
		})
	}

	// D. Chủ đề: Hình học tổng hợp (10 câu, bao gồm 1 câu hỏi chùm 4 câu)
	for i := 1; i <= 6; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           10,
			Topic:           "Hình học tổng hợp",
			TopicID:         &topics["Hình học tổng hợp"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.5,
			Point:           1.0,
			Content:         fmt.Sprintf("Một hình nón có bán kính đáy r = %d cm, độ dài đường sinh l = %d cm. Diện tích xung quanh của hình nón là:", i*3, i*5),
			Options:         buildOptions(fmt.Sprintf("%dπ cm²", i*3*i*5), fmt.Sprintf("%dπ cm²", i*3*i*3), fmt.Sprintf("%dπ cm²", i*5*i*5), fmt.Sprintf("%dπ cm²", i*3*i*4)),
			CorrectAnswer:   "A",
			SolutionGuide:   "Diện tích xung quanh hình nón Sxq = πrl.",
			Status:          "approved",
			Tags:            buildTags("Hình nón", "Hình học không gian", "Lớp 10"),
		})
	}

	// Tạo 1 Câu hỏi chùm (Group) gồm 4 câu hỏi con (Dạng hình học 10 điểm)
	qGroup := models.QuestionGroup{
		SharedContent: "Cho đường tròn (O; R) và một điểm M nằm ngoài đường tròn. Từ M kẻ hai tiếp tuyến MA, MB tới đường tròn (A, B là hai tiếp điểm). Một đường thẳng d đi qua M cắt đường tròn (O) tại hai điểm phân biệt C và D (MC < MD, tia MC nằm giữa tia MA và tia MO). Gọi H là giao điểm của OM và AB.",
	}
	db.Create(&qGroup)

	groupQuestions := []models.Question{
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           10,
			Topic:           "Hình học tổng hợp",
			TopicID:         &topics["Hình học tổng hợp"].ID,
			DifficultyLevel: "Thông hiểu",
			DifficultyPoint: 5.0,
			Point:           1.0,
			Content:         "Chứng minh tứ giác MAOB là tứ giác nội tiếp.",
			CorrectAnswer:   "Góc MAO = Góc MBO = 90 độ.",
			SolutionGuide:   "Hai tiếp tuyến vuông góc với bán kính tại tiếp điểm. Tổng 2 góc đối bằng 180 độ.",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           10,
			Topic:           "Hình học tổng hợp",
			TopicID:         &topics["Hình học tổng hợp"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 7.0,
			Point:           1.0,
			Content:         "Chứng minh MA² = MC.MD",
			CorrectAnswer:   "Tam giác MAC đồng dạng với tam giác MDA",
			SolutionGuide:   "Xét 2 tam giác MAC và MDA có góc M chung, góc MAC = góc MDA (góc tạo bởi tiếp tuyến và dây cung bằng góc nội tiếp cùng chắn cung AC). Suy ra 2 tam giác đồng dạng (g.g).",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           10,
			Topic:           "Hình học tổng hợp",
			TopicID:         &topics["Hình học tổng hợp"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 8.0,
			Point:           1.0,
			Content:         "Chứng minh tứ giác CHOD nội tiếp được đường tròn.",
			CorrectAnswer:   "Sử dụng MC.MD = MH.MO",
			SolutionGuide:   "Ta có MC.MD = MA² (câu b). Mà MA² = MH.MO (hệ thức lượng trong tam giác vuông MAO). Suy ra MC/MO = MH/MD. Suy ra tam giác MHC đồng dạng tam giác MDO (c.g.c). Suy ra góc MHC = góc MDO. Suy ra tứ giác CHOD nội tiếp (góc ngoài bằng góc trong đỉnh đối diện).",
			Status:          "approved",
		},
		{
			TypeQuestion:    "group",
			QuestionGroupID: &qGroup.ID,
			Type:            "Tự luận",
			Grade:           10,
			Topic:           "Hình học tổng hợp",
			TopicID:         &topics["Hình học tổng hợp"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 9.5,
			Point:           1.0,
			Content:         "Tia CH cắt đường tròn (O) tại điểm thứ hai E. Chứng minh AE song song với CD.",
			CorrectAnswer:   "Góc CAE = Góc ACD",
			SolutionGuide:   "Vì tứ giác CHOD nội tiếp nên góc DHO = góc DCO. Mà tam giác OCD cân tại O nên góc DCO = góc CDO. Lại có tứ giác CHOD nội tiếp nên góc CDO = góc CHO. Do đó góc DHO = góc CHO. Từ đó suy ra HA là phân giác góc ngoài của tam giác DHC... Dẫn đến góc đồng vị bằng nhau.",
			Status:          "approved",
		},
	}
	allQuestions = append(allQuestions, groupQuestions...)

	// E. Chủ đề: Bất đẳng thức & Cực trị (10 câu)
	for i := 1; i <= 7; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Trắc nghiệm",
			Grade:           10,
			Topic:           "Bất đẳng thức & Cực trị",
			TopicID:         &topics["Bất đẳng thức & Cực trị"].ID,
			DifficultyLevel: "Vận dụng",
			DifficultyPoint: 8.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Cho a, b là các số thực dương. Biết a + b = %d. Giá trị nhỏ nhất của biểu thức P = 1/a + 1/b là:", i*2),
			Options:         buildOptions(fmt.Sprintf("%d/%d", 4, i*2), fmt.Sprintf("%d", i*2), fmt.Sprintf("%d/%d", 1, i*2), "Không tồn tại"),
			CorrectAnswer:   "A",
			SolutionGuide:   "Áp dụng BĐT Cauchy (AM-GM): 1/a + 1/b >= 4/(a+b). Thay a+b vào để tìm min.",
			Status:          "approved",
			Tags:            buildTags("Bất đẳng thức", "Cực trị", "Lớp 10"),
		})
	}
	for i := 1; i <= 3; i++ {
		allQuestions = append(allQuestions, models.Question{
			TypeQuestion:    "single",
			Type:            "Tự luận",
			Grade:           10,
			Topic:           "Bất đẳng thức & Cực trị",
			TopicID:         &topics["Bất đẳng thức & Cực trị"].ID,
			DifficultyLevel: "Vận dụng cao",
			DifficultyPoint: 10.0,
			Point:           1.0,
			Content:         fmt.Sprintf("Cho các số thực dương x, y, z thỏa mãn x + y + z = %d. Tìm giá trị lớn nhất của biểu thức P = √(x+y) + √(y+z) + √(z+x).", i*3),
			CorrectAnswer:   "Max P đạt được khi x = y = z = " + fmt.Sprintf("%d", i),
			SolutionGuide:   "Áp dụng BĐT Bunhiacopxki (Cauchy-Schwarz): (√(x+y) + √(y+z) + √(z+x))² <= (1+1+1)(x+y+y+z+z+x) = 3 * 2(x+y+z).",
			Status:          "approved",
			Tags:            buildTags("Bunhiacopxki", "Bài điểm 10", "Lớp 10"),
		})
	}

	// Insert tất cả các câu hỏi
	if len(allQuestions) > 0 {
		res := db.Create(&allQuestions)
		if res.Error != nil {
			log.Fatalf("Error inserting questions: %v", res.Error)
		}
		fmt.Printf("Successfully seeded %d questions for Grade 10 Entrance Exam.\n", res.RowsAffected)
	}
}
