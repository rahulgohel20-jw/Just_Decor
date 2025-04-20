import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { KeenIcon } from "@/components";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import AddContact from "@/partials/modals/add-contact/AddContact";
import { columns, defaultData } from "./constant";

const ContactListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const responseFormate = () => {
    const data = defaultData.map((item) => {
      return {
        ...item,
        action: (
          <div className="flex items-center justify-center gap-1">
            <button
              className="btn btn-sm btn-icon btn-clear text-gray-600"
              title="Edit"
              onClick={handleModalOpen}
            >
              <i className="ki-filled ki-notepad-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-icon btn-clear text-danger"
              title="Delete"
            >
              <i className="ki-filled ki-trash"></i>
            </button>
          </div>
        ),
      };
    });
    return data;
  };
  const [tableData, setTableData] = useState(responseFormate());

  return (
    <Fragment>
      <div className="gap-2 pb-2 mb-3">
      <Container>
        <Breadcrumbs items={[{ title: "Contacts" }]} />
        </Container>
      </div>      
      <Container>
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input input-sm pl-8"
                placeholder="Search here"
                type="text"
              />
            </div>
            <div className="filItems">
              <select className="select select-sm w-28">
                <option value="1">First Name</option>
                <option value="2">Last Name</option>
                <option value="2">Sur Name</option>
              </select>
            </div>
            <div className="filItems">
              <button className="btn btn-sm btn-light" title="Export">
                <i className="ki-filled ki-folder-down"></i> Export
              </button>
            </div>
            <div className="filItems">
              <button className="btn btn-sm btn-light" title="Filter">
                <i className="ki-filled ki-setting-4"></i> Filter
              </button>
            </div>
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
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleModalOpen}
            >
              <i class="ki-filled ki-plus"></i> Add Contacts
            </button>
          </div>
        </div>
        <TableComponent columns={columns} data={tableData} />
      </Container>
      <AddContact isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Fragment>
  );
};
export { ContactListPage };
