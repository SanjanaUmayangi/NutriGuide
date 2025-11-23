// hooks/useNutrition.ts
import { useState } from "react";
import { FoodItem } from "../types/food";
import { fetchNutrition } from "../lib/api/nutritionApi";

export default function useNutrition() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const data = await fetchNutrition(query);
      setResults(data);
    } catch {
      setError("Failed to load nutrition data.");
    } finally {
      setLoading(false);
    }
  };

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search
  };
}
