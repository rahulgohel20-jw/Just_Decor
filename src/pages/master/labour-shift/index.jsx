import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import {
  GetAllLabourShift,
  deleteLabourShiftById,
  
} from "@/services/apiServices";
import useStyle from "./style";
import AddLabourshift from "@/partials/modals/add-labour-shift/AddLabourshift";
import Swal from "sweetalert2";

const Labourshiftmaster = () => {
  const classes = useStyle();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedcontactType, setSelectedcontactType] = useState(null);
  const [tableData, setTableData] = useState([]); // filtered data
  const [originalData, setOriginalData] = useState([]); // unfiltered API data
  const [searchQuery, setSearchQuery] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData"));
  const Id = userData?.id;

  // Fetch labour shifts from API
  const FetchLabourShift = () => {
    if (!Id) return; // No user logged in

    GetAllLabourShift(Id)
      .then((res) => {
       const shifts = res?.data?.data?.["Function Details"]?.map((shift, index) => ({
  sr_no: index + 1,
  shift_name: shift.nameEnglish || "-",
  shift_time: shift.shiftTime || "-",
  isActive: shift.isActive !== undefined ? shift.isActive : true,
  id: shift.id,
  nameHindi: shift.nameHindi || "",
  nameGujarati: shift.nameGujarati || "",
})) || [];


        setOriginalData(shifts);
        setTableData(shifts);
      })
      .catch((error) => {
        console.error("Error fetching labour shifts:", error);
      });
  };

  useEffect(() => {
    FetchLabourShift();
  }, []);

  // Search functionality
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        setTableData(originalData); // reset to original data
        return;
      }

      const filtered = originalData.filter(
        (item) =>
          item.shift_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.shift_time.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.nameHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.nameGujarati.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setTableData(filtered);
    }, 300); // debounce 300ms

    return () => clearTimeout(handler);
  }, [searchQuery, originalData]);

  // Delete shift
const DeleteShift = (shiftId) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This will remove the shift permanently.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteLabourShiftById(shiftId) // <-- corrected here
        .then((res) => {
          if (res?.data?.success) {
            setTableData((prev) => prev.filter((item) => item.id !== shiftId));
            setOriginalData((prev) => prev.filter((item) => item.id !== shiftId));
            Swal.fire({
              title: "Deleted!",
              text: res.data.msg || "Shift removed successfully.",
              icon: "success",
              timer: 1200,
              showConfirmButton: false,
            });
          } else {
            Swal.fire("Error!", res?.data?.msg || "Could not delete shift", "error");
          }
        })
        .catch((err) => {
          console.error("Error deleting shift:", err);
          Swal.fire("Error!", "Something went wrong!", "error");
        });
    }
  });
};


  // Edit shift
  const handleEdit = (shift) => {
    setSelectedcontactType(shift);
    setIsContactModalOpen(true);
  };

  // Toggle status
  // const statusCategory = (id, status) => {
  //   UpdateLabourShiftStatus(id, status)
  //     .then(() => {
  //       setTableData((prev) =>
  //         prev.map((item) => (item.id === id ? { ...item, isActive: status } : item))
  //       );
  //       setOriginalData((prev) =>
  //         prev.map((item) => (item.id === id ? { ...item, isActive: status } : item))
  //       );
  //       Swal.fire({
  //         title: "Updated!",
  //         text: "Shift status changed successfully.",
  //         icon: "success",
  //         timer: 1000,
  //         showConfirmButton: false,
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error updating status:", error);
  //     });
  // };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Labour Shift Master" }]} />
        </div>

        {/* Filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search Shift"
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
                setIsContactModalOpen(true);
                setSelectedcontactType(null);
              }}
              title="Add Labour Shift"
            >
              <i className="ki-filled ki-plus"></i> Add Shift
            </button>
          </div>
        </div>

        {/* Modal */}
       <AddLabourshift
  isOpen={isContactModalOpen}
  onClose={(val) => setIsContactModalOpen(val)}
  refreshData={FetchLabourShift}
  shiftData={selectedcontactType}
/>

        {/* Table */}
        <TableComponent
          columns={columns(handleEdit, DeleteShift)}
          data={tableData || []}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export default Labourshiftmaster;
