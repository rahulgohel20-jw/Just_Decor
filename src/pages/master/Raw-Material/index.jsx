import { Fragment, useEffect, useState } from "react";
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
  const [tableData, setTableData] = useState(defaultData);
  const [searchQuery, setSearchQuery] = useState("");
  const intl = useIntl();
  const [rawOriginalData, setRawOriginalData] = useState([]);

  useEffect(() => {
    FetchRawMaterial();
  }, []);

  let Id = localStorage.getItem("userId");

  const FetchRawMaterial = () => {
    GetAllRawMaterial(Id)
      .then((res) => {
        const list = res.data.data["Raw Material Details"] || [];
        setRawOriginalData(list);
      })
      .catch((error) => {
        console.error("Error fetching raw materials:", error);
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

    setTableData(mapped);
  }, [rawOriginalData, searchQuery, localStorage.getItem("lang")]);

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
            console.error("Error deleting Event type:", error);
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
        res.data?.msg && successMsgPopup(res.data.msg);
      })
      .catch((error) => {
        console.error("Error deleting Event type:", error);
      });
  };

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
                    id="USER.MASTER.RAW_MATERIAL_MASTER"
                    defaultMessage="Raw Material "
                  />
                ),
              },
            ]}
          />
        </div>
        {/* filters */}
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
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedRawMaterial(null);
                setIsRawMaterialModalOpen(true);
              }}
              title="Add Contact Category"
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
        {/* Supplier Modal */}

        <TableComponent
          columns={columns(handleEdit, DeleteRawMaterial, statusRaw)}
          data={tableData && tableData.length ? tableData : defaultData}
          paginationSize={100}
        />
      </Container>
    </Fragment>
  );
};
export default RawMaterial;
