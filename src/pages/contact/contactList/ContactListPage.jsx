import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { KeenIcon } from "@/components";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { columns, defaultData } from "./constant";

const ContactListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const responseFormate = () => {
    const data = defaultData.map((item) => {
      return {
        ...item,
        action: (
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary btn-sm me-2"
              onClick={handleModalOpen}
            >
              Edit
            </button>
            <button className="btn btn-danger btn-sm">Delete</button>
          </div>
        ),
      };
    });
    return data;
  };
  const [tableData, setTableData] = useState(responseFormate());

  return (
    <Fragment>
      <Container>
        <div className="flex flex-wrap items-center lg:items-end justify-between gap-2 mb-3">
          <div className="relative mb-1">
           <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
           <input 
            className="input input-sm pl-8"
            placeholder="Example input"
            type="text" />
          </div>
          {/* <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <span className="px-3 bg-gray-100">
              <KeenIcon icon="magnifier" className="text-gray-700 text-xl" />
            </span>
            <input
              className="px-4 py-2 focus:outline-none"
              placeholder="Example input"
              type="text"
            />
          </div> */}
          <button className="btn btn-sm btn-light mb-1" onClick={handleModalOpen}>
            + Add Contact
          </button>
        </div>
        <TableComponent columns={columns} data={tableData} />
      </Container>
      <CustomModal open={isModalOpen} onClose={handleModalClose}>
        <input type="text" placeholder="Enter your name" className="input" />
      </CustomModal>
    </Fragment>
  );
};
export { ContactListPage };
