export const buildPayload = (details, allocation = {}) => {
  const userId = Number(localStorage.getItem("userId"));

  return {
    dishCosting: details.dishCosting || 0,
    menuCategoryId: Number(details.category) || 0,
    menuSubCategoryId: Number(details.subCategory) || null,
    nameEnglish: details.nameEnglish || "",
    nameGujarati: details.nameGujarati || "",
    nameHindi: details.nameHindi || "",
    slogan: details.slogan || "",
    price: details.price || 0,
    remarks: details.remarks || "",
    sequence: details.priority || 0,
    totalRate: details.totalRate || 0,
    url: details.imageUrl || "",
    userId,

    menuItemRawMaterials: (details.recipes || []).map((r) => ({
      id: r.menuRmId || 0,
      rate: r.rate || 0,
      rawMaterialId: r.rawMaterialId || 0,
      unitId: r.unitId || 0,
      weight: Number(r.weight) || 0,
    })),

    menuItemAllocationConfigRequest:
      allocation && Object.keys(allocation).length > 0 ? allocation : null,
  };
};
