package handlers

import (
	"context"
	"time"

	"github.com/faiisu/ecom-backend/internal/db"
	"github.com/faiisu/ecom-backend/internal/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	users     *mongo.Collection
	jwtSecret []byte
}

// NewAuthHandler constructs an AuthHandler instance.
func NewAuthHandler(users *mongo.Collection, jwtSecret string) *AuthHandler {
	return &AuthHandler{users: users, jwtSecret: []byte(jwtSecret)}
}

type RegisterRequest struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type userDocument struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	Email        string             `bson:"email"`
	PasswordHash string             `bson:"password_hash"`
	FirstName    string             `bson:"first_name"`
	LastName     string             `bson:"last_name"`
	CreatedAt    time.Time          `bson:"created_at"`
}

type RegisterResponse struct {
	Message string              `json:"Message"`
	User    RegisterUserPayload `json:"user"`
}

type RegisterUserPayload struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type UsersResponse struct {
	Users []models.User `json:"users"`
}

// Register godoc
// @Summary Register a new user
// @Description Creates a new user account with hashed password.
// @Tags Auth
// @Accept json
// @Produce json
// @Param register body RegisterRequest true "Register payload"
// @Success 201 {object} RegisterResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /register [post]
func Register(c *fiber.Ctx) error {
	// Parse and validate request
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{Error: "Invalid request"})
	}

	//validate email and password
	if req.Email == "" || req.Password == "" || req.FirstName == "" || req.LastName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{Error: "Incomplete registration details"})
	}

	//Hash Password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{Error: "Failed to process password"})
	}

	user := models.User{
		ID:            uuid.New().String(),
		Email:         req.Email,
		Password_hash: string(hashedPassword),
		FirstName:     req.FirstName,
		LastName:      req.LastName,
		CreatedAt:     time.Now(),
	}

	// Insert into database
	_, err = db.UserCollection.InsertOne(context.Background(), user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{Error: "Failed to create user"})
	}

	resp := RegisterResponse{
		Message: "User registered successfully",
		User: RegisterUserPayload{
			ID:        user.ID,
			Email:     user.Email,
			FirstName: user.FirstName,
			LastName:  user.LastName,
		},
	}

	return c.Status(fiber.StatusCreated).JSON(resp)
}

func Login(c *fiber.Ctx) error {
	return c.SendString("Login endpoint - to be implemented")
}
