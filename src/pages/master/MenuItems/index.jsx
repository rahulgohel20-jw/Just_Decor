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
} from "@/services/apiServices";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import {  Spin } from "antd";
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

  let Id = localStorage.getItem("userId");

  // Wrap fetchPage in useCallback to prevent unnecessary recreations
  const fetchPage = useCallback(
    async (page, search = searchQuery) => {
      setLoading(true);

      try {
        console.log(`📩 Fetching page ${page} with search: "${search}"`);

        const response = await GetAllMenuItems({
          userId: Id,
          itemName: search || "", // Ensure empty string if no search
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
  ); // Include dependencies

  // Initial load
  useEffect(() => {
    fetchPage(1);
  }, []);

  // Search effect with debounce
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

const uploadImage = async (id, file) => {
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const fileType = "MenuItemImage";
    const moduleName = "MenuItem";

    const response = await uploadFileformenu(formData, {
      fileType,
      moduleId: id,
      moduleName,
    });

    // Get new image path from response
    const newImage = response?.data?.imagePath || "";

    // Update the specific row in tableData
    setTableData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, image: newImage } : item))
    );

    Swal.fire({
      title: "Uploaded!",
      text: "Image uploaded successfully.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Upload failed!", error);
    Swal.fire("Error", "Failed to upload image!", "error");
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

  const refreshData = () => {
    fetchPage(currentPage, searchQuery);
  };

  return (
    <Fragment>
      <Container>
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="MASTER.MENU_ITEMS"
                    defaultMessage="Menu Items Master"
                  />
                ),
              },
            ]}
          />
        </div>

        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={intl.formatMessage({
                  id: "MASTER.SEARCH_MENU_ITEMS",
                  defaultMessage: "Search Menu Items",
                })}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
                // setSelectedMenuItem(null);
                // setIsItemModalOpen(true);
              }}
              title={intl.formatMessage({
                id: "MASTER.ADD_MENU_ITEM",
                defaultMessage: "Add Item",
              })}
            >
              <i className="ki-filled ki-plus"></i>{" "}
              <FormattedMessage
                id="MASTER.ADD_MENU_ITEM"
                defaultMessage="Add Menu Item"
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
