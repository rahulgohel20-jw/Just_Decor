import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Getmenuprep } from "@/services/apiServices";
import { toAbsoluteUrl } from "@/utils";
import ShowMenuItems from "./ShowMenuItems";
import { Eye } from "lucide-react";

const MenuItemGrid = ({
  refreshKey,
  category = "All",
  categoryId = 0,
  pageSize = 100,
  searchTerm = "",
  selectedIdsSet = new Set(),
  onToggleSelect = () => {},
  selectedFunctionId = null,
  packageCategories = [],
  selectedItemsData = {},
}) => {
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(pageSize);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem("lang") || "en"
  );
  const userId = localStorage.getItem("userId");
  const sentinelRef = useRef();
  const observerRef = useRef();

  // Listen for language changes - Multiple methods to catch it
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem("lang") || "en";
      console.log("Language changed to:", newLang); // Debug log
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
        console.log("Language detected via polling:", currentLang);
        setCurrentLanguage(currentLang);
      }
    }, 500);

    return () => {
      window.removeEventListener("languageChange", handleLanguageChange);
      window.removeEventListener("storage", handleLanguageChange);
      clearInterval(intervalId);
    };
  }, [currentLanguage]);

  // Add this useEffect to force re-render when language changes
  useEffect(() => {
    console.log("Current language:", currentLanguage); // Debug log
    // This will trigger useMemo recalculation
  }, [currentLanguage]);

  // Helper function to get the appropriate name based on language
  // Using useMemo instead of useCallback to ensure proper re-rendering
  const getLocalizedName = useMemo(() => {
    return (item) => {
      const languageMap = {
        en: "menuItemName",
        hi: "menuItemNameHindi",
        gu: "menuItemNameGujarati",
      };

      const field = languageMap[currentLanguage] || "menuItemName";

      // Try different possible field names from API
      return item[field] || item.menuItemName || "";
    };
  }, [currentLanguage]);

  // Helper function to get localized category name
  // Using useMemo instead of useCallback to ensure proper re-rendering
  const getLocalizedCategoryName = useMemo(() => {
    return (item) => {
      const languageMap = {
        en: "menuCategoryName",
        hi: "menuCategoryNameHindi",
        gu: "menuCategoryNameGujarati",
      };

      const field = languageMap[currentLanguage] || "menuCategoryName";

      if (item.menuCategory) {
        return (
          item.menuCategory[field] ||
          item.menuCategory.nameEnglish ||
          item.menuCategory.name
        );
      }

      return item[field] || item.menuCategoryName || "Uncategorized";
    };
  }, [currentLanguage]);

  const getItemWithSlogan = useCallback(
    (item) => {
      const itemId = Number(item.menuItemId || item.id);

      if (selectedItemsData?.categories) {
        for (const categoryItems of Object.values(
          selectedItemsData.categories
        )) {
          const foundItem = categoryItems.find(
            (it) => Number(it.id) === itemId
          );
          if (foundItem) {
            return {
              ...item,
              itemSlogan: foundItem.itemSlogan || "",
              itemNotes: foundItem.itemNotes || "",
            };
          }
        }
      }

      return item;
    },
    [selectedItemsData]
  );

  const fetchMenuItems = useCallback(async () => {
    if (!selectedFunctionId || !userId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await Getmenuprep(
        selectedFunctionId,
        "",
        categoryId,
        1,
        1000,
        userId
      );

      let items = response?.data?.data?.menuPreparationItems || [];

      // ⭐ Convert API isPackage → internal isPackageItem
      items = items.map((it) => ({
        ...it,
        isPackageItem: !!it.isPackage,
      }));

      setAllMenuItems(items);
    } catch (err) {
      console.error("Failed to load menu items:", err);
      setError("Failed to load items");
      setAllMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFunctionId, userId, categoryId]);

  const searchMenuItems = useCallback(
    async (searchQuery) => {
      if (!selectedFunctionId || !userId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await Getmenuprep(
          selectedFunctionId,
          searchQuery.trim(),
          0,
          1,
          1000,
          userId
        );

        let items = response?.data?.data?.menuPreparationItems || [];

        // ⭐ convert API flag
        items = items.map((it) => ({
          ...it,
          isPackageItem: !!it.isPackage,
        }));

        setAllMenuItems(items);
      } catch (err) {
        console.error("Failed to search menu items:", err);
        setError("Failed to search items");
        setAllMenuItems([]);
      } finally {
        setLoading(false);
      }
    },
    [selectedFunctionId, userId]
  );

  useEffect(() => {
    fetchMenuItems();
  }, [refreshKey]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const timer = setTimeout(() => searchMenuItems(searchTerm), 400);
      return () => clearTimeout(timer);
    }

    fetchMenuItems();
  }, [searchTerm, categoryId, fetchMenuItems, searchMenuItems]);

  useEffect(() => {
    setDisplayCount(pageSize);
  }, [allMenuItems, pageSize]);

  const sortedItems = useMemo(() => {
    return [...allMenuItems].sort((a, b) => {
      // 🔥 1) Package items first
      const aPkg = a.isPackageItem ? 0 : 1;
      const bPkg = b.isPackageItem ? 0 : 1;
      if (aPkg !== bPkg) return aPkg - bPkg;

      // 🔥 2) If both are package items OR both are normal,
      // move package categories to top
      const aCat = getLocalizedCategoryName(a);
      const bCat = getLocalizedCategoryName(b);

      const aIdx = packageCategories.indexOf(aCat);
      const bIdx = packageCategories.indexOf(bCat);

      if (aIdx !== bIdx) {
        return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
      }

      return 0;
    });
  }, [
    allMenuItems,
    packageCategories,
    getLocalizedCategoryName,
    currentLanguage,
  ]); // Added currentLanguage dependency

  const displayedItems = useMemo(
    () => sortedItems.slice(0, displayCount),
    [sortedItems, displayCount, currentLanguage] // Added currentLanguage
  );

  const hasMore = displayCount < allMenuItems.length;

  useEffect(() => {
    if (!sentinelRef.current) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const f = entries[0];
        if (f.isIntersecting && !loading && hasMore) {
          setDisplayCount((prev) => prev + pageSize);
        }
      },
      { rootMargin: "200px" }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [loading, hasMore, pageSize]);

  const onItemClick = useMemo(() => {
    return (item) => {
      const catName =
        category !== "All" ? category : getLocalizedCategoryName(item);

      onToggleSelect(item, catName);
    };
  }, [onToggleSelect, category, getLocalizedCategoryName, currentLanguage]);

  const handleViewDetails = (item) => {
    const itemWithSlogan = getItemWithSlogan(item);
    setSelectedItem(itemWithSlogan);
    setIsModalOpen(true);
  };

  if (loading && allMenuItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (displayedItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 text-sm">
          {searchTerm ? "No items found" : "No items available"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {displayedItems.map((item) => {
          const id = item.menuItemId || item.id;
          const name = getLocalizedName(item);
          const numericId = Number(id);

          const isSelected =
            selectedIdsSet.has(numericId) ||
            selectedIdsSet.has(String(numericId));

          return (
            <div
              key={id}
              onClick={() => onItemClick(item)}
              className={`relative flex flex-col items-start border rounded-lg cursor-pointer transition-colors
                ${
                  isSelected
                    ? "border-green-500 bg-green-100/30"
                    : "hover:bg-blue-100/40 hover:border-blue-300"
                }`}
            >
              {/* 🔥 DIAGONAL PKG RIBBON */}
              {item.isPackageItem && (
                <div className="absolute top-0 left-0">
                  <div
                    className="bg-purple-600 text-white text-[10px] font-semibold px-6 py-[2px]
                    transform -rotate-45 translate-x-[-20px] translate-y-[6px] shadow-md"
                  >
                    PKG
                  </div>
                </div>
              )}

              <div className="relative w-full h-20 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
                {item.imagePath ? (
                  <img
                    src={
                      item.imagePath &&
                      typeof item.imagePath === "string" &&
                      item.imagePath !== "null" &&
                      item.imagePath !== "undefined" &&
                      item.imagePath.trim() !== "" &&
                      !item.imagePath.endsWith("null") &&
                      /\.(jpg|jpeg|png|webp|gif)$/i.test(item.imagePath)
                        ? item.imagePath
                        : toAbsoluteUrl("/media/menu/noImage.jpg")
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    className="w-4 h-4"
                    src={toAbsoluteUrl("/media/menu/noImage.jpg")}
                    alt="image"
                  />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(item);
                  }}
                  className="absolute top-1 left-1  text-white px-1 py-[2px] text-[11px] rounded flex items-center gap-1"
                >
                  <Eye className="text-primary" size={20} />
                </button>
              </div>

              <div className="w-full text-center text-xs font-medium p-2 line-clamp-2">
                {name}
              </div>

              {isSelected && (
                <span className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md">
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div
        ref={sentinelRef}
        className="h-8 flex items-center justify-center mt-4"
      >
        {!hasMore && displayedItems.length > 0 && (
          <p className="text-gray-400 text-xs">No more items</p>
        )}
      </div>

      <ShowMenuItems
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
      />
    </div>
  );
};

export default MenuItemGrid;
