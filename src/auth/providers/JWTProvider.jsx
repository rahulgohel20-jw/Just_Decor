import { createContext, useState, useEffect, useRef } from "react";
import { LoginUser } from "@/services/apiServices";
import * as authHelper from "../_helpers";
import { LoginOutUser } from "../../services/apiServices";
import { message } from "antd";

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
  const inactivityTimerRef = useRef(null);

  const INACTIVITY_LIMIT = 10 * 60 * 60 * 1000;

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

        // ✅ Save auth
        saveAuth(auth);
        console.log("email fetch", auth.user.email);

        // ✅ Store user data and token
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("userToken", userData.token);
        localStorage.setItem("lang", "en");

        try {
          await LoginOutUser(auth.user.email, "login");
          message.success("login Successfully");
        } catch (apiError) {
          console.error("Failed to send login notification:", apiError);
          // Continue with logout even if API call fails
        }

        // ✅ Store userId separately (for easy access later)
        if (userData.id) {
          localStorage.setItem("userId", userData.id.toString());
        }

        setCurrentUser(userData);

        startInactivityTimer(); // Start inactivity tracking after login
        return auth;
      } else {
        throw new Error("Login failed: Invalid credentials");
      }
    } catch (error) {
      saveAuth(undefined);
      setCurrentUser(undefined);
      throw new Error(
        error.response?.data?.msg ||
          error.message ||
          "Login failed. Please try again."
      );
    }
  };

  const logout = async () => {
    try {
      // Get user email before clearing localStorage
      const storedUserData = localStorage.getItem("userData");
      let userEmail = currentUser?.email;

      // If currentUser is not set, try to get email from localStorage
      if (!userEmail && storedUserData) {
        const userData = JSON.parse(storedUserData);
        userEmail = userData.email;
      }
      console.log("email", userEmail);

      // Call logout API if email exists
      if (userEmail) {
        try {
          await LoginOutUser(userEmail, "logout");
          console.log("Logout notification sent successfully");
          message.success("Logout Successfully");
        } catch (apiError) {
          console.error("Failed to send logout notification:", apiError);
          // Continue with logout even if API call fails
        }
      }

      // Clear all localStorage items
      localStorage.removeItem("phone");
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
      localStorage.removeItem("email");
      localStorage.removeItem("userProfileForm");

      // Clear auth state
      saveAuth(undefined);
      setCurrentUser(undefined);
    } catch (error) {
      console.error("Error during logout:", error);

      // Force logout even if there's an error
      localStorage.removeItem("phone");
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
      localStorage.removeItem("email");
      localStorage.removeItem("userProfileForm");
      saveAuth(undefined);
      setCurrentUser(undefined);
    }
  };

  // -------------------------------
  // 🔸 Inactivity Timer Logic
  // -------------------------------
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimerRef.current);

    inactivityTimerRef.current = setTimeout(async () => {
      console.warn("Auto logout due to inactivity");

      try {
        // Get user email before logout
        const storedUserData = localStorage.getItem("userData");
        let userEmail = currentUser?.email;

        if (!userEmail && storedUserData) {
          const userData = JSON.parse(storedUserData);
          userEmail = userData.email;
        }

        if (userEmail) {
          try {
            // 👇 Call the API before logging out
            await LoginOutUser(userEmail, "auto-logout");
          } catch (apiError) {
            console.error("Failed to send auto-logout notification:", apiError);
          }
        }

        // ✅ Proceed with regular logout cleanup
        logout();
      } catch (err) {
        console.error("Error during auto logout:", err);
        logout(); // Force logout anyway
      }
    }, INACTIVITY_LIMIT);
  };

  const startInactivityTimer = () => {
    resetInactivityTimer();

    const activityEvents = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Cleanup when user logs out or component unmounts
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInactivityTimer();
    };
  };

  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  // Start timer when user is logged in
  useEffect(() => {
    if (currentUser) {
      const cleanup = startInactivityTimer();
      return cleanup;
    } else {
      clearInactivityTimer();
    }
  }, [currentUser]);

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
