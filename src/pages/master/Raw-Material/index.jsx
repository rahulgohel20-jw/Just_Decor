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


  useEffect(() => {
    FetchRawMaterial();
  }, []);

  let userData = JSON.parse(localStorage.getItem("userData"));

  let Id = userData.id;
  const FetchRawMaterial = () => {
    GetAllRawMaterial(Id)
      .then((res) => {
        console.log("Raw Material Data:", res.data);

        const formatted = res.data.data["Raw Material Details"].map(
          (raw, index) => ({
            sr_no: index + 1,
            raw_material_id: raw.id,
            raw_material_cat_id: raw.rawMaterialCat.id,
            raw_material_name: raw.nameEnglish || "-",
            raw_material_category: raw.rawMaterialCat.nameEnglish,
            isActive: raw.isActive,
            unit: raw.unit.nameEnglish,
            unitId: raw.unit.id,
            priority: raw.sequence,
            rate: raw.supplierRate,
            suppliers: raw.rawMaterialSuppliers,
            weightPer100Pax: raw.weightPer100Pax,
            isGeneralFix: raw.isGeneralFix,
          })
        );

        setTableData(formatted);
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
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
            if (response && (response.success || response.status === 200)) {
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
          <Breadcrumbs items={[{ title: <FormattedMessage id="COMMON.RAW_MATERIAL_MASTER" defaultMessage="Raw Material Master" /> }]} />
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
                placeholder={intl.formatMessage({ id: "COMMON.RAW_MATERIAL_SEARCH", defaultMessage: "Raw Material Search..." })}
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
              <i className="ki-filled ki-plus"></i><FormattedMessage id="COMMON.ADD_RAW_MATERIAL" defaultMessage="Add Raw Material" />
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
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default RawMaterial;
