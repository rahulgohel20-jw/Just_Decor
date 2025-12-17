import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { FormattedMessage, useIntl } from "react-intl";
import { columns } from "./constant";
import FromCategoryDropdown from "../../../components/form-inputs/FromCategoryDropdown/FromCategoryDropdown";
import {
  GetRawMaterialcategory,
  Getrawmaterialitembycat,
  UpdateRawMaterialCategory,
} from "@/services/apiServices";

const ChangeRawMaterialCategoryPage = () => {
  const intl = useIntl();

  const [fromCategory, setFromCategory] = useState("");
  const [toCategory, setToCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const staticCategories = [{ id: "all", name: "All Categories" }];

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        console.log("🔹 User ID:", userId);

        const response = await GetRawMaterialcategory(userId);

        console.log("✅ Raw API Response:", response);

        const categoriesData =
          response?.data?.data?.["Raw Material Category Details"] || [];

        console.log("📊 Categories Array Before Mapping:", categoriesData);

        const categories = categoriesData.map((cat) => ({
          id: cat.id,
          name: cat.nameEnglish?.trim(),
        }));

        console.log("🎯 Final Mapped Categories:", categories);

        setCategoryList(categories);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRawMaterials = async () => {
      if (!fromCategory) {
        setTableData([]);
        return;
      }

      // Don't fetch if categories haven't loaded yet and "All" is selected
      if (fromCategory === "all" && categoryList.length === 0) {
        console.log("⏳ Waiting for categories to load...");
        return;
      }

      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        console.log("🔹 Fetching raw materials for category:", fromCategory);

        let cat_id_list = [];

        // If "All Categories" is selected, fetch all category IDs
        if (fromCategory === "all") {
          cat_id_list = categoryList.map((cat) => cat.id);
          console.log("📋 Fetching ALL categories:", cat_id_list);
        } else {
          // Single category - ensure it's in an array
          cat_id_list = [fromCategory];
          console.log("📋 Fetching single category:", cat_id_list);
        }

        // Don't make API call if no valid categories
        if (cat_id_list.length === 0) {
          console.log("⚠️ No valid category IDs to fetch");
          setTableData([]);
          setLoading(false);
          return;
        }

        const response = await Getrawmaterialitembycat(cat_id_list, userId);

        console.log("✅ Raw Materials API Response:", response);

        const rawMaterialsData = response?.data?.data || [];

        const formattedData = rawMaterialsData.map((item, index) => ({
          id: item.id || index,
          categoryId: item.rawMaterialCatId || item.category_id,
          rawMaterial: item.nameEnglish?.trim() || "N/A",
          category: item.rawMaterialCatNameEnglish?.trim() || "N/A",
        }));

        console.log("🎯 Final Formatted Table Data:", formattedData);

        setTableData(formattedData);
      } catch (error) {
        console.error("❌ Error fetching raw materials:", error);

        // Better error handling
        if (error.code === "ERR_NETWORK") {
          console.error(
            "🚫 CORS Error: Backend needs to enable CORS for localhost:5173"
          );
        }

        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRawMaterials();
  }, [fromCategory, categoryList]);

  const combinedCategories = [...staticCategories, ...categoryList];

  const handleSaveChanges = async () => {
    if (!toCategory || selectedRows.length === 0) {
      console.warn("⚠️ Missing required data for save");
      return;
    }

    setIsSaving(true);
    try {
      const userId = localStorage.getItem("userId");

      console.log("💾 Saving changes:");
      console.log("   Selected Items:", selectedRows);
      console.log("   To Category:", toCategory);

      // Extract category IDs from selected rows
      const currentCategoryIds = selectedRows.map((row) => row.categoryId);

      // Get unique category IDs (in case multiple items have same category)
      const uniqueCategoryIds = [...new Set(currentCategoryIds)];

      console.log("   Current Category IDs:", uniqueCategoryIds);

      // Call the update API
      const response = await UpdateRawMaterialCategory(
        uniqueCategoryIds, // current_cat_id_list (category IDs, not item IDs)
        toCategory, // new_cat_id
        userId // userId
      );

      console.log("✅ Update successful:", response);

      // Show success message
      alert("Categories updated successfully!");

      // Reset and refresh
      setSelectedRows([]);
      setToCategory("");

      // Refresh the table data
      if (fromCategory) {
        const fetchResponse = await Getrawmaterialitembycat(
          fromCategory === "all"
            ? categoryList.map((cat) => cat.id)
            : [fromCategory],
          userId
        );

        const rawMaterialsData = fetchResponse?.data?.data || [];
        const formattedData = rawMaterialsData.map((item, index) => ({
          id: item.id || index,
          categoryId: item.rawMaterialCatId || item.category_id,
          rawMaterial: item.nameEnglish?.trim() || "N/A",
          category: item.rawMaterialCatNameEnglish?.trim() || "N/A",
        }));

        setTableData(formattedData);
      }
    } catch (error) {
      console.error("❌ Error updating categories:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update categories. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Fragment>
      <Container>
        {/* Breadcrumb */}
        <div className="gap-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="RAW_MATERIAL.CHANGE_CATEGORY"
                    defaultMessage="Change Raw Material Category"
                  />
                ),
              },
            ]}
          />
        </div>

        {/* FROM / TO CATEGORY CARD */}
        <div className="card min-w-full p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">
                <FormattedMessage
                  id="FROM_CATEGORY"
                  defaultMessage="From Category"
                />
              </label>

              <FromCategoryDropdown
                value={fromCategory}
                onChange={setFromCategory}
                options={combinedCategories}
                disabled={categoriesLoading}
              />
            </div>
            <div>
              <label className="form-label">
                <FormattedMessage
                  id="TO_CATEGORY"
                  defaultMessage="To Category"
                />
              </label>

              <div className="relative">
                <select
                  className="input appearance-none pr-10"
                  value={toCategory}
                  onChange={(e) => setToCategory(e.target.value)}
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading ? "Loading..." : "Select a category"}
                  </option>

                  {categoryList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <i className="ki-filled ki-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
              </div>
            </div>
          </div>
        </div>

        {/* RAW MATERIAL LIST CARD */}
        <div className="card min-w-full p-4 mb-10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-black text-lg font-semibold">
              <FormattedMessage
                id="RAW_MATERIAL.LIST"
                defaultMessage="Raw Material List"
              />
            </h2>

            <div className="relative">
              <i className="ki-filled ki-magnifier text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                type="text"
                placeholder={intl.formatMessage({
                  id: "RAW_MATERIAL.SEARCH",
                  defaultMessage: "To search, type and press Enter.",
                })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : tableData.length === 0 && fromCategory ? (
            <div className="text-center py-10 text-gray-500">
              <FormattedMessage
                id="RAW_MATERIAL.NO_DATA"
                defaultMessage="No raw materials found for this category"
              />
            </div>
          ) : tableData.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <FormattedMessage
                id="RAW_MATERIAL.SELECT_CATEGORY"
                defaultMessage="Please select a category to view raw materials"
              />
            </div>
          ) : (
            <TableComponent
              columns={columns({
                selectedRows,
                setSelectedRows,
                data: tableData,
              })}
              data={tableData}
              paginationSize={10}
            />
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mb-10">
          <button
            className="btn btn-light"
            onClick={() => {
              setSelectedRows([]);
              setFromCategory("");
              setToCategory("");
            }}
          >
            <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
          </button>
          <button
            className="btn btn-primary"
            disabled={!toCategory || selectedRows.length === 0 || isSaving}
            onClick={handleSaveChanges}
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                <FormattedMessage
                  id="COMMON.SAVING"
                  defaultMessage="Saving..."
                />
              </>
            ) : (
              <FormattedMessage
                id="COMMON.SAVE_CHANGES"
                defaultMessage="Save Changes"
              />
            )}
          </button>
        </div>
      </Container>
    </Fragment>
  );
};

export { ChangeRawMaterialCategoryPage };
