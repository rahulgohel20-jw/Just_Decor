import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns, defaultData } from "./constant";
import InvoiceTable from "@/components/InvoiceTable/InvoiceTable"; // ✅ use the component again
import { useNavigate } from "react-router-dom";
import { CommonHexagonBadge } from "@/partials/common";
import { toAbsoluteUrl } from "@/utils";

const InvoiceDashboard = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState(defaultData);

  const steps = [
    {
      title: "Total Outstanding Receivable",
      value: "₹ 8,00,00,000.00",
      icon: <i className="ki-filled ki-wallet text-xl text-primary"></i>,
    },
    {
      title: "Due Today",
      value: "₹ 0.00",
      icon: <i className="ki-filled ki-calendar-tick text-xl text-primary"></i>,
    },
    {
      title: "Due within 30 days",
      value: "₹ 0.00",
      icon: <i className="ki-filled ki-time text-xl text-primary"></i>,
    },
    {
      title: "Over Due Invoice",
      value: "₹ 0.00",
      icon: <i className="ki-filled ki-information-3 text-xl text-primary"></i>,
    },
    {
      title: "Average Payment Days",
      value: "7 Days",
      icon: <i className="ki-filled ki-timer text-xl text-primary"></i>,
    },
  ];

  const handleAddInvoice = () => {
    navigate("/add-invoice");
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
        {/* 🧭 Breadcrumb + Button */}
        <div className="gap-2 mb-3 flex justify-between items-center">
          <Breadcrumbs items={[{ title: "Invoice Overview" }]} />
          <button
            onClick={handleAddInvoice}
            className="bg-[#FDE7C7] text-[#845A12] border border-[#845A12] px-4 py-2 rounded-lg font-semibold hover:bg-[#FDE7C7]"
          >
            Add Invoice
          </button>
        </div>

        {/* 💰 Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4 mb-4">
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

        {/* 📊 Table Component */}
        <InvoiceTable columns={columns} data={tableData} />
      </Container>
    </Fragment>
  );
};

export default InvoiceDashboard;
