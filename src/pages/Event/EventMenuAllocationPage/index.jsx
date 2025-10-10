import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Input, DatePicker, Radio, Select, Button, Table } from "antd";
import dayjs from "dayjs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import useStyles from "./style";

const EventMenuAllocationPage = () => {
  const classes = useStyles();
  const [tableData, setTableData] = useState();

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Menu Allocation" }]} />
        </div>
        {/* Event Details */}
        <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            <div className="flex flex-col gap-2.5">
              <p className="text-lg font-semibold text-gray-900">
                Event Name: Wedding
              </p>
              <div className="flex items-center gap-7">
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-user text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Party name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      Vivek
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-geolocation-home text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Venue name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      Ahmedabad
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Invoices Date:</span>
                    <span className="text-sm font-medium text-gray-900">
                      10/10/2025
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Invoice Number:</span>
                    <span className="text-sm font-medium text-gray-900">
                      INV20001052
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Event Date:</span>
                    <span className="text-sm font-medium text-gray-900">
                      12/12/2025
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-end gap-2">
              <button className="btn btn-sm btn-primary" title="Print">
                Delete
              </button>
              <button className="btn btn-sm btn-primary" title="Share">
                Save
              </button>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export default EventMenuAllocationPage;
