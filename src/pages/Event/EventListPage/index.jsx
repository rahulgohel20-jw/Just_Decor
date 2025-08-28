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

const EventListPage = () => {
  const classes = useStyle();
  useEffect(() => {
    FetchEvent();
  }, []);
  const [tableData, setTableData] = useState();
  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;
  const FetchEvent = () => {
    GetEventMaster(Id)
      .then((res) => {
        const formatted = res.data.data["Event Details"].map((cust, index) => ({
          sr_no: index + 1,
          eventid: cust.id,
          event_id: cust.eventNo || "-",
          event_date: cust.eventStartDateTime,
          customer: cust.party.nameEnglish,
          event_type: cust.eventType.nameEnglish,
          proforma_invoice: (
            // <Link to="/proforma-invoice">
            <Tooltip className="cursor-pointer" title="Proforma Invoice">
              <div
                className="flex justify-center items-center w-full"
                onClick={underConstruction}
              >
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </Tooltip>
            // </Link>
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
            <Link to="/estimate">
              <Tooltip className="cursor-pointer" title="Quotation">
                <div className="flex justify-center items-center w-full">
                  <BadgeDollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </Tooltip>
            </Link>
          ),
        }));

        setTableData(formatted);
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };
  const DeleteEvent = (eventid) => {
    DeleteEventMaster(eventid)
      .then(() => {
        FetchEvent();
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
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
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/add-event">
              <button
                className="btn btn-primary"
                onClick={handleModalOpen}
                title="Add Event"
              >
                <i className="ki-filled ki-plus"></i> Add Event
              </button>
            </Link>
          </div>
        </div>
        <TableComponent
          columns={columns(DeleteEvent)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default EventListPage;
