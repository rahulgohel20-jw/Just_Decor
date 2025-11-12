import { Fragment, useState, useMemo, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns } from "./constant";
import { useNavigate } from "react-router-dom";
import { TableComponent } from "@/components/table/TableComponent";
import { GetRenewalCustomer } from "@/services/apiServices";

const formatDate = (date) => {
  // Convert JS Date to dd-MM-yyyy
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const RenewalCustomer = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(""); // dropdown filter
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  useEffect(() => {
    fetchRenewalData(); // default load
  }, []);

  const calculateDateRange = (filterValue) => {
    const today = new Date();
    let startDate, endDate;

    if (filterValue === "1") {
      // Last 3 months
      startDate = new Date(today.setMonth(today.getMonth() - 3));
      endDate = new Date();
    } else if (filterValue === "2") {
      // Last 6 months
      startDate = new Date(today.setMonth(today.getMonth() - 6));
      endDate = new Date();
    } else if (filterValue === "3" && customRange.start && customRange.end) {
      // Custom Date (from date picker)
      startDate = new Date(customRange.start);
      endDate = new Date(customRange.end);
    } else {
      // Default last 30 days
      startDate = new Date(today.setDate(today.getDate() - 30));
      endDate = new Date();
    }

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  const fetchRenewalData = async (filterValue = "") => {
    setLoading(true);
    setError("");

    try {
      const { startDate, endDate } = calculateDateRange(filterValue);
      const response = await GetRenewalCustomer(startDate, endDate, true);

      if (response?.success) {
        if (!response.data || response.data.length === 0) {
          // Backend returned success but no data
          setTableData([]);
          setError("No data found for selected date range."); // show backend message
        } else {
          const mappedData = response.data.map((item, index) => ({
            Invoice: item.invoiceNo || `INV-${index + 1}`,
            CustomerName: item.customerName || "N/A",
            plan: item.planName || "N/A",
            Amount: item.totalPaid || 0,
            Date: item.startDate || "",
          }));
          setTableData(mappedData);
        }
      } else {
        setError(response?.errorMessage || "Failed to load data");
        setTableData([]);
      }
    } catch (err) {
      console.error("Error fetching renewal data:", err);
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
              <option value="1">Last 3 Months</option>
              <option value="2">Last 6 Months</option>
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

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <TableComponent columns={columns} data={filteredData} />
      </Container>
    </Fragment>
  );
};

export default RenewalCustomer;
