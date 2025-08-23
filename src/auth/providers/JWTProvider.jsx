/* eslint-disable no-unused-vars */
import { createContext, useState } from "react";
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

  const verify = async () => {
    if (auth) {
      try {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          setCurrentUser(JSON.parse(storedUserData));
        }
      } catch {
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };

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

  const login = async (email, password) => {
    try {
      const response = await LoginUser({
        email,
        password,
      });

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
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Login failed. Please try again.");
      }
    }
  };
  const register = async (email, password, password_confirmation) => {
    try {
      const { data: auth } = await axios.post(REGISTER_URL, {
        email,
        password,
        password_confirmation,
      });
      saveAuth(auth);
      const { data: user } = await getUser();
      setCurrentUser(user);
    } catch (error) {
      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const requestPasswordResetLink = async (email) => {
    await axios.post(FORGOT_PASSWORD_URL, {
      email,
    });
  };

  const changePassword = async (
    email,
    token,
    password,
    password_confirmation
  ) => {
    await axios.post(RESET_PASSWORD_URL, {
      email,
      token,
      password,
      password_confirmation,
    });
  };

  const getUser = async () => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      return { data: JSON.parse(storedUserData) };
    }
    throw new Error("No user data found");
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
        register,
        requestPasswordResetLink,
        changePassword,
        getUser,
        logout,
        verify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthProvider };
