import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import AddContact from "@/partials/modals/add-contact/AddContact";
import { Confirmation } from "@/components/confirmation/confirmation";
import { columns, defaultData } from "./constant";

const ContactListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEdit = (data) => {
    console.log(data);

    setEditData(data);
    setIsModalOpen(true);
  };

  const removeContact = () => {
    console.log("Contact removed");
  };

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
              onClick={() => handleEdit(item)}
            >
              <i className="ki-filled ki-notepad-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-icon btn-clear text-danger"
              title="Delete"
            >
              <Confirmation
                trigger={<i className="ki-filled ki-trash"></i>}
                content="Do you really want to delete?"
                yesText="Proceed"
                noText="Dismiss"
                onConfirm={() => console.log("User confirmed")}
                onCancel={() => console.log("User cancelled")}
              ></Confirmation>
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
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Contacts" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search here"
                type="text"
              />
            </div>
            <div className="filItems">
              <select className="select select-sm w-[170px]">
                <option value="">Select Contact Tag</option>
                <option value="1">Tag 1</option>
                <option value="2">Tag 2</option>
                <option value="3">Tag 3</option>
                <option value="4">Tag 4</option>
              </select>
            </div>
            <div className="filItems">
              <select className="select select-sm w-[170px]">
                <option value="">Select Companies</option>
                <option value="1">Company 1</option>
                <option value="2">Company 2</option>
                <option value="3">Company 3</option>
                <option value="4">Company 4</option>
              </select>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Export">
                <i className="ki-filled ki-folder-down"></i> Export
              </button>
            </div>

          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={handleModalOpen}
              title="Add Contact"
            >
              <i className="ki-filled ki-plus"></i> Add Contact
            </button>
          </div>
        </div>
        {/* TableComponent */}
        <TableComponent
          columns={columns}
          data={tableData}
          paginationSize={10}
        />
      </Container>
      <AddContact
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editData={editData}
      />
    </Fragment>
  );
};
export { ContactListPage };
