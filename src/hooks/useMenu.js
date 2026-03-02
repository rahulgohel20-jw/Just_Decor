import { applyMenuRights } from "@/utils/applyMenuRights";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthContext } from "@/auth";
import { useMemo } from "react";
import { useLocation } from "react-router";

import {
  allMenuItems,
  superAdminMenuItems,
  disableMenuItems,
} from "../config/menu.config";
import { recipeMenuItems } from "../config/menu.recipe";


export const useMenu = () => {
  const { currentUser, loading } = useAuthContext();
  const rights = useAuthStore((state) => state.rights);
  const location = useLocation();

  const menu = useMemo(() => {
    const isRecipeModule = location.pathname.startsWith("/recipe");

    if (!currentUser) {
      return disableMenuItems(
        isRecipeModule ? recipeMenuItems : allMenuItems
      );
    }

    const roleId = Number(currentUser?.userBasicDetails?.role?.id);
    const clientId = currentUser?.clientId;
    const plan = currentUser?.plan;
    const isApproved = currentUser?.isApprove === true;

    const isSuperSystem = roleId === 1 || clientId === 1;

    // 🔥 SWITCH BASE MENU
    let baseMenu;

    if (isRecipeModule) {
      baseMenu = recipeMenuItems;
    } else {
      baseMenu = isSuperSystem
        ? superAdminMenuItems
        : allMenuItems;
    }

    if (!plan || !isApproved) {
      return disableMenuItems(baseMenu);
    }

    if (roleId === 1 || roleId === 2) {
      return baseMenu;
    }

    // 👥 Members → apply rights
    return applyMenuRights(baseMenu, rights);
  }, [currentUser, rights, location.pathname]);

  return { menu, loading };
};