import { Fragment, useState, useMemo, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns } from "./constant";
import { useNavigate } from "react-router-dom";
import { TableComponent } from "@/components/table/TableComponent";
import { GetRenewalCustomer } from "@/services/apiServices";

const formatDateAPI = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Converts date → readable format
const formatDateDisplay = (dateString) => {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
};

const RenewalCustomer = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  useEffect(() => {
    fetchRenewalData();
  }, []);

  const calculateDateRange = (filterValue) => {
    const today = new Date();
    let startDate = new Date(today);
    let endDate = new Date(today);

    if (filterValue === "1") {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (filterValue === "2") {
      endDate.setMonth(endDate.getMonth() + 6);
    } else if (filterValue === "3" && customRange.start && customRange.end) {
      startDate = new Date(customRange.start);
      endDate = new Date(customRange.end);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    return { startDate, endDate };
  };

  const fetchRenewalData = async (filterValue = "") => {
    setLoading(true);
    setError("");
    try {
      const { startDate, endDate } = calculateDateRange(filterValue);

      const response = await GetRenewalCustomer(
        formatDateAPI(startDate),
        formatDateAPI(endDate),
        true
      );

      const resData = response?.data;
      console.log("📥 API Response:", resData);

      if (
        resData?.success &&
        Array.isArray(resData.data) &&
        resData.data.length > 0
      ) {
        const mappedData = resData.data.map((item, index) => ({
          Invoice: `${index + 1}`,
          CustomerName: item.customerName || "N/A",
          plan: item.name || "N/A",
          Amount: item.price ?? 0,
          BillingCycle: item.billingCycle || "N/A",
          StartDate: formatDateDisplay(item.startDate),
          EndDate: formatDateDisplay(item.endDate),
        }));
        setTableData(mappedData);
      } else {
        setTableData([]);
        setError("No data found for selected date range.");
      }
    } catch (err) {
      console.error("❌ Error fetching renewal data:", err);
      setError("Something went wrong while fetching data.");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const matchesSearch =
        row.CustomerName?.toLowerCase().includes(searchText.toLowerCase()) ||
        row.plan?.toLowerCase().includes(searchText.toLowerCase()) ||
        row.Invoice?.toLowerCase().includes(searchText.toLowerCase());
      return matchesSearch;
    });
  }, [tableData, searchText]);

  return (
    <Fragment>
      <Container>
        <div className="mb-3">
          <Breadcrumbs items={[{ title: "Renewal Plan History" }]} />
        </div>

        {/* Search & Month Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="filItems relative">
            <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
            <input
              className="input pl-8"
              placeholder="Search invoice"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="filItems relative">
            <select
              className="select pe-7.5"
              value={selectedMonth}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedMonth(value);
                if (value !== "3") fetchRenewalData(value);
              }}
            >
              <option value="">All Renewal (30 days)</option>
              <option value="1">Next 3 Months</option>
              <option value="2">Next 6 Months</option>
              <option value="3">Custom Date</option>
            </select>
          </div>

          {selectedMonth === "3" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="input"
                value={customRange.start}
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, start: e.target.value }))
                }
              />
              <input
                type="date"
                className="input"
                value={customRange.end}
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, end: e.target.value }))
                }
              />
              <button
                className="btn btn-primary"
                onClick={() => fetchRenewalData("3")}
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Loader / Message Display */}
        {loading && <p>Loading...</p>}
        {error && !loading && (
          <p className="text-red-500 font-medium mb-2">{error}</p>
        )}

        {/* Table */}
        {!loading && tableData.length > 0 && (
          <TableComponent columns={columns} data={filteredData} />
        )}
      </Container>
    </Fragment>
  );
};

export default RenewalCustomer;
