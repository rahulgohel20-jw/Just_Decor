import { createContext, useState, useEffect, useRef } from "react";
import { LoginUser, getUserById, LoginOutUser } from "@/services/apiServices";
import * as authHelper from "../_helpers";
import { message } from "antd";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState(null);
  const inactivityTimerRef = useRef(null);

  const INACTIVITY_LIMIT = 10 * 60 * 60 * 1000;

  const saveAuth = (auth) => {
    setAuth(auth);
    if (auth) authHelper.setAuth(auth);
    else authHelper.removeAuth();
  };

  const verify = async () => {
    const token = localStorage.getItem("userToken");
    const userId = localStorage.getItem("mainId");

    if (!token || !userId) {
      saveAuth(undefined);
      setCurrentUser(undefined);
      setLoading(false);
      return;
    }

    try {
      const response = await getUserById(userId);

      if (response?.data?.success) {
        setCurrentUser(response.data.data["User Details"][0]);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Verify failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verify();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await LoginUser({ email, password });

      if (response.data.success && response.data.data["User Details"]) {
        const userData = response.data.data["User Details"][0];

        const authData = {
          userId: userData.id,
          access_token: userData.token,
          token_type: userData.tokenType,
          expires_in: userData.expiresIn,
        };

        saveAuth(authData);

        localStorage.setItem("userToken", userData.token);
        localStorage.setItem("lang", "en");

        const finalUserId =
          userData.clientId === 0 || userData.clientId === -1
            ? userData.id
            : userData.clientId;
        localStorage.setItem("userId", finalUserId.toString());
        localStorage.setItem("mainId", userData.id);

        setCurrentUser(userData);

        try {
          await LoginOutUser(userData.email, "login");
          message.success("Login Successfully");
        } catch {}

        startInactivityTimer();
        return authData;
      }

      throw new Error("Invalid login response");
    } catch (error) {
      saveAuth(undefined);
      setCurrentUser(undefined);
      throw new Error(
        error.response?.data?.msg ||
          error.message ||
          "Login failed. Please try again.",
      );
    }
  };

  const logout = async () => {
    const email = currentUser?.email;

    // window.location.href = "/justcaterings/auth/login";

    try {
      if (email) {
        await LoginOutUser(email, "logout");
      }
    } catch (err) {
      console.error("Logout notification failed:", err);
    }

    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("lang");

    saveAuth(undefined);
    setCurrentUser(undefined);
    clearInactivityTimer();
  };

  // -------------------------------
  // 🔸 Inactivity Timer Logic
  // -------------------------------
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => logout(), INACTIVITY_LIMIT);
  };

  const startInactivityTimer = () => {
    resetInactivityTimer();

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    const onActivity = () => resetInactivityTimer();

    events.forEach((e) => window.addEventListener(e, onActivity));

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      clearInactivityTimer();
    };
  };

  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (currentUser) {
      const cleanup = startInactivityTimer();
      return cleanup;
    } else clearInactivityTimer();
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        currentUser,
        setCurrentUser,
        saveAuth,
        login,
        logout,
        verify, // 👈 Still exposed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
