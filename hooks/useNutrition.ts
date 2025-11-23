// // hooks/useNutrition.ts
// import { useState } from "react";
// import { FoodItem } from "../types/food";
// import { fetchNutrition } from "../lib/api/nutritionApi";

// export default function useNutrition() {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<FoodItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const search = async () => {
//     if (!query.trim()) return;

//     setLoading(true);
//     setError("");

//     try {
//       const data = await fetchNutrition(query);
//       setResults(data);
//     } catch {
//       setError("Failed to load nutrition data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     query,
//     setQuery,
//     results,
//     loading,
//     error,
//     search
//   };
// } 
import { useEffect, useState } from 'react';
import { fetchNutrition } from '../lib/api/nutritionApi';
import { FoodItem } from '../types/food';

const defaultFoods = ['banana', 'apple', 'chicken', 'rice', 'egg']; // default foods to show initially

export function useNutrition() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFoods = async (queries: string[]) => {
    setLoading(true);
    try {
      const results: FoodItem[] = [];
      for (const q of queries) {
        const data = await fetchNutrition(q);
        if (data && data.length > 0) {
          results.push(data[0]); // take first result
        }
      }
      setFoods(results);
    } catch (e) {
      console.error('Failed to load nutrition', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load default foods on first render
    loadFoods(defaultFoods);
  }, []);

  return { foods, loading, loadFoods };
}
