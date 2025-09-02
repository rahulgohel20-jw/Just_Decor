import { TableComponent } from "@/components/table/TableComponent";
import { Select } from "antd";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
export default function InvoiceTable({ columns, data }) {
  console.log("TableData:", data, columns);
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
              <option value="1">Draft</option>
              <option value="2">Save/Send</option>
              <option value="3">Paid</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn btn-primary" title="Download">
            <i className="ki-filled ki-cloud-download"></i> Download
          </button>
          <button className="btn btn-primary" title="Add Invoice">
            <i className="ki-filled ki-plus"></i> Add Invoice
          </button>
        </div>
      </div>
      {/* <Select
        defaultValue="All Invoice"
        options={[
          { value: "All Invoice" },
          { value: "Draft" },
          { value: "Save/Send" },
          { value: "Paid" },
        ]}
        className="select pe-7.5"
      /> */}
      <TableComponent columns={columns} data={data} paginationSize={10} />
    </>
  );
}
