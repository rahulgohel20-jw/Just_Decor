import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import AddEventType from "@/partials/modals/add-event-type/AddEventType";
import { GetEventType, DeleteEventType } from "@/services/apiServices";
const EventTypeMaster = () => {
  const [isEventTypeModalOpen, setIsEventTypeModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tableData, setTableData] = useState();
  useEffect(() => {
    FetchEventType();
  }, []);

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;
  const FetchEventType = () => {
    GetEventType(Id)
      .then((res) => {
        console.log(res);
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
    if (window.confirm("Are you sure you want to delete this Event type?")) {
      DeleteEventType(eventid)
        .then(() => {
          FetchEventType();
        })
        .catch((error) => {
          console.error("Error deleting Event type:", error);
        });
    }
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
