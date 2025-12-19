import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { FormattedMessage, useIntl } from "react-intl";
import { columns } from "./constant";
import FromCategoryDropdown from "../../../components/form-inputs/FromCategoryDropdown/FromCategoryDropdown";
import {
  Getrawmaterialitembycat,
  GetRawMaterialcategory,
  GetAllCustomer,
  Updateallocatesupplier,
} from "@/services/apiServices";
import Swal from "sweetalert2";

const Allocatesupplier = () => {
  const intl = useIntl();
  const [activeCategory, setActiveCategory] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [fromCategory, setFromCategory] = useState("");
  const [toCategory, setToCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setSupplierLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        const res = await GetAllCustomer(userId);

        const list = res?.data?.data?.["Party Details"] || [];

        // ✅ ONLY Outside Supplier (Food)
        const suppliers = list.filter(
          (party) => party?.contact?.contactType?.id === 3
        );

        setSupplierList(
          suppliers.map((party) => ({
            id: party.id,
            name: `${party.nameEnglish?.trim() || "N/A"} (${
              party?.contact?.contactType?.nameEnglish || "Outside Supplier"
            })`,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch suppliers", err);
      } finally {
        setSupplierLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

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
          supplier: item.partyNameEnglish || "",
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

  const staticCategories = [{ id: "all", name: "All Categories" }];

  const combinedCategories = [...staticCategories, ...categoryList];

  const handleSaveChanges = async () => {
    if (!selectedSupplier || selectedRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select at least one raw material and a supplier",
      });
      return;
    }

    const fromCategoryName =
      combinedCategories.find((c) => String(c.id) === String(fromCategory))
        ?.name || "Selected Category";

    const supplierName =
      supplierList.find((s) => String(s.id) === String(selectedSupplier))
        ?.name || "Selected Supplier";

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      html: `
      <div style="text-align:left">
        <p>You are about to allocate raw materials:</p>
        <ul>
          <li><b>From Category:</b> ${fromCategoryName}</li>
          <li><b>To Supplier:</b> ${supplierName}</li>
          <li><b>Items Selected:</b> ${selectedRows.length}</li>
        </ul>
      </div>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Allocate",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
    });

    if (!confirmResult.isConfirmed) return;

    setIsSaving(true);

    try {
      const userId = localStorage.getItem("userId");

      const params = new URLSearchParams();
      params.append("supplierId", selectedSupplier);
      params.append("userId", userId);

      selectedRows.forEach((id) => {
        params.append("raw_material_id_list", id);
      });

      const response = await Updateallocatesupplier(params.toString());

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: response?.data?.msg || "Supplier allocated successfully",
        confirmButtonColor: "#2563eb",
      });
      // ✅ Update table locally to show allocated supplier
      setTableData((prev) =>
        prev.map((row) =>
          selectedRows.includes(row.id)
            ? { ...row, supplier: supplierName }
            : row
        )
      );

      // 🔄 Reset
      setSelectedRows([]);
      setFromCategory("");
      setSelectedSupplier("");
      // setActiveCategory("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.msg || "Failed to allocate supplier",
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
                    defaultMessage="Allocate Supplier"
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
                  defaultMessage="To Vendor Supplier"
                />
              </label>

              <div className="relative">
                <select
                  className="input appearance-none pr-10"
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  disabled={supplierLoading}
                >
                  <option value="">
                    {supplierLoading
                      ? "Loading suppliers..."
                      : "Select Supplier"}
                  </option>

                  {supplierList.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name}
                    </option>
                  ))}
                </select>

                {/* Dropdown Icon */}
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
                defaultMessage="Raw Material Item List"
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
              data: tableData,
            })}
            data={tableData}
            paginationSize={10}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mb-10">
          <button
            className="btn btn-primary"
            disabled={
              !selectedSupplier || selectedRows.length === 0 || isSaving
            }
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

export { Allocatesupplier };
