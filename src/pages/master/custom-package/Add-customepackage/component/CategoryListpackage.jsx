import { useState, useMemo } from "react";
import { Search, Loader2, GripVertical } from "lucide-react";

function CategoryListpackage({
  selectedCategory,
  onSelectCategory,
  categories,
  setCategories,
  categoryItemCounts,
  onCategoryItemCountChange,
  onReorderCategories,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Display list including "All"
  const displayCategories = useMemo(() => {
    return [{ id: "all", nameEnglish: "All" }, ...categories];
  }, [categories]);

  const filteredCategories = useMemo(() => {
    return displayCategories.filter((cat) =>
      cat.nameEnglish?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [displayCategories, searchQuery]);

  const handleDragStart = (e, index) => {
    if (filteredCategories[index].id === "all") return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    if (filteredCategories[index].id === "all") return;

    const newCategories = [...categories];

    const draggedItem = newCategories[draggedIndex - 1];
    newCategories.splice(draggedIndex - 1, 1);
    newCategories.splice(index - 1, 0, draggedItem);

    setDraggedIndex(index);
    onReorderCategories(newCategories);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="w-72 bg-white border border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredCategories.map((cat, index) => (
          <div
            key={cat.id}
            draggable={cat.id !== "all"}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={draggedIndex === index ? "opacity-50" : ""}
          >
            <button
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2
                ${
                  selectedCategory === cat.id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
            >
              {cat.id !== "all" && (
                <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
              )}
              <span className="flex-1">{cat.nameEnglish}</span>
            </button>

            {selectedCategory === cat.id && (
              <div className="px-4 pb-3 bg-blue-50">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number Of Items
                </label>
                <input
                  type="number"
                  value={categoryItemCounts[cat.id] || ""}
                  onChange={(e) =>
                    onCategoryItemCountChange(cat.id, Number(e.target.value))
                  }
                  placeholder="Enter number"
                  className="w-full px-3 py-2 border rounded-lg"
                  min="0"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryListpackage;
