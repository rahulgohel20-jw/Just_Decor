import React, { useState, useCallback, useMemo } from "react";
import { Tooltip } from "antd";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toAbsoluteUrl } from "@/utils";

const DraggableItem = ({
  item,
  showDetails,
  currentFunctionData,
  rate,
  onItemRateChange,
  onNoteClick,
  onRemoveItem,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `item-${item.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col rounded-md border border-gray-200 bg-[#F2F7FB] p-2 mb-2 ${
        isDragging ? "shadow-lg ring-2 ring-blue-400" : "shadow-sm"
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-9 w-9 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </span>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-gray-800">
              {item.name}
            </span>
            {showDetails && (
              <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                <label className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500">Rate:</span>
                  <input
                    type="number"
                    min={0}
                    value={
                      currentFunctionData.itemRates?.[item.id] !== undefined
                        ? currentFunctionData.itemRates[item.id]
                        : rate > 0
                          ? rate
                          : item.price || 0
                    }
                    onChange={(e) => onItemRateChange(item.id, e.target.value)}
                    className="h-5 w-16 rounded-md border border-gray-200 bg-gray-50 px-2 text-xs"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip title="Notes">
            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onNoteClick(item.id);
              }}
            >
              <img
                className="w-3.5 h-3.5"
                src={toAbsoluteUrl("/media/menu/notes.png")}
                alt="notes"
              />
            </button>
          </Tooltip>
          <Tooltip title="Remove">
            <button
              type="button"
              className="inline-flex h-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveItem(item.id);
              }}
            >
              <i className="ki-filled ki-trash text-[16px]" />
            </button>
          </Tooltip>
          <span className="text-[#64748B]">⋮⋮</span>
        </div>
      </div>
    </li>
  );
};

const DraggableCategory = ({
  categoryName,
  categoryId,
  items,
  showDetails,
  currentFunctionData,
  rate,
  onItemRateChange,
  onNoteClick,
  onCategoryNoteClick,
  onRemoveItem,
  isExpanded,
  onToggleExpand,
  isDraggingOverlay,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: `category-${categoryId}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={`mb-3 rounded-md px-2.5 py-2 border border-gray-200 bg-white transition-all ${
        isDragging ? "shadow-lg ring-2 ring-blue-400" : "shadow-sm"
      }`}
    >
      <div
        className="flex items-center justify-between cursor-move"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-1">
          <span className="text-[20px] text-gray-400 cursor-grab active:cursor-grabbing">
            ⋮⋮
          </span>
          <div className="font-medium text-gray-800">
            <span>{categoryName}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Tooltip title="Category Notes">
            <button
              className="inline-flex h-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onCategoryNoteClick(categoryId);
              }}
            >
              <img
                className="w-3.5 h-3.5"
                src={toAbsoluteUrl("/media/menu/notes.png")}
                alt="notes"
              />
            </button>
          </Tooltip>
          <button
            className="inline-flex h-7 items-center justify-center text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(categoryId);
            }}
          >
            <i
              className={`ki-filled ${isExpanded ? "ki-down" : "ki-up"} text-[20px]`}
            />
          </button>
        </div>
      </div>

      <hr className="mt-2 border border-gray-200" />

      {isExpanded && (
        <div className="mt-3">
          <SortableContext
            items={items.map((item) => `item-${item.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {items.length === 0 ? (
              <div className="grid place-items-center h-16 rounded-md border-2 border-dashed border-gray-200 text-xs text-gray-400">
                Drop items here
              </div>
            ) : (
              <ul>
                {items.map((item) => (
                  <DraggableItem
                    key={item.id}
                    item={item}
                    showDetails={showDetails}
                    currentFunctionData={currentFunctionData}
                    rate={rate}
                    onItemRateChange={onItemRateChange}
                    onNoteClick={onNoteClick}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </ul>
            )}
          </SortableContext>
        </div>
      )}
    </section>
  );
};

const SelectedItemsList = ({
  selectedItemsByCategory,
  rate,
  showDetails,
  currentFunctionData,
  onItemRateChange,
  onNoteClick,
  onCategoryNoteClick,
  onRemoveItem,
  onItemCategoryChange,
  onCategoryOrderChange,
  categoryAnyItems = {},
  categories = [],
}) => {
  const [activeId, setActiveId] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  React.useEffect(() => {
    // Only initialize once when categories are loaded
    if (!isInitialized && categories.length > 0) {
      // Don't set categoryOrder on initial load
      // Let it be determined by selection order
      setIsInitialized(true);

      const expanded = {};
      categories.forEach((c) => {
        if (c.id !== 0) expanded[c.id] = true;
      });
      setExpandedCategories(expanded);
    }
  }, [categories, isInitialized]);

  const displayCategories = useMemo(() => {
    const categoriesWithItems = Object.entries(selectedItemsByCategory)
      .map(([categoryName, items]) => {
        const cat = categories.find((c) => c.name === categoryName);
        if (!cat || items.length === 0) return null;

        const earliestIndex = Math.min(
          ...items.map(
            (item) =>
              currentFunctionData.selectedItems?.indexOf(item.id) ?? Infinity
          )
        );

        return {
          categoryId: cat.id,
          categoryName: cat.name,
          items,
          earliestIndex,
        };
      })
      .filter((c) => c !== null);

    if (categoryOrder.length > 0) {
      return categoriesWithItems.sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.categoryId);
        const indexB = categoryOrder.indexOf(b.categoryId);

        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        return a.earliestIndex - b.earliestIndex;
      });
    }

    return categoriesWithItems.sort(
      (a, b) => a.earliestIndex - b.earliestIndex
    );
  }, [
    categoryOrder,
    selectedItemsByCategory,
    categories,
    currentFunctionData.selectedItems,
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (currentFunctionData.selectedItems?.length === 0) {
    return (
      <div className="text-xs text-gray-400 p-3 text-center">
        No items selected
      </div>
    );
  }

  const handleToggleExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id.toString().startsWith("category-")) {
      const activeCatId = parseInt(
        active.id.toString().replace("category-", "")
      );
      const overCatId = parseInt(over.id.toString().replace("category-", ""));

      const currentDisplayedIds = displayCategories.map((c) => c.categoryId);
      const fromIdx = currentDisplayedIds.indexOf(activeCatId);
      const toIdx = currentDisplayedIds.indexOf(overCatId);

      if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
        const newOrder = arrayMove(currentDisplayedIds, fromIdx, toIdx);
        setCategoryOrder(newOrder);
        onCategoryOrderChange && onCategoryOrderChange(newOrder);
      }
      return;
    }

    if (active.id.toString().startsWith("item-")) {
      const itemId = active.id.toString().replace("item-", "");
      const draggedItem = Object.values(selectedItemsByCategory)
        .flat()
        .find((i) => i.id == itemId);

      if (!draggedItem) return;

      let targetCategoryId = null;
      let targetCategoryName = null;

      if (over.id.toString().startsWith("category-")) {
        targetCategoryId = parseInt(
          over.id.toString().replace("category-", "")
        );
        const cat = categories.find((c) => c.id === targetCategoryId);
        targetCategoryName = cat?.name;
      } else if (over.id.toString().startsWith("item-")) {
        const targetItemId = over.id.toString().replace("item-", "");
        const targetItem = Object.values(selectedItemsByCategory)
          .flat()
          .find((i) => i.id == targetItemId);

        if (targetItem) {
          targetCategoryId = targetItem.parentId;
          const cat = categories.find((c) => c.id === targetCategoryId);
          targetCategoryName = cat?.name;
        }
      }

      if (
        targetCategoryId !== null &&
        targetCategoryId !== draggedItem.parentId
      ) {
        onItemCategoryChange &&
          onItemCategoryChange(
            parseInt(itemId),
            targetCategoryId,
            targetCategoryName
          );
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-2 max-h-[70vh] overflow-auto scrollable-y">
        <SortableContext
          items={displayCategories.map(
            ({ categoryId }) => `category-${categoryId}`
          )}
          strategy={verticalListSortingStrategy}
        >
          {displayCategories.map(({ categoryId, categoryName, items }) => (
            <DraggableCategory
              key={categoryId}
              categoryId={categoryId}
              categoryName={categoryName}
              items={items}
              showDetails={showDetails}
              currentFunctionData={currentFunctionData}
              rate={rate}
              onItemRateChange={onItemRateChange}
              onNoteClick={onNoteClick}
              onCategoryNoteClick={onCategoryNoteClick}
              onRemoveItem={onRemoveItem}
              isExpanded={expandedCategories[categoryId] || false}
              onToggleExpand={handleToggleExpand}
            />
          ))}
        </SortableContext>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="bg-white px-4 py-2 rounded-md shadow-xl border border-blue-300">
            <span className="text-sm font-semibold text-gray-700">
              {activeId.toString().startsWith("category-")
                ? "Moving Category"
                : "Moving Item"}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SelectedItemsList;
