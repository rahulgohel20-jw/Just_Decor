import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns, defaultData } from "./constant";
import { useNavigate } from "react-router-dom";
import { CommonHexagonBadge } from "@/partials/common";
import { toAbsoluteUrl } from "@/utils";
import { TableComponent } from "@/components/table/TableComponent";
import { GetSuperalladmininvoice } from "@/services/apiServices";

const SuperadminInvoice = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState(defaultData);
  const [filterType, setFilterType] = useState("0"); // 0=All,1=3m,2=6m,3=custom
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const [totals, setTotals] = useState({
    receivable: 0,
    dueToday: 0,
    dueWithin30Days: 0,
    overDue: 0,
    avgPaymentDays: 7,
  });
  // API date format (DD-MM-YYYY)
  const formatDateAPI = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

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
    navigate("/addInvoice");
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async (startDate = "", endDate = "") => {
    try {
      const response = await GetSuperalladmininvoice(startDate, endDate);
      console.log("API RESPONSE:", response);

      const apiData = response?.data?.data || response?.data;
      if (!apiData) return;

      const list =
        apiData?.["Admin Invoice Details"] ||
        apiData?.adminInvoiceDetails ||
        apiData ||
        [];

      const invoiceList = list.map((item) => ({
        id: item.id,
        Invoice: `INV-${String(item.id).padStart(4, "0")}`,
        CustomerName: item.userName || "-",
        plan: item.planName || "-",
        Amount: `₹ ${item.totalPaid?.toLocaleString("en-IN") || 0}`,
        BalanceDue: `₹ ${item.dueBalance?.toLocaleString("en-IN") || 0}`,
      }));

      setTableData(invoiceList);

      setTotals({
        receivable: apiData["Total Received"] || 0,
        dueToday: apiData["Total Remaining"] || 0,
        dueWithin30Days: apiData["Total Amount"] || 0,
        overDue: 0,
        avgPaymentDays: 7,
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };
  const applyDateFilter = (value) => {
    setFilterType(value);

    const today = new Date();
    let startDate = new Date(today);
    let endDate = new Date(today);

    if (value === "1") {
      // Last 3 months
      startDate.setMonth(today.getMonth() - 3);
    } else if (value === "2") {
      // Last 6 months
      startDate.setMonth(today.getMonth() - 6);
    } else if (value === "3") {
      // Custom date → wait for Apply button
      return;
    } else {
      // All invoices
      fetchInvoices();
      return;
    }

    fetchInvoices(formatDateAPI(startDate), formatDateAPI(endDate));
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
              <select
                value={filterType}
                className="select pe-7.5"
                onChange={(e) => applyDateFilter(e.target.value)}
              >
                <option value="0">All Invoice</option>
                <option value="1">Last 3 Months</option>
                <option value="2">Last 6 Months</option>
                <option value="3">Custom Date</option>
              </select>
            </div>

            {filterType === "3" && (
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
                  onClick={() =>
                    fetchInvoices(
                      formatDateAPI(customRange.start),
                      formatDateAPI(customRange.end)
                    )
                  }
                >
                  Apply
                </button>
              </div>
            )}
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
