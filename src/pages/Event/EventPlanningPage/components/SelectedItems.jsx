import React, { useMemo, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toAbsoluteUrl } from "@/utils";

const SelectedItems = ({
  functionId,
  data = { categoriesOrder: [], categories: {} },
  onRemove = () => {},
  onDragEndNewState = () => {},
  showRates = false,
  onRateChange = () => {},
  onOpenItemNotes = () => {},
  onOpenCategoryNotes = () => {},
}) => {
  const { categoriesOrder = [], categories = {} } = data;

  // -------------------------------
  // EXPAND / COLLAPSE STATE
  // -------------------------------
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const defaults = {};
    categoriesOrder.forEach((cat) => {
      defaults[cat] = true; // default expanded
    });
    setExpandedCategories(defaults);
  }, [categoriesOrder]);

  const toggleCategory = (catName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const getCategoryDroppableId = (cat) => `cat-${cat}`;
  const getItemDraggableId = (itemId) => `item-${itemId}`;

  // -------------------------------
  // DRAG END LOGIC
  // -------------------------------
  const internalOnDragEnd = (result) => {
    const { destination, source, type, draggableId } = result;
    if (!destination) return;

    if (type === "CATEGORY") {
      const newCategoriesOrder = Array.from(categoriesOrder);
      const [moved] = newCategoriesOrder.splice(source.index, 1);
      newCategoriesOrder.splice(destination.index, 0, moved);
      onDragEndNewState({ categoriesOrder: newCategoriesOrder, categories });
      return;
    }

    const srcCat = source.droppableId.replace(/^cat-/, "");
    const destCat = destination.droppableId.replace(/^cat-/, "");

    const srcList = Array.from(categories[srcCat] || []);
    const destList =
      srcCat === destCat ? srcList : Array.from(categories[destCat] || []);

    const itemIdStr = draggableId.replace(/^item-/, "");
    const itemIndex = srcList.findIndex((it) => String(it.id) === itemIdStr);
    if (itemIndex === -1) return;

    const [movedItem] = srcList.splice(itemIndex, 1);

    if (srcCat === destCat) {
      srcList.splice(destination.index, 0, movedItem);
      const newCategories = { ...categories, [srcCat]: srcList };
      onDragEndNewState({ categoriesOrder, categories: newCategories });
      return;
    }

    const updatedItem = { ...movedItem, menuCategoryName: destCat };
    destList.splice(destination.index, 0, updatedItem);

    const newCategories = {
      ...categories,
      [srcCat]: srcList.length ? srcList : undefined,
      [destCat]: destList,
    };

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

  // -------------------------------
  // TOTAL ITEMS + RATES
  // -------------------------------
  const { totalItems, totalRate } = useMemo(() => {
    let itemCount = 0;
    let rateSum = 0;

    categoriesOrder.forEach((catName) => {
      let items = categories[catName] || [];

      items = [...items].sort((a, b) => {
        const A = a.isPackageItem ? 0 : 1;
        const B = b.isPackageItem ? 0 : 1;
        return A - B;
      });

      itemCount += items.length;
      items.forEach((item) => {
        rateSum += Number(item.rate) || 0;
      });
    });

    return { totalItems: itemCount, totalRate: rateSum };
  }, [categoriesOrder, categories]);

  // -------------------------------
  // RENDER CATEGORIES + ITEMS
  // -------------------------------
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
                        {/* CATEGORY HEADER */}
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

                          <div className="flex items-center gap-1 text-gray-500">
                            <img
                              className="w-4 h-4"
                              src={toAbsoluteUrl("/media/menu/notes.png")}
                              alt="notes"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenCategoryNotes(
                                  catName,
                                  data.categoryNotes?.[catName] || ""
                                );
                              }}
                            />
                            {/* EXPAND / COLLAPSE BUTTON */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategory(catName);
                              }}
                              className="p-1 rounded hover:bg-gray-100"
                            >
                              {expandedCategories[catName] ? (
                                <i className="ki-filled ki-down text-[18px]" />
                              ) : (
                                <i className="ki-filled ki-up text-[18px]" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* ITEMS LIST (show only if expanded) */}
                        {expandedCategories[catName] && (
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
                                    {(provItem, snap) => (
                                      <div
                                        ref={provItem.innerRef}
                                        {...provItem.draggableProps}
                                        {...provItem.dragHandleProps}
                                        className={`relative flex items-center justify-between bg-[#EEF3F7] p-2 rounded-lg cursor-grab active:cursor-grabbing transition-shadow ${
                                          snap.isDragging
                                            ? "shadow-lg ring-2 ring-blue-400"
                                            : ""
                                        }`}
                                      >
                                        {/* PACKAGE RIBBON */}
                                        {item.isPackageItem && (
                                          <div className="absolute top-0 left-0">
                                            <div
                                              className="w-5 h-5 
                                              border-t-[28px] border-t-primary 
                                              border-r-[28px] border-r-transparent 
                                              relative"
                                            >
                                              <span
                                                className="absolute -top-[30px] left-[-1px] 
                                                text-[9px] text-white font-semibold 
                                                rotate-[-45deg]"
                                              >
                                                PKG
                                              </span>
                                            </div>
                                          </div>
                                        )}

                                        {/* LEFT SECTION */}
                                        <div className="flex items-center gap-2">
                                          <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500 overflow-hidden">
                                            <img
                                              src={
                                                item.imagePath &&
                                                typeof item.imagePath ===
                                                  "string" &&
                                                item.imagePath !== "null" &&
                                                item.imagePath !==
                                                  "undefined" &&
                                                item.imagePath.trim() !== "" &&
                                                !item.imagePath.endsWith(
                                                  "null"
                                                ) &&
                                                /\.(jpg|jpeg|png|webp|gif)$/i.test(
                                                  item.imagePath
                                                )
                                                  ? item.imagePath
                                                  : toAbsoluteUrl(
                                                      "/media/menu/noImage.jpg"
                                                    )
                                              }
                                              alt={item.nameEnglish}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>

                                          <div className="flex flex-col">
                                            <div className="text-md text-black">
                                              {item.nameEnglish}
                                            </div>

                                            {showRates && (
                                              <div className="mt-1">
                                                <label className="flex items-center gap-2">
                                                  <span className="text-[15px] text-gray-500">
                                                    Rate:
                                                  </span>
                                                  <input
                                                    type="number"
                                                    min={0}
                                                    value={item.rate}
                                                    onChange={(e) =>
                                                      onRateChange(
                                                        functionId,
                                                        catName,
                                                        item.id,
                                                        Number(e.target.value)
                                                      )
                                                    }
                                                    onClick={(e) =>
                                                      e.stopPropagation()
                                                    }
                                                    className="h-6 w-16 rounded border border-gray-200 bg-gray-50 px-2 text-xs"
                                                  />
                                                </label>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* REMOVE BUTTON */}
                                        <div className="flex items-center gap-0 text-gray-500">
                                          <img
                                            className="w-4 h-4 cursor-pointer"
                                            src={toAbsoluteUrl(
                                              "/media/menu/notes.png"
                                            )}
                                            alt="notes"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onOpenItemNotes(
                                                item.id,
                                                item.itemNotes || ""
                                              );
                                            }}
                                          />
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
                                          >
                                            <i className="ki-filled ki-trash text-[20px]" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}

                                {provItems.placeholder}
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
    );
  }, [
    categoriesOrder,
    categories,
    functionId,
    onRemove,
    showRates,
    onRateChange,
    expandedCategories,
  ]);

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar">{rendered}</div>

      {/* FOOTER */}
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

export default SelectedItems;
