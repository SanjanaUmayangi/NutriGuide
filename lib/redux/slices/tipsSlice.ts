import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tipsApi } from '../../api/tipsApi';
import { Tip } from '../../../types/api';
import { setItem, getItem } from '../../utils/storage';

interface TipsState {
  items: Tip[];
  featured: Tip[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  bookmarkedTips: string[];
}

const initialState: TipsState = {
  items: [],
  featured: [],
  categories: [],
  selectedCategory: 'All',
  searchQuery: '',
  loading: false,
  error: null,
  bookmarkedTips: [],
};

// Async thunks
export const fetchTips = createAsyncThunk(
  'tips/fetchTips',
  async (category?: string) => {
    const response = await tipsApi.getTips(category);
    return response;
  }
);

export const fetchFeaturedTips = createAsyncThunk(
  'tips/fetchFeaturedTips',
  async () => {
    const response = await tipsApi.getFeaturedTips();
    return response;
  }
);

export const fetchCategories = createAsyncThunk(
  'tips/fetchCategories',
  async () => {
    const response = await tipsApi.getCategories();
    return response;
  }
);

export const searchTips = createAsyncThunk(
  'tips/searchTips',
  async (query: string) => {
    const response = await tipsApi.searchTips(query);
    return response;
  }
);

export const toggleBookmark = createAsyncThunk(
  'tips/toggleBookmark',
  async ({ tipId, bookmarked }: { tipId: string; bookmarked: boolean }) => {
    await tipsApi.bookmarkTip(tipId, bookmarked);
    return { tipId, bookmarked };
  }
);

export const fetchBookmarkedTips = createAsyncThunk(
  'tips/fetchBookmarkedTips',
  async (_, { getState }) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const state = getState() as any;
    const allTips = await tipsApi.getTips(); // Get all tips
    const bookmarkedIds = state.tips.bookmarkedTips;
    
    // Filter to only bookmarked tips
    return allTips.filter(tip => bookmarkedIds.includes(tip.id));
  }
);


const tipsSlice = createSlice({
  name: 'tips',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
    },
    setBookmarkedTips: (state, action: PayloadAction<string[]>) => {
      state.bookmarkedTips = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tips
    builder
      .addCase(fetchTips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTips.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tips';
      })

    // Fetch Featured Tips
    .addCase(fetchFeaturedTips.fulfilled, (state, action) => {
      state.featured = action.payload;
    })

    // Fetch Categories
    .addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    })

    // Search Tips
    .addCase(searchTips.pending, (state) => {
      state.loading = true;
    })
    .addCase(searchTips.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    })
    .addCase(searchTips.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Search failed';
    })

    .addCase(fetchBookmarkedTips.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchBookmarkedTips.fulfilled, (state, action) => {
  state.loading = false;
  state.items = action.payload;
})
.addCase(fetchBookmarkedTips.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message || 'Failed to fetch saved tips';
})

    // Toggle Bookmark
    .addCase(toggleBookmark.fulfilled, (state, action) => {
      const { tipId, bookmarked } = action.payload;
      
      if (bookmarked) {
        if (!state.bookmarkedTips.includes(tipId)) {
          state.bookmarkedTips.push(tipId);
        }
      } else {
        state.bookmarkedTips = state.bookmarkedTips.filter(id => id !== tipId);
      }
      
      // Update the tip in items array
      const tipIndex = state.items.findIndex(tip => tip.id === tipId);
      if (tipIndex !== -1) {
        state.items[tipIndex].isBookmarked = bookmarked;
      }
      
      // Update the tip in featured array
      const featuredIndex = state.featured.findIndex(tip => tip.id === tipId);
      if (featuredIndex !== -1) {
        state.featured[featuredIndex].isBookmarked = bookmarked;
      }
      
      // Save to storage
      setItem('bookmarkedTips', state.bookmarkedTips);
    });
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
  clearSearch,
  setBookmarkedTips,
  clearError,
} = tipsSlice.actions;

export default tipsSlice.reducer;