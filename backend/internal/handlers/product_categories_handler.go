package handlers

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/faiisu/ecom-backend/internal/db"
	"github.com/faiisu/ecom-backend/internal/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RegisterProductCategory struct {
	Name string `json:"name"`
}

// AddProductCategory godoc
// @Summary Create a new product category
// @Tags Products
// @Accept json
// @Produce json
// @Param category body RegisterProductCategory true "Category payload"
// @Success 201 {object} models.ProductCategory
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /product-categories [post]
func AddProductCategory(c *fiber.Ctx) error {
	var req RegisterProductCategory
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{Error: "Invalid request"})
	}
	if req.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{Error: "Name is required"})
	}

	cat := models.ProductCategory{
		ID:   uuid.New().String(),
		Name: strings.ToLower(strings.TrimSpace(req.Name)),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var existing models.ProductCategory
	err := db.CategoryCollection.FindOne(ctx, bson.M{"name": cat.Name}).Decode(&existing)
	if err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{Error: "Category already exists"})
	}
	if !errors.Is(err, mongo.ErrNoDocuments) {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{Error: "Failed to check existing category"})
	}

	if _, err := db.CategoryCollection.InsertOne(ctx, cat); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{Error: "Failed to create category"})
	}
	return c.Status(fiber.StatusCreated).JSON(cat)
}

// GetProductCategories godoc
// @Summary Get all product categories
// @Description Retrieve a list of all product categories
// @Tags Products
// @Accept json
// @Produce json
// @Success 200 {array} models.ProductCategory
// @Failure 500 {object} ErrorResponse
// @Router /product-categories [get]
func GetProductCategories(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var categories []models.ProductCategory
	cursor, err := db.CategoryCollection.Find(ctx, bson.M{})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{Error: "Failed to fetch categories"})
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &categories); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{Error: "Failed to decode categories"})
	}

	return c.JSON(categories)
}

// DeleteProductCategory godoc
// @Summary Delete a product category
// @Description Delete a product category by ID
// @Tags Products
// @Accept json
// @Produce json
// @Param id path string true "Category ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /product-categories/{id} [delete]
func DeleteProductCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{Error: "Category ID is required"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := db.CategoryCollection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{Error: "Failed to delete category"})
	}

	if result.DeletedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(ErrorResponse{Error: "Category not found"})
	}

	return c.JSON(fiber.Map{"status": "Category deleted successfully"})
}
