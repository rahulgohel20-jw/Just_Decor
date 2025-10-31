const MenuItemGrid = ({
  items,
  searchTerm,
  onToggleSelection,
  loading,
  mode = "custom",
}) => {
  const filteredItems = (items || []).filter((child) =>
    (child?.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">Loading menu items...</div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="p-2 text-gray-400 text-xs text-center">
        {mode === "package"
          ? "No items found. Select a package first."
          : "No items found"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {filteredItems.map(
        ({ parentId, id, name, image, isSelected, isPackageItem }) => (
          <div
            key={id}
            className={`flex flex-col items-start border rounded-lg cursor-pointer transition-all relative overflow-hidden ${
              isSelected
                ? "border-success bg-green-300/10 text-success"
                : "hover:bg-blue-500/10 hover:border-blue-500/15"
            }`}
            onClick={() => onToggleSelection(id)}
          >
            {/* Package Badge - positioned absolutely without blocking image */}
            {mode === "package" && isPackageItem && (
              <span className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full z-10 font-semibold shadow-md">
                PKG
              </span>
            )}

            {/* Image Container */}
            <div className="w-full h-20 rounded-t-lg overflow-hidden flex items-center justify-center bg-gray-100">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.target.src =
                      "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
              ) : (
                // Placeholder when no image
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </div>

            {/* Item Name */}
            <div className="w-full h-12 font-medium px-2 pt-2 pb-1 text-center text-xs flex items-center justify-center">
              {name}
            </div>

            {/* Selection Checkmark */}
            {isSelected && (
              <span className="bg-success w-5 h-5 rounded-full shadow-lg shadow-green-500/50 absolute top-2 right-2 flex items-center justify-center z-10">
                <i className="ki-filled ki-check text-sm text-light"></i>
              </span>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default MenuItemGrid;
