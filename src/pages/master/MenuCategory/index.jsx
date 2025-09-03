import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import AddMenuCategory from "@/partials/modals/add-menu-category/AddMenuCategory";

import {
  GetAllCategory,
  DeleteCategoryId,
  UpdateStatus,
} from "@/services/apiServices";
const MenuCategory = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedMenuCategory, setSelectedCategory] = useState(null);
  const [tableData, setTableData] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;

  const FetchCategoryData = () => {
    GetAllCategory({ userid: Id, menuCategoryName: searchQuery })
      .then((res) => {
        const formatted = res.data.data["Menu Category Details"].map(
          (item, index) => ({
            ...item,
            sr_no: index + 1,
          })
        );

        setTableData(formatted);
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };

  const DeleteCategory = (id) => {
    DeleteCategoryId(id)
      .then((res) => {
        FetchCategoryData();
        res.data?.msg && successMsgPopup(res.data.msg);
      })
      .catch((error) => {
        console.error("Error deleting Event type:", error);
      });
  };

  const statusCategory = (id, status) => {
    UpdateStatus(id, status)
      .then((res) => {
        FetchCategoryData();
        res.data?.msg && successMsgPopup(res.data.msg);
      })
      .catch((error) => {
        console.error("Error deleting Event type:", error);
      });
  };
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  useEffect(() => {
    FetchCategoryData();
  }, [searchQuery]);
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Menu Category Master" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className={`flex flex-wrap items-center gap-2`}>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search Category"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => setIsCategoryModalOpen(true)}
              title="Add Category"
            >
              <i className="ki-filled ki-plus"></i> Add Category
            </button>
          </div>
        </div>
        <AddMenuCategory
          isModalOpen={isCategoryModalOpen}
          setIsModalOpen={setIsCategoryModalOpen}
          refreshData={FetchCategoryData}
          editData={selectedMenuCategory}
        />
        <TableComponent
          columns={columns(handleEdit, DeleteCategory, statusCategory)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default MenuCategory;
