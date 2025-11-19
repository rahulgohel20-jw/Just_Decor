import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Search, Check, Loader2 } from "lucide-react";

function MenuItemGridPackage({
  onToggleItem,
  selectedItemIds = new Set(),
  selectedCategory,
  Getmenuitemsusingcatid,
}) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const USER_ID = localStorage.getItem("userId");
  const PAGE_SIZE = 100;
  const observerRef = useRef();
  const gridContainerRef = useRef(null);
  const isFetchingRef = useRef(false);

  // FIXED: Reset when category changes
  useEffect(() => {
    setMenuItems([]);
    setPage(1);
    setHasMore(true);
    setSearchQuery("");
    isFetchingRef.current = false;

    // Fetch new category items
    fetchMenuItems(selectedCategory, 1);
  }, [selectedCategory]);

  const fetchMenuItems = useCallback(
    async (category, pageNum) => {
      // Prevent duplicate fetches
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        // FIXED: Pass 0 for "all" category, otherwise pass the category ID
        const categoryIdToPass = category === "all" ? 0 : Number(category);

        const response = await Getmenuitemsusingcatid(
          pageNum,
          PAGE_SIZE,
          USER_ID,
          categoryIdToPass
        );

        const newItems = response.data?.data?.items || [];
        const totalCount = response.data?.data?.totalItems || 0;

        setMenuItems((prevItems) => {
          return pageNum === 1 ? newItems : [...prevItems, ...newItems];
        });

        const isEndOfData =
          pageNum * PAGE_SIZE >= totalCount || newItems.length < PAGE_SIZE;

        if (isEndOfData) {
          setHasMore(false);
        } else {
          setPage(pageNum + 1);
          setHasMore(true);
        }
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [USER_ID, Getmenuitemsusingcatid]
  );

  // Infinite scroll observer
  useEffect(() => {
    const target = observerRef.current;
    if (!target || !hasMore) return;

    const options = {
      root: gridContainerRef.current,
      rootMargin: "200px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
        fetchMenuItems(selectedCategory, page);
      }
    }, options);

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [hasMore, selectedCategory, fetchMenuItems, page]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) =>
      (item.nameEnglish || item.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [menuItems, searchQuery]);

  const handleItemClick = (item) => {
    onToggleItem(item);
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col h-full">
      <div className="p-4 bg-white border border-gray-200">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div ref={gridContainerRef} className="flex-1 overflow-y-auto p-2">
        {filteredItems.length === 0 && !loading && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            {searchQuery
              ? `No items found matching "${searchQuery}"`
              : "No items available"}
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`bg-white rounded-lg p-3 cursor-pointer hover:shadow-md transition-all relative ${
                selectedItemIds.has(item.id)
                  ? "border-2 border-green-500"
                  : "border border-gray-200"
              }`}
            >
              {selectedItemIds.has(item.id) && (
                <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.nameEnglish || item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-xs">No Image</div>
                )}
              </div>
              <p className="text-sm font-medium text-gray-800 text-center leading-tight">
                {item.nameEnglish || item.name}
              </p>
            </div>
          ))}

          {hasMore && (
            <div ref={observerRef} className="col-span-4 py-4">
              {loading && (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">
                    Loading more items...
                  </span>
                </div>
              )}
            </div>
          )}

          {!hasMore && menuItems.length > 0 && (
            <div className="col-span-4 py-4 text-center text-gray-500 text-sm">
              You've reached the end of the menu items.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuItemGridPackage;
