export interface FoodItem {
  id: string;
  name: string;
  brand: string;
  calories: number;
  sugar: number;
  fat: number;
  protein: number;
  carbohydrates: number;
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
