import { useState, useEffect } from "react";
import { Modal, Select, Checkbox, Input, Button, Spin, Empty } from "antd";
import {
  GetRawmaterialItemByRecipe,
  Getmenuitems,
} from "@/services/apiServices";

const unitOptions = ["Gram", "Kilogram", "Litre"];

const CopyRecipe = ({ isOpen, onClose, onCopy }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeOptions, setRecipeOptions] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  const [items, setItems] = useState([]);
  const userId = localStorage.getItem("userId") || "0";

  const fetchRecipes = async () => {
    setLoadingRecipes(true);
    try {
      const page = 1;
      const size = 1000;
      const res = await Getmenuitems(page, size, userId);

      const list = res?.data?.data?.items || [];

      const mapped = list.map((r) => ({
        label: r.nameEnglish,
        value: r.id,
      }));

      setRecipeOptions(mapped);

      setSelectedRecipe(null);
      setItems([]);
    } catch (err) {
      console.log("Error fetching recipes:", err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const fetchRecipeItems = async (recipeId) => {
    setLoadingItems(true);
    try {
      const res = await GetRawmaterialItemByRecipe(recipeId, userId, false);

      const list = res?.data?.data?.menuItemRawMaterials || [];

      const formatted = list.map((i) => ({
        id: i.id,
        name: i.rawMaterial?.nameEnglish || "",
        rawmatrialId: i.rawMaterial.id || "",
        weight: i.weight || "",
        supplierRate: i.rawMaterial?.supplierRate || 0,
        unit: i.unit?.nameEnglish || "Gram",
        unitId: i.unit?.id || "",
        category: i.rawMaterial?.rawMaterialCat?.nameEnglish || "",
        checked: false,
      }));

      setItems(formatted);
    } catch (error) {
      console.log("Error fetching recipe items:", error);
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchRecipes();
  }, [isOpen]);

  const toggleSelectAll = (value) => {
    setItems(items.map((i) => ({ ...i, checked: value })));
  };

  const toggleItem = (id) => {
    setItems(
      items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const handleCopy = () => {
    const selectedItems = items.filter((i) => i.checked);
    onCopy(selectedItems);
    onClose(false);
  };

  return (
    <Modal
      title="Copy Recipe"
      width={820}
      open={isOpen}
      footer={null}
      onCancel={() => onClose(false)}
    >
      {loadingRecipes ? (
        <Spin className="mb-4" />
      ) : recipeOptions.length ? (
        <Select
          showSearch
          placeholder="Select recipe"
          value={selectedRecipe}
          onChange={(v) => {
            setSelectedRecipe(v);
            fetchRecipeItems(v);
          }}
          className="!w-64 mb-4"
          options={recipeOptions}
        />
      ) : (
        <Empty description="No Recipes Found" className="mb-4" />
      )}

      {/* Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[45px_1fr_150px_150px] items-center bg-primary text-white font-semibold py-2 px-3 text-[14px]">
          <Checkbox
            checked={items.every((i) => i.checked)}
            indeterminate={
              items.some((i) => i.checked) && !items.every((i) => i.checked)
            }
            onChange={(e) => toggleSelectAll(e.target.checked)}
          />
          <span className="uppercase">Name</span>
          <span className="uppercase text-center">Weight</span>
          <span className="uppercase text-center">Unit</span>
        </div>

        {/* Loader / Empty / Rows */}
        {loadingItems ? (
          <div className="py-8 flex justify-center">
            <Spin />
          </div>
        ) : items.length === 0 ? (
          <Empty description="No Items Found" className="py-8" />
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[45px_1fr_150px_150px] items-center py-3 px-3 border-b border-gray-200 bg-white"
            >
              <Checkbox
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
              />

              <span className="text-[13px] uppercase">{item.name}</span>

              <Input
                className="!w-28 text-center"
                value={item.weight}
                onChange={(e) =>
                  setItems(
                    items.map((i) =>
                      i.id === item.id ? { ...i, weight: e.target.value } : i
                    )
                  )
                }
              />

              <Select
                value={item.unit}
                className="!w-32"
                onChange={(v) =>
                  setItems(
                    items.map((i) => (i.id === item.id ? { ...i, unit: v } : i))
                  )
                }
                options={unitOptions.map((u) => ({ label: u, value: u }))}
              />
            </div>
          ))
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-center gap-5 mt-6">
        <Button
          type="primary"
          className="!w-28 !font-semibold bg-primary"
          onClick={handleCopy}
          disabled={!items.some((i) => i.checked)}
        >
          Copy
        </Button>
        <Button
          danger
          className="!w-28 !font-semibold"
          onClick={() => onClose(false)}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default CopyRecipe;
