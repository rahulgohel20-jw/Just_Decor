import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { TableComponent } from "@/components/table/TableComponent";
import { Confirmation } from "@/components/confirmation/confirmation";
import { columns, defaultData } from "./constant";

const NoteTab = () => {
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
              className="btn btn-sm btn-icon btn-clear text-gray-600"
              title="Edit"
              onClick={() => handleEdit(item)}
            >
              <i className="ki-filled ki-notepad-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Delete"
            >
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
      <div className="flex flex-col mb-2">
        <label className="form-label">Add Note</label>
        <Textarea />
      </div>
      <button className="btn btn-primary mb-5">Save</button>

      <TableComponent columns={columns} data={tableData} paginationSize={10} />
    </>
  );
};

export default NoteTab;
