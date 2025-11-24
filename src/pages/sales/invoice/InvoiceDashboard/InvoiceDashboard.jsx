import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns, defaultData } from "./constant";
import InvoiceTable from "@/components/InvoiceTable/InvoiceTable";
import { useNavigate } from "react-router-dom";
import { CommonHexagonBadge } from "@/partials/common";
import { toAbsoluteUrl } from "@/utils";
import { GetAllInvoice } from "@/services/apiServices";

const InvoiceDashboard = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState(defaultData);
  const [totals, setTotals] = useState({
    receivable: 0,
    dueToday: 0,
    dueWithin30Days: 0,
    overDue: 0,
    avgPaymentDays: 7,
  });
  const [originalData, setOriginalData] = useState([]);

  const userId = localStorage.getItem("userId");

  const fetchInvoices = async () => {
    try {
      const response = await GetAllInvoice(userId);

      const list = response?.data?.data?.["Event Invoice Details"] || [];

      setOriginalData(list);

      if (list.length > 0) {
        setTotals({
          receivable: list[0]?.overAllReceivableAmnt || 0,
          dueToday: list[0]?.overAllRemainingAmnt || 0,
          dueWithin30Days: list[0]?.overallTotalAmnt || 0,
          overDue: 0,
          avgPaymentDays: 7,
        });
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const language = localStorage.getItem("lang");

    const languageMap = {
      en: "nameEnglish",
      hi: "nameHindi",
      gu: "nameGujarati",
    };

    const field = languageMap[language] || "nameEnglish";

    const mapped = originalData.map((invoice, index) => ({
      Invoice:
        invoice?.invoiceCode || `INV-${String(index + 1).padStart(4, "0")}`,

      CustomerName: invoice?.event?.party?.[field] || "-",
      Eventname: invoice?.event?.eventType?.[field] || "-",

      PartyId: invoice?.event?.party?.id || "-",
      EventId: invoice?.event?.id || "-",

      eventDate: invoice?.event?.eventStartDateTime
        ? new Date(invoice.event.eventStartDateTime).toLocaleDateString(
            "en-GB",
            { day: "2-digit", month: "short", year: "numeric" }
          )
        : "-",

      invoiceDate: invoice?.createdAt || "-",

      Amount: `₹ ${(invoice?.grandTotal || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,

      BalanceDue: `₹ ${(invoice?.remainingAmount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,

      Status: invoice?.remainingAmount === 0 ? "Paid" : "Pending",
    }));

    setTableData(mapped);
  }, [originalData, localStorage.getItem("lang")]);

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
      title: "Total Remaining",
      value: `₹ ${totals.dueToday.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <i className="ki-filled ki-calendar-tick text-xl text-primary"></i>,
    },
    {
      title: "Total Amount",
      value: `₹ ${totals.dueWithin30Days.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <i className="ki-filled ki-time text-xl text-primary"></i>,
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
        {/* 🧭 Breadcrumb */}
        <div className="mb-3">
          <Breadcrumbs items={[{ title: "Invoice Overview" }]} />
        </div>

        {/* 🔍 Filters */}
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
        </div>

        {/* 💰 Summary Cards */}
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

        {/* 📊 Table Component */}
        <InvoiceTable columns={columns} data={tableData} />
      </Container>
    </Fragment>
  );
};

export default InvoiceDashboard;
