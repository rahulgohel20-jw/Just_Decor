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

  const rightsLoaded = Object.keys(rights || {}).length > 0;

  const menu = useMemo(() => {
    if (!currentUser) {
      return disableMenuItems(allMenuItems);
    }

    const roleId = Number(currentUser?.userBasicDetails?.role?.id);
    const plan = currentUser?.plan;
    const isApproved = currentUser?.isApprove === true;

    if (roleId === 1) {
      return superAdminMenuItems;
    } else if (roleId === 2) {
      return allMenuItems;
    }

    if (!plan || !isApproved) {
      return disableMenuItems(allMenuItems);
    }

    if (!rightsLoaded) {
      return disableMenuItems(allMenuItems);
    }

    return applyMenuRights(allMenuItems, rights);
  }, [currentUser, rights, rightsLoaded]);

  return { menu, loading };
};
