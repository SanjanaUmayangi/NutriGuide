// lib/redux/slices/foodSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FoodItem } from "../../../types/food";
import { fetchNutrition } from "../../api/nutritionApi";

interface FoodState {
  items: FoodItem[];
  loading: boolean;
   searchQuery: string;
}

const initialState: FoodState = {
  items: [],
  loading: false,
  searchQuery: '',
};

export const fetchFoods = createAsyncThunk<FoodItem[], string>(
  "foods/fetchFoods",
  async (query: string) => {
    return await fetchNutrition(query);
  }
);

const foodSlice = createSlice({
  name: "foods",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoods.pending, (state) => { state.loading = true; })
      .addCase(fetchFoods.fulfilled, (state, action: PayloadAction<FoodItem[]>) => {
        const newItems = action.payload.filter(
          item => !state.items.some(existing => existing.name === item.name)
        );
        state.items = [...state.items, ...newItems];
        state.loading = false;
      })

      .addCase(fetchFoods.rejected, (state) => { state.loading = false; });
  }
});

export default foodSlice.reducer;
