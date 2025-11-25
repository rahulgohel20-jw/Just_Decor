import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, categoryData } from "./constant";
import AddMenuItem from "@/partials/modals/add-menu-item/AddMenuItem";
import {
  GetAllMenuItems,
  DeleteMenuItem,
  updatestatusmneuitem,
} from "@/services/apiServices";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import { Form, Spin } from "antd";

const ITEMS_PER_PAGE = 1000; // Show 50 items per page

const MenuItems = () => {
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  let Id = localStorage.getItem("userId");

  useEffect(() => {
    // Initial load - load first page
    fetchPage(1);
  }, []);

  useEffect(() => {
    // Reset on search
    setCurrentPage(1);
    fetchPage(1);
  }, [searchQuery]);

  // Fetch specific page from API
  const fetchPage = async (page) => {
    setLoading(true);

    try {
      console.log(`📩 Fetching page ${page} with ${ITEMS_PER_PAGE} items`);

      const response = await GetAllMenuItems({
        userId: Id,
        itemName: searchQuery,
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
        image: item.imagePath || "",
        status: item.isActive,
        rawdata: item.menuItemRawMaterials || [],
        menuAllocation: item.menuItemAllocationConfigs || [],
        _originalItem: item, // Keep original for updates
      }));

      setTableData(mapped);
      console.log(`✅ Loaded ${items.length} items for page ${page}`);
    } catch (error) {
      console.error("Error loading page:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

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
              // Reload current page after delete
              fetchPage(currentPage);

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

  const handlePagination = (page) => {
    setCurrentPage(page);
    fetchPage(page);
  };

  const handleEdit = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setIsItemModalOpen(true);
  };

  const statusmenuitem = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await updatestatusmneuitem(id, newStatus);

      // Update status in current page data without reloading
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
    fetchPage(currentPage);
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
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

        {/* filters */}
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
                setSelectedMenuItem(null);
                setIsItemModalOpen(true);
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

        {/* Add/Edit modal */}
        {isItemModalOpen && (
          <AddMenuItem
            isModalOpen={isItemModalOpen}
            setIsModalOpen={setIsItemModalOpen}
            refreshData={refreshData}
            selectedMenuItem={selectedMenuItem}
          />
        )}

        {/* Table - Server-side pagination with 50 items per page */}
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
