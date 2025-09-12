import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import {
  GetAllRawMaterial, DeleteContactTypeMaster,updateContactTypeStatus
  
} from "@/services/apiServices";
import useStyle from "./style";
import AddRawMaterial from "@/partials/modals/add-raw-material/AddRawMaterial";




const RawMaterial = () => {
  const classes = useStyle();
  const [isRawMaterialModalOpen, setIsRawMaterialModalOpen] = useState(false);
  const [selectedcontactType, setSelectedcontactType] = useState(null);
  const [tableData, setTableData] = useState(defaultData);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    FetchRawMaterial();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        FetchRawMaterial();
        return;
      }

      SearchRawMaterial(searchQuery, Id)
        .then(({ data: { data } }) => {
          if (data && data["Raw Material Details"]) {
            const formatted = data["Raw Material Details"].map(
              (raw, index) => ({
                sr_no: index + 1,
                raw_material_name: raw.nameEnglish || "-",
            raw_material_category: raw.id,
            isActive: raw.isActive,

            unit:raw.unit,
            priority:raw.sequence,
              })
            );
            setTableData(formatted);
          } else {
            setTableData([]);
          }
        })
        .catch((error) => {
          console.error("Error searching customer:", error);
           setTableData(defaultData); // fallback
        });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  let userData = JSON.parse(localStorage.getItem("userData"));
  console.log("userData",userData);
  let Id = userData.id;
  const FetchRawMaterial = () => {
    GetAllRawMaterial(Id)
      .then((res) => {
        console.log("raw Material",res);
        const formatted = res.data.data["Raw Material Details"].map(
          (raw, index) => ({
            sr_no: index + 1,
            raw_material_name: raw.nameEnglish || "-",
            raw_material_category: raw.categoryName ,
            isActive: raw.isActive,
            unit:raw.unit,
            priority:raw.sequence,
            rate:raw.supplierRate
           
          })
        );

        setTableData(formatted);
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };

  const DeleteContactType = (id) => {
    console.log("contactis",id);

    if (window.confirm("Are you sure you want to delete this Contact type?")) {
      DeleteContactTypeMaster(id)
        .then(() => {
          FetchContactType();
        })
        .catch((error) => {
          console.error("Error deleting Event type:", error);
        });
    }
  };

  const handleEdit = (event) => {
    console.log("Editing contact type:", event);
    setSelectedcontactType(event);
    setIsRawMaterialModalOpen(true);
    
  };

  const statusCategory = (id, status) => {
    updateContactTypeStatus(id, status)
      .then((res) => {
        FetchContactType();
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
              onClick={() => setIsRawMaterialModalOpen(true)
                                
              }
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
  contactType={selectedcontactType}
/>
{/* Supplier Modal */}
      

        <TableComponent
          columns={columns(handleEdit, DeleteContactType,statusCategory)}
          data={tableData && tableData.length ? tableData : defaultData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default RawMaterial;
