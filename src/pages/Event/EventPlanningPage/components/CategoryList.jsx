import { useState, useEffect, useMemo } from "react";
import { GetAllCategoryformenu } from "@/services/apiServices";

const CategoryList = ({
  refreshKey,
  selectedCategoryId = 0,
  onCategoryChange = () => {},
  searchTerm = "",
  packageCategories = [],
  savedCategoriesOrder = [],
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem("lang") || "en"
  );
  const userId = localStorage.getItem("userId");

  // Listen for language changes - Multiple methods to catch it
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem("lang") || "en";
      console.log("CategoryList - Language changed to:", newLang); // Debug log
      setCurrentLanguage(newLang);
    };

    // Method 1: Custom event
    window.addEventListener("languageChange", handleLanguageChange);

    // Method 2: Storage event (for other tabs)
    window.addEventListener("storage", handleLanguageChange);

    // Method 3: Polling (check every 500ms as fallback)
    const intervalId = setInterval(() => {
      const currentLang = localStorage.getItem("lang") || "en";
      if (currentLang !== currentLanguage) {
        console.log(
          "CategoryList - Language detected via polling:",
          currentLang
        );
        setCurrentLanguage(currentLang);
      }
    }, 500);

    return () => {
      window.removeEventListener("languageChange", handleLanguageChange);
      window.removeEventListener("storage", handleLanguageChange);
      clearInterval(intervalId);
    };
  }, [currentLanguage]);

  // Helper function to get localized category name
  const getLocalizedCategoryName = useMemo(() => {
    return (cat) => {
      const languageMap = {
        en: "nameEnglish",
        hi: "nameHindi",
        gu: "nameGujarati",
      };

      const field = languageMap[currentLanguage] || "nameEnglish";

      // Return localized name or fallback to nameEnglish or name
      return cat[field] || cat.nameEnglish || cat.name || "";
    };
  }, [currentLanguage]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await GetAllCategoryformenu(userId);

      if (response?.data) {
        const categoryData = response.data.data["Menu Category Details"] || [];

        // Debug: Log first category to see available fields
        if (categoryData.length > 0) {
          console.log("Sample category fields:", Object.keys(categoryData[0]));
          console.log("Sample category:", categoryData[0]);
        }

        const categoryList = [
          { id: 0, nameEnglish: "All", nameHindi: "सभी", nameGujarati: "બધા" },
          ...categoryData.map((cat) => ({
            id: cat.id,
            nameEnglish: cat.nameEnglish || cat.name,
            nameHindi: cat.nameHindi || cat.nameEnglish || cat.name,
            nameGujarati: cat.nameGujarati || cat.nameEnglish || cat.name,
            // Keep original object for any other fields
            ...cat,
          })),
        ];

        setCategories(categoryList);

        // Ensure selected category exists in list
        const found = categoryList.find((c) => c.id === selectedCategoryId);
        if (!found) onCategoryChange("All", 0);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([
        { id: 0, nameEnglish: "All", nameHindi: "सभी", nameGujarati: "બધા" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [refreshKey]);

  const sortedCategories = useMemo(() => {
    const cats = [...categories];

    // Find "All" category
    const allCat = cats.find((c) => c.id === 0);

    // Get the localized names for comparison
    const getDisplayName = (cat) => getLocalizedCategoryName(cat);

    // Map saved order using localized names
    const savedOrderedCats = savedCategoriesOrder
      .map((catName) => cats.find((c) => getDisplayName(c) === catName))
      .filter(Boolean);

    const remaining = cats.filter(
      (c) => c.id !== 0 && !savedCategoriesOrder.includes(getDisplayName(c))
    );

    const packageCats = remaining.filter((c) =>
      packageCategories.includes(getDisplayName(c))
    );

    const normalCats = remaining.filter(
      (c) => !packageCategories.includes(getDisplayName(c))
    );

    return [allCat, ...savedOrderedCats, ...packageCats, ...normalCats].filter(
      Boolean
    );
  }, [
    categories,
    savedCategoriesOrder,
    packageCategories,
    getLocalizedCategoryName,
    currentLanguage,
  ]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return sortedCategories;
    const lower = searchTerm.toLowerCase();
    return sortedCategories.filter((cat) => {
      const displayName = getLocalizedCategoryName(cat);
      return displayName.toLowerCase().includes(lower);
    });
  }, [sortedCategories, searchTerm, getLocalizedCategoryName, currentLanguage]);

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
          const displayName = getLocalizedCategoryName(cat);
          const isPkgCat = packageCategories.includes(displayName);

          return (
            <div
              key={cat.id}
              onClick={() => onCategoryChange(displayName, cat.id)}
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
              {displayName}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
