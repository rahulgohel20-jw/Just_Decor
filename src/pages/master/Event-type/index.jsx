import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import AddEventType from "@/partials/modals/add-event-type/AddEventType";
import {
  GetEventType,
  DeleteEventType,
  SearchEventType,
} from "@/services/apiServices";
import Swal from "sweetalert2";
const EventTypeMaster = () => {
  const [isEventTypeModalOpen, setIsEventTypeModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tableData, setTableData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    FetchEventType();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        FetchEventType();
        return;
      }

      SearchEventType(searchQuery, Id)
        .then(({ data: { data } }) => {
          if (data && data["EventTypes Details"]) {
            const formatted = data["EventTypes Details"].map((cust, index) => ({
              sr_no: index + 1,
              event_type: cust.nameEnglish || "-",
              eventid: cust.id,
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
  const FetchEventType = () => {
    GetEventType(Id)
      .then((res) => {
        const formatted = res.data.data["EventTypes Details"].map(
          (cust, index) => ({
            sr_no: index + 1,
            event_type: cust.nameEnglish || "-",
            eventid: cust.id,
          })
        );

        setTableData(formatted);
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };

  const DeleteEventtype = (eventid) => {
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
        DeleteEventType(eventid)
          .then((response) => {
            if (response && (response.success || response.status === 200)) {
              FetchEventType();
              Swal.fire({
                title: "Removed!",
                text: "Event has been removed successfully.",
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
  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsEventTypeModalOpen(true);
  };
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Event Type Master" }]} />
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
              onClick={() => setIsEventTypeModalOpen(true)}
              title="Add Contact Category"
            >
              <i className="ki-filled ki-plus"></i> Add Event Type
            </button>
          </div>
        </div>
        <AddEventType
          isModalOpen={isEventTypeModalOpen}
          setIsModalOpen={setIsEventTypeModalOpen}
          refreshData={FetchEventType}
          selectedEvent={selectedEvent}
        />
        <TableComponent
          columns={columns(handleEdit, DeleteEventtype)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default EventTypeMaster;
