// // lib/redux/slices/authSlice.ts
// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { loginApi } from '../../api/authApi';
// import { getItem, removeItem, setItem } from '../../utils/storage';

// // Simulated registration API
// export const registerApi = async (name: string, email: string, password: string) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (password.length >= 6) {
//         resolve({ 
//           token: 'fake-jwt-token-' + Date.now(), 
//           username: name || email.split('@')[0] 
//         });
//       } else {
//         reject(new Error('Password must be at least 6 characters'));
//       }
//     }, 1000);
//   });
// };

// export const login = createAsyncThunk('auth/login', async ({ email, password }: any) => {
//   const res: any = await loginApi(email, password);
//   await setItem('token', res.token);
//   await setItem('username', res.username);
//   return res;
// });

// // Add register async thunk
// export const register = createAsyncThunk('auth/register', async ({ name, email, password }: any) => {
//   const res: any = await registerApi(name, email, password);
//   await setItem('token', res.token);
//   await setItem('username', res.username);
//   return res;
// });

// // Load persisted auth from storage on app start
// export const loadAuth = createAsyncThunk('auth/load', async () => {
//   const token = await getItem('token');
//   const username = await getItem('username');
//   return { token, username };
// });

// // Define proper types for the state
// interface AuthState {
//   email: string | null;  
//   token: string | null;
//   username: string | null;
//   loading: boolean;
//   error: string | null;
// }

// // Use the typed initialState
// const initialState: AuthState = {
//   email:'',  
//   token: null,
//   username: null,
//   loading: false,
//   error: null,
// };

// const slice = createSlice({
//   name: 'auth',
//   initialState, // Use the typed initialState here
//   reducers: {
//     logout(state) {
//       state.token = null;
//       state.username = null;
//       state.error = null; // Also clear error on logout
//       removeItem('token');
//       removeItem('username');
//     },
//     setCredentials(state, action) {
//       state.token = action.payload.token;
//       state.username = action.payload.username;
//       state.error = null; // Clear error when setting credentials
//     },
//     clearError(state) {
//       state.error = null; // Add this reducer to clear errors
//     },
//     loadAuth: (state, action: PayloadAction<{ token: string | null; username: string | null }>) => {
//       if (action.payload?.token) {
//         state.token = action.payload.token;
//         state.username = action.payload.username;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login cases
//       .addCase(login.pending, (state) => { 
//         state.loading = true; 
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => { 
//         state.loading = false; 
//         state.token = action.payload.token; 
//         state.username = action.payload.username;
//         state.error = null;
//       })
//       .addCase(login.rejected, (state, action) => { 
//         state.loading = false; 
//         state.error = action.error.message || 'Login failed';
//       })
//       // Register cases
//       .addCase(register.pending, (state) => { 
//         state.loading = true; 
//         state.error = null;
//       })
//       .addCase(register.fulfilled, (state, action) => { 
//         state.loading = false; 
//         state.token = action.payload.token; 
//         state.username = action.payload.username;
//         state.error = null;
//       })
//       .addCase(register.rejected, (state, action) => { 
//         state.loading = false; 
//         state.error = action.error.message || 'Registration failed';
//       })
//       // Load auth cases
//       .addCase(loadAuth.pending, (state) => { 
//         state.loading = true; 
//       })
//       .addCase(loadAuth.fulfilled, (state, action) => { 
//         state.loading = false; 
//         if (action.payload?.token) { 
//           state.token = action.payload.token; 
//           state.username = action.payload.username; 
//         }
//       })
//       .addCase(loadAuth.rejected, (state) => { 
//         state.loading = false; 
//       });
//   }
// });

// export const { logout, setCredentials, clearError} = slice.actions;
// export default slice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setItem, getItem, removeItem } from '../../utils/storage';
import { loginApi, registerApi, getCurrentUser, AuthResponse } from '../../../lib/api/authApi';
import { User, LoginCredentials, RegisterData, AuthState } from '../../../types/auth';

// Helper function to map API response to User type
const mapAuthResponseToUser = (data: AuthResponse): User => ({
  id: data.id.toString(),
  email: data.email,
  name: `${data.firstName} ${data.lastName}`,
  firstName: data.firstName,
  lastName: data.lastName,
  username: data.username,
  avatar: data.image,
  image: data.image,
  gender: data.gender,
  createdAt: new Date().toISOString(),
});

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      const user = mapAuthResponseToUser(response);
      
      // Store auth data
      await setItem('auth', {
        user,
        token: response.token,
      });
      
      return { user, token: response.token };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await registerApi(userData);
      const user = mapAuthResponseToUser(response);
      
      await setItem('auth', {
        user,
        token: response.token,
      });
      
      return { user, token: response.token };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const loadAuth = createAsyncThunk(
  'auth/load',
  async (_, { rejectWithValue }) => {
    try {
      const authData = await getItem('auth');
      if (authData && authData.token) {
        try {
          // Verify token and get current user from DummyJSON
          const response = await getCurrentUser(authData.token);
          const user = mapAuthResponseToUser(response);
          return { user, token: authData.token };
        } catch (error) {
          // Token might be expired, clear stored auth
          await removeItem('auth');
          throw new Error('Session expired');
        }
      }
      return null;
    } catch (error: any) {
      await removeItem('auth');
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      removeItem('auth');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        const authData = { user: state.user, token: state.token };
        setItem('auth', authData);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Load Auth
      .addCase(loadAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;