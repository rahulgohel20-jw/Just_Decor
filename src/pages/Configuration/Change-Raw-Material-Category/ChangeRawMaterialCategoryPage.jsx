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
import Swal from "sweetalert2";
import NoData from "../../../components/Nodata";

const ChangeRawMaterialCategoryPage = () => {
  const intl = useIntl();
  const [activeCategory, setActiveCategory] = useState("");

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

        const response = await GetRawMaterialcategory(userId);

        const categoriesData =
          response?.data?.data?.["Raw Material Category Details"] || [];

        const categories = categoriesData.map((cat) => ({
          id: cat.id,
          name: cat.nameEnglish?.trim(),
        }));

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
      if (!activeCategory) {
        setTableData([]);
        return;
      }

      if (activeCategory === "all" && categoryList.length === 0) return;

      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");

        let cat_id_list =
          activeCategory === "all"
            ? categoryList.map((cat) => cat.id)
            : [activeCategory];

        const response = await Getrawmaterialitembycat(cat_id_list, userId);

        const rawMaterialsData = response?.data?.data || [];

        const formattedData = rawMaterialsData.map((item, index) => ({
          id: item.id || index,
          categoryId: item.rawMaterialCatId || item.category_id,
          rawMaterial: item.nameEnglish?.trim() || "N/A",
          category: item.rawMaterialCatNameEnglish?.trim() || "N/A",
        }));

        setTableData(formattedData);
      } catch (error) {
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRawMaterials();
  }, [activeCategory, categoryList]);

  const combinedCategories = [...staticCategories, ...categoryList];

  const handleSaveChanges = async () => {
    if (!toCategory || selectedRows.length === 0) return;

    setIsSaving(true);

    try {
      const userId = localStorage.getItem("userId");

      const params = new URLSearchParams();

      params.append("new_cat_id", toCategory);
      params.append("userId", userId);

      selectedRows.forEach((row) => {
        params.append("raw_material_id_list", row.id);
      });

      const response = await UpdateRawMaterialCategory(params.toString());

      const successMsg = response?.data?.msg || "Category updated successfully";

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: successMsg,
        confirmButtonColor: "#2563eb",
      });

      setActiveCategory(toCategory);

      setSelectedRows([]);
      setFromCategory("");
      setToCategory("");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.msg || "Failed to update raw material category";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
        confirmButtonColor: "#dc2626",
      });
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
                onChange={(val) => {
                  setFromCategory(val);
                  setActiveCategory(val); // 👈 table loads
                }}
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
            <NoData
              text={intl.formatMessage({
                id: "RAW_MATERIAL.SELECT_CATEGORY",
                defaultMessage: "No raw materials found for this category",
              })}
            />
          ) : tableData.length === 0 ? (
            <NoData
              text={intl.formatMessage({
                id: "RAW_MATERIAL.SELECT_CATEGORY",
                defaultMessage:
                  "Please select a category to view raw materials",
              })}
            />
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
