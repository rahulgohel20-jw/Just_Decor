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
  onInstructionsChange = () => {}, // NEW PROP
}) => {
  const { categoriesOrder = [], categories = {} } = data;

  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const defaults = {};
    categoriesOrder.forEach((cat) => {
      defaults[cat] = true;
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
        <Droppable droppableId="categories-droppable" type="CATEGORY">
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
                              className="text-[#64748B] text-[22px] cursor-grab"
                            >
                              ⋮⋮
                            </span>
                            <p className="font-medium">{catName}</p>
                          </div>

                          <div className="flex items-center gap-1 text-gray-500">
                            <img
                              className="w-4 h-4 cursor-pointer"
                              src={toAbsoluteUrl("/media/menu/notes.png")}
                              alt="notes"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenCategoryNotes(catName);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => toggleCategory(catName)}
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

                        {expandedCategories[catName] && (
                          <Droppable
                            droppableId={getCategoryDroppableId(catName)}
                            type="ITEM"
                          >
                            {(provItems, snapshot) => (
                              <div
                                ref={provItems.innerRef}
                                {...provItems.droppableProps}
                                className={`space-y-2 min-h-[40px] rounded-lg ${
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
                                        className={`relative bg-[#EEF3F7] p-2 rounded-lg transition-shadow ${
                                          snap.isDragging
                                            ? "shadow-lg ring-2 ring-blue-400"
                                            : ""
                                        }`}
                                      >
                                        {/* TOP ROW */}
                                        <div
                                          {...provItem.dragHandleProps}
                                          className="flex items-center justify-between"
                                        >
                                          {/* LEFT AREA: Icon + Title + (Rate if enabled) */}
                                          <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
                                              <img
                                                src={
                                                  item.imagePath &&
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
                                              <span className="text-md text-black">
                                                {item.nameEnglish}
                                              </span>

                                              {showRates && (
                                                <label className="flex items-center gap-1 mt-1">
                                                  <span className="text-gray-500 text-xs">
                                                    Rate:
                                                  </span>
                                                  <input
                                                    type="text"
                                                    value={item.rate}
                                                    min={0}
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
                                                    className="w-16 h-6 rounded border border-gray-300 bg-white text-xs p-1"
                                                  />
                                                </label>
                                              )}
                                            </div>
                                          </div>

                                          {/* RIGHT AREA: Notes & Delete */}
                                          <div className="flex items-center gap-1 text-gray-600">
                                            <img
                                              className="w-4 h-4 cursor-pointer"
                                              src={toAbsoluteUrl(
                                                "/media/menu/notes.png"
                                              )}
                                              alt="notes"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                onOpenItemNotes(item.id);
                                              }}
                                            />
                                            <button
                                              type="button"
                                              className="text-red-500 hover:bg-gray-200 rounded p-1"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                onRemove(
                                                  functionId,
                                                  catName,
                                                  item.id
                                                );
                                              }}
                                            >
                                              <i className="ki-filled ki-trash text-[18px]" />
                                            </button>
                                          </div>
                                        </div>

                                        {/* INSTRUCTIONS FIELD */}
                                        <textarea
                                          rows={2}
                                          placeholder="Add instructions..."
                                          value={item.itemNotes || ""}
                                          onChange={(e) => {
                                            onInstructionsChange(
                                              functionId,
                                              catName,
                                              item.id,
                                              e.target.value
                                            );
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          className="w-full mt-2 bg-white border border-gray-200 rounded-md p-2 text-sm outline-none focus:outline-none focus:ring-0 resize-none"
                                        />
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
    expandedCategories,
    functionId,
    onRemove,
    showRates,
    onRateChange,
    onInstructionsChange,
  ]);

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar">{rendered}</div>

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
