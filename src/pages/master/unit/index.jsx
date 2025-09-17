import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import AddUnit from "@/partials/modals/add-unit/AddUnit";
import {
  Getunit,
  DeleteUnit,
  SearchUnit,
  updateunit,
} from "@/services/apiServices";
import Swal from "sweetalert2";
const UnitMaster = () => {
  const [isEventTypeModalOpen, setIsEventTypeModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [tableData, setTableData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    Fetchunit();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        Fetchunit();
        return;
      }

      SearchUnit(searchQuery, Id)
        .then(({ data: { data } }) => {
          if (data && data["Unit Details"]) {
            const formatted = data["Unit Details"].map((cust, index) => ({
              sr_no: index + 1,
              unit: cust.nameEnglish || "-",
              symbol: cust.symbolEnglish || "-",
              unitId: cust.id,
            }));
            setTableData(formatted);
          } else {
            setTableData([]);
          }
        })
        .catch((error) => {
          console.error("Error searching customer:", error);
        });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;
  const Fetchunit = () => {
    Getunit(Id)
      .then((res) => {
        console.log(res);

        const formatted = res.data.data["Unit Details"].map((cust, index) => ({
          sr_no: index + 1,
          unit: cust.nameEnglish || "-",
          symbol: cust.symbolEnglish || "-",
          unitId: cust.id,
          isActive: cust.isActive,
        }));

        setTableData(formatted);
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };

  const DeleteUnitrow = (unitId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this unit?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await DeleteUnit(unitId);

          if (response && (response.success || response.status === 200)) {
            Fetchunit();
            Swal.fire({
              title: "Removed!",
              text: "Unit has been removed successfully.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          } else {
            throw new Error(response?.message || "API call failed");
          }
        } catch (error) {
          console.error("Delete Unit API Error:", error);
          Swal.fire({
            title: "Error!",
            text: error.message || "Failed to delete unit.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };
  const handleEdit = (event) => {
    setSelectedUnit(event);
    setIsEventTypeModalOpen(true);
  };
  const statusUnit = (unitId, status) => {
    updateunit(unitId, status)
      .then((res) => {
        if (res.data?.msg || res.status === 200) {
          Swal.fire({
            title: "Success!",
            text: res.data?.msg || "Status updated successfully",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          Fetchunit();
        }
      })
      .catch((error) => {
        console.error("Error updating unit status:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update unit status",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Unit Master" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className={`flex flex-wrap items-center gap-2`}>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search Event"
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
                setIsEventTypeModalOpen(true);
                setSelectedUnit(null);
              }}
              title="Add Contact Category"
            >
              <i className="ki-filled ki-plus"></i> Add Unit
            </button>
          </div>
        </div>
        <AddUnit
          isModalOpen={isEventTypeModalOpen}
          setIsModalOpen={setIsEventTypeModalOpen}
          refreshData={Fetchunit}
          selectedUnit={selectedUnit}
        />
        <TableComponent
          columns={columns(handleEdit, DeleteUnitrow, statusUnit)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default UnitMaster;
