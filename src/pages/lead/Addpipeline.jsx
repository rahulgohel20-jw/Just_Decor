import { useState, useEffect } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Plus, Trash2 } from "lucide-react";
import { Fetchmanager, CreatePipeline } from "@/services/apiServices";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Addpipeline = ({ isModalOpen, setIsModalOpen, onSuccess }) => {
  const [pipelineName, setPipelineName] = useState("");
  const [openStages, setOpenStages] = useState([]);
  const [closeStages, setCloseStages] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // Reset form
  const resetForm = () => {
    setPipelineName("");
    setOpenStages([""]);
    setCloseStages([""]);
    setSelectedMember("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    setIsModalOpen(false);
  };

  // On modal open
  useEffect(() => {
    if (isModalOpen) {
      fetchManagers();
      setOpenStages([""]);
      setCloseStages([""]);
    }
  }, [isModalOpen]);

  const fetchManagers = () => {
    Fetchmanager(1)
      .then((res) => {
        if (res?.data?.data?.userDetails) {
          const managerList = res.data.data.userDetails.map((man) => ({
            value: man.id,
            label: man.firstName || "-",
          }));
          setManagers(managerList);
        }
      })
      .catch(() => setManagers([]));
  };

  const addOpenStage = () => setOpenStages([...openStages, ""]);
  const addCloseStage = () => setCloseStages([...closeStages, ""]);

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

  // Prevent deleting last stage
  const handleDeleteStage = (index, type) => {
    if (type === "open") {
      if (openStages.length === 1) return;
      setOpenStages(openStages.filter((_, i) => i !== index));
    } else {
      if (closeStages.length === 1) return;
      setCloseStages(closeStages.filter((_, i) => i !== index));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!pipelineName.trim()) {
      newErrors.pipelineName = "Pipeline name is required";
    }

    if (!selectedMember) {
      newErrors.selectedMember = "Please select created by member";
    }

    if (openStages.some((stage) => !stage.trim())) {
      newErrors.openStages = "All open stages must be filled";
    }

    if (closeStages.some((stage) => !stage.trim())) {
      newErrors.closeStages = "All close stages must be filled";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    const payload = {
      closeStages: closeStages.map((s) => s.trim()),
      id: -1,
      openStages: openStages.map((s) => s.trim()),
      userId: Number(selectedMember),
      pipelineName: pipelineName.trim(),
    };

    try {
      const res = await CreatePipeline(payload);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res?.data?.message || "Pipeline created successfully",
      });

      handleClose();
      onSuccess && onSuccess();
      navigate("/pipeline");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setSaving(false);
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
        <div className="rounded-lg">
          {/* Pipeline Name */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              maxLength={100}
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              placeholder="Pipeline Name"
              className={`w-full p-3 rounded-md border ${
                errors.pipelineName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.pipelineName && (
              <p className="text-red-500 text-sm mt-1">{errors.pipelineName}</p>
            )}
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
                className="bg-green-500 text-white p-2 rounded"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {openStages.map((stage, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={stage}
                    onChange={(e) =>
                      handleStageChange(index, e.target.value, "open")
                    }
                    placeholder={`Open Stage ${index + 1}`}
                    className={`w-full p-2 rounded-md border ${
                      errors.openStages ? "border-red-500" : "border-gray-300"
                    }`}
                  />

                  <button
                    onClick={() => handleDeleteStage(index, "open")}
                    disabled={openStages.length === 1}
                    className="text-red-500 disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {errors.openStages && (
                <p className="text-red-500 text-sm">{errors.openStages}</p>
              )}
            </div>
          </div>

          {/* Close Stages */}
          <div className="mb-6 border rounded-md overflow-hidden">
            <div className="flex justify-between items-center bg-[#EFF6FF] px-4 py-2">
              <span className="font-medium">Close Stages</span>
              <button
                onClick={addCloseStage}
                className="bg-green-500 text-white p-2 rounded"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {closeStages.map((stage, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={stage}
                    onChange={(e) =>
                      handleStageChange(index, e.target.value, "close")
                    }
                    placeholder={`Close Stage ${index + 1}`}
                    className={`w-full p-2 rounded-md border ${
                      errors.closeStages ? "border-red-500" : "border-gray-300"
                    }`}
                  />

                  <button
                    onClick={() => handleDeleteStage(index, "close")}
                    disabled={closeStages.length === 1}
                    className="text-red-500 disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {errors.closeStages && (
                <p className="text-red-500 text-sm">{errors.closeStages}</p>
              )}
            </div>
          </div>

          {/* Created By */}
          <div className="mb-6">
            <select
              className={`w-full p-3 rounded-md border ${
                errors.selectedMember ? "border-red-500" : "border-gray-300"
              }`}
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="">Select Created By Member</option>
              {managers.map((manager) => (
                <option key={manager.value} value={manager.value}>
                  {manager.label}
                </option>
              ))}
            </select>

            {errors.selectedMember && (
              <p className="text-red-500 text-sm mt-1">
                {errors.selectedMember}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 rounded-md text-white ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-blue-700"
              }`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </CustomModal>
    )
  );
};

export default Addpipeline;
