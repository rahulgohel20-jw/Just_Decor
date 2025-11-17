import { useState, useEffect, useRef, useCallback } from "react";
import { Getmenuitems } from "@/services/apiServices";

const MenuItemGrid = ({
  category = "All",
  pageSize = 100,
  searchTerm = "",
  selectedIdsSet = new Set(),
  onToggleSelect = () => {},
  selectedFunctionId = null,
}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  const observerRef = useRef();
  const sentinelRef = useRef();

  useEffect(() => {
    setMenuItems([]);
    setPageNo(1);
    setHasMore(true);
  }, [category, searchTerm, userId]);

  const fetchPage = useCallback(
    async (page) => {
      try {
        setLoading(true);
        setError(null);

        let response;

        try {
          response = await Getmenuitems(
            page,
            pageSize,
            userId,
            category === "All" ? undefined : category,
            searchTerm || undefined
          );
        } catch {
          response = await Getmenuitems(page, pageSize, userId);
        }

        const items =
          response?.data?.data?.items || response?.data?.items || [];

        const filtered =
          category !== "All"
            ? items.filter(
                (i) =>
                  (
                    i.menuCategory?.nameEnglish ||
                    i.menuCategory?.name ||
                    ""
                  ).toLowerCase() === category.toLowerCase()
              )
            : items;

        setMenuItems((prev) =>
          page === 1 ? filtered : [...prev, ...filtered]
        );

        setHasMore(filtered.length === pageSize);
      } catch (err) {
        setError("Failed to load items");
      } finally {
        setLoading(false);
      }
    },
    [pageSize, userId, category, searchTerm]
  );

  useEffect(() => {
    if (!userId) return;
    fetchPage(pageNo);
  }, [pageNo, userId, category, searchTerm]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          setPageNo((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current.disconnect();
  }, [loading, hasMore]);

  const onItemClick = (item) => {
    const catName =
      item.menuCategory?.nameEnglish ||
      item.menuCategory?.name ||
      item.menuCategoryName ||
      "Uncategorized";

    onToggleSelect(item, catName);
  };

  if (loading && pageNo === 1)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {menuItems.map((item) => {
          const id = item.id;
          const displayName = item.nameEnglish || item.menuItemName || "";

          const numericId = Number(id);
          const isSelected =
            selectedIdsSet.has(numericId) ||
            selectedIdsSet.has(String(numericId));

          return (
            <div
              key={id}
              onClick={() => onItemClick(item)}
              className={`flex flex-col items-start border rounded-lg cursor-pointer relative
                ${
                  isSelected
                    ? "border-green-500 bg-green-100/30"
                    : "hover:bg-blue-100/40 hover:border-blue-300"
                }`}
            >
              <div className="w-full h-20 bg-gray-100 flex items-center justify-center">
                {item.imagePath ? (
                  <img
                    src={item.imagePath}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-xs">No Image</div>
                )}
              </div>

              <div className="w-full text-center text-xs font-medium p-2">
                {displayName}
              </div>

              {isSelected && (
                <span className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div ref={sentinelRef} className="h-8 flex items-center justify-center">
        {loading && (
          <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-blue-600"></div>
        )}
        {!hasMore && !loading && (
          <p className="text-gray-400 text-xs">No more items</p>
        )}
      </div>
    </div>
  );
};

export default MenuItemGrid;
