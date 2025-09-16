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
const RawMaterial = () => {
  const classes = useStyle();
  const [isRawMaterialModalOpen, setIsRawMaterialModalOpen] = useState(false);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);
  const [tableData, setTableData] = useState(defaultData);
  const [searchQuery, setSearchQuery] = useState("");
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
    if (window.confirm("Are you sure you want to delete this raw material?")) {
      Deleterawmaterial(raw_material_id)
        .then((res) => {
          if (res.data?.msg) {
            Swal.fire({
              title: `${res.data?.msg}`,
              text: "",
              icon: "success",
              background: "#f5faff",
              color: "#003f73",
              confirmButtonText: "Okay",
              confirmButtonColor: "#005BA8",
              showClass: {
                popup: `
                animate__animated
                animate__fadeInDown
                animate__faster
              `,
              },
            });
          }
          FetchRawMaterial();
        })
        .catch((error) => {
          console.error("Error deleting Event type:", error);
        });
    }
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
          <Breadcrumbs items={[{ title: "Raw Material Master" }]} />
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
                placeholder="Search Raw Material"
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
              <i className="ki-filled ki-plus"></i> Add Raw Material
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
