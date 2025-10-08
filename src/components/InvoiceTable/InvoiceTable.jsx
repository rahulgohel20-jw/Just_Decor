import { TableComponent } from "@/components/table/TableComponent";

import { Download } from "lucide-react";
export default function InvoiceTable({ columns, data }) {
  return (
    <>
      {/* filters */}
      <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="filItems relative">
            <select defaultValue="All Invoice" className="select pe-7.5">
              <option value="0" selected>
                All Invoice
              </option>
              <option value="1">Last 3 Months</option>
              <option value="2">Last 6 Months</option>
              <option value="3">Custom Date</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn btn-primary" title="Download">
            <Download style={{ width: "18", height: "18" }} /> Download
          </button>
        </div>
      </div>

      <TableComponent columns={columns} data={data} paginationSize={10} />
    </>
  );
}
