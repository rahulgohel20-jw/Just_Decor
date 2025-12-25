import { Fragment, useEffect, useState, useCallback } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import {
  GetAllMenuItems,
  DeleteMenuItem,
  updatestatusmneuitem,
  uploadFileformenu,
  GetAllSubCategory,
} from "@/services/apiServices";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 1000;

const MenuItems = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [subCategoryList, setSubCategoryList] = useState([]);

  let Id = localStorage.getItem("userId");

  const FetchSubCategoryData = () => {
    setLoading(true);
    GetAllSubCategory({ userid: Id })
      .then((res) => {
        const list = res.data.data["Menu Sub Category Details"] || [];
        console.log(list);

        setSubCategoryList(list);
      })
      .catch((error) => console.error("Error fetching sub category:", error))
      .finally(() => setLoading(false));
  };

  const fetchPage = useCallback(
    async (page, search = searchQuery, subCat = subCategoryFilter) => {
      setLoading(true);

      try {
        console.log(`📩 Fetching page ${page} with search: "${search}"`);

        const response = await GetAllMenuItems({
          userId: Id,
          itemName: search || "",
          subCategoryId: subCat || "",
          page: page,
          size: ITEMS_PER_PAGE,
        });

        const items = response?.data?.data?.items || [];
        const total = response?.data?.data?.totalItems || 0;

        setTotalItems(total);

        // Map items to table format
        const language = localStorage.getItem("lang");
        const languageMap = {
          en: "nameEnglish",
          hi: "nameHindi",
          gu: "nameGujarati",
        };
        const field = languageMap[language] || "nameEnglish";

        const mapped = items.map((item, index) => ({
          sr_no: (page - 1) * ITEMS_PER_PAGE + index + 1,
          id: item.id,
          name: item[field] || "-",
          category: item.menuCategory?.[field] || "-",
          subCategory: item.menuSubCategory?.[field] || "-",
          kitchenArea: item.kitchenArea?.[field] || "-",
          slogan: item.slogan || "-",
          price: item.price || "-",
          priority: item.sequence || "-",
          cost: item.dishCosting || 0,
          image: item.imagePath || "",
          status: item.isActive,
          rawdata: item.menuItemRawMaterials || [],
          menuAllocation: item.menuItemAllocationConfigs || [],
          uploadImage,

          _originalItem: item,
        }));

        setTableData(mapped);
        console.log(`✅ Loaded ${items.length} items for page ${page}`);
      } catch (error) {
        console.error("Error loading page:", error);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    },
    [Id, searchQuery]
  );

  useEffect(() => {
    fetchPage(1);
    FetchSubCategoryData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log("🔍 Search triggered:", searchQuery);
      setCurrentPage(1);
      fetchPage(1, searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleDelete = (id) => {
    if (!id || isNaN(id)) {
      console.error("❌ Invalid ID passed to delete:", id);
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteMenuItem(id)
          .then((response) => {
            if (
              response &&
              (response.success || response.data.success === true)
            ) {
              fetchPage(currentPage, searchQuery);

              Swal.fire({
                title: "Removed!",
                text: "Menu Item has been removed successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              throw new Error(response?.message || "API call failed");
            }
          })
          .catch((err) => {
            console.error("Delete error:", err);
          });
      }
    });
  };

  const uploadImage = async (moduleRecordId, file) => {
    if (!file) return;

    if (!(file instanceof File || file instanceof Blob)) {
      Swal.fire("Error", "File must be binary", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("fileType", "IMAGE");
      formData.append("moduleName", "MENUITEM");
      formData.append("moduleRecordId", moduleRecordId);
      formData.append("userId", Id);

      const response = await uploadFileformenu(formData);

      // ✅ STRICT SUCCESS CHECK
      if (response?.data?.success !== true) {
        throw new Error(response?.data?.msg || "Image upload failed");
      }

      const imagePath = response.data.fullPath; // ✅ CORRECT KEY

      setTableData((prev) =>
        prev.map((item) =>
          item.id === moduleRecordId ? { ...item, image: imagePath } : item
        )
      );

      Swal.fire({
        title: "Uploaded!",
        text: response.data.msg,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Upload failed:", error);

      Swal.fire(
        "Error",
        error.response?.data?.msg || error.message || "Image upload failed",
        "error"
      );
    }
  };

  const handlePagination = (page) => {
    setCurrentPage(page);
    fetchPage(page, searchQuery);
  };

  const handleEdit = (menuItem) => {
    navigate("/master/menu-items", {
      state: { editData: menuItem._originalItem },
    });
  };

  const statusmenuitem = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await updatestatusmneuitem(id, newStatus);

      setTableData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Fragment>
      <Container>
        <div className=" pb-2 mb-3">
          <h1 className="test-xl text-gray-900">
            <FormattedMessage
              id="COMMON.MENU_ITEM_RECIPE_MASTER"
              defaultMessage="Menu Item Recipe Master"
            />
          </h1>
        </div>

        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex  items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8 w-[200px]"
                placeholder={intl.formatMessage({
                  id: "MASTER.SEARCH_MENU_ITEMS",
                  defaultMessage: "Search Menu Items",
                })}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="input min-w-[200px]"
              value={subCategoryFilter}
              onChange={(e) => {
                const selected = e.target.value;
                setSubCategoryFilter(selected);
                setCurrentPage(1);

                fetchPage(1, searchQuery, selected);
              }}
            >
              <option value="">All Subcategories</option>
              {subCategoryList?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nameEnglish || item.name || "-"}
                </option>
              ))}
            </select>

            {loading && (
              <div className="flex items-center gap-2 text-primary">
                <Spin size="small" />
                <span className="text-sm">Loading items...</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate("/master/menu-items");
              }}
              title={intl.formatMessage({
                id: "MASTER.ADD_MENU_ITEM",
                defaultMessage: "Add Item",
              })}
            >
              <i className="ki-filled ki-plus"></i>{" "}
              <FormattedMessage
                id="USER.MASTER.ADD_CONTACT_CATEGORY"
                defaultMessage="Create New"
              />
            </button>
          </div>
        </div>

        <TableComponent
          columns={columns(handleEdit, handleDelete, statusmenuitem)}
          data={tableData}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: ITEMS_PER_PAGE,
            total: totalItems,
            onChange: handlePagination,
            showSizeChanger: false,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Container>
    </Fragment>
  );
};

export default MenuItems;
