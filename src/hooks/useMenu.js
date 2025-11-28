import { useMemo } from "react";
import { useAuthContext } from "../auth/useAuthContext";
import {
  allMenuItems,
  superAdminMenuItems,
  disableMenuItems,
} from "../config/menu.config";

export const useMenu = () => {
  const { currentUser, loading } = useAuthContext();

  const menu = useMemo(() => {
    if (!currentUser) return disableMenuItems(allMenuItems);

    const roleId = currentUser?.userBasicDetails?.role?.id;

    const plan = currentUser?.plan;

    const isApproved = currentUser?.isApprove === true;

    if (roleId === 1) return superAdminMenuItems;
    if (roleId >= 2) {
      return !plan || !isApproved
        ? disableMenuItems(allMenuItems)
        : allMenuItems;
    }

    return disableMenuItems(allMenuItems);
  }, [currentUser]);

  return { menu, loading };
};
