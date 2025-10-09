// import React, { useState, useCallback } from "react";
// import { Tooltip } from "antd";
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragOverlay,
//   useDroppable,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
//   useSortable,
//   arrayMove,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// /* --------------------------- ITEM (restyled only) --------------------------- */

// const DraggableItem = ({
//   item,
//   showDetails,
//   currentFunctionData,
//   rate,
//   onItemRateChange,
//   onNoteClick,
//   onRemoveItem,
// }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({
//     id: `item-${item.id}`,
//     data: { type: "item", item },
//   });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.55 : 1,
//   };

//   return (
//     <li
//       ref={setNodeRef}
//       style={style}
//       className={`group relative flex flex-col rounded-md border border-gray-200 bg-white p-2.5 mb-2 last:mb-0 ${
//         isDragging
//           ? "shadow-lg ring-1 ring-blue-300"
//           : "shadow-[0_1px_0_#ececec]"
//       }`}
//       {...attributes}
//       {...listeners}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2.5">
//           <span className="h-9 w-9 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
//             <img
//               src={item.image}
//               alt={item.name}
//               className="h-full w-full object-cover"
//             />
//           </span>
//           <span className="text-[13px] font-medium text-gray-800 leading-none">
//             {item.name}
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <Tooltip title="Notes">
//             <button
//               className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onNoteClick(item.id);
//               }}
//             >
//               <i className="ki-filled ki-notepad text-[16px]" />
//             </button>
//           </Tooltip>
//           <Tooltip title="Remove">
//             <button
//               className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onRemoveItem(item.id);
//               }}
//             >
//               <i className="ki-filled ki-trash text-[16px]" />
//             </button>
//           </Tooltip>
//         </div>
//       </div>

//       {showDetails && (
//         <div
//           className="mt-2 flex items-center justify-between"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <label className="flex items-center gap-2">
//             <span className="text-[11px] text-gray-500 tracking-wide">
//               Rate :
//             </span>
//             <input
//               type="number"
//               min={0}
//               value={
//                 currentFunctionData.itemRates?.[item.id] !== undefined
//                   ? currentFunctionData.itemRates[item.id]
//                   : rate > 0
//                     ? rate
//                     : item.price || 0
//               }
//               onChange={(e) => onItemRateChange(item.id, e.target.value)}
//               className="h-7 w-20 rounded-md border border-gray-200 bg-gray-50 px-2 text-xs text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </label>
//         </div>
//       )}
//     </li>
//   );
// };

// /* ------------------------- CATEGORY (restyled only) ------------------------- */

// const DraggableCategory = ({
//   categoryName,
//   categoryId,
//   items,
//   showDetails,
//   currentFunctionData,
//   rate,
//   onItemRateChange,
//   onNoteClick,
//   onCategoryNoteClick,
//   onRemoveItem,
//   isExpanded,
//   onToggleExpand,
//   isDraggingCategory,
// }) => {
//   const { isOver, setNodeRef: setDroppableRef } = useDroppable({
//     id: `category-${categoryId}`,
//     data: { type: "category", categoryId, categoryName },
//   });

//   const {
//     attributes,
//     listeners,
//     setNodeRef: setSortableRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({
//     id: `category-sort-${categoryId}`,
//     data: { type: "category-sort", categoryId, categoryName },
//   });

//   const categoryStyle = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.6 : 1,
//   };

//   const setNodeRef = useCallback(
//     (node) => {
//       setDroppableRef(node);
//       setSortableRef(node);
//     },
//     [setDroppableRef, setSortableRef]
//   );

//   return (
//     <section
//       ref={setNodeRef}
//       style={categoryStyle}
//       className="mb-3 rounded-md px-2.5 py-2 cursor-move border border-gray-200 bg-white"
//     >
//       {/* Header bar */}
//       <div
//         className={`flex items-center justify-between  ${
//           isDragging
//             ? "shadow-md ring-1 ring-blue-300"
//             : "shadow-[0_1px_0_#ececec]"
//         }`}
//         {...attributes}
//         {...listeners}
//       >
//         <div className="flex items-center gap-2.5">
//           <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 text-[12px] text-gray-500">
//             {/* small grip dot visual similar to screenshot */}⋮
//           </span>
//           <span className="text-[13px] font-semibold text-gray-900">
//             {categoryName}
//           </span>
//           <Tooltip title="Category Notes">
//             <button
//               className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onCategoryNoteClick(categoryId);
//               }}
//             >
//               <i className="ki-filled ki-notepad text-[16px]" />
//             </button>
//           </Tooltip>
//         </div>

//         <button
//           className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
//           onClick={(e) => {
//             e.stopPropagation();
//             onToggleExpand(categoryId);
//           }}
//         >
//           <i
//             className={`ki-filled ${isExpanded ? "ki-minus" : "ki-plus"} text-[16px]`}
//           />
//         </button>
//       </div>

//       {/* Body */}
//       {isExpanded && (
//         <div
//           className={`mt-1  p-2 ${
//             isOver && !isDraggingCategory
//               ? "ring-2 ring-blue-300 bg-blue-50/40"
//               : ""
//           }`}
//         >
//           <SortableContext
//             items={items.map((item) => `item-${item.id}`)}
//             strategy={verticalListSortingStrategy}
//           >
//             {items.length === 0 ? (
//               <div
//                 className={`grid place-items-center h-16 rounded-md border-2 border-dashed text-xs ${
//                   isOver && !isDraggingCategory
//                     ? "border-blue-300 text-blue-600 bg-blue-50/60"
//                     : "border-gray-200 text-gray-400"
//                 }`}
//               >
//                 {isOver && !isDraggingCategory
//                   ? "Drop item here"
//                   : "Drop items here"}
//               </div>
//             ) : (
//               <ul className="divide-y divide-transparent">
//                 {items.map((item) => (
//                   <DraggableItem
//                     key={item.id}
//                     item={item}
//                     showDetails={showDetails}
//                     currentFunctionData={currentFunctionData}
//                     rate={rate}
//                     onItemRateChange={onItemRateChange}
//                     onNoteClick={onNoteClick}
//                     onRemoveItem={onRemoveItem}
//                   />
//                 ))}
//               </ul>
//             )}
//           </SortableContext>
//         </div>
//       )}
//     </section>
//   );
// };

// /* --------------------------- WRAPPER (layout only) -------------------------- */

// const SelectedItemsList = ({
//   selectedItemsByCategory,
//   rate,
//   showDetails,
//   currentFunctionData,
//   onItemRateChange,
//   onNoteClick,
//   onCategoryNoteClick,
//   onRemoveItem,
//   onItemCategoryChange,
//   onCategoryOrderChange,
//   categories = [],
// }) => {
//   const [activeId, setActiveId] = useState(null);
//   const [activeItem, setActiveItem] = useState(null);
//   const [activeCategory, setActiveCategory] = useState(null);

//   const [expandedCategories, setExpandedCategories] = useState({});
//   const [orderedCategoryContainers, setOrderedCategoryContainers] = useState(
//     []
//   );

//   React.useEffect(() => {
//     const expanded = {};
//     const containers = categories
//       .filter((cat) => cat.id !== 0)
//       .map((category) => {
//         const categoryItems = selectedItemsByCategory[category.name] || [];
//         if (category.id !== 0) expanded[category.id] = true;
//         return {
//           categoryName: category.name,
//           categoryId: category.id,
//           items: categoryItems,
//         };
//       })
//       .filter((c) => c.items.length > 0);

//     setExpandedCategories(expanded);
//     setOrderedCategoryContainers(containers);
//   }, [categories, selectedItemsByCategory]);

//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
//     useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
//   );

//   if (currentFunctionData.selectedItems?.length === 0) {
//     return (
//       <div className="text-xs text-gray-400 p-3 text-center">
//         No items selected
//       </div>
//     );
//   }

//   const handleToggleExpand = (categoryId) => {
//     setExpandedCategories((prev) => ({
//       ...prev,
//       [categoryId]: !prev[categoryId],
//     }));
//   };

//   const handleDragStart = (event) => {
//     const { active } = event;
//     setActiveId(active.id);

//     if (active.id.toString().startsWith("category-sort-")) {
//       const categoryId = active.id.toString().replace("category-sort-", "");
//       const draggedCategory = categories.find((cat) => cat.id == categoryId);
//       setActiveCategory(draggedCategory);

//       const collapsed = {};
//       categories.forEach((cat) => {
//         if (cat.id !== 0) collapsed[cat.id] = false;
//       });
//       setExpandedCategories(collapsed);
//     } else if (active.id.toString().startsWith("item-")) {
//       const itemId = active.id.toString().replace("item-", "");
//       const draggedItem = Object.values(selectedItemsByCategory)
//         .flat()
//         .find((i) => i.id == itemId);
//       setActiveItem(draggedItem);
//     }
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     setActiveId(null);
//     setActiveItem(null);
//     setActiveCategory(null);
//     if (!over) return;

//     // Category re-order
//     if (active.id.toString().startsWith("category-sort-")) {
//       const activeCategoryId = parseInt(
//         active.id.toString().replace("category-sort-", "")
//       );
//       if (over.id.toString().startsWith("category-sort-")) {
//         const overCategoryId = parseInt(
//           over.id.toString().replace("category-sort-", "")
//         );
//         if (activeCategoryId !== overCategoryId) {
//           const from = orderedCategoryContainers.findIndex(
//             (c) => c.categoryId === activeCategoryId
//           );
//           const to = orderedCategoryContainers.findIndex(
//             (c) => c.categoryId === overCategoryId
//           );
//           if (from !== -1 && to !== -1) {
//             const newOrder = arrayMove(orderedCategoryContainers, from, to);
//             setOrderedCategoryContainers(newOrder);
//             onCategoryOrderChange &&
//               onCategoryOrderChange(activeCategoryId, overCategoryId);
//           }
//         }
//       }
//       return;
//     }

//     // Item move across categories
//     const activeItemId = active.id.toString().replace("item-", "");
//     const draggedItem = Object.values(selectedItemsByCategory)
//       .flat()
//       .find((i) => i.id == activeItemId);
//     if (!draggedItem) return;

//     let targetCategoryId = null;
//     let targetCategoryName = null;

//     if (over.data?.current?.type === "category") {
//       targetCategoryId = over.data.current.categoryId;
//       targetCategoryName = over.data.current.categoryName;
//     } else if (over.id.toString().startsWith("item-")) {
//       const targetItemId = over.id.toString().replace("item-", "");
//       const targetItem = Object.values(selectedItemsByCategory)
//         .flat()
//         .find((i) => i.id == targetItemId);
//       if (targetItem) {
//         targetCategoryId = targetItem.parentId;
//         const targetCategory = categories.find(
//           (c) => c.id === targetCategoryId
//         );
//         targetCategoryName = targetCategory?.name || "Uncategorized";
//       }
//     }

//     if (
//       targetCategoryId !== null &&
//       targetCategoryId !== draggedItem.parentId
//     ) {
//       onItemCategoryChange &&
//         onItemCategoryChange(
//           parseInt(activeItemId),
//           targetCategoryId,
//           targetCategoryName
//         );
//     }
//   };

//   const categorySortableIds = orderedCategoryContainers.map(
//     ({ categoryId }) => `category-sort-${categoryId}`
//   );
//   const isDraggingCategory =
//     activeId && activeId.toString().startsWith("category-sort-");

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCenter}
//       onDragStart={handleDragStart}
//       onDragEnd={handleDragEnd}
//     >
//       {/* panel wrapper to match screenshot look */}
//       <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
//         <SortableContext
//           items={categorySortableIds}
//           strategy={verticalListSortingStrategy}
//         >
//           {orderedCategoryContainers.map(
//             ({ categoryName, categoryId, items }) => (
//               <DraggableCategory
//                 key={`${categoryName}-${categoryId}`}
//                 categoryName={categoryName}
//                 categoryId={categoryId}
//                 items={items}
//                 showDetails={showDetails}
//                 currentFunctionData={currentFunctionData}
//                 rate={rate}
//                 onItemRateChange={onItemRateChange}
//                 onNoteClick={onNoteClick}
//                 onCategoryNoteClick={onCategoryNoteClick}
//                 onRemoveItem={onRemoveItem}
//                 isExpanded={expandedCategories[categoryId] || false}
//                 onToggleExpand={handleToggleExpand}
//                 isDraggingCategory={isDraggingCategory}
//               />
//             )
//           )}
//         </SortableContext>
//       </div>

//       <DragOverlay>
//         {activeCategory ? (
//           <div className="bg-white px-3 py-2 rounded-md shadow-lg border border-blue-300">
//             <div className="flex items-center gap-2">
//               <i className="ki-filled ki-menu text-gray-400" />
//               <span className="text-xs font-semibold">
//                 {activeCategory.name}
//               </span>
//             </div>
//           </div>
//         ) : activeItem ? (
//           <div className="bg-white px-3 py-2 rounded-md shadow-lg border border-blue-300">
//             <div className="flex items-center gap-2">
//               <span className="h-8 w-8 rounded-md overflow-hidden bg-gray-100">
//                 <img
//                   src={activeItem.image}
//                   alt={activeItem.name}
//                   className="w-full h-full object-cover"
//                 />
//               </span>
//               <span className="text-xs font-medium">{activeItem.name}</span>
//             </div>
//           </div>
//         ) : null}
//       </DragOverlay>
//     </DndContext>
//   );
// };

// export default SelectedItemsList;










import React, { useState, useCallback } from "react";
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
    data: { type: "item", item },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col rounded-md border border-gray-200 bg-[#F2F7FB] p-2 mb-2 last:mb-0 ${
        isDragging
          ? "shadow-lg ring-1 ring-blue-300"
          : "shadow-[0_1px_0_#ececec]"
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
          <div className="flex flex-col ">
            <span className="text-[13px] font-medium text-gray-800 leading-none">
              {item.name}
            </span>
            {showDetails && (
              <div
                className="mt-1 flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <label className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 tracking-wide">
                    Rate :
                  </span>
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
                    className="h-5 w-16 rounded-md border border-gray-200 bg-gray-50 px-2 text-xs text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="inline-flex h-7 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onNoteClick(item.id);
              }}
            >
              <img
                className="w-3.5 h-3.5  text-[#64748B]"
                src={toAbsoluteUrl("/media/menu/notes.png")}
                alt="profile"
              />
            </button>
          </Tooltip>
          <Tooltip title="Remove">
            <button
              type="button"
              className="inline-flex h-7  items-center justify-center rounded-md text-danger"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveItem(item.id);
              }}
            >
              <i className="ki-filled ki-trash text-[16px]" />
            </button>
          </Tooltip>
          <span className="inline-flex h-7  items-center justify-center  text-[20px] text-[#64748B]">
            ⋮⋮
          </span>
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
  isDraggingCategory,
   numberOfItems,
}) => {
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: `category-${categoryId}`,
    data: { type: "category", categoryId, categoryName },
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
    data: { type: "category-sort", categoryId, categoryName },
  });

  const categoryStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const setNodeRef = useCallback(
    (node) => {
      setDroppableRef(node);
      setSortableRef(node);
    },
    [setDroppableRef, setSortableRef]
  );

  return (
    <section
      ref={setNodeRef}
      style={categoryStyle}
      className="mb-3 rounded-md px-2.5 py-2 cursor-move border border-gray-200 bg-white"
    >
      <div
        className={`flex items-center justify-between`}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-1">
          <span className="inline-flex h-5 w-5 items-center justify-center  text-[20px] text-black">
            ⋮⋮
          </span>
          <div className="font-medium text-gray-800 flex items-center gap-1">
  <span>{categoryName}</span>
  {numberOfItems ? (
    <span className="text-xs text-gray-500">(Any {numberOfItems})</span>
  ) : null}
</div>

          <Tooltip title="Category Notes">
            <button
              className="inline-flex h-7  items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onCategoryNoteClick(categoryId);
              }}
            >
              <img
                className="w-3.5 h-3.5  ring-4 ring-white shadow"
                src={toAbsoluteUrl("/media/menu/notes.png")}
                alt="profile"
              />
            </button>
          </Tooltip>
          <button
            className="inline-flex h-7  items-center justify-center text-[#979797]"
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
        <div className={`mt-3`}>
          <SortableContext
            items={items.map((item) => `item-${item.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {items.length === 0 ? (
              <div
                className={`grid place-items-center h-16 rounded-md border-2 border-dashed text-xs ${
                  isOver && !isDraggingCategory
                    ? "border-blue-300 text-blue-600 bg-blue-50/60"
                    : "border-gray-200 text-gray-400"
                }`}
              >
                {isOver && !isDraggingCategory
                  ? "Drop item here"
                  : "Drop items here"}
              </div>
            ) : (
              <ul className="divide-y divide-transparent">
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
  numberOfItems,
  categories = [],
}) => {
  
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const [expandedCategories, setExpandedCategories] = useState({});
  const [orderedCategoryContainers, setOrderedCategoryContainers] = useState(
    []
  );

  React.useEffect(() => {
    const expanded = {};
    const containers = categories
      .filter((cat) => cat.id !== 0)
      .map((category) => {
        const categoryItems = selectedItemsByCategory[category.name] || [];
        if (category.id !== 0) expanded[category.id] = true;
        return {
          categoryName: category.name,
          categoryId: category.id,
          items: categoryItems,
        };
      })
      .filter((c) => c.items.length > 0);

    setExpandedCategories(expanded);
    setOrderedCategoryContainers(containers);
  }, [categories, selectedItemsByCategory]);

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
    const { active } = event;
    setActiveId(active.id);

    if (active.id.toString().startsWith("category-sort-")) {
      const categoryId = active.id.toString().replace("category-sort-", "");
      const draggedCategory = categories.find((cat) => cat.id == categoryId);
      setActiveCategory(draggedCategory);

      const collapsed = {};
      categories.forEach((cat) => {
        if (cat.id !== 0) collapsed[cat.id] = false;
      });
      setExpandedCategories(collapsed);
    } else if (active.id.toString().startsWith("item-")) {
      const itemId = active.id.toString().replace("item-", "");
      const draggedItem = Object.values(selectedItemsByCategory)
        .flat()
        .find((i) => i.id == itemId);
      setActiveItem(draggedItem);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveItem(null);
    setActiveCategory(null);
    if (!over) return;

    // Category re-order
    if (active.id.toString().startsWith("category-sort-")) {
      const activeCategoryId = parseInt(
        active.id.toString().replace("category-sort-", "")
      );
      if (over.id.toString().startsWith("category-sort-")) {
        const overCategoryId = parseInt(
          over.id.toString().replace("category-sort-", "")
        );
        if (activeCategoryId !== overCategoryId) {
          const from = orderedCategoryContainers.findIndex(
            (c) => c.categoryId === activeCategoryId
          );
          const to = orderedCategoryContainers.findIndex(
            (c) => c.categoryId === overCategoryId
          );
          if (from !== -1 && to !== -1) {
            const newOrder = arrayMove(orderedCategoryContainers, from, to);
            setOrderedCategoryContainers(newOrder);
            onCategoryOrderChange &&
              onCategoryOrderChange(activeCategoryId, overCategoryId);
          }
        }
      }
      return;
    }

    // Item move across categories
    const activeItemId = active.id.toString().replace("item-", "");
    const draggedItem = Object.values(selectedItemsByCategory)
      .flat()
      .find((i) => i.id == activeItemId);
    if (!draggedItem) return;

    let targetCategoryId = null;
    let targetCategoryName = null;

    if (over.data?.current?.type === "category") {
      targetCategoryId = over.data.current.categoryId;
      targetCategoryName = over.data.current.categoryName;
    } else if (over.id.toString().startsWith("item-")) {
      const targetItemId = over.id.toString().replace("item-", "");
      const targetItem = Object.values(selectedItemsByCategory)
        .flat()
        .find((i) => i.id == targetItemId);
      if (targetItem) {
        targetCategoryId = targetItem.parentId;
        const targetCategory = categories.find(
          (c) => c.id === targetCategoryId
        );
        targetCategoryName = targetCategory?.name || "Uncategorized";
      }
    }

    if (
      targetCategoryId !== null &&
      targetCategoryId !== draggedItem.parentId
    ) {
      onItemCategoryChange &&
        onItemCategoryChange(
          parseInt(activeItemId),
          targetCategoryId,
          targetCategoryName
        );
    }
  };

  const categorySortableIds = orderedCategoryContainers.map(
    ({ categoryId }) => `category-sort-${categoryId}`
  );
  const isDraggingCategory =
    activeId && activeId.toString().startsWith("category-sort-");

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* panel wrapper to match screenshot look */}
      <div className="space-y-2 max-h-[70vh] overflow-auto scrollable-y ">
        <SortableContext
          items={categorySortableIds}
          strategy={verticalListSortingStrategy}
        >
          {orderedCategoryContainers.map(
            ({ categoryName, categoryId, items }) => (
              <DraggableCategory
                key={`${categoryName}-${categoryId}`}
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
                  numberOfItems={numberOfItems} 
              />
            )
          )}
        </SortableContext>
      </div>

      <DragOverlay>
        {activeCategory ? (
          <div className="bg-white px-3 py-2 rounded-md shadow-lg border border-blue-300">
            <div className="flex items-center gap-2">
              <i className="ki-filled ki-menu text-gray-400" />
              <span className="text-xs font-semibold">
                {activeCategory.name}
              </span>
            </div>
          </div>
        ) : activeItem ? (
          <div className="bg-white px-3 py-2 rounded-md shadow-lg border border-blue-300">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-md overflow-hidden bg-gray-100">
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














