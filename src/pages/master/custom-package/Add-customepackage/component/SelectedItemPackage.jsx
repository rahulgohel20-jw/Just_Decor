import React, { useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toAbsoluteUrl } from "@/utils";

/**
 Props:
 - functionId
 - data: { categoriesOrder: [], categories: { [categoryName]: [items...] } }
 - onRemove(functionId, categoryName, itemId)
 - onDragEndNewState(newState) -> expects { categoriesOrder, categories }
*/

const SelectedItemPackage = ({
  functionId,
  data = { categoriesOrder: [], categories: {} },
  onRemove = () => {},
  onDragEndNewState = () => {},
}) => {
  const { categoriesOrder = [], categories = {} } = data;

  const getCategoryDroppableId = (cat) => `cat-${cat}`;
  const getItemDraggableId = (itemId) => `item-${itemId}`;

  const internalOnDragEnd = (result) => {
    const { destination, source, type, draggableId } = result;
    if (!destination) return;

    // Reorder categories
    if (type === "CATEGORY") {
      const newCategoriesOrder = Array.from(categoriesOrder);
      const [moved] = newCategoriesOrder.splice(source.index, 1);
      newCategoriesOrder.splice(destination.index, 0, moved);
      onDragEndNewState({ categoriesOrder: newCategoriesOrder, categories });
      return;
    }

    // Item-level reordering or moving across categories
    const srcCat = source.droppableId.replace(/^cat-/, "");
    const destCat = destination.droppableId.replace(/^cat-/, "");

    const srcList = Array.from(categories[srcCat] || []);
    const destList =
      srcCat === destCat ? srcList : Array.from(categories[destCat] || []);

    const itemIdStr = draggableId.replace(/^item-/, "");
    const itemIndex = srcList.findIndex((it) => String(it.id) === itemIdStr);
    if (itemIndex === -1) return;

    const [movedItem] = srcList.splice(itemIndex, 1);

    // Same category - just reorder
    if (srcCat === destCat) {
      srcList.splice(destination.index, 0, movedItem);
      const newCategories = { ...categories, [srcCat]: srcList };
      onDragEndNewState({ categoriesOrder, categories: newCategories });
      return;
    }

    // Moving across categories - update the item's category reference
    const updatedItem = {
      ...movedItem,
      menuCategoryName: destCat,
    };
    destList.splice(destination.index, 0, updatedItem);

    const newCategories = {
      ...categories,
      [srcCat]: srcList.length ? srcList : undefined,
      [destCat]: destList,
    };

    // Clean up empty categories
    Object.keys(newCategories).forEach((k) => {
      if (!newCategories[k] || newCategories[k].length === 0)
        delete newCategories[k];
    });

    const newCategoriesOrder = categoriesOrder.slice();
    if (!newCategoriesOrder.includes(destCat)) newCategoriesOrder.push(destCat);
    const finalOrder = newCategoriesOrder.filter((c) => newCategories[c]);

    onDragEndNewState({
      categoriesOrder: finalOrder,
      categories: newCategories,
    });
  };

  // Calculate total items and total rate
  const { totalItems, totalRate } = useMemo(() => {
    let itemCount = 0;
    let rateSum = 0;

    categoriesOrder.forEach((catName) => {
      const items = categories[catName] || [];
      itemCount += items.length;
      items.forEach((item) => {
        rateSum += Number(item.rate) || 0;
      });
    });

    return { totalItems: itemCount, totalRate: rateSum };
  }, [categoriesOrder, categories]);

  const rendered = useMemo(() => {
    if (!categoriesOrder || categoriesOrder.length === 0) {
      return (
        <div className="p-4 text-center text-sm text-gray-500">
          No items selected for this function.
        </div>
      );
    }

    return (
      <DragDropContext onDragEnd={internalOnDragEnd}>
        <Droppable
          droppableId="categories-droppable"
          type="CATEGORY"
          direction="vertical"
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-3 p-3"
            >
              {categoriesOrder.map((catName, catIdx) => {
                const items = categories[catName] || [];
                return (
                  <Draggable
                    key={catName}
                    draggableId={`cat-${catName}`}
                    index={catIdx}
                  >
                    {(provCat) => (
                      <div
                        ref={provCat.innerRef}
                        {...provCat.draggableProps}
                        className="bg-white border rounded-xl shadow-sm p-3"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span
                              {...provCat.dragHandleProps}
                              className="text-[#64748B] text-[22px] cursor-grab active:cursor-grabbing"
                            >
                              ⋮⋮
                            </span>
                            <p className="font-medium">{catName}</p>
                          </div>

                          <div className="flex items-center gap-3 text-gray-500">
                            <img
                              className="w-4 h-4"
                              src={toAbsoluteUrl("/media/menu/notes.png")}
                              alt="notes"
                            />
                            <div className="text-gray-500 text-xs">
                              {items.length} items
                            </div>
                          </div>
                        </div>

                        <Droppable
                          droppableId={getCategoryDroppableId(catName)}
                          type="ITEM"
                        >
                          {(provItems, snapshot) => (
                            <div
                              ref={provItems.innerRef}
                              {...provItems.droppableProps}
                              className={`space-y-2 min-h-[40px] rounded-lg transition-colors ${
                                snapshot.isDraggingOver ? "bg-blue-50" : ""
                              }`}
                            >
                              {items.map((item, idx) => (
                                <Draggable
                                  key={item.id}
                                  draggableId={getItemDraggableId(item.id)}
                                  index={idx}
                                >
                                  {(provItem, snapshot) => (
                                    <div
                                      ref={provItem.innerRef}
                                      {...provItem.draggableProps}
                                      {...provItem.dragHandleProps}
                                      className={`flex items-center justify-between bg-[#EEF3F7] p-2 rounded-lg cursor-grab active:cursor-grabbing transition-shadow ${
                                        snapshot.isDragging
                                          ? "shadow-lg ring-2 ring-blue-400"
                                          : ""
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500 overflow-hidden">
                                          {item.imagePath ? (
                                            <img
                                              src={item.imagePath}
                                              alt={item.nameEnglish}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            "img"
                                          )}
                                        </div>
                                        <div className="flex flex-col">
                                          <div className="text-md text-black">
                                            {item.nameEnglish}
                                          </div>
                                          <div className="mt-1">
                                            <label className="flex items-center gap-2">
                                              <span className="text-[15px] text-gray-500">
                                                Rate:
                                              </span>
                                              <input
                                                type="number"
                                                min={0}
                                                value={item.rate}
                                                onChange={() => {}}
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                }
                                                onMouseDown={(e) =>
                                                  e.stopPropagation()
                                                }
                                                className="h-6 w-16 rounded border border-gray-200 bg-gray-50 px-2 text-xs"
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3 text-gray-500">
                                        <button
                                          type="button"
                                          className="rounded hover:bg-gray-100 text-red-500 p-1"
                                          aria-label="Remove"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove(
                                              functionId,
                                              catName,
                                              item.id
                                            );
                                          }}
                                          onMouseDown={(e) =>
                                            e.stopPropagation()
                                          }
                                        >
                                          <i className="ki-filled ki-trash text-[20px]" />
                                        </button>
                                        <span className="text-[#64748B] text-[22px]">
                                          ⋮⋮
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provItems.placeholder}
                            </div>
                          )}
                        </Droppable>
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
    );
  }, [categoriesOrder, categories, functionId, onRemove]);

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar">{rendered}</div>

      {/* Sticky Footer */}
      <div className="border-t bg-white p-3 mt-auto">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 font-medium">
            Total Items:{" "}
            <span className="font-semibold text-gray-900">{totalItems}</span>
          </span>
          <span className="text-gray-700 font-medium">
            Total:{" "}
            <span className="font-semibold text-gray-900">
              ₹ {totalRate.toFixed(2)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectedItemPackage;
