import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData,categoryData } from "./constant";
import AddMenuItem from "@/partials/modals/add-menu-item/AddMenuItem";

const MenuItems = () => {
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [tableData, setTableData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    FetchCategoryData();
  }, [searchQuery]);

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;
  const FetchCategoryData = () => {
    const formatted = defaultData.map(
          (item, index) => ({
            sr_no: index + 1,
            category: item.category || "-",
            item: item.item
          })
        );

        setTableData(formatted);
  };

  const DeleteCategory = () => {
      FetchCategoryData();
  };
  const handleEdit = (category) => {
    setSelectedMenuItem(category);
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
          <div className={`flex flex-wrap items-center gap-2`}>
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
        <AddMenuItem
          isModalOpen={isItemModalOpen}
          setIsModalOpen={setIsItemModalOpen}
          refreshData={FetchCategoryData}
          selectedMenuItem={selectedMenuItem}
          categoryData={categoryData}
        />
        <TableComponent
          columns={columns(handleEdit, DeleteCategory)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default MenuItems;
