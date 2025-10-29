import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import {
  GetAllContactType,
  DeleteContactTypeMaster,
  updateContactTypeStatus,
} from "@/services/apiServices";
import useStyle from "./style";
import AddLabourshift from "@/partials/modals/add-labour-shift/AddLabourshift";
import Swal from "sweetalert2";

// ✅ STATIC DATA (for first load)
const staticData = [
  { sr_no: 1, shift_name: "Morning", shift_time: "08:00 AM", isActive: true, id: 1 },
  { sr_no: 2, shift_name: "Afternoon", shift_time: "12:00 PM", isActive: true, id: 2 },
  { sr_no: 3, shift_name: "Evening", shift_time: "04:00 PM", isActive: false, id: 3 },
  { sr_no: 4, shift_name: "Night", shift_time: "08:00 PM", isActive: true, id: 4 },
];


const Labourshiftmaster = () => {
  const classes = useStyle();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedcontactType, setSelectedcontactType] = useState(null);
  const [tableData, setTableData] = useState(staticData); // ✅ load static data initially
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    FetchContactType(); // Try fetching API data after mount
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        setTableData(staticData);
        return;
      }

      // Optional: if SearchContactCategory API exists
      // else do local search on static data
      const filtered = staticData.filter((item) =>
        item.contact_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTableData(filtered);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const Id = userData?.id;

  const FetchContactType = () => {
    if (!Id) return; // no user logged in — keep static data

    GetAllContactType(Id)
      .then((res) => {
        const formatted =
          res?.data?.data?.["Contact Type Details"]?.map((cust, index) => ({
            sr_no: index + 1,
            shift_name: cust.nameEnglish || "-",
shift_time: cust.nameHindi || "-", // or another field if you have time data
id: cust.id,

           
            isActive: cust.isActive,
          })) || [];

        if (formatted.length) setTableData(formatted);
      })
      .catch((error) => {
        console.error("Error fetching contact types:", error);
      });
  };

  const DeleteContactType = (contacttypeid) => {
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
        // If API available:
        DeleteContactTypeMaster(contacttypeid)
          .then((response) => {
            if (response?.success || response?.status === 200) {
              FetchContactType();
            }
          })
          .catch(() => console.error("Error deleting shift"))
          .finally(() => {
            setTableData((prev) =>
              prev.filter((item) => item.contacttypeid !== contacttypeid)
            );
            Swal.fire({
              title: "Deleted!",
              text: "Shift removed successfully.",
              icon: "success",
              timer: 1200,
              showConfirmButton: false,
            });
          });
      }
    });
  };

  const handleEdit = (event) => {
    setSelectedcontactType(event);
    setIsContactModalOpen(true);
  };

  const statusCategory = (id, status) => {
    updateContactTypeStatus(id, status)
      .then(() => {
        setTableData((prev) =>
          prev.map((item) =>
            item.contacttypeid === id ? { ...item, isActive: status } : item
          )
        );
        Swal.fire({
          title: "Updated!",
          text: "Shift status changed successfully.",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

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
          onClose={setIsContactModalOpen}
          refreshData={FetchContactType}
          contactType={selectedcontactType}
        />

        {/* Table */}
        <TableComponent
          columns={columns(handleEdit, DeleteContactType, statusCategory)}
          data={tableData || []}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export default Labourshiftmaster;
