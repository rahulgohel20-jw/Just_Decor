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
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

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
    id: item.id,
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

const DroppableCategory = ({
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
}) => {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-semibold text-xs text-gray-900">
          {categoryName}
          <Tooltip title="Category Notes">
            <button
              className="ml-2 text-gray-400 hover:text-gray-500"
              onClick={() => onCategoryNoteClick(categoryId)}
            >
              <i className="ki-filled ki-notepad"></i>
            </button>
          </Tooltip>
        </span>
      </div>
      <ul className="bg-white rounded border shadow-sm min-h-[60px] relative">
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-xs border-2 border-dashed border-gray-200 rounded">
              Drop items here
            </div>
          ) : (
            items.map((item) => (
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
            ))
          )}
        </SortableContext>
      </ul>
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
  categories = [],
}) => {
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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Get the dragged item
    const draggedItem = Object.values(selectedItemsByCategory)
      .flat()
      .find((item) => item.id === activeId);

    if (!draggedItem) return;

    // Determine target category
    let targetCategoryId = null;
    let targetCategoryName = null;

    // Check if dropped over another item (get its category)
    const targetItem = Object.values(selectedItemsByCategory)
      .flat()
      .find((item) => item.id === overId);

    if (targetItem) {
      targetCategoryId = targetItem.parentId;
      const targetCategory = categories.find(
        (cat) => cat.id === targetCategoryId
      );
      targetCategoryName = targetCategory?.name || "Uncategorized";
    } else {
      // Check if dropped over a category container
      Object.entries(selectedItemsByCategory).forEach(([catName, items]) => {
        if (items.length === 0) {
          // For empty categories, we need to identify by category name
          // This requires additional logic based on your category structure
          const category = categories.find((cat) => cat.name === catName);
          if (category) {
            targetCategoryId = category.id;
            targetCategoryName = catName;
          }
        }
      });
    }

    // Only proceed if we have a valid target and it's different from current
    if (targetCategoryId && targetCategoryId !== draggedItem.parentId) {
      // Call the callback to handle the category change
      if (onItemCategoryChange) {
        onItemCategoryChange(activeId, targetCategoryId, targetCategoryName);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <div className="space-y-2">
        {Object.entries(selectedItemsByCategory).map(
          ([categoryName, items]) => {
            const category = categories.find(
              (cat) => cat.name === categoryName
            );
            const categoryId = category?.id || items[0]?.parentId || 0;

            return (
              <DroppableCategory
                key={categoryName}
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
              />
            );
          }
        )}
      </div>
      <DragOverlay>
        {/* This will show a preview of the item being dragged */}
      </DragOverlay>
    </DndContext>
  );
};

export default SelectedItemsList;
