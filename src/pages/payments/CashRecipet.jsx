import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import AddContact from "@/partials/modals/add-company/AddCompany";
import { columns, defaultData } from "./cashrecipetconstant";

const CashRecipet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const responseFormate = () => {
    const data = defaultData.map((item) => {
      return {
        ...item,
        handleModalOpen: handleModalOpen,
      };
    });
    return data;
  };

  const [tableData, setTableData] = useState(responseFormate());

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <h1 className="text-3xl font-bold text-[#111827]">Cash Receipt</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-between mb-4">
          <div className="filItems relative">
            <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
            <input className="input pl-8" placeholder="Search " type="text" />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleModalOpen}
            title="Create"
          >
            <i className="ki-filled ki-plus"></i> Create
          </button>
        </div>
        {/* TableComponent */}
        <TableComponent
          columns={columns}
          data={tableData}
          paginationSize={10}
        />
      </Container>
      {/* AddContact */}
      <AddContact isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Fragment>
  );
};
export default CashRecipet;
