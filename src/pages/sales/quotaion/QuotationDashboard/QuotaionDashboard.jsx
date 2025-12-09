import { Fragment, useState, useEffect, useMemo } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns, defaultData } from "./constant";
import QuotationTable from "@/components/QuotationTable/QuotationTable";
import { CommonHexagonBadge } from "@/partials/common";
import {
  GetAllQuotation,
  GetAllQuotationByFilter,
} from "@/services/apiServices";
import { toAbsoluteUrl } from "@/utils";
import { Download } from "lucide-react";
import { useIntl } from "react-intl";
import { FormattedMessage } from "react-intl";

const formatDateAPI = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateDisplay = (dateString) => {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
};

const QuotationDashboard = () => {
  const intl = useIntl();
  const userId = localStorage.getItem("userId");

  const [tableData, setTableData] = useState(defaultData);
  const [searchText, setSearchText] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(""); // "", 1, 2, 3
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const [originalData, setOriginalData] = useState([]);

  const [totals, setTotals] = useState({
    receivable: 0,
    remaining: 0,
    total: 0,
  });

  const calculateDateRange = (filterValue) => {
    const end = new Date();
    const start = new Date();

    if (filterValue === "1") {
      start.setMonth(start.getMonth() - 3);
    } else if (filterValue === "2") {
      start.setMonth(start.getMonth() - 6);
    } else if (filterValue === "3" && customRange.start && customRange.end) {
      return {
        startDate: new Date(customRange.start),
        endDate: new Date(customRange.end),
      };
    }

    return { startDate: start, endDate: end };
  };

  const fetchQuotations = async (filterValue = "") => {
    let response;

    if (filterValue === "") {
      response = await GetAllQuotation(userId);
    } else {
      const { startDate, endDate } = calculateDateRange(filterValue);

      response = await GetAllQuotationByFilter(
        formatDateAPI(endDate),
        formatDateAPI(startDate),
        userId
      );
    }

    const list =
      response?.data?.data["Event Functions Quotation Details"] || [];
    setOriginalData(list);

    setTotals({
      receivable: list[0]?.overAllReceivableAmnt || 0,
      remaining: list[0]?.overAllRemainingAmnt || 0,
      total: list[0]?.overallTotalAmnt || 0,
    });
  };

  useEffect(() => {
    fetchQuotations("");
  }, []);

  // 📌 MAP TABLE DATA
  useEffect(() => {
    const lang = localStorage.getItem("lang");
    const languageMap = {
      en: "nameEnglish",
      hi: "nameHindi",
      gu: "nameGujarati",
    };
    const field = languageMap[lang] || "nameEnglish";

    const mapped = originalData.map((q, index) => ({
      Invoice: index + 1,
      EventId: q?.event?.id || "-",
      PartyId: q?.event?.party?.id || "-",
      CustomerName: q?.event?.party?.[field] || "-",
      Eventname: q?.event?.eventType?.[field] || "-",
      eventDate: q?.event?.eventStartDateTime
        ? formatDateDisplay(q.event.eventStartDateTime)
        : "-",
      QuotationDate: q?.createdAt || "-",
      Amount: q?.totalAmount || "-",
      BalanceDue: q?.remainingAmount || "-",
    }));

    setTableData(mapped);
  }, [originalData, localStorage.getItem("lang")]);

  // 🔍 Search Filter
  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const s = searchText.toLowerCase();
      return (
        row.CustomerName?.toLowerCase().includes(s) ||
        row.Eventname?.toLowerCase().includes(s) ||
        String(row.Invoice)?.toLowerCase().includes(s)
      );
    });
  }, [tableData, searchText]);

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
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="SALES.QUOTATION_OVERVIEW"
                    defaultMessage="Quotation Overview"
                  />
                ),
              },
            ]}
          />
        </div>

        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search Quotation"
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* FILTER SELECT */}
            <div className="filItems relative">
              <select
                className="select pe-7.5"
                value={selectedMonth}
                onChange={(e) => {
                  const v = e.target.value;
                  setSelectedMonth(v);
                  if (v !== "3") fetchQuotations(v);
                }}
              >
                <option value="">All Quotations</option>
                <option value="1">Last 3 Months</option>
                <option value="2">Last 6 Months</option>
                <option value="3">Custom Date</option>
              </select>
            </div>

            {/* CUSTOM DATE */}
            {selectedMonth === "3" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="input"
                  value={customRange.start}
                  onChange={(e) =>
                    setCustomRange((p) => ({ ...p, start: e.target.value }))
                  }
                />
                <input
                  type="date"
                  className="input"
                  value={customRange.end}
                  onChange={(e) =>
                    setCustomRange((p) => ({ ...p, end: e.target.value }))
                  }
                />
                <button
                  className="btn btn-primary"
                  onClick={() => fetchQuotations("3")}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* DOWNLOAD BUTTON */}
          <button className="btn btn-primary">
            <Download style={{ width: 18, height: 18 }} /> Download
          </button>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {[
            {
              label: "Total Outstanding Receivable",
              value: totals.receivable,
            },
            {
              label: "Total Remaining",
              value: totals.remaining,
            },
            {
              label: "Total Amount",
              value: totals.total,
            },
          ].map((s, i) => (
            <div key={i} className="card p-4 user-access-bg">
              <div className="flex flex-col items-center gap-2">
                <CommonHexagonBadge
                  stroke="stroke-primary"
                  fill="fill-light"
                  size="size-[50px]"
                  badge={
                    <i className="ki-filled ki-wallet text-xl text-primary"></i>
                  }
                />
                <p className="form-info text-gray-700 text-center">{s.label}</p>
                <h3 className="text-xl font-semibold text-primary">
                  ₹ {s.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <QuotationTable columns={columns} data={filteredData} />
      </Container>
    </Fragment>
  );
};

export default QuotationDashboard;
