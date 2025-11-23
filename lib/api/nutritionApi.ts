// lib/api/nutritionApi.ts
import axios from "axios";
import { API_NINJAS_KEY } from "../../constants/config";
import { FoodItem } from "../../types/food";
import { fetchFoodImage } from "./imageApi";

function mapApiToFoodItem(api: any, image?: string): FoodItem {
  return {
    id: Math.random().toString(36).substring(2, 12),
    name: api.name,
    brand: "",
    calories: api.calories,
    sugar: 0,
    fat: api.fat_total_g,
    protein: api.protein_g,
    carbohydrates: api.carbohydrates_total_g,
    image, // assign Pixabay image
  };
}

export async function fetchNutrition(query: string): Promise<FoodItem[]> {
  try {
    // 1️⃣ Get nutrition data
    let nutritionData: any[] = [];

    if (!API_NINJAS_KEY) {
      nutritionData = [{
        name: query,
        calories: 90,
        fat_total_g: 1,
        protein_g: 0.5,
        carbohydrates_total_g: 20
      }];
    } else {
      const res = await axios.get(
        `https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`,
        { headers: { "X-Api-Key": API_NINJAS_KEY } }
      );
      nutritionData = res.data;
    }

    // 2️⃣ Get image from Pixabay
    const imageUrl = await fetchFoodImage(query);

    // 3️⃣ Map results
    //return nutritionData.map(item => mapApiToFoodItem(item, imageUrl));
    return nutritionData.map(item => ({
      ...item,
      image: imageUrl, // attach image from Unsplash
    }));
  } catch (e) {
    console.warn("nutritionApi error", e);
    return [];
  }
}
