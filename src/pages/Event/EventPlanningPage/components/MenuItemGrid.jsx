import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Getmenuprep } from "@/services/apiServices";

const MenuItemGrid = ({
  category = "All",
  categoryId = 0,
  pageSize = 100,
  searchTerm = "",
  selectedIdsSet = new Set(),
  onToggleSelect = () => {},
  selectedFunctionId = null,
}) => {
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  // Fetch menu items using Getmenuprep API
  const fetchMenuItems = useCallback(async () => {
    if (!selectedFunctionId || !userId) return;

    try {
      setLoading(true);
      setError(null);

      // Use the categoryId prop directly (0 for "All", specific ID for categories)
      const response = await Getmenuprep(
        selectedFunctionId,
        categoryId,
        1,
        1000, // Fetch large batch since we're doing client-side pagination
        userId
      );

      const items = response?.data?.data?.menuPreparationItems || [];
      setAllMenuItems(items);
    } catch (err) {
      console.error("Failed to load menu items:", err);
      setError("Failed to load items");
      setAllMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFunctionId, userId, categoryId]);

  // Fetch items when dependencies change
  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Filter items only by search term (category filtering is done by API)
  const filteredItems = useMemo(() => {
    let items = [...allMenuItems];

    // Filter by search term only
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      items = items.filter((item) => {
        const name = (
          item.nameEnglish ||
          item.menuItemName ||
          ""
        ).toLowerCase();
        return name.includes(searchLower);
      });
    }

    return items;
  }, [allMenuItems, searchTerm]);

  // Paginate filtered items on client side
  const [displayCount, setDisplayCount] = useState(pageSize);
  const displayedItems = useMemo(
    () => filteredItems.slice(0, displayCount),
    [filteredItems, displayCount]
  );

  const hasMore = displayCount < filteredItems.length;

  // Intersection observer for infinite scroll
  const sentinelRef = useRef();
  const observerRef = useRef();

  useEffect(() => {
    if (!sentinelRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          setDisplayCount((prev) => prev + pageSize);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [loading, hasMore, pageSize]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(pageSize);
  }, [category, searchTerm, pageSize]);

  const onItemClick = (item) => {
    const catName =
      item.menuCategory?.nameEnglish ||
      item.menuCategory?.name ||
      item.menuCategoryName ||
      "Uncategorized";

    onToggleSelect(item, catName);
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
          {searchTerm
            ? "No items found matching your search"
            : "No items available"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {displayedItems.map((item) => {
          const id = item.menuItemId || item.id;
          const displayName = item.nameEnglish || item.menuItemName || "";

          const numericId = Number(id);
          const isSelected =
            selectedIdsSet.has(numericId) ||
            selectedIdsSet.has(String(numericId));

          return (
            <div
              key={id}
              onClick={() => onItemClick(item)}
              className={`flex flex-col items-start border rounded-lg cursor-pointer relative transition-colors
                ${
                  isSelected
                    ? "border-green-500 bg-green-100/30"
                    : "hover:bg-blue-100/40 hover:border-blue-300"
                }`}
            >
              <div className="w-full h-20 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
                {item.imagePath ? (
                  <img
                    src={item.imagePath}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-xs">No Image</div>
                )}
              </div>

              <div className="w-full text-center text-xs font-medium p-2 line-clamp-2">
                {displayName}
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
    </div>
  );
};

export default MenuItemGrid;
