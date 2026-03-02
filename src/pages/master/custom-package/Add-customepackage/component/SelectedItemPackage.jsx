import { Eye, EyeOff, Trash2, GripVertical } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

export default function SelectedItemPackage({
  selectedItems,
  onRemoveItem,
  onUpdateRate,
  categoryMap = {},
  onReorder,
  categoryItemCounts,
}) {
  const [showRates, setShowRates] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [categoryOrder, setCategoryOrder] = useState([]);
  const navigate = useNavigate();

  const [notesModal, setNotesModal] = useState({
    isOpen: false,
    itemIndex: null,
    notes: null,
  });

  useEffect(() => {}, []);

  const groupedItems = useMemo(() => {
    const grouped = selectedItems.reduce((acc, item, index) => {
      const catId = item.category;
      if (!acc[catId]) acc[catId] = [];
      acc[catId].push({ ...item, currentIndex: index });
      return acc;
    }, {});

    return grouped;
  }, [selectedItems]);

  useEffect(() => {
    const currentCategories = Object.keys(groupedItems);

    if (categoryOrder.length === 0 && currentCategories.length > 0) {
      setCategoryOrder(currentCategories);
      return;
    }

    const newCategories = currentCategories.filter(
      (cat) => !categoryOrder.includes(cat),
    );
    if (newCategories.length > 0) {
      setCategoryOrder((prev) => [...prev, ...newCategories]);
    }

    const validCategories = categoryOrder.filter((cat) =>
      currentCategories.includes(cat),
    );
    if (validCategories.length !== categoryOrder.length) {
      setCategoryOrder(validCategories);
    }
  }, [groupedItems]);

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

  // Handle drag end for both categories and items
  const handleDragEnd = (result) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "CATEGORY") {
      const newCategoryOrder = Array.from(categoryOrder);
      const [movedCategory] = newCategoryOrder.splice(source.index, 1);
      newCategoryOrder.splice(destination.index, 0, movedCategory);

      setCategoryOrder(newCategoryOrder);

      const reorderedItems = [];
      newCategoryOrder.forEach((catId) => {
        const categoryItems = groupedItems[catId] || [];
        categoryItems.forEach((item) => {
          const { currentIndex, ...cleanItem } = item;
          reorderedItems.push(cleanItem);
        });
      });

      onReorder(reorderedItems);
      return;
    }

    if (type === "ITEM") {
      const sourceCatId = source.droppableId.replace("cat-", "");
      const destCatId = destination.droppableId.replace("cat-", "");

      const newGroupedItems = {};
      Object.keys(groupedItems).forEach((catId) => {
        newGroupedItems[catId] = [...groupedItems[catId]];
      });

      const [draggedItem] = newGroupedItems[sourceCatId].splice(
        source.index,
        1,
      );

      if (sourceCatId === destCatId) {
        newGroupedItems[sourceCatId].splice(destination.index, 0, draggedItem);
      } else {
        const updatedItem = { ...draggedItem, category: destCatId };
        newGroupedItems[destCatId].splice(destination.index, 0, updatedItem);
      }

      const newCategoryOrderFinal = Object.keys(newGroupedItems).filter(
        (id) => newGroupedItems[id].length > 0,
      );

      setCategoryOrder(newCategoryOrderFinal);

      const reorderedItems = [];
      newCategoryOrderFinal.forEach((catId) => {
        (newGroupedItems[catId] || []).forEach((item) => {
          const { currentIndex, ...cleanItem } = item;
          reorderedItems.push(cleanItem);
        });
      });

      onReorder(reorderedItems);
    }
  };

  return (
    <div className="w-96 bg-white border border-gray-200 flex flex-col h-full">
      {/* HEADER */}
      <div className="px-4 py-4 border-b bg-white flex items-center justify-between">
        <h3 className="text-base font-semibold">Selected Items</h3>

        {showRates ? (
          <Eye
            className="w-5 h-5 cursor-pointer text-blue-600"
            onClick={() => setShowRates(false)}
          />
        ) : (
          <EyeOff
            className="w-5 h-5 cursor-pointer text-gray-400"
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

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories" type="CATEGORY">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {categoryOrder.map((catId, catIndex) => {
                  const items = groupedItems[catId] || [];
                  const catName =
                    categoryMap[catId] ||
                    items[0]?.menuCategory?.nameEnglish ||
                    "UNCATEGORIZED";

                  const count = categoryItemCounts.hasOwnProperty(catId)
                    ? categoryItemCounts[catId]
                    : categoryItemCounts["all"] || null;

                  return (
                    <Draggable
                      key={`cat-${catId}`}
                      draggableId={`category-${catId}`}
                      index={catIndex}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white rounded-xl border shadow-sm transition-all ${
                            snapshot.isDragging
                              ? "shadow-lg ring-2 ring-blue-400 opacity-90"
                              : ""
                          }`}
                        >
                          {/* CATEGORY HEADER */}
                          <div
                            {...provided.dragHandleProps}
                            className="px-4 py-3 flex items-center justify-between bg-gray-50 border-b cursor-move hover:bg-gray-100"
                          >
                            <div className="flex items-center gap-3">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold text-gray-700 text-sm uppercase">
                                {catName}
                                {count ? ` (Any ${count})` : ""}
                              </span>
                            </div>

                            {/* Expand / Collapse */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategory(catId);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              {expandedCategories[catId] ? (
                                <span className="text-blue-600 text-lg font-bold">
                                  −
                                </span>
                              ) : (
                                <span className="text-gray-400 text-lg font-bold">
                                  +
                                </span>
                              )}
                            </button>
                          </div>

                          {expandedCategories[catId] && (
                            <Droppable droppableId={`cat-${catId}`} type="ITEM">
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className={`min-h-[60px] transition-colors ${
                                    snapshot.isDraggingOver
                                      ? "bg-blue-50 border-2 border-dashed border-blue-300"
                                      : ""
                                  }`}
                                >
                                  {items.map((item, itemIndex) => (
                                    <Draggable
                                      key={`item-${item.id}-${item.currentIndex}`}
                                      draggableId={`item-${item.id}-${item.currentIndex}`}
                                      index={itemIndex}
                                    >
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`px-4 py-3 flex items-center gap-3 border-b last:border-b-0 cursor-move hover:bg-gray-50 transition-all ${
                                            snapshot.isDragging
                                              ? "bg-white shadow-lg ring-2 ring-blue-400 rounded"
                                              : ""
                                          }`}
                                        >
                                          <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />

                                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden border">
                                            {item.image ? (
                                              <img
                                                src={item.image}
                                                alt={
                                                  item.nameEnglish || item.name
                                                }
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
                                                <span className="text-xs text-gray-500">
                                                  Rate:
                                                </span>
                                                <input
                                                  type="number"
                                                  value={item.rate || 0}
                                                  onChange={(e) =>
                                                    onUpdateRate(
                                                      item.currentIndex,
                                                      parseInt(
                                                        e.target.value,
                                                      ) || 0,
                                                    )
                                                  }
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                  onMouseDown={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                  className="w-14 px-2 py-1 text-xs border rounded"
                                                />
                                              </div>
                                            )}
                                          </div>
                                          {/* <button
                                            onClick={() =>
                                              onOpenNotes(item.currentIndex)
                                            }
                                            onMouseDown={(e) =>
                                              e.stopPropagation()
                                            }
                                            className="text-purple-500 hover:text-purple-700 p-1"
                                          >
                                            <FileText className="w-4 h-4" />
                                          </button> */}

                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onRemoveItem(item.currentIndex);
                                            }}
                                            onMouseDown={(e) =>
                                              e.stopPropagation()
                                            }
                                            className="text-red-500 hover:text-red-700 p-1"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="border-t px-4 py-3 bg-white flex justify-between text-sm font-semibold">
        <span>Total Items: {selectedItems.length}</span>
        <span>Total: ₹ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}
