import { useEffect, useState } from "react";
import { TableComponent } from "@/components/table/TableComponent";
import { CustomModal } from "@/components/custom-modal/CustomModal";

const AddGrossary = ({ isModalOpen, setIsModalOpen,modalData, agencies }) => {
  
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Agency, Place & Date Allocation"
        width={900}
        footer={[
          <div className="flex justify-end" key={"footer-buttons"}>
            <button
              key="cancel"
              className="btn btn-light"
              onClick={handleModalClose}
              title="Cancel"
            >
              Cancel
            </button>
          </div>,
        ]}
      >
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-end gap-2">
            <select className="select pe-7.5">
                <option value="">-- Select --</option>
                {agencies.map((agency, i) => (
                  <option key={i} >{agency}</option>
                ))}
              </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
                className="btn btn-primary"
                title="Allocate"
              >
                 Allocate 
            </button>
            </div>
            <div className="flex flex-wrap items-end gap-2">
            <select className="select pe-7.5">
                <option value="">At Venue</option>
                <option value="">Godown</option>
              </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
                className="btn btn-primary"
                title="Allocate"
              >
                 Allocate 
            </button>
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <div className="input">
                <i className="ki-filled ki-calendar"></i>
                <input
                  type="date"
                  className="h-full"
                />
              </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
                className="btn btn-primary"
                title="Allocate"
              >
                 Allocate 
            </button>
            </div>
        </div>
        <div className={'flex flex-col gap-1 w-full'}>
          {modalData()}
        </div>
        {/* Total Price and save button*/}
      <div className="flex items-center justify-center gap-5 bg-gray-200 border-b border-gray-300 py-2">
         <button
          className="btn btn-primary save-btn"
          title="Save"
          onClick={handleModalClose}
        >
          Save
        </button>
        <button
              key="cancel"
              className="btn btn-danger"
              onClick={handleModalClose}
              title="Cancel"
            >
              Cancel
            </button>
      </div>
      </CustomModal>
    )
  );
};
export default AddGrossary;
