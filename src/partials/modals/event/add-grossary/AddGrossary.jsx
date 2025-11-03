import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { FormattedMessage } from "react-intl";

const AddGrossary = ({
  isModalOpen,
  setIsModalOpen,
  modalData,
  onAllocateAgency,
  onAllocatePlace,
  onAllocateDate,
  agencies = [],
  loading,
}) => {
  const [selectedAgency, setSelectedAgency] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [data, setData] = useState([
    
  ]);

  const handleModalClose = () => setIsModalOpen(false);

  // Dropdown options
  const agencyOptions = agencies.map((a) => ({
    label: a.nameEnglish || a.name,
    value: a.nameEnglish || a.name,
  }));

  const placeOptions = [
    { label: "At Venue", value: "At Venue" },
    { label: "Kitchen", value: "Kitchen" },
    { label: "Store", value: "Store" },
  ];

  // Handle inline table changes
  const handleChange = (index, field, value) => {
    setData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  // Allocation handlers
  const handleAllocateAgency = () => {
    if (selectedAgency) {
      onAllocateAgency(selectedAgency);
      setData((prev) =>
        prev.map((item) => ({ ...item, agency: selectedAgency }))
      );
    }
  };

  const handleAllocatePlace = () => {
    if (selectedPlace) {
      onAllocatePlace(selectedPlace);
      setData((prev) =>
        prev.map((item) => ({ ...item, place: selectedPlace }))
      );
    }
  };

  const handleAllocateDate = () => {
    if (selectedDate) {
      onAllocateDate(selectedDate);
      setData((prev) =>
        prev.map((item) => ({ ...item, date: selectedDate }))
      );
    }
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title={<FormattedMessage id="GROSSARY.AGENCY_PLACE_DATE_ALLOCATION" defaultMessage="Agency, Place & Date Allocation"/>}
        width={900}
        footer={[
          <div className="flex justify-between" key={"footer-buttons"}>
            <button
              key="cancel"
              className="btn btn-light"
              onClick={handleModalClose}
            >
              <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
            </button>
            <button
              className="btn btn-primary save-btn"
              onClick={handleModalClose}
            >
            <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />

            </button>
          </div>,
        ]}
      >
        {/* Allocation Filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-3 mb-4">
          {/* Agency Allocation */}
          <div className="flex items-end gap-2">
            <select
              className="select pe-7.5"
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
            >
              <option value=""><FormattedMessage id="SIDEBAR_MODAL.SELECT_AGENCY" defaultMessage="Select Agency" /></option>
              {loading && <option><FormattedMessage id="SIDEBAR_MODAL.LOADING" defaultMessage="Loading..." /></option>}
              {!loading && agencies.length > 0 ? (
                agencies.map((agency) => (
                  <option
                    key={agency.id}
                    value={agency.nameEnglish || agency.name}
                  >
                    {agency.nameEnglish || agency.name}
                  </option>
                ))
              ) : (
                !loading && <option><FormattedMessage id="COMMON.NO_AGENCY_FOUND" defaultMessage="No agnecies found" /></option>
              )}
            </select>
            <button
              className="btn btn-primary"
              onClick={handleAllocateAgency}
              disabled={!selectedAgency}
            >
              <FormattedMessage id="COMMON.ALLOCATE" defaultMessage="Allocate" />
            </button>
          </div>

          {/* Place Allocation */}
          <div className="flex items-end gap-2">
            <select
              className="select pe-7.5"
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
            >
              <option value=""><FormattedMessage id="SIDEBAR_MODAL.SELECT_PLACE" defaultMessage="Select Place" /></option>
                <option value="At Venue"><FormattedMessage id="SIDEBAR_MODAL.AT_VENUE" defaultMessage="At Venue" /></option>
                <option value="Godown"><FormattedMessage id="SIDEBAR_MODAL.GO_DOWN" defaultMessage="At Godown" /></option>
             
            </select>
            <button
              className="btn btn-primary"
              onClick={handleAllocatePlace}
              disabled={!selectedPlace}
            >
              <FormattedMessage id="COMMON.ALLOCATE" defaultMessage="Allocate" />
            </button>
          </div>

          {/* Date Allocation */}
          <div className="flex items-end gap-2">
            <DatePicker
              className="input"
              showTime
              format="MM/DD/YYYY hh:mm A"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
            <button
              className="btn btn-primary"
              onClick={handleAllocateDate}
              disabled={!selectedDate}
            >
              <FormattedMessage id="COMMON.ALLOCATE" defaultMessage="Allocate" />
            </button>
          </div>
        </div>

        {/* Table Section */}
    
        {/* Optional Custom Data Section */}
        <div className="mt-4">{modalData()}</div>
      </CustomModal>
    )
  );
};

export default AddGrossary;
