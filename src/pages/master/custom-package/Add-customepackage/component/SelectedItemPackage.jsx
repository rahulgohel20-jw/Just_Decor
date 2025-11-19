import { Eye, EyeOff, Trash2, GripVertical, Plus, Minus } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

export default function SelectedItemPackage({
  selectedItems,
  onRemoveItem,
  onUpdateRate,
  categoryMap = {},
  onReorderItems,
  onReorderCategories, // <-- NEW PROP
  categoryItemCounts,
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedCategory, setDraggedCategory] = useState(null); // NEW
  const [showRates, setShowRates] = useState(false);

  const [expandedCategories, setExpandedCategories] = useState({});

  // GROUP ITEMS BY CATEGORY
  const groupedItems = useMemo(
    () =>
      selectedItems.reduce((acc, item, index) => {
        const catId = item.category;
        if (!acc[catId]) acc[catId] = [];
        acc[catId].push({ ...item, originalIndex: index });
        return acc;
      }, {}),
    [selectedItems]
  );

  const categoryOrder = Object.keys(groupedItems);

  // EXPAND ALL BY DEFAULT
  useEffect(() => {
    const allExpanded = {};
    Object.keys(groupedItems).forEach((catId) => {
      allExpanded[catId] = true;
    });
    setExpandedCategories(allExpanded);
  }, [groupedItems]);

  const total = selectedItems.reduce((sum, item) => sum + (item.rate || 0), 0);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // CATEGORY DRAG START
  const handleCategoryDragStart = (catId) => {
    setDraggedCategory(catId);
  };

  // CATEGORY DRAG OVER
  const handleCategoryDragOver = (e, targetCatId) => {
    e.preventDefault();
    if (!draggedCategory || draggedCategory === targetCatId) return;

    const fromIndex = categoryOrder.indexOf(draggedCategory);
    const toIndex = categoryOrder.indexOf(targetCatId);

    onReorderCategories(fromIndex, toIndex);
  };

  // CATEGORY DROP
  const handleCategoryDrop = () => {
    setDraggedCategory(null);
  };

  return (
    <div className="w-96 bg-white border border-gray-200 flex flex-col h-full">
      {/* HEADER */}
      <div className="px-4 py-4 border-b bg-white flex items-center justify-between">
        <h3 className="text-base font-semibold">Selected Items</h3>

        {showRates ? (
          <Eye
            className="w-5 h-5 cursor-pointer text-primary"
            onClick={() => setShowRates(false)}
          />
        ) : (
          <EyeOff
            className="w-5 h-5 cursor-pointer text-primary"
            onClick={() => setShowRates(true)}
          />
        )}
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-3">
        {categoryOrder.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No items selected.
          </div>
        )}

        {categoryOrder.map((catId) => {
          const items = groupedItems[catId];

          return (
            <div
              key={catId}
              draggable
              onDragStart={() => handleCategoryDragStart(catId)}
              onDragOver={(e) => handleCategoryDragOver(e, catId)}
              onDrop={handleCategoryDrop}
              className="bg-white mb-4 rounded-xl border shadow-sm"
            >
              {/* CATEGORY HEADER */}
              <div className="px-4 py-3 flex items-center justify-between bg-gray-50 border-b">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />

                  <span className="font-semibold text-gray-700 text-sm uppercase">
                    {(() => {
                      const catName =
                        items[0]?.menuCategory?.nameEnglish ||
                        categoryMap[catId] ||
                        "UNCATEGORIZED";

                      const count = categoryItemCounts.hasOwnProperty(catId)
                        ? categoryItemCounts[catId]
                        : categoryItemCounts["all"] || null;

                      return `${catName}${count ? ` (Any ${count})` : ""}`;
                    })()}
                  </span>
                </div>

                {/* Expand / Collapse */}
                {expandedCategories[catId] ? (
                  <Minus
                    className="w-5 h-5 cursor-pointer text-blue-600"
                    onClick={() => toggleCategory(catId)}
                  />
                ) : (
                  <Plus
                    className="w-5 h-5 cursor-pointer text-gray-400"
                    onClick={() => toggleCategory(catId)}
                  />
                )}
              </div>

              {/* ITEMS */}
              {expandedCategories[catId] &&
                items.map((item) => (
                  <div
                    key={item.originalIndex}
                    draggable
                    onDragStart={(e) => {
                      setDraggedItem(item);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (
                        draggedItem &&
                        draggedItem.originalIndex !== item.originalIndex
                      ) {
                        onReorderItems(
                          draggedItem.originalIndex,
                          item.originalIndex
                        );
                      }
                    }}
                    onDrop={() => setDraggedItem(null)}
                    className="px-4 py-3 flex items-center gap-3 border-b last:border-b-0 cursor-move hover:bg-gray-50"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />

                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden border">
                      {item.image ? (
                        <img
                          src={item.image}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {item.nameEnglish || item.name}
                      </p>

                      {showRates && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">Rate:</span>
                          <input
                            type="number"
                            value={item.rate || 0}
                            onChange={(e) =>
                              onUpdateRate(
                                item.originalIndex,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-14 px-2 py-1 text-xs border rounded"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.originalIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="border-t px-4 py-3 bg-white flex justify-between text-sm font-semibold">
        <span>Total Items: {selectedItems.length}</span>
        <span>Total: ₹ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}
