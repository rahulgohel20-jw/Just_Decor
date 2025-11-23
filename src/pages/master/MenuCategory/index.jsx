import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import AddMenuCategory from "@/partials/modals/add-menu-category/AddMenuCategory";
import Swal from "sweetalert2";
import {
  GetAllCategory,
  DeleteCategoryId,
  UpdateStatus,
} from "@/services/apiServices";
import ViewMenuCategory from "../../../partials/modals/view-menu-category/ViewMenuCategory";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

const MenuCategory = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isViewCategoryModalOpen, setIsViewCategoryModalOpen] = useState(false);
  const [selectedMenuCategory, setSelectedCategory] = useState(null);
  const [tableData, setTableData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [originalData, setOriginalData] = useState([]);

  const intl = useIntl();

  let Id = localStorage.getItem("userId");

  const FetchCategoryData = () => {
    GetAllCategory({ userid: Id, menuCategoryName: searchQuery })
      .then((res) => {
        const list = res.data.data["Menu Category Details"] || [];
        setOriginalData(list);
      })
      .catch((error) => {
        console.error("Error fetching category:", error);
      });
  };

  useEffect(() => {
    const language = localStorage.getItem("lang");

    const languageMap = {
      en: "nameEnglish",
      hi: "nameHindi",
      gu: "nameGujarati",
    };

    const field = languageMap[language] || "nameEnglish";

    const mapped = originalData.map((item, index) => ({
      ...item,
      sr_no: index + 1,
      nameEnglish: item[field] || "-",
      imagePath: item.imagePath || "",
    }));

    setTableData(mapped);
  }, [originalData, localStorage.getItem("lang")]);

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
        DeleteCategoryId(id)
          .then((response) => {
            if (
              response &&
              (response.success || response.data.success === true)
            ) {
              FetchCategoryData();
              Swal.fire({
                title: "Removed!",
                text: "Menu Category has been removed successfully.",
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

  const handleView = (category) => {
    setSelectedCategory(category);
    setIsViewCategoryModalOpen(true);
  };

  useEffect(() => {
    FetchCategoryData();
  }, [searchQuery]);
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
                    id="MENU_CATEGORY.MASTER"
                    defaultMessage="Menu Category Master"
                  />
                ),
              },
            ]}
          />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className={`flex flex-wrap items-center gap-2`}>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={intl.formatMessage({
                  id: "MENU_CATEGORY.SEARCH_PLACEHOLDER",
                  defaultMessage: "Search Category...",
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
              onClick={() => setIsCategoryModalOpen(true)}
              title="Add Category"
            >
              <i className="ki-filled ki-plus"></i>{" "}
              <FormattedMessage
                id="MENU_CATEGORY.ADD_CATEGORY_BUTTON"
                defaultMessage="Add Category"
              />
            </button>
          </div>
        </div>
        <AddMenuCategory
          isModalOpen={isCategoryModalOpen}
          setIsModalOpen={setIsCategoryModalOpen}
          refreshData={FetchCategoryData}
          editData={selectedMenuCategory}
        />
        <ViewMenuCategory
          isModalOpen={isViewCategoryModalOpen}
          setIsModalOpen={setIsViewCategoryModalOpen}
          editData={selectedMenuCategory}
        />
        <TableComponent
          columns={columns(
            handleEdit,
            DeleteCategory,
            statusCategory,
            handleView
          )}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default MenuCategory;
