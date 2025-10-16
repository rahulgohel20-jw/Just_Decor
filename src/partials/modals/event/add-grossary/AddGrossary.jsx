import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const AddGrossary = ({
  isModalOpen,
  setIsModalOpen,
  modalData,
  onAllocateAgency,
  onAllocatePlace,
  onAllocateDate,
  agencies,
  loading,
}) => {
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const [selectedAgency, setSelectedAgency] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleAllocateAgency = () => {
    if (selectedAgency) {
      console.log("Selected Agency:", selectedAgency);
      onAllocateAgency(selectedAgency);
    }
  };

  const handleAllocatePlace = () => {
    if (selectedPlace) {
      console.log("Selected Place:", selectedPlace);
      onAllocatePlace(selectedPlace);
    }
  };

  const handleAllocateDate = () => {
    if (selectedDate) {
      console.log("Selected Date:", selectedDate);
      onAllocateDate(selectedDate);
    }
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Agency, Place & Date Allocation"
        width={900}
        footer={[
          <div className="flex justify-between" key={"footer-buttons"}>
            <button
              key="cancel"
              className="btn btn-light"
              onClick={handleModalClose}
              title="Cancel"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary save-btn"
              title="Save"
              onClick={handleModalClose}
            >
              Save
            </button>
          </div>,
        ]}
      >
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          {/* Agency Allocation */}
          <div className="flex flex-wrap items-end gap-2">
            <select
              className="select pe-7.5"
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
            >
              <option value="">-- Select Agency --</option>
              {loading && <option>Loading...</option>}
              {!loading && agencies.length > 0
                ? agencies.map((agency) => (
                    <option
                      key={agency.id}
                      value={agency.nameEnglish || agency.name}
                    >
                      {agency.nameEnglish || agency.name}
                    </option>
                  ))
                : !loading && <option>No agencies found</option>}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              title="Allocate Agency"
              onClick={handleAllocateAgency}
              disabled={!selectedAgency}
            >
              Allocate
            </button>
          </div>

          {/* Place Allocation */}
          <div className="flex flex-wrap items-end gap-2">
            <select
              className="select pe-7.5"
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
            >
              <option value="">-- Select Place --</option>
              <option value="At Venue">At Venue</option>
              <option value="Godown">Godown</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              title="Allocate Place"
              onClick={handleAllocatePlace}
              disabled={!selectedPlace}
            >
              Allocate
            </button>
          </div>

          {/* Date Allocation */}
          <div className="flex flex-wrap items-end gap-2">
            <DatePicker
              className="input "
              showTime
              format="MM/DD/YYYY hh:mm A"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              title="Allocate Date"
              onClick={handleAllocateDate}
              disabled={!selectedDate}
            >
              Allocate
            </button>
          </div>
        </div>

        <div className={"flex flex-col gap-1 w-full"}>{modalData()}</div>
      </CustomModal>
    )
  );
};
export default AddGrossary;
