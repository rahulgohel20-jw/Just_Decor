import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import AddContact from "@/partials/modals/add-contact/AddContact";
import { DragAndDrop } from "@/components/drag-and-drop/DragAndDrop";
import { defaultData } from "./constant";

const LeadPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columns, setColumns] = useState(defaultData);
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  return (
    <Fragment>
      <div className="gap-2 pb-2 mb-3">
        <Container>
          <Breadcrumbs items={[{ title: "Lead" }]} />
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
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleModalOpen}
              title="Add Lead"
            >
              <i className="ki-filled ki-plus"></i> Add Lead
            </button>
          </div>
        </div>
        <DragAndDrop columns={columns} setColumns={setColumns} />
      </Container>
      <AddContact isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Fragment>
  );
};
export { LeadPage };
