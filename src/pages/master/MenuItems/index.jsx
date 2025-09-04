import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, categoryData } from "./constant";
import AddMenuItem from "@/partials/modals/add-menu-item/AddMenuItem";
import { GetAllMenuItems , DeleteMenuItem } from "@/services/apiServices";

const MenuItems = () => {
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData?.id;

  useEffect(() => {
    FetchMenuItems();
  }, [searchQuery]);

  // ✅ Fetch menu items
 const FetchMenuItems = () => {
  GetAllMenuItems({ userId: Id, menuItemName: searchQuery }) // <-- fixed key
    .then((res) => {
      if (
        res?.data?.data &&
        Array.isArray(res.data.data["Menu Item Details"])
      ) {
        const formatted = res.data.data["Menu Item Details"].map(
          (item, index) => ({
            sr_no: index + 1,
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
          })
        );
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

  console.log("✅ Deleting item with ID:", id);

  DeleteMenuItem(id)
    .then(() => {
      FetchMenuItems();
    })
    .catch((err) => {
      console.error("Delete error:", err);
    });
};


  const handleEdit = (menuItem) => {
console.log("✏️ Edit clicked:", menuItem);
    setSelectedMenuItem(menuItem);
    setIsItemModalOpen(true);
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Menu Items Master" }]} />
        </div>

        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search item"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => setIsItemModalOpen(true)}
              title="Add Item"
            >
              <i className="ki-filled ki-plus"></i> Add Item
            </button>
          </div>
        </div>

        {/* Add/Edit modal */}
        <AddMenuItem
          isModalOpen={isItemModalOpen}
          setIsModalOpen={(val) => {
            setIsItemModalOpen(val);
            if (!val) {
              setSelectedMenuItem(null); // clear selection when closing
              FetchMenuItems(); // refresh table when modal closes
            }
          }}
          refreshData={FetchMenuItems}
          selectedMenuItem={selectedMenuItem}
          categoryData={categoryData}
        />

        {/* Table */}
        <TableComponent
          columns={columns(handleEdit, handleDelete)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export default MenuItems;
