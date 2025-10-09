import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import SearchInput from "../../../Event/EventPreparationPage/components/SearchInput";
import CategoryList from "../../../Event/EventPreparationPage/components/CategoryList";
import MenuItemGrid from "../../../Event/EventPreparationPage/components/MenuItemGrid";
import SelectedItemsList from "../../../Event/EventPreparationPage/components/SelectedItemsList";
import { useCustomPackageLogic } from "./hooks/useCustomPackageLogic";

const AddCustomPackage = () => {
  const navigate = useNavigate();
  const {
    filteredCategories,
    selectedCategoryId,
    handleCategoryChange,
    categoryAnyItems,
    setCategoryAnyItems,
    filteredChildren,
    toggleChildSelection,
    handleRemoveItem,
    selectedItemsByCategory,
    showDetails,
    getAllSelectedItemIds,
    calculateTotalPrice,
    totalSelectedCount,
    loading,
    categories,
    validationSchema,
    initialFormState,
    handleSubmit,
  } = useCustomPackageLogic();

  return (
    <Fragment>
      <Container className="flex flex-col min-h-screen">
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Add Custom Package" }]} />
        </div>

        <Formik
          initialValues={initialFormState}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <form className="flex flex-col gap-4">
              {/* ============ Package Form Section ============ */}
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="text-lg font-semibold mb-3">Package Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Package Name
                    </label>
                    <input
                      type="text"
                      name="packageName"
                      className="input w-full"
                      placeholder="Enter package name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Package Price
                    </label>
                    <input
                      type="number"
                      name="packagePrice"
                      className="input w-full"
                      placeholder="Enter package price"
                    />
                  </div>
                </div>
              </div>

              {/* ============ Custom Package Items Section ============ */}
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="text-lg font-semibold mb-3">Custom Package Items</h3>

                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* ============ Categories ============ */}
                  <div className="col-span-3">
                    <div className="h-full flex flex-col gap-3">
                      <div className="sticky top-0 z-10 bg-white border-b p-3 rounded-t-lg">
                        <SearchInput placeholder="Search categories" />
                      </div>

                      <div className="border rounded-md bg-white p-2 max-h-[520px] overflow-auto">
                        {filteredCategories.map((cat) => {
                          const isSelected = selectedCategoryId === cat.id;
                          const anyValue = categoryAnyItems?.[cat.id]?.count || 1;

                          return (
                            <div key={cat.id} className="mb-2 border rounded-md">
                              <div
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`p-2 cursor-pointer flex justify-between items-center ${
                                  isSelected
                                    ? "bg-primary/10 border-primary"
                                    : "bg-white"
                                }`}
                              >
                                <span className="font-medium text-gray-800">
                                  {cat.name}
                                </span>
                                {anyValue ? (
                                  <span className="text-xs text-gray-500">
                                    (Any {anyValue})
                                  </span>
                                ) : null}
                              </div>

                              {isSelected && (
                                <div className="p-2 border-t bg-gray-50">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Number of Items (Any)
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                    value={anyValue}
                                    onChange={(e) =>
                                      setCategoryAnyItems((prev) => ({
                                        ...prev,
                                        [cat.id]: {
                                          ...prev[cat.id],
                                          count: parseInt(e.target.value) || 1,
                                        },
                                      }))
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ============ Items Grid ============ */}
                  <div className="col-span-6">
                    <div className="h-full">
                      <div className="border-b p-3 bg-light">
                        <SearchInput placeholder="Search items" />
                      </div>
                      <div className="flex-1 p-3 max-h-[520px] overflow-auto">
                        <MenuItemGrid
                          items={filteredChildren}
                          onToggleSelection={toggleChildSelection}
                          loading={loading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ============ Selected Items ============ */}
                  <div className="col-span-3">
                    <div className="h-full lg:border-s bg-muted/25">
                      <div className="border-b p-3 bg-muted/15">
                        <span className="text-md font-medium text-gray-900">
                          Selected Items
                        </span>
                      </div>
                      <div className="flex-1 p-3 max-h-[516px] overflow-auto bg-white">
                        <SelectedItemsList
                          key={JSON.stringify(Object.keys(selectedItemsByCategory))}
                          selectedItemsByCategory={selectedItemsByCategory}
                          showDetails={showDetails}
                          currentFunctionData={{
                            selectedItems: getAllSelectedItemIds(),
                            itemNotes: {},
                            itemRates: {},
                            itemSlogans: {},
                            categoryNotes: {},
                            categorySlogans: {},
                          }}
                          categories={categories}
                          categoryAnyItems={categoryAnyItems}
                          onRemoveItem={handleRemoveItem}
                        />
                      </div>
                      <div className="p-3 border-t flex items-center justify-between">
                        <span className="text-xs text-gray-700">
                          Total Items: {totalSelectedCount}
                        </span>
                        <span className="text-xs text-gray-700">
                          ₹ {calculateTotalPrice().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============ Footer Buttons ============ */}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isSubmitting || loading || totalSelectedCount === 0}
                >
                  Save Package
                </button>
              </div>
            </form>
          )}
        </Formik>
      </Container>
    </Fragment>
  );
};

export default AddCustomPackage;
