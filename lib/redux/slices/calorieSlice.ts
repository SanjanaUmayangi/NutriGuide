import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setItem } from '../../utils/storage';
import { FoodItem } from '../../../types/food';

interface TrackerItem extends FoodItem {
  dateAdded: string;
  quantity: number;
}

interface CalorieState {
  items: TrackerItem[];
  dailyGoal: number;
}

const initialState: CalorieState = {
  items: [],
  dailyGoal: 2000, // Default daily calorie goal
};

const calorieSlice = createSlice({
  name: 'calories',
  initialState,
  reducers: {
    // Add food to tracker
    addToTracker: (state, action: PayloadAction<FoodItem & { quantity?: number }>) => {
      const today = new Date().toDateString();
      const existingItem = state.items.find(
        item => item.name === action.payload.name && item.dateAdded === today
      );

      if (existingItem) {
        // Update quantity if already tracked today
        existingItem.quantity += action.payload.quantity || 1;
        existingItem.calories = (action.payload.calories / (action.payload.quantity || 1)) * existingItem.quantity;
        existingItem.protein = (action.payload.protein / (action.payload.quantity || 1)) * existingItem.quantity;
        existingItem.carbohydrates = (action.payload.carbohydrates / (action.payload.quantity || 1)) * existingItem.quantity;
        existingItem.fat = (action.payload.fat / (action.payload.quantity || 1)) * existingItem.quantity;
      } else {
        // Add new item to tracker
        const quantity = action.payload.quantity || 1;
        state.items.push({
          ...action.payload,
          dateAdded: today,
          quantity: quantity,
          calories: action.payload.calories * quantity,
          protein: action.payload.protein * quantity,
          carbohydrates: action.payload.carbohydrates * quantity,
          fat: action.payload.fat * quantity,
        });
      }
      setItem('tracker', state.items);
    },

    // Remove item from tracker
    removeFromTracker: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1);
      setItem('tracker', state.items);
    },

    // Update item quantity
    updateQuantity: (state, action: PayloadAction<{ index: number; quantity: number }>) => {
      const { index, quantity } = action.payload;
      const item = state.items[index];
      const ratio = quantity / item.quantity;
      
      item.quantity = quantity;
      item.calories = item.calories * ratio;
      item.protein = item.protein * ratio;
      item.carbohydrates = item.carbohydrates * ratio;
      item.fat = item.fat * ratio;
      
      setItem('tracker', state.items);
    },

    // Clear today's tracker
    clearTracker: (state) => {
      state.items = [];
      setItem('tracker', state.items);
    },

    // Clear all tracker data (including previous days)
    clearAllTrackerData: (state) => {
      state.items = [];
      setItem('tracker', state.items);
    },

    // Set daily calorie goal
    setDailyGoal: (state, action: PayloadAction<number>) => {
      state.dailyGoal = action.payload;
      setItem('dailyGoal', state.dailyGoal);
    },

    // Load tracker from storage
    setTracker: (state, action: PayloadAction<TrackerItem[]>) => {
      state.items = action.payload;
    },

    // Load daily goal from storage
    setDailyGoalFromStorage: (state, action: PayloadAction<number>) => {
      state.dailyGoal = action.payload;
    },
  },
});

export const {
  addToTracker,
  removeFromTracker,
  updateQuantity,
  clearTracker,
  clearAllTrackerData,
  setDailyGoal,
  setTracker,
  setDailyGoalFromStorage,
} = calorieSlice.actions;

export default calorieSlice.reducer;