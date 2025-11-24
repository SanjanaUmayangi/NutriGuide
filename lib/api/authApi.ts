// // lib/api/authApi.ts
// export async function loginApi(email: string, password: string) {
//   // mock: accept any
//   return new Promise((resolve) => {
//     setTimeout(() => resolve({ token: 'fake-token', username: email.split('@')[0] }), 700);
//   });
// }



import { LoginCredentials, RegisterData, User } from '../../types/auth';

// DummyJSON API endpoints
const BASE_URL = 'https://dummyjson.com';

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

export interface LoginResponse extends AuthResponse {
  // Additional login-specific fields if needed
}

export interface RegisterResponse extends AuthResponse {
  // Additional register-specific fields if needed
}

// Mock register function since DummyJSON doesn't have real registration
export async function registerApi(userData: RegisterData): Promise<AuthResponse> {
  // Since DummyJSON doesn't have a real register endpoint, we'll mock it
  await new Promise(resolve => setTimeout(resolve, 1000));
    // Split name into first and last name for DummyJSON format
  const nameParts = userData.name.split(' ');
  
  return {
    id: Math.floor(Math.random() * 1000),
    username: userData.email.split('@')[0],
    email: userData.email,
    firstName: userData.name.split(' ')[0] || 'User',
    lastName: userData.name.split(' ')[1] || 'Name',
    gender: 'male', // default
    image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    token: 'dummy_token_' + Math.random().toString(36).substr(2, 9),
  };
}


export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: credentials.username, // 🆕 Use username instead of email
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json();
  return data;
}

// Get current user (verify token)
export async function getCurrentUser(token: string): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get current user');
  }

  const data = await response.json();
  return { ...data, token }; // Include token in response
}

