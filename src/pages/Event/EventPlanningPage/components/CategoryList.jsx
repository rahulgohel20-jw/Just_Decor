import { useState, useEffect, useMemo } from "react";
import { GetAllCategoryformenu } from "@/services/apiServices";

const CategoryList = ({
  selectedCategoryId = 0, // ⭐ Highlight by ID
  onCategoryChange = () => {},
  searchTerm = "",
  packageCategories = [], // ["WELCOME DRINKS", "BAR BE QUE"]
  savedCategoriesOrder = [], // e.g. ["WELCOME DRINKS", "BAR BE QUE"]
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await GetAllCategoryformenu(userId);

        if (response?.data) {
          const categoryData =
            response.data.data["Menu Category Details"] || [];

          const categoryList = [
            { id: 0, name: "All" },
            ...categoryData.map((cat) => ({
              id: cat.id,
              name: cat.nameEnglish || cat.name,
            })),
          ];

          setCategories(categoryList);

          // Ensure selected category exists in list
          const found = categoryList.find((c) => c.id === selectedCategoryId);
          if (!found) onCategoryChange("All", 0);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([{ id: 0, name: "All" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // -------------------------------------------------------
  // ⭐ CATEGORY SORTING PRIORITY:
  // 1) All
  // 2) Saved order from API (menuSortOrder)
  // 3) Package categories (PKG applied)
  // 4) Normal categories
  // -------------------------------------------------------
  const sortedCategories = useMemo(() => {
    const cats = [...categories];

    const allCat = cats.find((c) => c.name === "All");

    const savedOrderedCats = savedCategoriesOrder
      .map((catName) => cats.find((c) => c.name === catName))
      .filter(Boolean);

    const remaining = cats.filter(
      (c) => c.name !== "All" && !savedCategoriesOrder.includes(c.name)
    );

    const packageCats = remaining.filter((c) =>
      packageCategories.includes(c.name)
    );

    const normalCats = remaining.filter(
      (c) => !packageCategories.includes(c.name)
    );

    return [allCat, ...savedOrderedCats, ...packageCats, ...normalCats].filter(
      Boolean
    );
  }, [categories, savedCategoriesOrder, packageCategories]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return sortedCategories;
    const lower = searchTerm.toLowerCase();
    return sortedCategories.filter((cat) =>
      cat.name.toLowerCase().includes(lower)
    );
  }, [sortedCategories, searchTerm]);

  if (loading) {
    return (
      <div className="w-full p-3 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        {filteredCategories.map((cat) => {
          const isPkgCat = packageCategories.includes(cat.name);

          return (
            <div
              key={cat.id}
              onClick={() => onCategoryChange(cat.name, cat.id)}
              className={`cursor-pointer px-3 py-2 rounded transition-all relative
                ${
                  selectedCategoryId === cat.id
                    ? "bg-blue-100 text-blue-700 border border-blue-400 font-semibold"
                    : isPkgCat
                      ? "bg-blue-50 text-primary border border-primary"
                      : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {isPkgCat && (
                <span className="absolute top-1 right-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">
                  PKG
                </span>
              )}
              {cat.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
