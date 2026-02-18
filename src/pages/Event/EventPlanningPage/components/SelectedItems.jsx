import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toAbsoluteUrl } from "@/utils";

// ✅ Extracted into its own component so it never remounts on parent re-render
const ItemRow = ({
  item,
  idx,
  catName,
  functionId,
  showRates,
  onRateChange,
  onOpenItemNotes,
  onRemove,
  onInstructionsChange,
  displayItemName,
  isOpen,
  isAutoFocus,
  onToggleInstruction,
  initialInstruction,
  syncToken, // ✅ only changes when a REAL external reset happens (lang change / functionId change)
}) => {
  const [instruction, setInstruction] = useState(initialInstruction || "");
  const prevSyncToken = useRef(syncToken);

  // ✅ Only reset when syncToken actually changes (language switch, function switch)
  // NOT on every parent render — this is what was breaking typing
  useEffect(() => {
    if (syncToken !== prevSyncToken.current) {
      prevSyncToken.current = syncToken;
      setInstruction(initialInstruction || "");
    }
  }, [syncToken, initialInstruction]);

  return (
    <Draggable
      key={item.id}
      draggableId={`item-${item.id}`}
      index={idx}
    >
      {(provItem, snap) => (
        <div
          ref={provItem.innerRef}
          {...provItem.draggableProps}
          className={`relative bg-[#EEF3F7] p-2 rounded-lg transition-shadow ${
            snap.isDragging ? "shadow-lg ring-2 ring-blue-400" : ""
          }`}
        >
          {/* TOP ROW */}
          <div
            {...provItem.dragHandleProps}
            className="flex items-center justify-between"
          >
            {/* LEFT AREA */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={
                    item?.imagePath &&
                    typeof item.imagePath === "string" &&
                    item.imagePath.trim() !== "" &&
                    item.imagePath !== "null" &&
                    item.imagePath !== "undefined" &&
                    !item.imagePath.toLowerCase().includes("/null") &&
                    /\.(jpg|jpeg|png|webp|gif)$/i.test(item.imagePath)
                      ? item.imagePath
                      : toAbsoluteUrl("/media/menu/noImage.jpg")
                  }
                  alt="Images"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-md text-black">{displayItemName}</span>

                {showRates && (
                  <label className="flex items-center gap-1 mt-1">
                    <span className="text-gray-500 text-xs">Rate:</span>
                    <input
                      type="text"
                      value={item.rate}
                      min={0}
                      onChange={(e) =>
                        onRateChange(
                          functionId,
                          catName,
                          item.id,
                          Number(e.target.value),
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-16 h-6 rounded border border-gray-300 bg-white text-xs p-1"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* RIGHT AREA */}
            <div className="flex items-center gap-1 text-gray-600">
              <img
                className="w-4 h-4 cursor-pointer"
                src={toAbsoluteUrl("/media/menu/notes.png")}
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
                  onRemove(functionId, catName, item.id);
                }}
              >
                <i className="ki-filled ki-trash text-[18px]" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleInstruction(item.id);
            }}
            className="text-xs text-[#005BA8] mt-2 hover:underline"
          >
            {isOpen ? "Hide instructions" : "Show instructions"}
          </button>

          {/* ✅ Textarea stays mounted in this component — no remount on typing */}
          {isOpen && (
            <textarea
              rows={2}
              placeholder="Add instructions..."
              value={instruction}
              onChange={(e) => {
                const value = e.target.value;
                setInstruction(value);
                onInstructionsChange(functionId, catName, item.id, value);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full mt-2 bg-white border border-gray-200 rounded-md p-2 text-sm resize-none"
              autoFocus={isAutoFocus}
            />
          )}
        </div>
      )}
    </Draggable>
  );
};

const SelectedItems = ({
  functionId,
  data = { categoriesOrder: [], categories: {} },
  onRemove = () => {},
  onDragEndNewState = () => {},
  showRates = false,
  onRateChange = () => {},
  onOpenItemNotes = () => {},
  onOpenCategoryNotes = () => {},
  onInstructionsChange = () => {},
}) => {
  const { categoriesOrder = [], categories = {} } = data;

  const [expandedCategories, setExpandedCategories] = useState({});
  const [autoOpenItemId, setAutoOpenItemId] = useState(null);
  const [manuallyOpenItems, setManuallyOpenItems] = useState({});
  const [itemInstructions, setItemInstructions] = useState({});

  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem("lang") || "en",
  );

  const previousItemIdsRef = useRef(new Set());
  const isInitialMountRef = useRef(true);
  const hasLoadedInitialDataRef = useRef(false);

  const getNotesByLang = (itemNotes) => {
    const lang = localStorage.getItem("lang") || "en";
    if (!itemNotes) return "";
    if (lang === "hi") return itemNotes.hindi || itemNotes.english || "";
    if (lang === "gu") return itemNotes.gujarati || itemNotes.english || "";
    return itemNotes.english || "";
  };

  useEffect(() => {
    const instructions = {};
    Object.keys(categories).forEach((catName) => {
      const items = categories[catName] || [];
      items.forEach((item) => {
        if (item.itemNotes) {
          const lang = localStorage.getItem("lang") || "en";
          if (lang === "hi") {
            instructions[item.id] =
              item.itemNotes.hindi || item.itemNotes.english || "";
          } else if (lang === "gu") {
            instructions[item.id] =
              item.itemNotes.gujarati || item.itemNotes.english || "";
          } else {
            instructions[item.id] = item.itemNotes.english || "";
          }
        }
      });
    });
    setItemInstructions(instructions);
  }, [categories, currentLanguage]);

  useEffect(() => {
    const openItems = {};
    Object.keys(categories).forEach((catName) => {
      const items = categories[catName] || [];
      items.forEach((item) => {
        if (item.itemNotes) {
          const lang = localStorage.getItem("lang") || "en";
          const noteText =
            lang === "hi"
              ? item.itemNotes.hindi || item.itemNotes.english || ""
              : lang === "gu"
                ? item.itemNotes.gujarati || item.itemNotes.english || ""
                : item.itemNotes.english || "";
          if (noteText.trim()) {
            openItems[item.id] = true;
          }
        }
      });
    });
    setManuallyOpenItems((prev) => ({ ...prev, ...openItems }));
  }, [categories, currentLanguage]);

  useEffect(() => {
    setManuallyOpenItems({});
    setAutoOpenItemId(null);
    previousItemIdsRef.current = new Set();
    hasLoadedInitialDataRef.current = false;
  }, [functionId]);

  useEffect(() => {
    const currentItemIds = new Set();
    let newItemId = null;
    let newItemCategory = null;

    categoriesOrder.forEach((cat) => {
      const items = categories[cat] || [];
      items.forEach((item) => {
        currentItemIds.add(item.id);
        if (!previousItemIdsRef.current.has(item.id)) {
          newItemId = item.id;
          newItemCategory = cat;
        }
      });
    });

    if (newItemId && newItemCategory && hasLoadedInitialDataRef.current) {
      setExpandedCategories({ [newItemCategory]: true });
      setManuallyOpenItems({ [newItemId]: true });
      setAutoOpenItemId(newItemId);
      setTimeout(() => setAutoOpenItemId(null), 100);
    }

    if (!hasLoadedInitialDataRef.current && currentItemIds.size > 0) {
      hasLoadedInitialDataRef.current = true;
    }

    previousItemIdsRef.current = currentItemIds;
  }, [categories, categoriesOrder]);

  const toggleInstruction = useCallback((itemId) => {
    setManuallyOpenItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem("lang") || "en";
      setCurrentLanguage(newLang);
    };

    window.addEventListener("languageChange", handleLanguageChange);
    window.addEventListener("storage", handleLanguageChange);

    const intervalId = setInterval(() => {
      const currentLang = localStorage.getItem("lang") || "en";
      if (currentLang !== currentLanguage) {
        setCurrentLanguage(currentLang);
      }
    }, 500);

    return () => {
      window.removeEventListener("languageChange", handleLanguageChange);
      window.removeEventListener("storage", handleLanguageChange);
      clearInterval(intervalId);
    };
  }, [currentLanguage]);

  useEffect(() => {
    if (isInitialMountRef.current) {
      const defaults = {};
      categoriesOrder.forEach((cat) => {
        defaults[cat] = true;
      });
      setExpandedCategories(defaults);
      isInitialMountRef.current = false;
    }
  }, [categoriesOrder]);

  const getLocalizedItemName = useMemo(() => {
    return (item) => {
      const languageMap = {
        en: "nameEnglish",
        hi: "nameHindi",
        gu: "nameGujarati",
      };
      const field = languageMap[currentLanguage] || "nameEnglish";
      return (
        item[field] ||
        item.nameEnglish ||
        item.menuItemName ||
        item.menuItemNameEnglish ||
        ""
      );
    };
  }, [currentLanguage]);

  const getLocalizedCategoryName = useMemo(() => {
    return (categoryName) => {
      const items = categories[categoryName] || [];
      if (items.length === 0) return categoryName;
      const firstItem = items[0];
      const languageMap = {
        en: firstItem.menuCategoryName || categoryName,
        hi:
          firstItem.menuCategoryNameHindi ||
          firstItem.menuCategoryName ||
          categoryName,
        gu:
          firstItem.menuCategoryNameGujarati ||
          firstItem.menuCategoryName ||
          categoryName,
      };
      return languageMap[currentLanguage] || categoryName;
    };
  }, [currentLanguage, categories]);

  const toggleCategory = useCallback((catName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  }, []);

  const internalOnDragEnd = useCallback(
    (result) => {
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
      if (!newCategoriesOrder.includes(destCat))
        newCategoriesOrder.push(destCat);
      const finalOrder = newCategoriesOrder.filter((c) => newCategories[c]);

      onDragEndNewState({
        categoriesOrder: finalOrder,
        categories: newCategories,
      });
    },
    [categoriesOrder, categories, onDragEndNewState],
  );

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

  if (!categoriesOrder || categoriesOrder.length === 0) {
    return (
      <div className="w-full flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="p-4 text-center text-sm text-gray-500">
            No items selected for this function.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* ✅ DragDropContext is NOT inside useMemo — prevents textarea remounting */}
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
                  const displayCategoryName = getLocalizedCategoryName(catName);

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
                              <p className="font-medium">{displayCategoryName}</p>
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
                              droppableId={`cat-${catName}`}
                              type="ITEM"
                            >
                              {(provItems, snapshot) => (
                                <div
                                  ref={provItems.innerRef}
                                  {...provItems.droppableProps}
                                  className={`space-y-2 min-h-[40px] rounded-lg transition-all duration-300 overflow-hidden ${
                                    snapshot.isDraggingOver ? "bg-blue-50" : ""
                                  }`}
                                >
                                  {items.map((item, idx) => (
                                    <ItemRow
                                      key={item.id}
                                      item={item}
                                      idx={idx}
                                      catName={catName}
                                      functionId={functionId}
                                      showRates={showRates}
                                      onRateChange={onRateChange}
                                      onOpenItemNotes={onOpenItemNotes}
                                      onRemove={onRemove}
                                      onInstructionsChange={onInstructionsChange}
                                      displayItemName={getLocalizedItemName(item)}
                                      isOpen={!!manuallyOpenItems[item.id]}
                                      isAutoFocus={autoOpenItemId === item.id}
                                      onToggleInstruction={toggleInstruction}
                                      initialInstruction={itemInstructions[item.id] || ""}
                                      syncToken={`${functionId}__${currentLanguage}`}
                                    />
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
      </div>

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