import { useState } from "react";
import { Confirmation } from "@/components/confirmation/confirmation";
import StageTimeLine from "../TimeLineComponent/StageTimeLine";
import { defaultData } from "./constant";

const StageTimeLineTab = () => {
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
      <div className="card-body">
        <StageTimeLine />
        <StageTimeLine />
        <StageTimeLine />
        <StageTimeLine />
        <StageTimeLine />
      </div>
    </>
  );
};

export default StageTimeLineTab;
