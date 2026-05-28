package utils

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey []byte

func getSecretKey() []byte {
	if len(secretKey) == 0 {
		key := os.Getenv("JWT_SECRET")
		if key == "" {
			panic("FATAL ERROR: JWT_SECRET environment variable is missing. Cần cấu hình biến môi trường này để chạy ứng dụng an toàn.")
		}
		secretKey = []byte(key)
	}
	return secretKey
}

type Claims struct {
	UserID    uint   `json:"user_id"`
	Role      string `json:"role"`
	TokenType string `json:"token_type"` // "access" or "refresh"
	jwt.RegisteredClaims
}

// GenerateTokens generates both an access token (15m) and a refresh token (7d)
func GenerateTokens(userID uint, role string) (accessToken string, refreshToken string, err error) {
	// 1. Access Token (15 phút)
	accessExpirationTime := time.Now().Add(15 * time.Minute)
	accessClaims := &Claims{
		UserID:    userID,
		Role:      role,
		TokenType: "access",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(accessExpirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	accToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessToken, err = accToken.SignedString(getSecretKey())
	if err != nil {
		return "", "", err
	}

	// 2. Refresh Token (7 ngày)
	refreshExpirationTime := time.Now().Add(7 * 24 * time.Hour)
	refreshClaims := &Claims{
		UserID:    userID,
		Role:      role,
		TokenType: "refresh",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(refreshExpirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	refToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshToken, err = refToken.SignedString(getSecretKey())
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

// ParseToken validates a token and ensures it's an access token
func ParseToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return getSecretKey(), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	if claims.TokenType != "access" && claims.TokenType != "" { // "" for backward compatibility temporarily if needed
		return nil, errors.New("invalid token type: expected access token")
	}

	return claims, nil
}

// ValidateRefreshToken validates a token and ensures it's a refresh token
func ValidateRefreshToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return getSecretKey(), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	if claims.TokenType != "refresh" {
		return nil, errors.New("invalid token type: expected refresh token")
	}

	return claims, nil
}
