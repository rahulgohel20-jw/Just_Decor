import { Fragment, useState, useMemo } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns, defaultData } from "./constant";
import { useNavigate } from "react-router-dom";
import { TableComponent } from "@/components/table/TableComponent";

const RenewalCustomer = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState(defaultData);

  // Search state
  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(""); // "01" to "12"

  // Filtered data based on search and month
  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const matchesSearch =
        row.CustomerName.toLowerCase().includes(searchText.toLowerCase()) ||
        row.plan.toLowerCase().includes(searchText.toLowerCase()) ||
        row.Invoice.toLowerCase().includes(searchText.toLowerCase());

      const matchesMonth = selectedMonth
        ? new Date(row.Date).getMonth() + 1 === Number(selectedMonth)
        : true;

      return matchesSearch && matchesMonth;
    });
  }, [tableData, searchText, selectedMonth]);

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
              />
            </div>
            <div className="filItems relative">
              <select defaultValue="0" className="select pe-7.5">
                <option value="0">All Renewal</option>
                <option value="1">Last 3 Months</option>
                <option value="2">Last 6 Months</option>
                <option value="3">Custom Date</option>
              </select>
            </div>
          </div>

        <TableComponent columns={columns} data={filteredData} />
      </Container>
    </Fragment>
  );
};

export default RenewalCustomer;
