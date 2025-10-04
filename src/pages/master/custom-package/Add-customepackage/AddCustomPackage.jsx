import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import CategoryList from "../../../Event/EventPreparationPage/components/CategoryList";
import MenuItemGrid from "../../../Event/EventPreparationPage/components/MenuItemGrid";
import SelectedItemsList from "../../../Event/EventPreparationPage/components/SelectedItemsList";
import SearchInput from "../../../Event/EventPreparationPage/components/SearchInput";
import { useCategories, useMenuItems } from "../../../master/custom-package/Add-customepackage/hook/usePackageData";

const AddCustomPackage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [childSearch, setChildSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
const [numberOfItems, setNumberOfItems] = useState("");

  const { categories, fetchCategories } = useCategories();
  const { menuItems, loading, fetchMenuItems, allMenuItems } = useMenuItems();

  const allCategory = { id: 0, name: "All" };
  const categoriesWithAll = [allCategory, ...categories];

  /* ─────────────── Init Load ─────────────── */
  useEffect(() => {
    const initializeData = async () => {
      await fetchCategories();
      await fetchMenuItems(0); // load all items by default
    };
    initializeData();
  }, []);

  /* ─────────────── Category Change ─────────────── */
  const handleCategoryChange = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    await fetchMenuItems(categoryId);
  };

  /* ─────────────── Item Selection Toggle ─────────────── */
  const toggleChildSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  /* ─────────────── Filtering ─────────────── */
  const filteredCategories = categoriesWithAll.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  // Add selection state for UI
  const menuItemsWithSelectionState = menuItems.map((item) => ({
    ...item,
    isSelected: selectedItems.includes(item.id),
  }));

  const filteredChildren = menuItemsWithSelectionState.filter((child) =>
    child.name.toLowerCase().includes(childSearch.toLowerCase())
  );

  /* ─────────────── Selected Items Panel ─────────────── */
  // ✅ Always use allMenuItems so switching categories doesn’t lose selection
  const selectedMenuItems = allMenuItems.filter((item) =>
    selectedItems.includes(item.id)
  );

  const selectedItemsByCategory = selectedMenuItems.reduce((acc, item) => {
    const category = categories.find((cat) => cat.id === item.parentId);
    const categoryName = category?.name || "Uncategorized";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(item);
    return acc;
  }, {});

  const calculateTotalPrice = () =>
    selectedMenuItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0),
      0
    );

  /* ─────────────── JSX ─────────────── */
  return (
    <Fragment>
      <Container className="flex flex-col min-h-screen">
        {/* Breadcrumb */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Add Custom Package" }]} />
        </div>

        {/* Package Info */}
        <div className="border rounded-lg p-4 mb-4 bg-white">
          <h3 className="text-lg font-semibold mb-3">New Custom Package</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name (English)*
              </label>
              <input
                type="text"
                className="input mt-1 w-full"
                placeholder="Enter name in English"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name (ગુજરાતી)
              </label>
              <input
                type="text"
                className="input mt-1 w-full"
                placeholder="Enter name in Gujarati"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name (हिन्दी)
              </label>
              <input
                type="text"
                className="input mt-1 w-full"
                placeholder="Enter name in Hindi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price*
              </label>
              <input
                type="number"
                className="input mt-1 w-full"
                placeholder="Enter price"
              />
            </div>
          </div>
        </div>

        {/* Category / Items / Selection */}

    
            <div className="border rounded-lg p-4 mb-4 bg-white">
           <h3 className="text-lg font-semibold mb-3"> Custom Package Items</h3>
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Panel - Categories */}



            
   {/* Left Panel - Categories */}
<div className="col-span-3">
  <div className="h-full lg:border-e lg:border-e-border flex flex-col gap-3">
    {/* 🔝 Sticky Top - Category Search */}
    <div className="sticky top-0 z-10 bg-white border-b p-3 rounded-t-lg">
      <SearchInput
        placeholder="Search categories"
        value={search}
        onChange={setSearch}
      />
    </div>

    {/* 📦 Category List Box */}
    <div className="border rounded-md bg-white p-2 max-h-[520px] overflow-auto scrollable-y">
      <CategoryList
        categories={filteredCategories}
        selectedId={selectedCategoryId}
        onSelect={handleCategoryChange}
        searchTerm={search}
      />
    </div>

    {/* 📦 Separate Number of Items Box */}
    <div className="sticky bottom-0 z-10 border rounded-md p-3 bg-white">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Number of Items
      </label>
      <input
        type="number"
        min="0"
        className="input w-full"
        placeholder="Enter number"
        value={numberOfItems}
        onChange={(e) => setNumberOfItems(e.target.value)}
      />
    </div>
  </div>
</div>




            {/* Middle Panel - Menu Items */}
            <div className="col-span-6">
              <div className="h-full">
                <div className="border-b p-3 bg-light">
                  <SearchInput
                    placeholder="Search items"
                    value={childSearch}
                    onChange={setChildSearch}
                  />
                </div>
                <div className="flex-1 p-3 max-h-[520px] overflow-auto scrollable-y">
                  <MenuItemGrid
                    items={filteredChildren}
                    searchTerm={childSearch}
                    onToggleSelection={toggleChildSelection}
                    loading={loading}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel - Selected Items */}
            <div className="col-span-3">
              <div className="h-full lg:border-s lg:border-s-border bg-muted/25">
                <div className="border-b p-3 bg-muted/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-md font-medium text-gray-900">
                      Selected Items
                    </span>
                    <button
                      className="text-primary hover:underline"
                      onClick={() => setShowDetails((prev) => !prev)}
                    >
                      {showDetails ? (
                        <i className="ki-filled ki-eye"></i>
                      ) : (
                        <i className="ki-filled ki-eye-slash"></i>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-3 max-h-[516px] overflow-auto scrollable-y bg-white">
                  <SelectedItemsList
                    selectedItemsByCategory={selectedItemsByCategory}
                    showDetails={showDetails}
                    currentFunctionData={{
                      selectedItems: selectedItems,
                      itemNotes: {},
                      itemRates: {},
                      itemSlogans: {},
                      categoryNotes: {},
                      categorySlogans: {},
                    }}
                    categories={categories}
                    onItemRateChange={() => {}}
                    onNoteClick={() => {}}
                    onCategoryNoteClick={() => {}}
                    onRemoveItem={toggleChildSelection}
                  />
                </div>
                <div className="p-3 border-t flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs text-gray-700">
                      Total Items:
                    </span>
                    <span className="font-bold text-xs text-gray-900">
                      {selectedItems.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs text-gray-700">
                      Total:
                    </span>
                    <span className="font-bold text-xs text-gray-900">
                      ₹ {calculateTotalPrice()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2">
          <button className="btn btn-light" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button
            className="btn btn-success"
            disabled={loading || selectedItems.length === 0}
          >
            <i className="ki-filled ki-save-2"></i>
            Save Package
          </button>
        </div>
      </Container>
    </Fragment>
  );
};

export default AddCustomPackage;
