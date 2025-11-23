// lib/redux/slices/authSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginApi } from '../../api/authApi';
import { getItem, removeItem, setItem } from '../../utils/storage';

// Simulated registration API
export const registerApi = async (name: string, email: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (password.length >= 6) {
        resolve({ 
          token: 'fake-jwt-token-' + Date.now(), 
          username: name || email.split('@')[0] 
        });
      } else {
        reject(new Error('Password must be at least 6 characters'));
      }
    }, 1000);
  });
};

export const login = createAsyncThunk('auth/login', async ({ email, password }: any) => {
  const res: any = await loginApi(email, password);
  await setItem('token', res.token);
  await setItem('username', res.username);
  return res;
});

// Add register async thunk
export const register = createAsyncThunk('auth/register', async ({ name, email, password }: any) => {
  const res: any = await registerApi(name, email, password);
  await setItem('token', res.token);
  await setItem('username', res.username);
  return res;
});

// Load persisted auth from storage on app start
export const loadAuth = createAsyncThunk('auth/load', async () => {
  const token = await getItem('token');
  const username = await getItem('username');
  return { token, username };
});

// Define proper types for the state
interface AuthState {
  token: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}

// Use the typed initialState
const initialState: AuthState = {
  token: null,
  username: null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'auth',
  initialState, // Use the typed initialState here
  reducers: {
    logout(state) {
      state.token = null;
      state.username = null;
      state.error = null; // Also clear error on logout
      removeItem('token');
      removeItem('username');
    },
    setCredentials(state, action) {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.error = null; // Clear error when setting credentials
    },
    clearError(state) {
      state.error = null; // Add this reducer to clear errors
    },
    loadAuth: (state, action: PayloadAction<{ token: string | null; username: string | null }>) => {
      if (action.payload?.token) {
        state.token = action.payload.token;
        state.username = action.payload.username;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => { 
        state.loading = false; 
        state.token = action.payload.token; 
        state.username = action.payload.username;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.error.message || 'Login failed';
      })
      // Register cases
      .addCase(register.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => { 
        state.loading = false; 
        state.token = action.payload.token; 
        state.username = action.payload.username;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.error.message || 'Registration failed';
      })
      // Load auth cases
      .addCase(loadAuth.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(loadAuth.fulfilled, (state, action) => { 
        state.loading = false; 
        if (action.payload?.token) { 
          state.token = action.payload.token; 
          state.username = action.payload.username; 
        }
      })
      .addCase(loadAuth.rejected, (state) => { 
        state.loading = false; 
      });
  }
});

export const { logout, setCredentials, clearError} = slice.actions;
export default slice.reducer;