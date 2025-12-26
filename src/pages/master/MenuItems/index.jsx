import { Fragment, useEffect, useState, useCallback } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import {
  GetAllMenuItems,
  DeleteMenuItem,
  updatestatusmneuitem,
  uploadFileformenu,
  GetAllSubCategory,
  GetAllCategory,
} from "@/services/apiServices";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";

const ITEMS_PER_PAGE = 100;

const MenuItems = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  let Id = localStorage.getItem("userId");

  const FetchCategoryData = async () => {
    setLoading(true);
    try {
      const res = await GetAllCategory({
        userid: Id,
        menuCategoryName: "",
      });

      const list = res.data.data["Menu Category Details"] || [];
      setCategoryList(list);
    } catch (error) {
      console.error("Error fetching category:", error);
      setCategoryList([]);
    } finally {
      setLoading(false);
    }
  };

  const FetchSubCategoryData = () => {
    setLoading(true);
    GetAllSubCategory({ userid: Id })
      .then((res) => {
        const list = res.data.data["Menu Sub Category Details"] || [];
        setSubCategoryList(list);
      })
      .catch((error) => console.error("Error fetching sub category:", error))
      .finally(() => setLoading(false));
  };

  const fetchPage = useCallback(
    async (
      page,
      search = searchQuery,
      category = categoryFilter,
      subCat = subCategoryFilter
    ) => {
      setLoading(true);

      try {
        const response = await GetAllMenuItems({
          userId: Id,
          itemName: search || "",
          menuCatId: category || "",
          subCategoryId: subCat || "",
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
          _originalItem: item,
        }));

        setTableData(mapped);
      } catch (error) {
        console.error("Error loading page:", error);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    },
    [Id, searchQuery, categoryFilter, subCategoryFilter]
  );

  useEffect(() => {
    fetchPage(1);
    FetchCategoryData();
    FetchSubCategoryData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchPage(1, searchQuery, categoryFilter, subCategoryFilter);
    }, 500);

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

  const uploadImage = async (moduleRecordId, file) => {
    if (!file) return;

    if (!(file instanceof File || file instanceof Blob)) {
      Swal.fire("Error", "File must be binary", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("fileType", "IMAGE");
      formData.append("moduleName", "MENUITEM");
      formData.append("moduleRecordId", moduleRecordId);
      formData.append("userId", Id);

      const response = await uploadFileformenu(formData);

      if (response?.data?.success !== true) {
        throw new Error(response?.data?.msg || "Image upload failed");
      }

      const imagePath = response.data.fullPath;

      setTableData((prev) =>
        prev.map((item) =>
          item.id === moduleRecordId ? { ...item, image: imagePath } : item
        )
      );

      Swal.fire({
        title: "Uploaded!",
        text: response.data.msg,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Upload failed:", error);

      Swal.fire(
        "Error",
        error.response?.data?.msg || error.message || "Image upload failed",
        "error"
      );
    }
  };

  const handlePagination = (page) => {
    setCurrentPage(page);
    fetchPage(page, searchQuery, categoryFilter, subCategoryFilter);
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

  const handleImageUpload = (e, itemId) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(itemId, file);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  return (
    <Fragment>
      <Container>
        <div className="pb-2 mb-3">
          <h1 className="test-xl text-gray-900">
            <FormattedMessage
              id="COMMON.MENU_ITEM_RECIPE_MASTER"
              defaultMessage="Menu Item Recipe Master"
            />
          </h1>
        </div>

        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8 w-[200px]"
                placeholder={intl.formatMessage({
                  id: "MASTER.SEARCH_MENU_ITEMS",
                  defaultMessage: "Search Menu Items",
                })}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              className="min-w-[200px]"
              showSearch
              allowClear
              placeholder="All Categories"
              optionFilterProp="label"
              value={categoryFilter || undefined}
              onChange={(value) => {
                const selected = value || "";
                setCategoryFilter(selected);
                setSubCategoryFilter("");
                setCurrentPage(1);
                fetchPage(1, searchQuery, selected, "");
              }}
              options={[
                { value: "", label: "All Categories" },
                ...categoryList.map((item) => ({
                  value: item.id,
                  label: item.nameEnglish || "-",
                })),
              ]}
            />
            <Select
              className="min-w-[200px]"
              showSearch
              allowClear
              placeholder="All Subcategories"
              optionFilterProp="label"
              value={subCategoryFilter || undefined}
              onChange={(value) => {
                const selected = value || "";
                setSubCategoryFilter(selected);
                setCurrentPage(1);
                fetchPage(1, searchQuery, categoryFilter, selected);
              }}
              options={[
                { value: "", label: "All Subcategories" },
                ...(subCategoryList || []).map((item) => ({
                  value: item.id,
                  label: item.nameEnglish || item.name || "-",
                })),
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate("/master/menu-items");
              }}
              title={intl.formatMessage({
                id: "MASTER.ADD_MENU_ITEM",
                defaultMessage: "Add Item",
              })}
            >
              <i className="ki-filled ki-plus"></i>{" "}
              <FormattedMessage
                id="USER.MASTER.ADD_CONTACT_CATEGORY"
                defaultMessage="Create New"
              />
            </button>
          </div>
        </div>

        {/* Native Table */}
        <div className="card">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Sr. No.
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Image
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Sub Category
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Price (100 Pax)
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8">
                        <Spin size="large" />
                        <p className="mt-2 text-gray-600">Loading...</p>
                      </td>
                    </tr>
                  ) : tableData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-8 text-gray-500"
                      >
                        No menu items found
                      </td>
                    </tr>
                  ) : (
                    tableData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-6 text-gray-800">
                          {item.sr_no}
                        </td>
                        <td className="py-4 px-6">
                          <div className="relative inline-block w-20 h-20 group">
                            <img
                              src={item.image || "/no-image.png"}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md border"
                            />
                            <label className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-primary/90 transition-all">
                              <i className="ki-filled ki-cloud-add text-white text-xs"></i>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, item.id)}
                              />
                            </label>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-800 font-medium">
                          {item.name}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {item.category}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {item.subCategory}
                        </td>
                        <td className="py-4 px-6 text-gray-800">
                          {item.price}
                        </td>
                        <td className="py-4 px-6">
                          <label className="switch switch-sm">
                            <input
                              type="checkbox"
                              checked={item.status}
                              onChange={() =>
                                statusmenuitem(item.id, item.status)
                              }
                            />
                            <span className="slider"></span>
                          </label>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              className="w-9 h-9 flex items-center justify-center rounded hover:bg-blue-50 text-blue-600 transition-colors"
                              onClick={() => handleEdit(item)}
                              title="Edit"
                            >
                              <i className="ki-filled ki-notepad-edit text-lg"></i>
                            </button>
                            <button
                              className="w-9 h-9 flex items-center justify-center rounded hover:bg-red-50 text-red-600 transition-colors"
                              onClick={() => handleDelete(item.id)}
                              title="Delete"
                            >
                              <i className="ki-filled ki-trash text-lg"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {!loading && tableData.length > 0 && (
            <div className="card-footer justify-between">
              <div className="text-sm text-gray-600">
                Showing {startItem} to {endItem} of {totalItems} items
              </div>
              <div className="flex gap-2 items-center">
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => handlePagination(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="ki-filled ki-left"></i>
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`btn btn-sm ${
                          currentPage === pageNum ? "btn-primary" : "btn-light"
                        }`}
                        onClick={() => handlePagination(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="btn btn-sm btn-light"
                  onClick={() => handlePagination(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <i className="ki-filled ki-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </Fragment>
  );
};

export default MenuItems;
