import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { KeenIcon } from "@/components";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns, defaultData } from "./constant";
import AddSales from "../../partials/modals/add-sales/AddSales";

const SalesPersonList = () => {
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
      <div className="gap-2 pb-2 mb-3">
        <Container>
          <Breadcrumbs items={[{ title: "Sales Team" }]} />
        </Container>
      </div>
      <Container>
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleModalOpen}
              title="Add Contacts"
            >
              <i class="ki-filled ki-plus"></i> Add Member
            </button>
          </div>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input input-sm pl-8"
                placeholder="Search here"
                type="text"
              />
            </div>
            <div className="filItems">
              <select className="select select-sm w-28" placeholder="Roles">
                <option value="Manager">Manager</option>
                <option value="Sales Person">Sales Person</option>
                <option value="Test">Test</option>
                
              </select>
            </div>
            {/* <div className="filItems">
              <button className="btn btn-sm btn-light" title="Export">
                <i className="ki-filled ki-folder-down"></i> Export
              </button>
            </div>
            <div className="filItems">
              <button className="btn btn-sm btn-light" title="Filter">
                <i className="ki-filled ki-setting-4"></i> Filter
              </button>
            </div> */}
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
          
        </div>
        <TableComponent
          columns={columns}
          data={tableData}
          paginationSize={10}
        />
      </Container>
      <AddSales isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Fragment>
  );
};
export { SalesPersonList };
