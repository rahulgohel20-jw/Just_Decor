import { useAuthStore } from "@/store/useAuthStore";

export const usePermission = (pageName) => {
  const rights = useAuthStore((state) => state.rights);

  return rights[pageName] || {
    view: false,
    add: false,
    edit: false,
    delete: false,
  };
};
