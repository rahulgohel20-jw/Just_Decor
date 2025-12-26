import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns, defaultData } from "./constant";
import InvoiceTable from "@/components/InvoiceTable/InvoiceTable";
import { useNavigate } from "react-router-dom";
import { CommonHexagonBadge } from "@/partials/common";
import { toAbsoluteUrl } from "@/utils";
import { FormattedMessage } from "react-intl";

import {
  GetAllInvoice,
  GetAllInvoicedatabyfilter,
} from "@/services/apiServices";

const InvoiceDashboard = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState(defaultData);
  const [originalData, setOriginalData] = useState([]);

  const [totals, setTotals] = useState({
    receivable: 0,
    dueToday: 0,
    dueWithin30Days: 0,
  });

  const userId = localStorage.getItem("userId");

  /* ---------------------- DATE FORMATTER FOR API ---------------------- */
  const formatDateAPI = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  /* ---------------------- FILTER STATES ---------------------- */
  const [filterType, setFilterType] = useState("0"); // 0=All,1=3m,2=6m,3=custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ---------------------- NORMAL API (ALL INVOICE) ---------------------- */
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
        });
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  /* ---------------------- FILTER API ---------------------- */
  const applyInvoiceFilter = async () => {
    try {
      let start = "";
      let end = "";

      if (filterType === "1") {
        // Last 3 months
        const today = new Date();
        const before3 = new Date();
        before3.setMonth(today.getMonth() - 3);

        start = formatDateAPI(before3);
        end = formatDateAPI(today);
      } else if (filterType === "2") {
        // Last 6 months
        const today = new Date();
        const before6 = new Date();
        before6.setMonth(today.getMonth() - 6);

        start = formatDateAPI(before6);
        end = formatDateAPI(today);
      } else if (filterType === "3") {
        // Custom date
        if (!startDate || !endDate) return;
        start = formatDateAPI(startDate);
        end = formatDateAPI(endDate);
      } else {
        // All Invoice
        fetchInvoices();
        return;
      }

      const response = await GetAllInvoicedatabyfilter(end, start, userId);
      const filteredList =
        response?.data?.data?.["Event Invoice Details"] || [];
      setOriginalData(filteredList);
    } catch (err) {
      console.error("Filter error:", err);
    }
  };

  /* ---------------------- LOAD ALL ON FIRST RENDER ---------------------- */
  useEffect(() => {
    fetchInvoices();
  }, []);

  /* ---------------------- AUTO APPLY FILTER ---------------------- */
  useEffect(() => {
    if (filterType !== "3") {
      applyInvoiceFilter();
    }
  }, [filterType]);

  /* ---------------------- MAP TABLE DATA ---------------------- */
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
    title: (
      <FormattedMessage
        id="TOTAL.OUTSTANDING_RECEIVABLE"
        defaultMessage="Total Outstanding Receivable"
      />
    ),
    value: `₹ ${totals.receivable.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    icon: <i className="ki-filled ki-wallet text-xl text-primary"></i>,
  },
  {
    title: (
      <FormattedMessage
        id="TOTAL.REMAINING"
        defaultMessage="Total Remainiing"
      />
    ),
    value: `₹ ${totals.dueToday.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    icon: <i className="ki-filled ki-calendar-tick text-xl text-primary"></i>,
  },
  {
    title: (
      <FormattedMessage
        id="TOTAL.AMOUNT"
        defaultMessage="Total Amount"
      />
    ),
    value: `₹ ${totals.dueWithin30Days.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    icon: <i className="ki-filled ki-time text-xl text-primary"></i>,
  },
];

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
        {/* Breadcrumb */}
        <div className="mb-3">
          <h1 className="text-xl text-gray-900">
            <FormattedMessage
              id="INVOICE.OVERVIEW"
              defaultMessage=" Invoice Overview"
            />{" "}
          </h1>
        </div>

        {/* Filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={
                  <FormattedMessage
                    id="INVOICE.SEARCH"
                    defaultMessage="Search Invoice"
                  />
                }
              />
            </div>

            {/* Filter Dropdown */}
            <div className="filItems relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="select pe-7.5"
              >
                <option value="0">
                  {" "}
                  <FormattedMessage
                    id="INVOICE.ALL"
                    defaultMessage="  All Invoice"
                  />
                </option>
                <option value="1">
                  {" "}
                  <FormattedMessage
                    id="INVOICE.LAST_3_MONTHS"
                    defaultMessage=" Last 3 Months"
                  />
                </option>
                <option value="2">
                  {" "}
                  <FormattedMessage
                    id="INVOICE.LAST_6_MONTHS"
                    defaultMessage=" Last 6 Months"
                  />
                </option>
                <option value="3">
                  {" "}
                  <FormattedMessage
                    id="INVOICE.CUSTOM_DATE"
                    defaultMessage="    
                  Custom Date
"
                  />
                  
                </option>
              </select>
            </div>

            {/* Custom Date Range */}
            {filterType === "3" && (
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  className="input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  type="date"
                  className="input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={applyInvoiceFilter}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 lg:gap-4 mb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="card min-w-full p-4 bg-no-repeat bg-[length:460px] user-access-bg"
            >
              <div className="flex flex-col items-center gap-2">
                <CommonHexagonBadge
                  stroke="stroke-primary-clarity"
                  fill="fill-light"
                  size="size-[50px]"
                  badge={step.icon}
                />
                <p className="form-info text-gray-700">{step.title}</p>
                <h3 className="text-xl font-semibold text-primary">
                  {step.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <InvoiceTable columns={columns} data={tableData} />
      </Container>
    </Fragment>
  );
};

export default InvoiceDashboard;
