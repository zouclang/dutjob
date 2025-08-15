import { createContext } from "react";

type UserRole = "job_seeker" | "job_poster" | null;

export const AuthContext = createContext({
  isAuthenticated: false,
  userRole: null as UserRole,
  setIsAuthenticated: (value: boolean, role?: UserRole) => {},
  logout: () => {},
});