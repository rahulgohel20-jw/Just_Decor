import { Fragment, useEffect, useState, useMemo } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns } from "./constant";
import {
  GetAllRawMaterial,
  Deleterawmaterial,
  updateRawMaterialStatus,
  GetRawMaterialcategory,
  UpdateSequence,
} from "@/services/apiServices";
import useStyle from "./style";
import AddRawMaterial from "@/partials/modals/add-raw-material/AddRawMaterial";
import Swal from "sweetalert2";
import { FormattedMessage, useIntl } from "react-intl";

const ITEMS_PER_PAGE = 100;

const RawMaterial = () => {
  const classes = useStyle();
  const intl = useIntl();

  const [isRawMaterialModalOpen, setIsRawMaterialModalOpen] = useState(false);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);

  const [rawOriginalData, setRawOriginalData] = useState([]);
  const [allTableData, setAllTableData] = useState([]);
  const [displayData, setDisplayData] = useState([]);

  const [categories, setCategories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [generalFixFilter, setGeneralFixFilter] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const userId = localStorage.getItem("userId");

  /* -------------------- RESET PAGE ON FILTER CHANGE -------------------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, generalFixFilter]);

  /* -------------------- FETCH RAW MATERIALS -------------------- */
  const FetchRawMaterial = (page = currentPage) => {
    setLoading(true);

    GetAllRawMaterial(userId, page, ITEMS_PER_PAGE)
      .then((res) => {
        const data = res?.data?.data || {};
        setRawOriginalData(data["Raw Material Details"] || []);
        setTotalRecords(data.totalItems || 0); // ✅ FIXED
      })
      .catch(() => {
        setRawOriginalData([]);
      })
      .finally(() => setLoading(false));
  };

  /* -------------------- FETCH CATEGORIES -------------------- */
  const FetchCategories = () => {
    GetRawMaterialcategory(userId)
      .then((res) => {
        setCategories(res?.data?.data?.["Raw Material Category Details"] || []);
      })
      .catch(() => setCategories([]));
  };

  useEffect(() => {
    FetchRawMaterial(1);
    FetchCategories();
  }, []);

  useEffect(() => {
    FetchRawMaterial(currentPage);
  }, [currentPage]);

  /* -------------------- MAP RAW DATA -------------------- */
  useEffect(() => {
    const language = localStorage.getItem("lang");
    const languageMap = {
      en: "nameEnglish",
      hi: "nameHindi",
      gu: "nameGujarati",
    };
    const field = languageMap[language] || "nameEnglish";

    const sortedData = [...rawOriginalData].sort(
      (a, b) => (a.sequence || 0) - (b.sequence || 0)
    );

    const mapped = sortedData.map((raw, index) => ({
      sr_no: (currentPage - 1) * ITEMS_PER_PAGE + index + 1, // ✅ FIX
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

  /* -------------------- FILTERING -------------------- */
  const filteredTableData = useMemo(() => {
    let data = allTableData;

    if (categoryFilter) {
      data = data.filter(
        (i) => i.raw_material_cat_id === Number(categoryFilter)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (i) =>
          i.raw_material_name?.toLowerCase().includes(q) ||
          i.raw_material_category?.toLowerCase().includes(q) ||
          i.unit?.toLowerCase().includes(q) ||
          String(i.rate).includes(q)
      );
    }

    if (generalFixFilter) {
      data = data.filter((i) => i.isGeneralFix);
    }

    return data;
  }, [allTableData, searchQuery, categoryFilter, generalFixFilter]);

  useEffect(() => {
    setDisplayData(filteredTableData);
  }, [filteredTableData]);

  /* -------------------- PAGINATION -------------------- */
  console.log("total and items per page", totalRecords, ITEMS_PER_PAGE);

  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  /* -------------------- DRAG & DROP -------------------- */
  const handleDrop = (_, dropIndex) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const reordered = [...displayData];
    const [item] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, item);
    setDisplayData(reordered);

    UpdateSequence(
      reordered.map((i, idx) => ({
        rawMaterialCatId: i.raw_material_cat_id || 0,
        rawMaterialId: i.raw_material_id,
        sequence: idx + 1,
      }))
    ).catch(() => {
      setDisplayData(filteredTableData);
      Swal.fire("Error", "Sequence update failed", "error");
    });
  };

  /* -------------------- ACTIONS -------------------- */
  const DeleteRawMaterial = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        Deleterawmaterial(id).then(FetchRawMaterial);
      }
    });
  };

  const statusRaw = (id, status) =>
    updateRawMaterialStatus(id, status).then(FetchRawMaterial);

  const tableColumns = columns(
    (id) => {
      setSelectedRawMaterial(id);
      setIsRawMaterialModalOpen(true);
    },
    DeleteRawMaterial,
    statusRaw
  );

  /* -------------------- RENDER -------------------- */
  return (
    <Fragment>
      <Container>
        <Breadcrumbs
          items={[
            {
              title: (
                <FormattedMessage
                  id="USER.MASTER.RAW_MATERIAL_MASTER"
                  defaultMessage="Raw Material"
                />
              ),
            },
          ]}
        />

        <AddRawMaterial
          isOpen={isRawMaterialModalOpen}
          onClose={setIsRawMaterialModalOpen}
          refreshData={FetchRawMaterial}
          rawmaterial={selectedRawMaterial}
        />

        <div className="card mt-3">
          {loading ? (
            <div className="py-10 text-center">Loading...</div>
          ) : (
            <>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th />
                    {tableColumns.map((c, i) => (
                      <th key={i}>{c.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((row, i) => (
                    <tr
                      key={row.raw_material_id}
                      draggable
                      onDragStart={() => setDraggedIndex(i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(null, i)}
                      className={`cursor-grab transition-all ${
                        dragOverIndex === i ? "border-t-2 border-primary" : ""
                      }`}
                      style={{
                        backgroundColor:
                          draggedIndex === i ? "#f3f4f6" : "transparent",
                      }}
                    >
                      <td className="text-center cursor-grab active:cursor-grabbing">
                        ⋮⋮
                      </td>
                      {tableColumns.map((c, j) => (
                        <td key={j}>
                          {c.cell
                            ? c.cell({ row: { original: row } })
                            : row[c.accessorKey]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end gap-2 p-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="py-1 px-3 rounded-lg bg-[#005BA8] text-white"
                >
                  Prev
                </button>
                <span className="text-sm flex align-center  items-center">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="py-1 px-3 rounded-lg bg-[#005BA8] text-white"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </Container>
    </Fragment>
  );
};

export default RawMaterial;
