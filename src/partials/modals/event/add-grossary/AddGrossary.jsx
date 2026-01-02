import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddVendor from "../../add-vendor/AddVendor";
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
  FetchSuplier,
}) => {
  const [selectedAgency, setSelectedAgency] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  const handleModalClose = () => setIsModalOpen(false);

  // Allocation handlers
  const handleAllocateAgency = () => {
    if (selectedAgency) {
      onAllocateAgency(selectedAgency);
    }
  };

  const handleAllocatePlace = () => {
    if (selectedPlace) {
      onAllocatePlace(selectedPlace);
    }
  };

  const handleAllocateDate = () => {
    if (selectedDate) {
      onAllocateDate(selectedDate);
    }
  };

  return (
    <>
      {/* SUPPLIER MODAL */}
      {isModalOpen && (
        <CustomModal
          open={isModalOpen}
          onClose={handleModalClose}
          title={
            <FormattedMessage
              id="GROSSARY.AGENCY_PLACE_DATE_ALLOCATION"
              defaultMessage="Supplier Allocation"
            />
          }
          width={1000}
          footer={[
            <div className="flex justify-between w-full" key="footer">
              <button className="btn btn-light" onClick={handleModalClose}>
                <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
              </button>
              <button className="btn btn-primary" onClick={handleModalClose}>
                <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
              </button>
            </div>,
          ]}
        >
          {/* Allocation Filters */}
          <div className="filters flex flex-wrap items-center justify-between gap-3 mb-4">
            {/* Agency */}
            <div className="flex items-end gap-2">
              <select
                className="select w-[200px]"
                value={selectedAgency}
                onChange={(e) => setSelectedAgency(e.target.value)}
              >
                <option value="">
                  <FormattedMessage
                    id="SIDEBAR_MODAL.SELECT_AGENCY"
                    defaultMessage="Select Agency"
                  />
                </option>

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
                  : null}
              </select>

              {/* Add Vendor */}
              <button
                type="button"
                onClick={() => {
                  setIsVendorModalOpen(true);
                  setIsModalOpen(false); // hide supplier modal
                }}
                className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full"
                title="Add Vendor"
              >
                <i className="ki-filled ki-plus"></i>
              </button>

              <button
                className="btn btn-primary"
                onClick={handleAllocateAgency}
                disabled={!selectedAgency}
              >
                <FormattedMessage
                  id="COMMON.ALLOCATE"
                  defaultMessage="Allocate"
                />
              </button>
            </div>

            {/* Place */}
            <div className="flex items-end gap-2">
              <select
                className="select w-[200px]"
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
              >
                <option value="">
                  <FormattedMessage
                    id="SIDEBAR_MODAL.SELECT_PLACE"
                    defaultMessage="Select Place"
                  />
                </option>
                <option value="At Venue">
                  <FormattedMessage
                    id="SIDEBAR_MODAL.AT_VENUE"
                    defaultMessage="At Venue"
                  />
                </option>
                <option value="Godown">
                  <FormattedMessage
                    id="SIDEBAR_MODAL.GO_DOWN"
                    defaultMessage="At Godown"
                  />
                </option>
              </select>

              <button
                className="btn btn-primary"
                onClick={handleAllocatePlace}
                disabled={!selectedPlace}
              >
                <FormattedMessage
                  id="COMMON.ALLOCATE"
                  defaultMessage="Allocate"
                />
              </button>
            </div>

            {/* Date */}
            <div className="flex items-end gap-2">
              <DatePicker
                className="input"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showTimeSelect
                timeFormat="hh:mm aa"
                timeIntervals={15}
                dateFormat="MM/dd/yyyy hh:mm aa"
                placeholderText="Select date and time"
              />
              <button
                className="btn btn-primary"
                onClick={handleAllocateDate}
                disabled={!selectedDate}
              >
                <FormattedMessage
                  id="COMMON.ALLOCATE"
                  defaultMessage="Allocate"
                />
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="mt-4">{modalData && modalData()}</div>
        </CustomModal>
      )}

      {/* ADD VENDOR MODAL */}
      <AddVendor
        isModalOpen={isVendorModalOpen}
        setIsModalOpen={(val) => {
          setIsVendorModalOpen(val);

          if (!val) {
            // reopen supplier modal
            setIsModalOpen(true);
            FetchSuplier && FetchSuplier();
          }
        }}
        refreshData={FetchSuplier}
      />
    </>
  );
};

export default AddGrossary;
