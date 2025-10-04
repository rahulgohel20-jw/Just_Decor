import { useState } from "react";
import { GetAllCategoryformenu, GetAllMenuItems } from "@/services/apiServices";

/* ────────────────────────────────
   HOOK 1: CATEGORY FETCHER
──────────────────────────────── */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    return GetAllCategoryformenu(userId)
      .then((res) => {
        const categories = res.data.data["Menu Category Details"].map(
          (item, index) => ({
            ...item,
            name: item.nameEnglish,
            sr_no: index + 1,
          })
        );
        setCategories(categories);
        return categories;
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        throw error;
      });
  };

  return { categories, fetchCategories };
};

/* ────────────────────────────────
   HOOK 2: MENU ITEMS FETCHER
──────────────────────────────── */
export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMenuItems = (categoryId = 0) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    /* ✅ 1. If we already have items, filter locally */
    if (allMenuItems.length > 0) {
      console.log("Filtering items for category:", categoryId);
      console.table(
        allMenuItems.map((i) => ({
          id: i.id,
          name: i.name,
          parentId: i.parentId,
        }))
      );

      const filtered =
        categoryId === 0
          ? allMenuItems
          : allMenuItems.filter(
              (item) => String(item.parentId) === String(categoryId)
            );

      console.log(
        "Filtering for categoryId:",
        categoryId,
        "Filtered:",
        filtered.length
      );

      console.log(
        "🔍 CategoryId selected:",
        categoryId,
        "\n🧾 Menu items category mapping:",
        allMenuItems.map((i) => ({
          id: i.id,
          name: i.name,
          parentId: i.parentId,
          rawMenuCategoryId: i.menuCategoryId,
          rawCategoryId: i.categoryId,
          rawMenuItemCategoryId: i.menuItemCategoryId,
        }))
      );

      setMenuItems(filtered);
      return Promise.resolve(filtered);
    }

    /* ✅ 2. Otherwise fetch from API */
    setLoading(true);
    console.log("Fetching from API - Category:", categoryId);

    return GetAllMenuItems({ userId })
      .then((res) => {
        const responseData = res?.data?.data;

        if (!responseData) {
          setMenuItems([]);
          setAllMenuItems([]);
          return [];
        }

        const rawItems = responseData["Menu Item Details"] || [];

        if (rawItems.length === 0) {
          setMenuItems([]);
          setAllMenuItems([]);
          return [];
        }

        /* 🧾 Debug raw API structure */
        console.log(
          "🧾 Raw API first few items:",
          rawItems.slice(0, 5).map((x) => ({
            id: x.id,
            nameEnglish: x.nameEnglish,
            menuCategoryId: x.menuCategoryId,
            categoryId: x.categoryId,
            menuItemCategoryId: x.menuItemCategoryId,
            menuCategory: x.menuCategory,
            category: x.category,
          }))
        );

        /* ✅ Normalize items */
        const items = rawItems.map((item) => ({
          id: item.id,
          parentId:
            item.menuCategoryId ||
            item.categoryId ||
            item.menuItemCategoryId ||
            item.menuCategory?.id ||
            item.category?.id ||
            0,
          name: item.nameEnglish || item.menuItemName || item.name,
          image: item.imagePath?.replace("jcupload", "uploads") || "",
          price: item.price || 0,
          isSelected: false,
        }));

        console.log("All items fetched:", items.length);
        console.table(
          items.map((i) => ({
            id: i.id,
            name: i.name,
            parentId: i.parentId,
          }))
        );

        // Store all items
        setAllMenuItems(items);

        // ✅ Filter for selected category
        const filtered =
          categoryId === 0
            ? items
            : items.filter(
                (item) => String(item.parentId) === String(categoryId)
              );

        console.log(
          "Initial filter - Category:",
          categoryId,
          "Filtered:",
          filtered.length
        );

        setMenuItems(filtered);
        return filtered;
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
        setMenuItems([]);
        setAllMenuItems([]);
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { menuItems, loading, fetchMenuItems, setMenuItems, allMenuItems };
};
