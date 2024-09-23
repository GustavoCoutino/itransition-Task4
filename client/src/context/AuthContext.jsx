import { createContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = "https://itransition-task4-hk2t.onrender.com";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("auth-token", response.data.token);
      navigate("/admin");
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "An error occurred during login"
      );
    }
  };

  const register = async ({ name, email, password, position }) => {
    try {
      const registrationTime = new Date().toISOString();
      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        position,
        status: true,
        lastLogin: null,
        registration_time: registrationTime,
      });
      navigate("/login");
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "An error occurred during registration"
      );
    }
  };

  const getUsers = async () => {
    const token = localStorage.getItem("auth-token");
    try {
      const response = await axios.get(`${API_URL}/api/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching users"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    navigate("/login");
  };
  return (
    <AuthContext.Provider value={{ login, register, logout, getUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
