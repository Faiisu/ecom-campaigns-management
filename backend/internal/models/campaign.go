package models

import "time"

type Campaign struct {
	ID                 string    `json:"id" bson:"_id,omitempty"`
	Name               string    `json:"name" bson:"name"`
	Description        string    `json:"description,omitempty" bson:"description,omitempty"`
	DiscountType       string    `json:"discount_type" bson:"discount_type"` // "percent", "fixed", "userPoint"
	DiscountValue      float64   `json:"discount_value" bson:"discount_value"`
	CampaignCategoryID string    `json:"campaign_category_id" bson:"campaign_category_id"`
	IsActive           bool      `json:"is_active" bson:"is_active"`
	StartAt            time.Time `json:"start_at" bson:"start_at"`
	EndAt              time.Time `json:"end_at" bson:"end_at"`
}

type CampaignTargetCategory struct {
	CampaignID        string `json:"campaign_id" bson:"campaign_id"`
	ProductCategoryID string `json:"product_category_id" bson:"product_category_id"`
}

type CampaignsCategories struct {
	ID          string `json:"id" bson:"_id,omitempty"`
	Name        string `json:"name" bson:"name"`
	Description string `json:"description" bson:"description"`
}
