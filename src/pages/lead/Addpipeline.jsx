import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Plus } from "lucide-react";

const Addpipeline = ({ isModalOpen, setIsModalOpen }) => {
  const [pipelineName, setPipelineName] = useState("");
  const [openStages, setOpenStages] = useState([]);
  const [closeStages, setCloseStages] = useState([]);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const addOpenStage = () => {
    setOpenStages([...openStages, ""]);
  };

  const addCloseStage = () => {
    setCloseStages([...closeStages, ""]);
  };

  const handleStageChange = (index, value, type) => {
    if (type === "open") {
      const updated = [...openStages];
      updated[index] = value;
      setOpenStages(updated);
    } else {
      const updated = [...closeStages];
      updated[index] = value;
      setCloseStages(updated);
    }
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleClose}
        width="900px"
        title="Create Pipeline"
      >
        <div className="  rounded-lg">
          {/* Pipeline Name */}
          <div className="mb-6">
            <label htmlFor="">Name: </label>
            <input
              type="text"
              maxLength={100}
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              placeholder="Pipeline Name"
              className="w-full bg-gray-200 p-3 rounded-md outline-none"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {pipelineName.length}/100
            </div>
          </div>

          {/* Open Stages */}
          <div className="mb-6 border rounded-md overflow-hidden">
            <div className="flex justify-between items-center bg-[#EFF6FF] px-4 py-2">
              <span className="font-medium">Open Stages</span>
              <button
                onClick={addOpenStage}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {openStages.map((stage, index) => (
                <input
                  key={index}
                  type="text"
                  value={stage}
                  onChange={(e) =>
                    handleStageChange(index, e.target.value, "open")
                  }
                  placeholder={`Open Stage ${index + 1}`}
                  className="w-full p-2 border rounded-md"
                />
              ))}
            </div>
          </div>

          {/* Close Stages */}
          <div className="mb-6 border rounded-md overflow-hidden">
            <div className="flex justify-between items-center bg-[#EFF6FF] px-4 py-2">
              <span className="font-medium">Close Stages</span>
              <button
                onClick={addCloseStage}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {closeStages.map((stage, index) => (
                <input
                  key={index}
                  type="text"
                  value={stage}
                  onChange={(e) =>
                    handleStageChange(index, e.target.value, "close")
                  }
                  placeholder={`Close Stage ${index + 1}`}
                  className="w-full p-2 border rounded-md"
                />
              ))}
            </div>
          </div>

          {/* Created By Member */}
          <div className="mb-6">
            <select className="w-full p-3 border rounded-md bg-white">
              <option value="">Select Created By Member</option>
              <option value="1">Member 1</option>
              <option value="2">Member 2</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700">
              Save
            </button>
          </div>
        </div>
      </CustomModal>
    )
  );
};

export default Addpipeline;
