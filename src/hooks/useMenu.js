import { useMemo } from "react";
import { useAuthContext } from "../auth/useAuthContext";
import {
  allMenuItems,
  superAdminMenuItems,
  disableMenuItems,
} from "../config/menu.config";
import { applyMenuRights } from "@/utils/applyMenuRights";
import { useAuthStore } from "@/store/useAuthStore";

export const useMenu = () => {
  const { currentUser, loading } = useAuthContext();
  const rights = useAuthStore((state) => state.rights);

  const menu = useMemo(() => {
    if (!currentUser) {
      return disableMenuItems(allMenuItems);
    }

    const roleId = Number(currentUser?.userBasicDetails?.role?.id);
    const plan = currentUser?.plan;
    const isApproved = currentUser?.isApprove === true;

    // 👑 Super Admin → full access
    if (roleId === 1) {
      return superAdminMenuItems;
    }

    // ❌ No plan or not approved → fully disabled
    if (!plan || !isApproved) {
      return disableMenuItems(allMenuItems);
    }


    // 🔐 Apply rights → disable no-access pages
    return applyMenuRights(allMenuItems, rights);
  }, [currentUser, rights]);

  return { menu, loading };
};
