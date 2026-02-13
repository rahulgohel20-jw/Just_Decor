import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      rights: {},

      setAuth: (user, token, rights) =>
        set({
          user,
          token,
          rights,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          rights: {},
        }),
    }),
    {
      name: "auth-storage", // localStorage key
    },
  ),
);
