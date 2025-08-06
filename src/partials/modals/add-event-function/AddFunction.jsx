import { CustomModal } from "@/components/custom-modal/CustomModal";
import { DatePicker, Tooltip } from "antd";
import FunctionTypeDropdown from "@/components/dropdowns/FunctionTypeDropdown";
import { Textarea } from "@/components/ui/textarea";
const AddFunctionModel = ({ isModalOpen, setIsModalOpen, eventData,setEventModalData,functionDataStore }) => {
  
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = ({ target: { value, name } }) => {
    setEventModalData({
      ...eventData,
      [name]: value,
    });
  };

  const handleModalSave = () => {
    functionDataStore()
    handleModalClose()
  }

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add Function"
        width={800}
        footer={[
          <div className="flex justify-between" key={"footer-buttons"}>
            <button
              key="cancel"
              className="btn btn-light"
              onClick={handleModalClose}
              title="Close"
            >
              Close
            </button>
            <button
              key="save"
              className="btn btn-success"
              title="Save"
              onClick={handleModalSave}
            >
              Save
            </button>
          </div>,
        ]}
      >
        <div className="flex flex-col gap-y-2 gap-x-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-4">
              <div className="flex flex-col">
                <label className="form-label">Function Name</label>
                <FunctionTypeDropdown
                  value={eventData.customer_id}
                  name={'customer_id'}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col">
                <label className="form-label">Start Date</label>
                <DatePicker
                  className="input"
                  date={eventData.start_date}
                  name={'start_date'}
                  onChange={(date) =>
                    handleInputChange(
                      { target: { value: date, name: "start_date" } })
                  }
                />
              </div>
              <div className="flex flex-col">
                <label className="form-label">End Date</label>
                <DatePicker
                  className="input"
                  date={eventData.end_date}
                  name={'end_date'}
                  onChange={(date) =>
                    handleInputChange(
                      { target: { value: date, name: "end_date" } })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              <div className="flex flex-col">
                <label className="form-label">Notes</label>
                <Textarea
                  className="textarea h-full"
                  placeholder="Notes"
                  rows={3}
                  name={'notes'}
                  value={eventData.notes}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="form-label">Location</label>
                <Textarea
                  className="textarea h-full"
                  placeholder="Location"
                  rows={3}
                  value={eventData.address}
                  name={'address'}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
      </CustomModal>
    )
  );
};
export default AddFunctionModel;
