import { Fragment, useEffect, useState, useMemo } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import AddVenueType from "../../../partials/modals/add-venue-type/AddVenueType";
import { GetVenueType, DeleteVenueTypeApi } from "@/services/apiServices";
import { FormattedMessage, useIntl } from "react-intl";
import Swal from "sweetalert2";

const VenueTypeMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const intl = useIntl();

  const userId = useMemo(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      return userData?.id ? parseInt(userData.id, 10) : null;
    } catch (e) {
      console.error("Error parsing userData", e);
      return null;
    }
  }, []);

  const fetchVenueTypes = async () => {
    if (!userId) return;

    try {
      const res = await GetVenueType(userId);
      if (res.data?.data?.["Venue Details"]) {
        const formatted = res.data.data["Venue Details"].map((item, index) => ({
          sr_no: index + 1,
          venue_type: item.nameEnglish || "-",
          venueid: item.id,
          isActive: item.isActive,
        }));
        setTableData(formatted);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching venue types:", error);
      setTableData([]);
    }
  };

  useEffect(() => {
    if (userId) fetchVenueTypes();
  }, [userId]);

  const handleEdit = (venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedVenue(null);
    setIsModalOpen(true);
  };

  // ✅ Delete handler
  const handleDelete = (venue) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete venue "${venue.venue_type}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await DeleteVenueTypeApi(venue.venueid);
          if (res.data?.success) {
            Swal.fire("Deleted!", "Venue type has been deleted.", "success");
            fetchVenueTypes();
          } else {
            Swal.fire("Failed", res.data.msg || "Could not delete", "error");
          }
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error", "Something went wrong while deleting.", "error");
        }
      }
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
                    id="USER.MASTER.VENUE_TYPE_MASTER"
                    defaultMessage="Venue Type Master"
                  />
                ),
              },
            ]}
          />
        </div>

        {/* Filters & Add Button */}
        <div className="filters flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <i className="ki-filled ki-magnifier text-primary absolute left-3 top-1/2 -translate-y-1/2"></i>
              <input
                className="input pl-10 pr-4"
                placeholder={intl.formatMessage({
                  id: "USER.MASTER.SEARCH_VENUE_TYPE",
                  defaultMessage: "Search Venue Type",
                })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={handleAdd}
          >
            <i className="ki-filled ki-plus"></i>
            <FormattedMessage
              id="USER.MASTER.ADD_VENUE_TYPE"
              defaultMessage="Add Venue Type"
            />
          </button>
        </div>

        {/* Modal */}
        <AddVenueType
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          refreshData={fetchVenueTypes}
          selectedEvent={selectedVenue} // <-- selectedVenue passed for edit
        />

        {/* Table */}
        <TableComponent
          columns={columns(handleEdit, handleDelete)} // pass delete handler
          data={tableData || []}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export default VenueTypeMaster;
