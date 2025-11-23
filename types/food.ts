export interface FoodItem {
  id: string;
  name: string;
  brand: string;
  calories: number;
  sugar: number;
  fat: number;
  protein: number;
  carbohydrates: number;
  fat_saturated?: number;
  fiber?: number;               // new
  serving_size_g?: number;      // new
  sodium_mg?: number;           // new
  potassium_mg?: number;        // new
  cholesterol_mg?: number;
  image?: string;
}

export interface FoodDetails extends FoodItem {
  ingredients: string[];
  vitamins: string[];
  allergens?: string[];
}

export interface FavouriteFood {
  id: string;
  foodId: string;
  savedAt: string;
}

export interface DailyCalorieEntry {
  id: string;
  foodId: string;
  calories: number;
  addedAt: string;
}
