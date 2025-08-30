import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import AddMenuSubCategory from "@/partials/modals/add-menu-sub-category/AddMenuSubCategory";
import {
  GetAllSubCategory,
 DeleteSubCategoryId,
 UpdateSubStatus
} from "@/services/apiServices";
import { columns } from "./constant";
import { successMsgPopup } from "../../../underConstruction";

const MenuSubCategory = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedMenuCategory, setSelectedCategory] = useState(null);
  const [tableData, setTableData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  
  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;
  const FetchSubCategoryData = () => {
    GetAllSubCategory(Id,true,searchQuery)
          .then((res) => {
            const formatted = res.data.data["Menu Sub Category Details"].map(
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
         DeleteSubCategoryId(id)
           .then((res) => {
            res.data?.msg && successMsgPopup(res.data.msg)
             FetchSubCategoryData();
           })
           .catch((error) => {
             console.error("Error deleting Event type:", error);
           });
     };
  const statusSubCategory = (id, status) => {
         UpdateSubStatus(id, status)
           .then((res) => {
             FetchSubCategoryData();
             res.data?.msg && successMsgPopup(res.data.msg)
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
    FetchSubCategoryData();
  }, [searchQuery]);

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Menu Item Sub Category" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className={`flex flex-wrap items-center gap-2`}>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search Sub Category"
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
              <i className="ki-filled ki-plus"></i> Add Sub Category
            </button>
          </div>
        </div>
        <AddMenuSubCategory
          isModalOpen={isCategoryModalOpen}
          setIsModalOpen={setIsCategoryModalOpen}
          refreshData={FetchSubCategoryData}
          editData={selectedMenuCategory}
        />
        <TableComponent
          columns={columns(handleEdit, DeleteCategory, statusSubCategory)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default MenuSubCategory;
