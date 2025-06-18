import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { TableComponent } from "@/components/table/TableComponent";
import { Confirmation } from "@/components/confirmation/confirmation";
import { columns, defaultData } from "./constant";

const QuotationTab = () => {
  const handleEdit = (data) => {
    setEditData(data);
    setIsModalOpen(true);
  };

  const responseFormate = () => {
    const data = defaultData.map((item) => {
      return {
        ...item,
        action: (
          <div className="flex items-center justify-center gap-1">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Edit"
              onClick={() => handleEdit(item)}
            >
              <i className="ki-filled ki-notepad-edit"></i>
            </button>
            <button className="btn btn-sm btn-icon btn-clear" title="Delete">
              <Confirmation
                trigger={<i className="ki-filled ki-trash"></i>}
                content="Do you really want to delete?"
                yesText="Proceed"
                noText="Dismiss"
                onConfirm={() => console.log("User confirmed")}
                onCancel={() => console.log("User cancelled")}
              ></Confirmation>
            </button>
          </div>
        ),
      };
    });
    return data;
  };

  const [tableData, setTableData] = useState(responseFormate());

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h4 class="font-semibold text-gray-900">Quotations</h4>
        <div className="flex flex-wrap items-center gap-2">
          <div className="filItems">
            <button className="btn btn-primary shrink-0" title="Add Quotation">
              <i className="ki-filled ki-plus"></i> Add Quotation
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col mb-2">
        <div className="p-4 flex flex-col items-center">
          <p className="text-sm text-gray-900 opacity-50 mt-3">
            No data available!
          </p>
        </div>
      </div>
    </>
  );
};

export default QuotationTab;
