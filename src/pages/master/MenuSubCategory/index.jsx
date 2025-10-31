import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import AddMenuSubCategory from "@/partials/modals/add-menu-sub-category/AddMenuSubCategory";
import {
  GetAllSubCategory,
  DeleteSubCategoryId,
  UpdateSubStatus,
} from "@/services/apiServices";
import { columns } from "./constant";
import { successMsgPopup } from "../../../underConstruction";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";


const MenuSubCategory = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedMenuCategory, setSelectedCategory] = useState(null);
  const [tableData, setTableData] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const intl = useIntl();

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;
  const FetchSubCategoryData = () => {
    GetAllSubCategory({ userid: Id, menuSubCategoryName: searchQuery })
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
        DeleteSubCategoryId(id)
          .then((response) => {
            if (response && (response.success || response.status === 200)) {
              FetchSubCategoryData();
              Swal.fire({
                title: "Removed!",
                text: "Menu Item Sub has been removed successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              throw new Error(response?.message || "API call failed");
            }
          })
          .catch((error) => {
            console.error("Error deleting Event type:", error);
          });
      }
    });
  };
  const statusSubCategory = (id, status) => {
    UpdateSubStatus(id, status)
      .then((res) => {
        FetchSubCategoryData();
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
    FetchSubCategoryData();
  }, [searchQuery]);

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: <FormattedMessage id="MENU_ITEM_SUB_CATEGORY" defaultMessage="Menu Item Sub Category" /> }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className={`flex flex-wrap items-center gap-2`}>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={intl.formatMessage({ id: "SEARCH_SUB_CATEGORY", defaultMessage: "Search Sub Category" })}
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
                setSelectedCategory(null);
                setIsCategoryModalOpen(true);
              }}
              title="Add Category"
            >
              <i className="ki-filled ki-plus"></i> <FormattedMessage id="ADD_SUB_CATEGORY" defaultMessage="Add Sub Category" />
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
