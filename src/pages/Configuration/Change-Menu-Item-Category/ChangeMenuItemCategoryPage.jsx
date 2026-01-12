import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { FormattedMessage, useIntl } from "react-intl";
import { columns } from "./constant";
import FromCategoryDropdown from "../../../components/form-inputs/FromCategoryDropdown/FromCategoryDropdown";
import {
  GetMenuCategoryByUserId,
  Getmenuitemsusingcatidconfig,
  UpdtaemenuItemcatergoryconfig,
} from "@/services/apiServices";
import Swal from "sweetalert2";
import NoData from "../../../components/Nodata";

const ChangeMenuItemCategoryPage = () => {
  const intl = useIntl();
  const [activeCategory, setActiveCategory] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [fromCategory, setFromCategory] = useState("");
  const [toCategory, setToCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        const response = await GetMenuCategoryByUserId(userId);

        const categoriesData =
          response?.data?.data?.["Menu Category Details"] || [];

        const categories = categoriesData.map((cat) => ({
          id: cat.id,
          name: cat.nameEnglish?.trim(),
        }));

        setCategoryList(categories);
      } catch (error) {
        console.error("❌ Error fetching menu categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMenuitem = async () => {
      if (!activeCategory) {
        setTableData([]);
        return;
      }

      if (activeCategory === "all" && categoryList.length === 0) return;

      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");

        let menu_cat_ids =
          activeCategory === "all"
            ? categoryList.map((cat) => cat.id)
            : [activeCategory];

        // Call API without `type`
        const response = await Getmenuitemsusingcatidconfig(
          menu_cat_ids,
          userId,
          { type: null }
        );

        const menuItemsData =
          response?.data?.data || response?.data?.darta || [];

        const formattedData = menuItemsData.map((item) => ({
          id: item.id,
          menuItem: item.nameEnglish?.trim() ?? "N/A",
          category: item.menuCategoryNameEnglish?.trim() ?? "N/A",
        }));

        setTableData(formattedData);
      } catch (error) {
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuitem();
  }, [activeCategory, categoryList]);

  const staticCategories = [{ id: "all", name: "All Categories" }];

  const combinedCategories = [...staticCategories, ...categoryList];

  const handleSaveChanges = async () => {
    if (!toCategory || selectedRows.length === 0) return;

    setIsSaving(true);

    try {
      const userId = localStorage.getItem("userId");

      const params = new URLSearchParams();

      params.append("new_cat_id", toCategory);
      params.append("user_id", userId);
      params.append("type", null);

      selectedRows.forEach((id) => {
        params.append("menu_item_ids", id);
      });

      const response = await UpdtaemenuItemcatergoryconfig(params.toString());

      const successMsg =
        response?.data?.msg || "Menu item category updated successfully";

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: successMsg,
        confirmButtonColor: "#2563eb",
      });

      // reload table
      setActiveCategory(toCategory);
      setSelectedRows([]);
      setFromCategory("");
      setToCategory("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Failed to update menu item category",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTableData = tableData.filter((item) => {
    if (!searchQuery) return true; // no search, show all

    const query = searchQuery.toLowerCase();

    // check the fields you want to search in
    return (
      item.menuItem.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  return (
    <Fragment>
      <Container>
        {/* Breadcrumb */}
        <div className="gap-2 mb-3">
          <h1 className="text-xl text-gray-900">
            <FormattedMessage
              id="MENUITEM.CHANGE_CATEGORY"
              defaultMessage="Change Menu Item Category"
            />
          </h1>
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
                  setActiveCategory(val);
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
                id="MENUITEM.LIST"
                defaultMessage="Menu Item List"
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

          <TableComponent
            columns={columns({
              selectedRows,
              setSelectedRows,
              data: filteredTableData,
            })}
            data={filteredTableData}
            paginationSize={10}
          />
        </div>

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

export { ChangeMenuItemCategoryPage };
