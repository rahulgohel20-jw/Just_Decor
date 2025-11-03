import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns, defaultData } from "./constant";
import { useNavigate } from "react-router-dom";
import { CommonHexagonBadge } from "@/partials/common";
import { toAbsoluteUrl } from "@/utils";
import { TableComponent } from "@/components/table/TableComponent";

const SuperadminInvoice = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState(defaultData);
  const [totals, setTotals] = useState({
    receivable: 0,
    dueToday: 0,
    dueWithin30Days: 0,
    overDue: 0,
    avgPaymentDays: 7,
  });

  const steps = [
    {
      title: "Total Outstanding Receivable",
      value: `₹ ${totals.receivable.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <i className="ki-filled ki-wallet text-xl text-primary"></i>,
    },
    {
      title: "Due Today",
      value: `₹ ${totals.dueToday.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <i className="ki-filled ki-calendar-tick text-xl text-primary"></i>,
    },
    {
      title: "Due within 30 days",
      value: `₹ ${totals.dueWithin30Days.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <i className="ki-filled ki-time text-xl text-primary"></i>,
    },
  ];

  const handleAddInvoice = () => {
    navigate("/addInvoice");
  };

  return (
    <Fragment>
      <style>
        {`
          .user-access-bg {
            background-image: url('${toAbsoluteUrl("/images/bg_01.png")}');
          }
          .dark .user-access-bg {
            background-image: url('${toAbsoluteUrl("/images/bg_01_dark.png")}');
          }
        `}
      </style>

      <Container>
        <div className="mb-3">
          <Breadcrumbs items={[{ title: "Invoice Overview" }]} />
        </div>

        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search invoice"
                type="text"
              />
            </div>
            <div className="filItems relative">
              <select defaultValue="0" className="select pe-7.5">
                <option value="0">All Invoice</option>
                <option value="1">Last 3 Months</option>
                <option value="2">Last 6 Months</option>
                <option value="3">Custom Date</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary" title="Download">
              Download
            </button>
            <button
              className="btn btn-primary"
              title="Download"
              onClick={handleAddInvoice}
            >
              Add Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 lg:gap-4 mb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="card min-w-full p-4 rtl:[background-position:-center_center] [background-position:center_center] bg-no-repeat bg-[length:460px] user-access-bg"
            >
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <CommonHexagonBadge
                  stroke="stroke-primary-clarity"
                  fill="fill-light"
                  size="size-[50px]"
                  badge={step.icon}
                />
                <div className="flex flex-col items-center justify-center w-full">
                  <p className="form-info text-gray-700 font-normal text-center mb-0">
                    {step.title}
                  </p>
                  <h3 className="text-xl font-semibold text-primary mb-0">
                    {step.value}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <TableComponent columns={columns} data={tableData} />
      </Container>
    </Fragment>
  );
};

export default SuperadminInvoice;
