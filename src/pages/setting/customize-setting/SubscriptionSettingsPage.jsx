import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns } from "./constant";
import { TableComponent } from "@/components/table/TableComponent";

const SubscriptionSettingsPage = () => {
  const [tableData, setTableData] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const DeleteEventtype = () => {};
  const handleEdit = () => {};
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "" }]} />
        </div>
        <div className="card min-w-full p-4  mb-10">
          <div className="mb-4">
            <h2 className="text-black text-lg font-semibold">Subscription</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 text-base ">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Type</p>
              <p className="font-semibold">Subscription</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Plan</p>
              <p className="font-semibold">Basic</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Price</p>
              <p className="font-semibold">
                $240.00 <span className="text-gray-500 font-normal">/mo</span>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Users</p>
              <p className="font-semibold">1</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Start Date</p>
              <p className="font-semibold">22/05/2025</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">End Date</p>
              <p className="font-semibold">21/05/2026</p>
            </div>
          </div>
        </div>
        <div className="card min-w-full p-4  mb-10">
          <div className=" flex  items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-black text-lg font-semibold">
                Subscription Activity
              </h2>
            </div>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <TableComponent
            columns={columns(handleEdit, DeleteEventtype)}
            data={tableData}
            paginationSize={10}
          />
        </div>
      </Container>
    </Fragment>
  );
};
export { SubscriptionSettingsPage };
