import { create } from "zustand";

export const useAuthStore = create((set) => ({
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
}));
