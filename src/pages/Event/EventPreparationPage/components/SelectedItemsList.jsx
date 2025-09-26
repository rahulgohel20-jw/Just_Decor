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
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
    data: {
      type: "item",
      item,
    },
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
      className={`flex flex-col border-b last:border-0 p-3 cursor-move ${
        isDragging ? "bg-blue-50 shadow-lg z-50" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-8 h-8 rounded overflow-hidden"
            style={{ flex: "0 0 2rem" }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </span>
          <span className="text-xs font-medium">{item.name}</span>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Notes">
            <button
              className="ml-2 text-gray-400 hover:text-gray-500"
              onClick={() => onNoteClick(item.id)}
            >
              <i className="ki-filled ki-notepad"></i>
            </button>
          </Tooltip>
          <Tooltip title="Remove">
            <button
              className="ml-2 text-gray-400 hover:text-red-500"
              onClick={() => onRemoveItem(item.id)}
            >
              <i className="ki-filled ki-trash"></i>
            </button>
          </Tooltip>
        </div>
      </div>
      {showDetails && (
        <div
          className="flex items-center justify-between mt-1 gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Rate:</span>
            <input
              type="number"
              value={
                currentFunctionData.itemRates?.[item.id] !== undefined
                  ? currentFunctionData.itemRates[item.id]
                  : rate > 0
                    ? rate
                    : item.price || 0
              }
              onChange={(e) => onItemRateChange(item.id, e.target.value)}
              min={0}
              className="input input-sm w-20"
            />
          </div>
        </div>
      )}
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
  isDraggingCategory,
}) => {
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: `category-${categoryId}`,
    data: {
      type: "category",
      categoryId,
      categoryName,
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `category-sort-${categoryId}`,
    data: {
      type: "category-sort",
      categoryId,
      categoryName,
    },
  });

  const categoryStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const setNodeRef = useCallback(
    (node) => {
      setDroppableRef(node);
      setSortableRef(node);
    },
    [setDroppableRef, setSortableRef]
  );

  return (
    <div ref={setNodeRef} style={categoryStyle} className="mb-2">
      <div
        className={`flex items-center justify-between gap-2 mb-1 p-2 rounded cursor-move ${
          isDragging ? "bg-blue-50 shadow-lg" : "hover:bg-gray-50"
        }`}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-gray-900">
            {categoryName}
          </span>
          <Tooltip title="Category Notes">
            <button
              className="ml-2 text-gray-400 hover:text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                onCategoryNoteClick(categoryId);
              }}
            >
              <i className="ki-filled ki-notepad"></i>
            </button>
          </Tooltip>
        </div>

        <button
          className="text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(categoryId);
          }}
        >
          <i className={`ki-filled ${isExpanded ? "ki-minus" : "ki-plus"}`}></i>
        </button>
      </div>

      {isExpanded && (
        <div
          className={`bg-white rounded border shadow-sm min-h-[60px] relative transition-colors duration-200 ${
            isOver && !isDraggingCategory ? "border-blue-400 bg-blue-50" : ""
          }`}
        >
          <SortableContext
            items={items.map((item) => `item-${item.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {items.length === 0 ? (
              <div
                className={`p-4 text-center text-xs border-2 border-dashed rounded transition-colors duration-200 ${
                  isOver && !isDraggingCategory
                    ? "border-blue-400 text-blue-600 bg-blue-50"
                    : "border-gray-200 text-gray-400"
                }`}
              >
                {isOver && !isDraggingCategory
                  ? "Drop item here"
                  : "Drop items here"}
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
    </div>
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
  onOrderedContainersChange,
  categories = [],
  preOrderedContainers = [],
}) => {
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const [expandedCategories, setExpandedCategories] = useState({});

  const [orderedCategoryContainers, setOrderedCategoryContainers] = useState(
    []
  );

  const calculatedContainers = useMemo(() => {
    if (preOrderedContainers && preOrderedContainers.length > 0) {
      return preOrderedContainers.sort((a, b) => {
        const sortOrderA = a.sortOrder !== undefined ? a.sortOrder : 999;
        const sortOrderB = b.sortOrder !== undefined ? b.sortOrder : 999;
        return sortOrderA - sortOrderB;
      });
    }

    return categories
      .filter((cat) => cat.id !== 0)
      .map((category) => {
        const categoryItems = selectedItemsByCategory[category.name] || [];
        return {
          categoryName: category.name,
          categoryId: category.id,
          items: categoryItems,
        };
      })
      .filter((container) => container.items.length > 0);
  }, [categories, selectedItemsByCategory, preOrderedContainers]);

  React.useEffect(() => {
    const containerIds = calculatedContainers.map((c) => c.categoryId).sort();
    const prevContainerIds = orderedCategoryContainers
      .map((c) => c.categoryId)
      .sort();

    if (JSON.stringify(containerIds) !== JSON.stringify(prevContainerIds)) {
      let updatedContainers;

      if (containerIds.length > 0 && orderedCategoryContainers.length > 0) {
        updatedContainers = orderedCategoryContainers
          .map((prevContainer) => {
            const updatedContainer = calculatedContainers.find(
              (c) => c.categoryId === prevContainer.categoryId
            );
            return updatedContainer
              ? { ...prevContainer, items: updatedContainer.items }
              : null;
          })
          .filter(Boolean);

        const newCategories = calculatedContainers.filter(
          (newContainer) =>
            !orderedCategoryContainers.some(
              (prevContainer) =>
                prevContainer.categoryId === newContainer.categoryId
            )
        );
        updatedContainers.push(...newCategories);
      } else {
        updatedContainers = calculatedContainers;
      }

      setOrderedCategoryContainers(updatedContainers);

      if (onOrderedContainersChange && updatedContainers.length > 0) {
        onOrderedContainersChange([...updatedContainers]);
      }
    }
  }, [
    calculatedContainers,
    orderedCategoryContainers,
    onOrderedContainersChange,
  ]);

  React.useEffect(() => {
    const expanded = {};

    calculatedContainers.forEach((container) => {
      const prevContainer = orderedCategoryContainers.find(
        (c) => c.categoryId === container.categoryId
      );
      const prevItemCount = prevContainer?.items.length || 0;
      const currentItemCount = container.items.length;

      if (currentItemCount > prevItemCount && currentItemCount > 0) {
        expanded[container.categoryId] = true;
      }
    });

    if (Object.keys(expanded).length > 0) {
      setExpandedCategories((prev) => ({ ...prev, ...expanded }));
    }
  }, [calculatedContainers, orderedCategoryContainers]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (currentFunctionData.selectedItems?.length === 0) {
    return (
      <div className="text-xs text-gray-400 p-2 text-center">
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
    const { active } = event;
    setActiveId(active.id);

    if (active.id.toString().startsWith("category-sort-")) {
      const categoryId = active.id.toString().replace("category-sort-", "");
      const draggedCategory = orderedCategoryContainers.find(
        (container) => container.categoryId == categoryId
      );
      setActiveCategory(draggedCategory);

      const collapsedState = {};
      orderedCategoryContainers.forEach((container) => {
        collapsedState[container.categoryId] = false;
      });
      setExpandedCategories(collapsedState);

      console.log("Starting category drag:", {
        categoryId,
        draggedCategory,
      });
    } else if (active.id.toString().startsWith("item-")) {
      const itemId = active.id.toString().replace("item-", "");
      const draggedItem = Object.values(selectedItemsByCategory)
        .flat()
        .find((item) => item.id == itemId);
      setActiveItem(draggedItem);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    console.log("Drag end:", {
      activeId: active.id,
      overId: over?.id,
      activeData: active.data?.current,
      overData: over?.data?.current,
    });

    setActiveId(null);
    setActiveItem(null);
    setActiveCategory(null);

    if (!over) return;

    if (active.id.toString().startsWith("category-sort-")) {
      const activeCategoryId = parseInt(
        active.id.toString().replace("category-sort-", "")
      );

      let overCategoryId = null;

      if (over.id.toString().startsWith("category-sort-")) {
        overCategoryId = parseInt(
          over.id.toString().replace("category-sort-", "")
        );
      } else if (over.id.toString().startsWith("category-")) {
        overCategoryId = parseInt(over.id.toString().replace("category-", ""));
      }

      if (overCategoryId !== null && activeCategoryId !== overCategoryId) {
        console.log("Reordering categories:", {
          from: activeCategoryId,
          to: overCategoryId,
          overId: over.id,
        });

        const activeIndex = orderedCategoryContainers.findIndex(
          (container) => container.categoryId === activeCategoryId
        );
        const overIndex = orderedCategoryContainers.findIndex(
          (container) => container.categoryId === overCategoryId
        );

        if (activeIndex !== -1 && overIndex !== -1) {
          const newOrderedContainers = arrayMove(
            orderedCategoryContainers,
            activeIndex,
            overIndex
          );

          console.log("New category order:", {
            oldOrder: orderedCategoryContainers.map((c) => ({
              id: c.categoryId,
              name: c.categoryName,
            })),
            newOrder: newOrderedContainers.map((c) => ({
              id: c.categoryId,
              name: c.categoryName,
            })),
            activeIndex,
            overIndex,
          });

          setOrderedCategoryContainers([...newOrderedContainers]);

          if (onCategoryOrderChange) {
            onCategoryOrderChange(activeCategoryId, overCategoryId);
          }
        }
      }
      return;
    }

    const activeItemId = active.id.toString().replace("item-", "");
    const overId = over.id;

    const draggedItem = Object.values(selectedItemsByCategory)
      .flat()
      .find((item) => item.id == activeItemId);

    if (!draggedItem) return;

    let targetCategoryId = null;
    let targetCategoryName = null;

    if (over.data?.current?.type === "category") {
      targetCategoryId = over.data.current.categoryId;
      targetCategoryName = over.data.current.categoryName;
    } else if (overId.toString().startsWith("item-")) {
      const targetItemId = overId.toString().replace("item-", "");
      const targetItem = Object.values(selectedItemsByCategory)
        .flat()
        .find((item) => item.id == targetItemId);

      if (targetItem) {
        targetCategoryId = targetItem.parentId;
        const targetCategory = categories.find(
          (cat) => cat.id === targetCategoryId
        );
        targetCategoryName = targetCategory?.name || "Uncategorized";
      }
    }

    if (
      targetCategoryId !== null &&
      targetCategoryId !== draggedItem.parentId
    ) {
      if (onItemCategoryChange) {
        onItemCategoryChange(
          parseInt(activeItemId),
          targetCategoryId,
          targetCategoryName
        );
      }
    }
  };

  const categorySortableIds = orderedCategoryContainers.map(
    ({ categoryId }) => `category-sort-${categoryId}`
  );
  console.log(categorySortableIds, "sort");

  const isDraggingCategory =
    activeId && activeId.toString().startsWith("category-sort-");

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-2">
        <SortableContext
          items={categorySortableIds}
          strategy={verticalListSortingStrategy}
        >
          {orderedCategoryContainers.map(
            ({ categoryName, categoryId, items }) => (
              <DraggableCategory
                key={`category-${categoryId}`}
                categoryName={categoryName}
                categoryId={categoryId}
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
                isDraggingCategory={isDraggingCategory}
              />
            )
          )}
        </SortableContext>
      </div>

      <DragOverlay>
        {activeCategory ? (
          <div className="bg-white p-3 rounded shadow-lg border-2 border-blue-400">
            <div className="flex items-center gap-2">
              <i className="ki-filled ki-menu text-gray-400"></i>
              <span className="text-xs font-semibold">
                {activeCategory.categoryName}
              </span>
            </div>
          </div>
        ) : activeItem ? (
          <div className="bg-white p-3 rounded shadow-lg border-2 border-blue-400">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded overflow-hidden">
                <img
                  src={activeItem.image}
                  alt={activeItem.name}
                  className="w-full h-full object-cover"
                />
              </span>
              <span className="text-xs font-medium">{activeItem.name}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SelectedItemsList;
