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
import { Form } from "antd";

const MenuItems = () => {
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10000);
  const [totalItems, setTotalItems] = useState(0);

  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const intl = useIntl();

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData?.id;

  useEffect(() => {
    FetchMenuItems();
  }, []); // fetch on mount

  useEffect(() => {
    FetchMenuItems();
  }, [searchQuery]); // fetch when searchQuery changes

  const FetchMenuItems = (page = currentPage) => {
    GetAllMenuItems({
      userId: Id,
      menuItemName: searchQuery,
      page: page,
      size: pageSize,
    })
      .then((res) => {
        console.log("Menu Items API Response:", res);

        if (res?.data?.data?.items && Array.isArray(res.data.data.items)) {
          setTotalItems(res.data.data.totalItems); // save total items for pagination

          const formatted = res.data.data.items.map((item, index) => ({
            sr_no: (page - 1) * pageSize + index + 1, // dynamic serial number
            id: item.id,
            name: item.nameEnglish || "-",
            category: item.menuCategory?.nameEnglish || "-",
            subCategory: item.menuSubCategory?.nameEnglish || "-",
            kitchenArea: item.kitchenArea?.nameEnglish || "-",
            slogan: item.slogan || "-",
            price: item.price || "-",
            priority: item.sequence || "-",
            image: item.imagePath || "",
            status: item.isActive,
            rawdata: item.menuItemRawMaterials || [],
            menuAllocation: item.menuItemAllocationConfigs || [],
          }));

          setTableData(formatted);
        } else {
          setTableData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
      });
  };

  // ✅ delete then refresh table
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
            if (response && (response.success || response.status === 200)) {
              FetchMenuItems();
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

  const handleEdit = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setIsItemModalOpen(true);
  };

  const statusmenuitem = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await updatestatusmneuitem(id, newStatus);

      FetchMenuItems();
    } catch (error) {
      console.error("Error updating status:", error);
    }
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
        {isItemModalOpen &&
          (() => {
            return (
              <AddMenuItem
                isModalOpen={isItemModalOpen}
                setIsModalOpen={setIsItemModalOpen}
                refreshData={FetchMenuItems}
                selectedMenuItem={selectedMenuItem}
              />
            );
          })()}

        {/* Table */}
        <TableComponent
          columns={columns(handleEdit, handleDelete, statusmenuitem)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export default MenuItems;
