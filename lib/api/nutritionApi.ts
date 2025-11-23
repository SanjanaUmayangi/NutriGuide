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
        `https://api.calorieninjas.com/v1/nutrition?query=${query}`,
        { headers: { "X-Api-Key": API_NINJAS_KEY } }
      );
      nutritionData = Array.isArray(res.data.items) ? res.data.items : [];
    
    }

    // 2️⃣ Get image from Pixabay
    const imageUrl = await fetchFoodImage(query);

     // Map API response to your FoodItem type
    return nutritionData.map(item => ({
      id: Math.random().toString(36).substring(2, 12),
      name: item.name || query,
      brand: "",
      //calories: item.calories,
      calories: typeof item.calories === "number" ? item.calories : 23,
      sugar: typeof item.sugar_g === "number" ? item.sugar_g : 0,
      fat: typeof item.fat_total_g === "number" ? item.fat_total_g : 0,
      fat_saturated: item.fat_saturated_g,
      protein: item.protein_g,
      carbohydrates: typeof item.carbohydrates_total_g === "number" ? item.carbohydrates_total_g : 0,
      fiber: item.fiber_g,
      serving_size_g: item.serving_size_g,
      sodium_mg: item.sodium_mg,
      potassium_mg: item.potassium_mg,
      cholesterol_mg: item.cholesterol_mg,
      image: imageUrl,
    }));
  } catch (e) {
    console.warn("nutritionApi error", e);
    return [];
  }
}




// // lib/api/nutritionApi.ts
// import axios from "axios";
// import { OPENFOODFACTS_API_URL } from "../../constants/config";
// import { FoodItem } from "../../types/food";
// import { fetchFoodImage } from "./imageApi";

// // Map OpenFoodFacts data to your FoodItem interface
// function mapOpenFoodFactsToFoodItem(product: any): FoodItem {
//   const nutriments = product.nutriments || {};
  
//   return {
//     id: product.code || Math.random().toString(36).substring(2, 12),
//     name: product.product_name || product.product_name_en || 'Unknown Food',
//     brand: product.brands || '',
//     calories: nutriments['energy-kcal'] || nutriments['energy-kcal_100g'] || 0,
//     sugar: nutriments.sugars || nutriments.sugars_100g || 0,
//     fat: nutriments.fat || nutriments.fat_100g || 0,
//     protein: nutriments.proteins || nutriments.proteins_100g || 0,
//     carbohydrates: nutriments.carbohydrates || nutriments.carbohydrates_100g || 0,
//     image: product.image_url, // OpenFoodFacts image as fallback
//   };
// }

// export async function fetchNutrition(query: string): Promise<FoodItem[]> {
//   try {
//     // 1️⃣ First get Unsplash image
//     const unsplashImage = await fetchFoodImage(query);
    
//     // 2️⃣ Search OpenFoodFacts for nutrition data
//     const searchResponse = await axios.get(
//       `${OPENFOODFACTS_API_URL}/search`,
//       {
//         params: {
//           search_terms: query,
//           page_size: 5, // Get top 5 results
//           json: true
//         }
//       }
//     );

//     const products = searchResponse.data.products || [];

//     if (products.length === 0) {
//       // If no products found, return basic item with Unsplash image
//       return [{
//         id: Math.random().toString(36).substring(2, 12),
//         name: query,
//         brand: "",
//         calories: 0,
//         sugar: 0,
//         fat: 0,
//         protein: 0,
//         carbohydrates: 0,
//         image: unsplashImage, // Use Unsplash image
//       }];
//     }

//     // Map products to FoodItem format
//     const foodItems: FoodItem[] = [];

//     for (const product of products) {
//       if (product.product_name && hasValidNutrition(product)) {
//         const foodItem = mapOpenFoodFactsToFoodItem(product);
        
//         // Prioritize Unsplash image, fallback to OpenFoodFacts image
//         foodItem.image = unsplashImage || product.image_url;
        
//         foodItems.push(foodItem);
        
//         // Only return one good result to avoid duplicates
//         if (foodItems.length >= 3) break;
//       }
//     }

//     // If no valid products found, return at least one with the query name
//     if (foodItems.length === 0) {
//       return [{
//         id: Math.random().toString(36).substring(2, 12),
//         name: query,
//         brand: "",
//         calories: 0,
//         sugar: 0,
//         fat: 0,
//         protein: 0,
//         carbohydrates: 0,
//         image: unsplashImage,
//       }];
//     }

//     return foodItems;

//   } catch (error) {
//     console.warn("API error:", error);
    
//     // Fallback with Unsplash image
//     const unsplashImage = await fetchFoodImage(query);
//     return [{
//       id: Math.random().toString(36).substring(2, 12),
//       name: query,
//       brand: "",
//       calories: 0,
//       sugar: 0,
//       fat: 0,
//       protein: 0,
//       carbohydrates: 0,
//       image: unsplashImage,
//     }];
//   }
// }

// // Helper function to check if product has valid nutrition data
// function hasValidNutrition(product: any): boolean {
//   const nutriments = product.nutriments || {};
//   return !!(nutriments['energy-kcal'] || nutriments['energy-kcal_100g'] || 
//            nutriments.proteins || nutriments.proteins_100g);
// }