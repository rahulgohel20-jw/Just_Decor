import { useEffect, useState } from "react";
import { TableComponent } from "@/components/table/TableComponent";
import { CustomModal } from "@/components/custom-modal/CustomModal";

const AddGrossary = ({ isModalOpen, setIsModalOpen,columns, tableData }) => {
  

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
                <option>TIRUPATI AGRO</option>
                <option>jaydeepbhai</option>
                <option>RAJADHIRAJ HITESH BHAI</option>
                <option>HARDIK BHAI GAS</option>
                <option>HITESH DANDI</option>
                <option>BANSARI GROCERY</option>
                <option>NARESH CHANDRA</option>
                <option>SURBHI DAIRY</option>
                <option>KAMLESH BHAI</option>
                <option>NILESH AQUA BLUE</option>
                <option>RICHI RICH BAKERY</option>
                <option>SANKET BAKERY</option>
                <option>RAM SINGH</option>
                <option>JAGDISH BHAI</option>
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
       <TableComponent 
          columns={columns} 
          data={tableData}
          paginationSize={10}
        />
      </CustomModal>
    )
  );
};
export default AddGrossary;
