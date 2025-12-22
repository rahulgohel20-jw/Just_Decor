import { Fragment, useEffect, useState, useMemo } from "react";
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
import { Spin } from "antd";

const MenuCategory = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isViewCategoryModalOpen, setIsViewCategoryModalOpen] = useState(false);
  const [selectedMenuCategory, setSelectedCategory] = useState(null);
  const [allTableData, setAllTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);

  const intl = useIntl();

  let Id = localStorage.getItem("userId");

  // Fetch ALL categories
  const FetchCategoryData = async () => {
    setLoading(true);
    try {
      console.log("📥 Fetching all categories...");

      const res = await GetAllCategory({
        userid: Id,
        menuCategoryName: "",
      });

      const list = res.data.data["Menu Category Details"] || [];
      setOriginalData(list);

      console.log(`✅ Loaded ${list.length} categories`, list);
    } catch (error) {
      console.error("Error fetching category:", error);
      setOriginalData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    FetchCategoryData();
  }, []);

  // Map data based on language
  useEffect(() => {
    const language = localStorage.getItem("lang");
    console.log("🌍 Current language:", language);

    const languageMap = {
      en: "nameEnglish",
      hi: "nameHindi",
      gu: "nameGujarati",
    };

    const field = languageMap[language] || "nameEnglish";

    const mapped = originalData.map((item, index) => ({
      ...item,
      sr_no: index + 1,
      // Display name based on current language
      displayName: item[field] || "-",
      // IMPORTANT: Keep all original language fields for search
      nameEnglish: item.nameEnglish || "",
      nameHindi: item.nameHindi || "",
      nameGujarati: item.nameGujarati || "",
      imagePath: item.imagePath || "",
    }));

    console.log("📊 Mapped table data:", mapped);
    setAllTableData(mapped);
  }, [originalData]);

  // Client-side filtering - searches across ALL language fields
  const filteredTableData = useMemo(() => {
    if (!searchQuery.trim()) {
      console.log("🔍 No search query - showing all data");
      return allTableData;
    }

    const query = searchQuery.toLowerCase().trim();
    console.log(`🔍 Filtering with query: "${query}"`);
    console.log("📋 Total data to search:", allTableData.length);

    const filtered = allTableData.filter((item) => {
      // Search across all language fields
      const searchInEnglish = (item.nameEnglish || "")
        .toLowerCase()
        .includes(query);
      const searchInHindi = (item.nameHindi || "")
        .toLowerCase()
        .includes(query);
      const searchInGujarati = (item.nameGujarati || "")
        .toLowerCase()
        .includes(query);

      const matchesSearch =
        searchInEnglish || searchInHindi || searchInGujarati;

      if (matchesSearch) {
        console.log(`✅ Match found:`, {
          english: item.nameEnglish,
          hindi: item.nameHindi,
          gujarati: item.nameGujarati,
        });
      }

      return matchesSearch;
    });

    console.log(
      `✅ Filtered results: ${filtered.length} out of ${allTableData.length}`
    );
    return filtered;
  }, [allTableData, searchQuery]);

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
        if (res.data?.msg) {
          Swal.fire({
            title: "Success!",
            text: res.data.msg,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      })
      .catch((error) => {
        console.error("Error updating status:", error);
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

  const refreshData = () => {
    FetchCategoryData();
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
                    id="MENU_CATEGORY.MASTER"
                    defaultMessage="Menu Category Master"
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
                  id: "MENU_CATEGORY.SEARCH_PLACEHOLDER",
                  defaultMessage: "Search Category...",
                })}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  console.log("⌨️ Search input changed:", value);
                  setSearchQuery(value);
                }}
              />
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-primary">
                <Spin size="small" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
            {!loading && (
              <span className="text-sm text-gray-600">
                Showing {filteredTableData.length} of {allTableData.length}{" "}
                categories
              </span>
            )}
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
              <i className="ki-filled ki-plus"></i>{" "}
              <FormattedMessage
                id="MENU_CATEGORY.ADD_CATEGORY_BUTTON"
                defaultMessage="Create New"
              />
            </button>
          </div>
        </div>

        <AddMenuCategory
          isModalOpen={isCategoryModalOpen}
          setIsModalOpen={setIsCategoryModalOpen}
          refreshData={refreshData}
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
          data={filteredTableData}
          loading={loading}
          pagination={false}
        />
      </Container>
    </Fragment>
  );
};

export default MenuCategory;
