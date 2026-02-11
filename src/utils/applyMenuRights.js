export const applyMenuRights = (menuItems, rights) => {
  return menuItems.map((item) => {
    let disabled = false;
    let statusLabel;

    // If item maps to a permission page
    if (item.pageName) {
      const canView = rights[item.pageName]?.view === true;
      if (!canView) {
        disabled = true;
        statusLabel = "No Access 🔒";
      }
    }

    // Process children recursively
    let children;
    if (item.children) {
      children = applyMenuRights(item.children, rights);
    }

    return {
      ...item,
      disabled,
      statusLabel,
      children,
    };
  });
};
