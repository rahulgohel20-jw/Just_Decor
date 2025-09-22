import { Fragment, useEffect, useState } from "react";
import { BadgeDollarSign, FileText, Receipt } from "lucide-react";
import { Tooltip } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import useStyle from "./style";
import { Link } from "react-router-dom";
import { underConstruction } from "@/underConstruction";
import { GetEventMaster, DeleteEventMaster } from "@/services/apiServices";
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
import ViewEventDetail from "../../../partials/modals/view-event-detail/ViewEventDetail";
import MenuReport from "@/partials/modals/menu-report/MenuReport";
import Swal from "sweetalert2";
const EventListPage = () => {
  const classes = useStyle();
  useEffect(() => {
    FetchEvent();
  }, []);
  const [tableData, setTableData] = useState();
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [viewEventModal, setViewEventModal] = useState(false);
  const [isMenuReport, setIsMenuReport] = useState(false);
  const [menuReportEventId, setMenuReportEventId] = useState(null);
  let userData = JSON.parse(localStorage.getItem("userData"));
  const [allTableData, setAllTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  let Id = userData.id;
  const FetchEvent = () => {
    GetEventMaster(Id)
      .then((res) => {
        const formatted = res.data.data["Event Details"]
          .slice()
          .reverse()
          .map((cust, index) => ({
            sr_no: index + 1,
            eventid: cust.id,
            event_id: cust.eventNo || "-",
            event_date:
              cust.eventStartDateTime.split(" ")[0] +
              " To " +
              cust.eventEndDateTime.split(" ")[0],
            customer: cust.party.nameEnglish,
            event_type: cust.eventType.nameEnglish,
            proforma_invoice: (
              <Tooltip className="cursor-pointer" title="Proforma Invoice">
                <div
                  className="flex justify-center items-center w-full"
                  onClick={underConstruction}
                >
                  <FileText className="w-5 h-5 text-primary" />
                </div>
              </Tooltip>
            ),
            invoice: (
              <Link to="/invoice-dashboard">
                <Tooltip className="cursor-pointer" title="Invoice">
                  <div className="flex justify-center items-center w-full">
                    <Receipt className="w-5 h-5 text-success" />
                  </div>
                </Tooltip>
              </Link>
            ),
            quotation: (
              <Link to={`/quotation/${cust.id}`}>
                <Tooltip className="cursor-pointer" title="Quotation">
                  <div className="flex justify-center items-center w-full">
                    <BadgeDollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                </Tooltip>
              </Link>
            ),
          }));

        setAllTableData(formatted);
        setTableData(formatted);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  };
  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchTerm(value);

    const filtered = allTableData.filter(
      (row) =>
        row.event_id.toUpperCase().includes(value) ||
        row.customer.toUpperCase().includes(value) ||
        row.event_type.toUpperCase().includes(value) ||
        row.event_date.toUpperCase().includes(value)
    );

    setTableData(filtered);
  };

  const DeleteEvent = (eventid) => {
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
        DeleteEventMaster(eventid)
          .then((response) => {
            if (response && (response.success || response.status === 200)) {
              FetchEvent();
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
            error.data?.msg && errorMsgPopup(error.data.msg);
            console.error("Error deleting event:", error);
          });
      }
    });
  };
  const viewEvent = (eventId) => {
    setSelectedEventId(eventId);
    setViewEventModal(true);
  };
  const openMenuReport = (eventId) => {
    setMenuReportEventId(eventId);
    setIsMenuReport(true);
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Events" }]} />
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
                placeholder="Search event"
                type="text"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/add-event">
              <button className="btn btn-primary" title="Add Event">
                <i className="ki-filled ki-plus"></i> Add Event
              </button>
            </Link>
          </div>
        </div>
        <ViewEventDetail
          isModalOpen={viewEventModal}
          setIsModalOpen={setViewEventModal}
          eventId={selectedEventId}
        />
        <TableComponent
          columns={columns(DeleteEvent, viewEvent, openMenuReport)}
          data={tableData}
          paginationSize={10}
        />
        <MenuReport
          isModalOpen={isMenuReport}
          setIsModalOpen={setIsMenuReport}
          eventId={menuReportEventId}
        />
      </Container>
    </Fragment>
  );
};
export default EventListPage;
