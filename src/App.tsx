import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import JobPosting from "@/pages/JobPosting";
import JobListings from "@/pages/JobListings";
import JobDetail from "@/pages/JobDetail";
import { useState, useEffect } from "react";
import { AuthContext } from '@/contexts/authContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type UserRole = "job_seeker" | "job_poster" | null;

export default function App() {
  // Initialize auth state from localStorage on app load
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  useEffect(() => {
    const initAuth = () => {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser);
          if (user && user.role) {
            setIsAuthenticated(true);
            setUserRole(user.role);
          }
        } catch (error) {
          console.error('Failed to parse user data', error);
          localStorage.removeItem('currentUser');
        }
      }
    };

    initAuth();
  }, []);

  const login = (role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, setIsAuthenticated: login, logout }}
    >
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/post-job" element={<JobPosting />} />
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}
