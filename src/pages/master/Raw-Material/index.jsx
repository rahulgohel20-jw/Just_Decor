import { Fragment, useEffect, useState, useMemo } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import {
  GetAllRawMaterial,
  Deleterawmaterial,
  updateRawMaterialStatus,
} from "@/services/apiServices";
import useStyle from "./style";
import AddRawMaterial from "@/partials/modals/add-raw-material/AddRawMaterial";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

const RawMaterial = () => {
  const classes = useStyle();
  const [isRawMaterialModalOpen, setIsRawMaterialModalOpen] = useState(false);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);
  const [allTableData, setAllTableData] = useState([]); // All data (unfiltered)
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const [rawOriginalData, setRawOriginalData] = useState([]);

  let Id = localStorage.getItem("userId");

  // Fetch All Raw Materials (No Pagination)
  const FetchRawMaterial = () => {
    setLoading(true);
    GetAllRawMaterial(Id, 1, 10000) // PAGE 1, LIMIT 10000
      .then((res) => {
        const list = res.data.data["Raw Material Details"] || [];
        setRawOriginalData(list);
        console.log(`✅ Loaded ${list.length} raw materials`);
      })
      .catch((error) => {
        console.error("Error fetching raw materials:", error);
        setRawOriginalData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    FetchRawMaterial();
  }, []);

  // Map raw data to table format whenever language or data changes
  useEffect(() => {
    const language = localStorage.getItem("lang");

    const languageMap = {
      en: "nameEnglish",
      hi: "nameHindi",
      gu: "nameGujarati",
    };

    const field = languageMap[language] || "nameEnglish";

    let mapped = rawOriginalData.map((raw, index) => ({
      sr_no: index + 1,
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

    // 🔍 Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      mapped = mapped.filter(
        (item) =>
          item.raw_material_name?.toLowerCase().includes(q) ||
          item.raw_material_category?.toLowerCase().includes(q) ||
          item.unit?.toLowerCase().includes(q) ||
          String(item.rate)?.toLowerCase().includes(q)
      );
    }

    setAllTableData(mapped);
  }, [rawOriginalData]);

  // 🔍 Client-side filtering with useMemo for performance
  const filteredTableData = useMemo(() => {
    if (!searchQuery.trim()) {
      return allTableData;
    }

    const query = searchQuery.toLowerCase().trim();
    console.log(`🔍 Filtering with query: "${query}"`);

    const filtered = allTableData.filter((item) => {
      return (
        item.raw_material_name?.toLowerCase().includes(query) ||
        item.raw_material_category?.toLowerCase().includes(query) ||
        item.unit?.toLowerCase().includes(query)
      );
    });

    console.log(
      `✅ Found ${filtered.length} matches out of ${allTableData.length}`
    );
    return filtered;
  }, [allTableData, searchQuery]);

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
              FetchRawMaterial();
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
        FetchRawMaterial();
      })
      .catch((error) => {
        console.error("Error status update:", error);
      });
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
                    id="USER.MASTER.RAW_MATERIAL_MASTER"
                    defaultMessage="Raw Material "
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
            {searchQuery && (
              <span className="text-sm text-gray-600">
                {filteredTableData.length} of {allTableData.length} items
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
                defaultMessage="Add Raw Material"
              />
            </button>
          </div>
        </div>

        <AddRawMaterial
          isOpen={isRawMaterialModalOpen}
          onClose={setIsRawMaterialModalOpen}
          refreshData={FetchRawMaterial}
          rawmaterial={selectedRawMaterial}
        />

        <TableComponent
          columns={columns(handleEdit, DeleteRawMaterial, statusRaw)}
          data={filteredTableData} // 🔍 Use filtered data instead of all data
          loading={loading}
          pagination={false} // Show all filtered items without pagination
        />
      </Container>
    </Fragment>
  );
};

export default RawMaterial;
