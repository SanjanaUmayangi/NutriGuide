// hooks/useAuth.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register, logout, loadAuth } from "../lib/redux/slices/authSlice";
import { RootState } from "../lib/redux/store";

export default function useAuth() {
  const dispatch = useDispatch();
  const { token, username, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Load auth state from storage when hook is used
    dispatch(loadAuth() as any);
  }, [dispatch]);

  const loginUser = (email: string, password: string) => {
    dispatch(login({ email, password }) as any);
  };

  const registerUser = (name: string, email: string, password: string) => {
    dispatch(register({ name, email, password }) as any);
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user: username, // Use username as user
    token,
    loading,
    error,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    isAuthenticated: !!token,
  };
}