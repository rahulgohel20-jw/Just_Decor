import { useState, useMemo } from "react";
import CategoryListpackage from "./component/CategoryListpackage";
import MenuItemGridPackage from "./component/MenuItemGridPackage";
import SelectedItemPackage from "./component/SelectedItemPackage";
import { Input } from "antd";

function AddCustomPackage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const handleAddItem = (item) => {
    // Check if an item with the same ID is already selected
    const isDuplicate = selectedItems.some(
      (selectedItem) => selectedItem.id === item.id
    );

    if (!isDuplicate) {
      // Ensure we include category info for grouping in SelectedItemPackage
      setSelectedItems([
        ...selectedItems,
        {
          ...item,
          rate: 0,
          // Assuming category ID is stored in item.menuCatId
          category: item.menuCatId,
        },
      ]);
    }
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, idx) => idx !== index));
  };

  const handleUpdateRate = (index, rate) => {
    const updated = [...selectedItems];
    updated[index] = { ...updated[index], rate };
    setSelectedItems(updated);
  };

  const handleSave = () => {
    console.log("Saving package:", selectedItems);
    alert("Package saved successfully!");
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All changes will be lost.")) {
      setSelectedItems([]);
    }
  };

  const selectedItemIds = useMemo(() => {
    return new Set(selectedItems.map((item) => item.id));
  }, [selectedItems]);

  const categoryMap = useMemo(() => {
    const map = {};
    map["all"] = "All Menu Items";
    categories.forEach((cat) => {
      map[cat.id] = cat.nameEnglish;
    });
    return map;
  }, [categories]);

  return (
    <div>
      <h2 className="text-xl font-semibold ml-4">Add Custom Package</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* English */}
        <div>
          <label>Name (English)</label>
          <Input
            label="Name (English)"
            name="nameEnglish"
            value=""
            onChange=""
            lang={"en-US"}
            required
            className="input"
          />
          {errors.nameEnglish && (
            <p className="text-red-500 text-sm mt-1">{errors.nameEnglish}</p>
          )}
        </div>
        <div>
          {/* Gujarati */}
          <label>Name (ગુજરાતી)</label>
          <Input
            label={"Name (ગુજરાતી)"}
            name="nameGujarati"
            value=""
            onChange=""
            lng={"gu-US"}
            className="input"
          />
        </div>
        <div>
          {/* Gujarati */}
          <label>Name (हिंदी)</label>
          <Input
            label={"Name (हिंदी)"}
            name="nameGujarati"
            value=""
            onChange=""
            lng={"gu-US"}
            className="input"
          />
        </div>
        {/* Hindi */}
        <div>
          <label>Price</label>
          <Input name="price" value="" required className="input" />
        </div>
      </div>
      <div className="h-screen flex flex-col p-4">
        <div className="flex-1 flex overflow-hidden">
          <CategoryListpackage
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            setCategories={setCategories}
          />

          <MenuItemGridPackage
            selectedCategory={selectedCategory}
            onAddItem={handleAddItem}
            selectedItemIds={selectedItemIds}
          />

          <div className="text-gray-700">
            <SelectedItemPackage
              selectedItems={selectedItems}
              onRemoveItem={handleRemoveItem}
              onUpdateRate={handleUpdateRate}
              categoryMap={categoryMap}
            />
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCustomPackage;
