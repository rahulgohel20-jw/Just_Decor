import { applyMenuRights } from "@/utils/applyMenuRights";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthContext } from "@/auth";
import { useMemo } from "react";
import {
  allMenuItems,
  superAdminMenuItems,
  disableMenuItems,
} from "../config/menu.config";

export const useMenu = () => {
  const { currentUser, loading } = useAuthContext();
  const rights = useAuthStore((state) => state.rights);

  const menu = useMemo(() => {
    if (!currentUser) {
      return disableMenuItems(allMenuItems);
    }

    const roleId = Number(currentUser?.userBasicDetails?.role?.id);
    const clientId = currentUser?.clientId;
    const plan = currentUser?.plan;
    const isApproved = currentUser?.isApprove === true;

    // 🔥 Decide Base Menu First
    const isSuperSystem = roleId === 1 || clientId === 1;

    const baseMenu = isSuperSystem ? superAdminMenuItems : allMenuItems;

    // 🔒 Plan restriction
    if (!plan || !isApproved) {
      return disableMenuItems(baseMenu);
    }

    // 👑 Top level roles (Admin & SuperAdmin)
    if (roleId === 1 || roleId === 2) {
      return baseMenu;
    }

    // 👥 Members → apply rights
    return applyMenuRights(baseMenu, rights);
  }, [currentUser, rights]);

  return { menu, loading };
};
