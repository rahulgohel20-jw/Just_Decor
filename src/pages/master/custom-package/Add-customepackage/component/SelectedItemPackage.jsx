import { Eye, Trash2, MoreVertical } from "lucide-react";

// ACCEPTED categoryMap prop
function SelectedItemPackage({
  selectedItems,
  onRemoveItem,
  onUpdateRate,
  categoryMap = {},
}) {
  const total = selectedItems.reduce((sum, item) => sum + (item.rate || 0), 0);
  console.log(categoryMap);

  // Helper function to get category name
  const getCategoryName = (categoryId) => {
    // Use categoryMap, fall back to the ID, or 'Uncategorized'
    return categoryMap[categoryId] || categoryId || "Uncategorized";
  };

  // Group items by category ID and include the original index
  const groupedItems = selectedItems.reduce((acc, item, index) => {
    // Determine the category ID. Assuming it's stored in item.category (set in AddCustomPackage)
    // Note: item.category is item.menuCatId
    const catId = item.category || "Other";

    if (!acc[catId]) acc[catId] = [];

    // Push the item along with its original index for correct removal/update callbacks
    acc[catId].push({ ...item, originalIndex: index });
    return acc;
  }, {});

  return (
    <div className="w-96 bg-gray-50 border border-gray-200 flex flex-col h-full">
      <div className="px-4 py-6 bg-white border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-700">
          Selected Items
        </h3>
        <button className="text-primary">
          <Eye className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {selectedItems.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No items selected for this package.
          </div>
        ) : (
          Object.entries(groupedItems).map(([catId, items]) => (
            <div key={catId} className="mb-1">
              <div className="px-4 py-2.5 bg-gray-50 flex items-center justify-between border-y border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col gap-0.5">
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  </div>
                  <span className="font-semibold text-gray-700 text-xs tracking-wide uppercase">
                    {getCategoryName(catId)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <span className="text-xs text-gray-500">
                    {items.length} items
                  </span>
                </div>
              </div>

              {items.map((item, idx) => (
                <div
                  // Use originalIndex for a unique and stable key related to the parent array
                  key={`${item.id}-${item.originalIndex}`}
                  className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100"
                >
                  <div className="w-12 h-12 bg-gray-50 rounded flex-shrink-0 overflow-hidden border border-gray-200">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 mb-1.5 leading-tight">
                      {item.displayName || item.nameEnglish || item.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Rate:</span>
                      <input
                        type="number"
                        value={item.rate || 0}
                        onChange={(e) =>
                          // Pass the original index and new rate
                          onUpdateRate(
                            item.originalIndex,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-14 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button
                      // Pass the original index for removal
                      onClick={() => onRemoveItem(item.originalIndex)}
                      className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-300 hover:text-gray-500 p-1.5 hover:bg-gray-100 rounded transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-200 px-4 py-3.5 bg-white">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700 text-sm">
            Total Items: {selectedItems.length}
          </span>
          <span className="font-semibold text-gray-900 text-sm">
            Total: ₹ {total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SelectedItemPackage;
