import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddVendor from "../../add-vendor/AddVendor";
import AddGodown from "@/partials/modals/add-godown/AddGodown";
import PlaceSelect from "../../../../components/PlaceSelect/PlaceSelect";

import { FormattedMessage } from "react-intl";
import { GETallGodown } from "../../../../services/apiServices";
import AddContactName from "../../../../pages/master/MenuItemMaster/components/AddContactName";

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
  const [isGodownOpen, setIsGodownOpen] = useState(false);
  const [options, setOptions] = useState([
    { value: "venue", label: "At venue", id: "venue" },
  ]);

  const handleModalClose = () => setIsModalOpen(false);

  let userId = localStorage.getItem("userId");

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

  useEffect(() => {
    fetchGodowns();
  }, []);

  const fetchGodowns = async () => {
    try {
      // Get userId from localStorage

      // Validate userId
      if (!userId || userId === "undefined" || userId === "null") {
        console.warn("No valid userId found, skipping godown fetch");
        return;
      }

      // Pass userId to the API call
      const res = await GETallGodown(userId);

      if (res?.data?.data?.length) {
        const godownOptions = res.data.data.map((g) => ({
          value: g.nameEnglish, // ✅ Changed to nameEnglish for display
          label: g.nameEnglish,
          id: g.id, // ✅ Keep the ID in a separate property
        }));

        setOptions([
          { value: "At venue", label: "At venue", id: "venue" },
          ...godownOptions,
        ]);
      }
    } catch (err) {
      console.error("Error fetching godowns:", err);
    } finally {
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
                className="select w-[150px]"
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
                  setIsModalOpen(false);
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

            <div className="flex items-end gap-2">
              <div className="w-[200px]">
                <PlaceSelect
                  value={selectedPlace}
                  onChange={(value) => setSelectedPlace(value)}
                  options={options}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsGodownOpen(true);
                  setIsModalOpen(false);
                }}
                className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full"
                title="Add Vendor"
              >
                <i className="ki-filled ki-plus"></i>
              </button>

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
      <AddContactName
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
        contactTypeId={3}
        concatId={3}
      />

      <AddGodown
        isModalOpen={isGodownOpen}
        setIsModalOpen={(val) => {
          setIsGodownOpen(val);

          if (!val) {
            // reopen supplier modal
            setIsModalOpen(true);
            fetchGodowns && fetchGodowns();
          }
        }}
        refreshData={fetchGodowns}
      />
    </>
  );
};

export default AddGrossary;
