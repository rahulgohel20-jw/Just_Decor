/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect } from "react";
import { LoginUser } from "@/services/apiServices";
import * as authHelper from "../_helpers";

const API_URL = import.meta.env.VITE_APP_API_URL;
export const REGISTER_URL = `${API_URL}/register`;
export const FORGOT_PASSWORD_URL = `${API_URL}/forgot-password`;
export const RESET_PASSWORD_URL = `${API_URL}/reset-password`;
export const GET_USER_URL = `${API_URL}/user`;

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState();

  const saveAuth = (auth) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
    }
  };

  const verify = async () => {
    const userToken = localStorage.getItem("userToken");
    const storedUserData = localStorage.getItem("userData");

    if (userToken && storedUserData) {
      setCurrentUser(JSON.parse(storedUserData));
    } else {
      saveAuth(undefined);
      setCurrentUser(undefined);
    }
    setLoading(false);
  };

  useEffect(() => {
    verify();

    //  Listen for localStorage changes (even from same tab)
    const handleStorageChange = () => {
      const userToken = localStorage.getItem("userToken");
      const storedUserData = localStorage.getItem("userData");

      if (!userToken || !storedUserData) {
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await LoginUser({ email, password });
      if (response.data.success && response.data.data["User Details"]) {
        const userData = response.data.data["User Details"][0];

        const auth = {
          access_token: userData.token,
          token_type: userData.tokenType,
          expires_in: userData.expiresIn,
          user: {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            contactNo: userData.contactNo,
            isActive: userData.isActive,
            isApprove: userData.isApprove,
            clientId: userData.clientId,
            createdAt: userData.createdAt,
          },
        };

        saveAuth(auth);
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("userToken", userData.token);
        setCurrentUser(userData);

        return auth;
      } else {
        throw new Error("Login failed: Invalid credentials");
      }
    } catch (error) {
      saveAuth(undefined);
      setCurrentUser(undefined);
      throw new Error(error.response?.data?.msg || error.message || "Login failed. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("phone");
    localStorage.removeItem("userData");
    localStorage.removeItem("userToken");
    localStorage.removeItem("email");
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        logout,
        verify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
