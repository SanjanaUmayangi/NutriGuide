export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar?: string;
  image?: string;
  gender?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;

  password: string;
}

export interface RegisterData {
  username: string;
  name: string;
//   firsname: string;
//   lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}