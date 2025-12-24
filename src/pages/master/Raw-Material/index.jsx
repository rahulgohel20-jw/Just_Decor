import { Fragment, useEffect, useState, useMemo } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns, defaultData } from "./constant";
import {
  GetAllRawMaterial,
  Deleterawmaterial,
  updateRawMaterialStatus,
  GetRawMaterialcategory,
  UpdateSequence,
  GetRawMaterialByCategoryWithPagination,
  SearchRawMaterial, // ✅ Added import
} from "@/services/apiServices";
import useStyle from "./style";
import AddRawMaterial from "@/partials/modals/add-raw-material/AddRawMaterial";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

const ITEMS_PER_PAGE = 100;

const RawMaterial = () => {
  const classes = useStyle();
  const [isRawMaterialModalOpen, setIsRawMaterialModalOpen] = useState(false);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);
  const [allTableData, setAllTableData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const [rawOriginalData, setRawOriginalData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [generalFixFilter, setGeneralFixFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  let Id = localStorage.getItem("userId");

  // ✅ NEW: Search Raw Material function
  const FetchSearchRawMaterial = (searchTerm, page = currentPage) => {
    if (!searchTerm.trim()) {
      // If search is cleared, fetch all
      FetchRawMaterial(page);
      return;
    }

    setLoading(true);
    // ✅ FIX: Backend expects 1-based pagination (page starts from 1, not 0)
    SearchRawMaterial(Id, page, ITEMS_PER_PAGE, searchTerm)
      .then((res) => {
        const data = res?.data?.data || {};
        const rawMaterials = data["Raw Material Details"] || [];

        setRawOriginalData(rawMaterials);
        setTotalRecords(data.totalItems || 0);
      })
      .catch((error) => {
        console.error("Error searching raw materials:", error);
        setRawOriginalData([]);
        setTotalRecords(0);
      })
      .finally(() => setLoading(false));
  };

  const FetchRawMaterialByCategory = (categoryId, page = currentPage) => {
    if (!categoryId) {
      FetchRawMaterial(page);
      return;
    }

    setLoading(true);
    const catIdArray = [Number(categoryId)];
    const backendPage = page - 1;

    GetRawMaterialByCategoryWithPagination(
      catIdArray,
      Id,
      backendPage,
      ITEMS_PER_PAGE
    )
      .then((res) => {
        const responseData = res?.data || {};
        const data = responseData.data || [];

        const transformedData = data.map((item) => ({
          id: item.id,
          nameEnglish: item.nameEnglish,
          nameHindi: item.nameHindi,
          nameGujarati: item.nameGujarati,
          unit: {
            id: item.unit,
            nameEnglish: item.unitNameEnglish || "",
            nameHindi: item.unitNameHindi || "",
            nameGujarati: item.unitNameGujarati || "",
          },
          rawMaterialCat: {
            id: item.rawMaterialCatId,
            nameEnglish: item.rawMaterialCatNameEnglish,
            nameHindi: item.rawMaterialCatNameHindi,
            nameGujarati: item.rawMaterialCatNameGujarati,
          },
          isActive: item.isActive ?? true,
          sequence: item.sequence || 0,
          supplierRate: item.rate || 0,
          weightPer100Pax: item.weightPer100Pax || 0,
          isGeneralFix: item.isGeneralFix || false,
          rawMaterialSuppliers: item.partyId
            ? [
                {
                  id: item.partyId,
                  nameEnglish: item.partyNameEnglish,
                  nameHindi: item.partyNameHindi,
                  nameGujarati: item.partyNameGujarati,
                },
              ]
            : [],
        }));

        setRawOriginalData(transformedData);
        setTotalRecords(responseData.totalRawMaterialItems || 0);
      })
      .catch(() => {
        setRawOriginalData([]);
        setTotalRecords(0);
      })
      .finally(() => setLoading(false));
  };

  const FetchRawMaterial = (page = currentPage) => {
    setLoading(true);

    // ✅ Note: Check if this API also expects 1-based pagination
    GetAllRawMaterial(Id, page, ITEMS_PER_PAGE)
      .then((res) => {
        const data = res?.data?.data || {};
        setRawOriginalData(data["Raw Material Details"] || []);
        setTotalRecords(data.totalItems || 0);
      })
      .catch(() => {
        setRawOriginalData([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter]);

  // ✅ REMOVED: searchQuery from this useEffect (now handled by debounced search)
  useEffect(() => {
    setCurrentPage(1);
  }, [generalFixFilter]);

  const FetchCategories = () => {
    GetRawMaterialcategory(Id)
      .then((res) => {
        const list = res.data.data["Raw Material Category Details"] || [];
        setCategories(list);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  };

  useEffect(() => {
    FetchRawMaterial(1);
    FetchCategories();
  }, []);

  // ✅ UPDATED: Handle page changes and search
  useEffect(() => {
    if (searchQuery.trim()) {
      // If there's a search query, use search API
      FetchSearchRawMaterial(searchQuery, currentPage);
    } else if (categoryFilter) {
      // If category filter is active
      FetchRawMaterialByCategory(categoryFilter, currentPage);
    } else {
      // Default: fetch all
      FetchRawMaterial(currentPage);
    }
  }, [currentPage, categoryFilter, searchQuery]);

  // ✅ UPDATED: Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setCurrentPage(1); // Reset to page 1 when searching
        FetchSearchRawMaterial(searchQuery, 1);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const language = localStorage.getItem("lang");
    const languageMap = {
      en: "nameEnglish",
      hi: "nameHindi",
      gu: "nameGujarati",
    };
    const field = languageMap[language] || "nameEnglish";

    const sortedData = [...rawOriginalData].sort((a, b) => {
      return (a.sequence || 0) - (b.sequence || 0);
    });

    const mapped = sortedData.map((raw, index) => ({
      sr_no: (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
      raw_material_id: raw.id,
      raw_material_cat_id: raw.rawMaterialCat?.id,
      raw_material_name: raw[field] || "-",
      raw_material_category: raw.rawMaterialCat?.[field] || "-",
      isActive: raw.isActive,
      unit: raw.unit?.[field] || "-",
      unitId: raw.unit?.id,
      priority: raw.sequence,
      rate: raw.supplierRate,
      suppliers: raw.rawMaterialSuppliers,
      weightPer100Pax: raw.weightPer100Pax,
      isGeneralFix: raw.isGeneralFix,
    }));

    setAllTableData(mapped);
  }, [rawOriginalData, currentPage]);

  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  // ✅ UPDATED: Only apply generalFixFilter client-side (search is now server-side)
  const filteredTableData = useMemo(() => {
    let filtered = allTableData;

    if (generalFixFilter) {
      filtered = filtered.filter((item) => item.isGeneralFix === true);
    }

    return filtered;
  }, [allTableData, generalFixFilter]);

  useEffect(() => {
    setDisplayData(filteredTableData);
  }, [filteredTableData]);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    const reorderedData = [...displayData];
    const [draggedItem] = reorderedData.splice(draggedIndex, 1);
    reorderedData.splice(dropIndex, 0, draggedItem);

    setDisplayData(reorderedData);

    const updatePayload = reorderedData.map((item, index) => ({
      rawMaterialCatId: item.raw_material_cat_id || 0,
      rawMaterialId: item.raw_material_id,
      sequence: index + 1,
    }));

    UpdateSequence(updatePayload)
      .then((res) => {
        if (searchQuery.trim()) {
          FetchSearchRawMaterial(searchQuery, currentPage);
        } else if (categoryFilter) {
          FetchRawMaterialByCategory(categoryFilter, currentPage);
        } else {
          FetchRawMaterial(currentPage);
        }
      })
      .catch((error) => {
        console.error("❌ Error updating sequence:", error);
        setDisplayData(filteredTableData);
        Swal.fire({
          title: "Error!",
          text: "Failed to update sequence.",
          icon: "error",
        });
      });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const DeleteRawMaterial = (raw_material_id) => {
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
        Deleterawmaterial(raw_material_id)
          .then((response) => {
            if (
              response &&
              (response.success || response.data.success === true)
            ) {
              if (searchQuery.trim()) {
                FetchSearchRawMaterial(searchQuery, currentPage);
              } else if (categoryFilter) {
                FetchRawMaterialByCategory(categoryFilter, currentPage);
              } else {
                FetchRawMaterial(currentPage);
              }
              Swal.fire({
                title: "Removed!",
                text: "Raw material has been removed successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              throw new Error(response?.message || "API call failed");
            }
          })
          .catch((error) => {
            console.error("Error deleting raw material:", error);
          });
      }
    });
  };

  const handleEdit = (raw_material_id) => {
    setSelectedRawMaterial(raw_material_id);
    setIsRawMaterialModalOpen(true);
  };

  const statusRaw = (raw_material_id, status) => {
    updateRawMaterialStatus(raw_material_id, status)
      .then((res) => {
        if (searchQuery.trim()) {
          FetchSearchRawMaterial(searchQuery, currentPage);
        } else if (categoryFilter) {
          FetchRawMaterialByCategory(categoryFilter, currentPage);
        } else {
          FetchRawMaterial(currentPage);
        }
      })
      .catch((error) => {
        console.error("Error status update:", error);
      });
  };

  const handleRefreshData = () => {
    if (searchQuery.trim()) {
      FetchSearchRawMaterial(searchQuery, currentPage);
    } else if (categoryFilter) {
      FetchRawMaterialByCategory(categoryFilter, currentPage);
    } else {
      FetchRawMaterial(currentPage);
    }
  };

  const tableColumns = columns(handleEdit, DeleteRawMaterial, statusRaw);

  return (
    <Fragment>
      <Container>
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="USER.MASTER.RAW_MATERIAL_MASTER"
                    defaultMessage="Raw Material Item Master"
                  />
                ),
              },
            ]}
          />
        </div>

        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div
            className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}
          >
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={intl.formatMessage({
                  id: "COMMON.RAW_MATERIAL_SEARCH",
                  defaultMessage: "Raw Material Search...",
                })}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filItems">
              <select
                className="select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">
                  {intl.formatMessage({
                    id: "COMMON.ALL_CATEGORIES",
                    defaultMessage: "All Categories",
                  })}
                </option>
                {categories.map((cat) => {
                  const language = localStorage.getItem("lang");
                  const languageMap = {
                    en: "nameEnglish",
                    hi: "nameHindi",
                    gu: "nameGujarati",
                  };
                  const field = languageMap[language] || "nameEnglish";

                  return (
                    <option key={cat.id} value={cat.id}>
                      {cat[field]}
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              className={`btn ${generalFixFilter ? "btn-primary" : "btn-secondary"}`}
              onClick={() => {
                setGeneralFixFilter(!generalFixFilter);
              }}
            >
              {generalFixFilter ? "Show All" : "General Fix"}
            </button>

            {/* ✅ UPDATED: Show count when filtering */}
            {(searchQuery || generalFixFilter) && (
              <span className="text-sm text-gray-600">
                {displayData.length} of {totalRecords} items
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedRawMaterial(null);
                setIsRawMaterialModalOpen(true);
              }}
            >
              <i className="ki-filled ki-plus"></i>
              <FormattedMessage
                id="COMMON.ADD_RAW_MATERIAL"
                defaultMessage="Create New"
              />
            </button>
          </div>
        </div>

        <AddRawMaterial
          isOpen={isRawMaterialModalOpen}
          onClose={setIsRawMaterialModalOpen}
          refreshData={handleRefreshData}
          rawmaterial={selectedRawMaterial}
        />

        <div className="card">
          <div className="">
            <div className="table-responsive">
              <div className="relative">
                {loading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                      <div className="w-16 h-16 border-4 border-[#005BA8] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                  </div>
                )}
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th className="w-10">
                        <i className="ki-filled ki-sort-vertical text-gray-500"></i>
                      </th>
                      {tableColumns.map((col, index) => (
                        <th key={index}>{col.header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={tableColumns.length + 1}
                          className="text-center py-10 text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    ) : (
                      displayData.map((row, rowIndex) => (
                        <tr
                          key={row.raw_material_id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, rowIndex)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, rowIndex)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, rowIndex)}
                          className={`cursor-grab transition-all ${
                            dragOverIndex === rowIndex
                              ? "border-t-2 border-primary"
                              : ""
                          }`}
                          style={{
                            backgroundColor:
                              draggedIndex === rowIndex
                                ? "#f3f4f6"
                                : "transparent",
                          }}
                        >
                          <td className="text-center cursor-grab active:cursor-grabbing">
                            ⋮⋮
                          </td>
                          {tableColumns.map((col, colIndex) => (
                            <td key={colIndex}>
                              {col.cell
                                ? col.cell({ row: { original: row } })
                                : row[col.accessorKey]}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="flex justify-end gap-2 p-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="py-1 px-3 rounded-lg bg-[#005BA8] text-white disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span className="text-sm flex items-center">
                    Page {currentPage} of {totalPages || 1}
                  </span>

                  <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="py-1 px-3 rounded-lg bg-[#005BA8] text-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default RawMaterial;
