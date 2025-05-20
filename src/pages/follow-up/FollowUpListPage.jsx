import { Fragment, useState } from "react";
import { toAbsoluteUrl } from "@/utils/Assets";
import { KeenIcon } from "@/components";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Confirmation } from "@/components/confirmation/confirmation";
import AddFollowUp from "@/partials/modals/add-follow-up/AddFollowUp";

const FollowUpListPage = () => {
  const image = (
    <div className="flex items-center justify-center rounded-full border-2 border-success-clarity size-[100px] shrink-0 bg-light">
      <img
        src={toAbsoluteUrl("/media/brand-logos/duolingo.svg")}
        className="size-[50px]"
      />
    </div>
  );
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

  const items = [
    {
      logo: "300-2.png",
      name: "Jason Tatum",
      email: "jasontatum21@gmail.com",
      mobile: "9087676588",
      status: "Open",
      type: "Call",
      date_of_followup: "2023-10-01 05:45 PM",
      assigned_to: "John Doe",
      label: false,
    },
  ];
  const renderItem = (item, index) => {
    return (
      <>
        <div className="flex flex-col gap-3 lg:gap-4">
          <div className="card min-w-full">
            <div className="flex flex-col flex-1">
              <div className="flex flex-wrap justify-between  items-center gap-7 p-4">                  
                <div className="flex flex-wrap items-center gap-7 p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <img src={toAbsoluteUrl(`/media/avatars/${item.logo}`)} className="rounded-md max-h-10 max-w-full shrink-0" alt=""/>
                    <div className="grid grid-col">
                      <p className="text-md font-medium text-gray-900" title={item.name}>{item.name}</p>
                      <span className="text-sm" title={item.email}>{item.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-5 lg:gap-7">
                    <div className="flex flex-col">
                      <div className="text-xs">Type</div>
                      <div className="text-sm font-medium text-gray-900">{item.type}</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs">Reminder</div>
                      <span className="text-sm font-medium text-gray-900">{item.date_of_followup}</span>
                    </div>
                  </div>
                </div>
                  <div className="flex items-center gap-1">
                    <div className="text-xs">Status</div>
                    <div class="badge badge-outline badge-secondary rounded-full badge-lg" title={item.status}>{item.status}</div>
                  </div>
              </div>
              <div className="flex flex-wrap justify-between items-center bg-gray-100 border-t border-gray-200 rounded-b-xl gap-2 px-4 py-3">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-md"><i class="ki-filled ki-user me-2"></i>{item.name}</p>
                  <p className="text-md"><i class="ki-filled ki-ki-filled ki-sms me-2"></i>{item.email}</p>
                  <p className="text-md"><i class="ki-filled ki-call me-2"></i>+91 98765 54321</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm btn-icon btn-clear btn-light" title="Edit">
                    <KeenIcon icon="notepad-edit" />
                  </button>
                  <button className="btn btn-sm btn-icon btn-clear btn-light" title="Close">
                    <KeenIcon icon="check-circle" />
                  </button>
                  <button className="btn btn-sm btn-icon btn-clear btn-light" title="Remark" >
                    <i className="ki-filled ki-tab-tablet"></i>
                  </button>
                  <button className="btn btn-sm btn-icon btn-clear btn-danger" title="Delete">
                    <KeenIcon icon="trash" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card min-w-full">
            <div className="flex flex-col flex-1">
              <div className="flex flex-wrap justify-between  items-center gap-7 p-4">                  
                <div className="flex flex-wrap items-center gap-7 p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <img src={toAbsoluteUrl(`/media/avatars/${item.logo}`)} className="rounded-md max-h-10 max-w-full shrink-0" alt=""/>
                    <div className="grid grid-col">
                      <p className="text-md font-medium text-gray-900" title={item.name}>{item.name}</p>
                      <span className="text-sm" title={item.email}>{item.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-5 lg:gap-7">
                    <div className="flex flex-col">
                      <div className="text-xs">Type</div>
                      <div className="text-sm font-medium text-gray-900">{item.type}</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs">Reminder</div>
                      <span className="text-sm font-medium text-gray-900">{item.date_of_followup}</span>
                    </div>
                  </div>
                </div>
                  <div className="flex items-center gap-1">
                    <div className="text-xs">Status</div>
                    <div class="badge badge-outline badge-success rounded-full badge-lg" title="Success">Success</div>
                  </div>
              </div>
              <div className="flex flex-wrap justify-between items-center bg-gray-100 border-t border-gray-200 rounded-b-xl gap-2 px-4 py-3">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-md"><i class="ki-filled ki-user me-2"></i>{item.name}</p>
                  <p className="text-md"><i class="ki-filled ki-ki-filled ki-sms me-2"></i>{item.email}</p>
                  <p className="text-md"><i class="ki-filled ki-call me-2"></i>+91 98765 54321</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm btn-icon btn-clear btn-light" title="Edit">
                    <KeenIcon icon="notepad-edit" />
                  </button>
                  <button className="btn btn-sm btn-icon btn-clear btn-light" title="Close">
                    <KeenIcon icon="check-circle" />
                  </button>
                  <button className="btn btn-sm btn-icon btn-clear btn-light" title="Remark" >
                    <i className="ki-filled ki-tab-tablet"></i>
                  </button>
                  <button className="btn btn-sm btn-icon btn-clear btn-danger" title="Delete">
                    <KeenIcon icon="trash" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card min-w-full">
            <div className="flex flex-col flex-1">
              <div className="flex flex-wrap items-center gap-7 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <img src={toAbsoluteUrl(`/media/avatars/${item.logo}`)} className="rounded-md max-h-10 max-w-full shrink-0" alt=""/>
                  <div className="grid grid-col">
                    <p className="text-md font-medium text-gray-900" title={item.name}>{item.name}</p>
                    <span className="text-sm" title={item.email}>{item.email}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-5 lg:gap-7">
                  <div className="flex flex-col">
                    <div className="text-xs">Status</div>
                    <div className="text-sm font-medium text-gray-900">{item.status}</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs">Type</div>
                    <div className="text-sm font-medium text-gray-900">{item.type}</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs">Reminder</div>
                    <span className="text-sm font-medium text-gray-900">{item.date_of_followup}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-between items-center bg-gray-100 border-t border-gray-200 rounded-b-xl gap-2 px-4 py-3">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-md"><i class="ki-filled ki-user me-2"></i>{item.name}</p>
                  <p className="text-md"><i class="ki-filled ki-ki-filled ki-sms me-2"></i>{item.email}</p>
                  <p className="text-md"><i class="ki-filled ki-call me-2"></i>+91 98765 54321</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm btn-icon btn-clear btn-light" title="Edit">
                    <KeenIcon icon="notepad-edit" />
                  </button>
                  <button className="btn btn-sm btn-icon btn-clear btn-light" title="Close">
                    <KeenIcon icon="check-circle" />
                  </button>
                  <button className="btn btn-sm btn-icon btn-clear btn-light" title="Remark" >
                    <i className="ki-filled ki-tab-tablet"></i>
                  </button>
                  <button className="btn btn-sm btn-icon btn-clear btn-danger" title="Delete">
                    <KeenIcon icon="trash" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card min-w-full">
            <div className="flex flex-col flex-1">
              <div className="flex flex-wrap items-center gap-7 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <img src={toAbsoluteUrl(`/media/avatars/${item.logo}`)} className="rounded-md max-h-10 max-w-full shrink-0" alt=""/>
                  <div className="grid grid-col">
                    <p className="text-md font-medium text-gray-900" title={item.name}>{item.name}</p>
                    <span className="text-sm" title={item.email}>{item.email}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-5 lg:gap-7">
                  <div className="flex flex-col">
                    <div className="text-xs">Status</div>
                    <div className="text-sm font-medium text-gray-900">{item.status}</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs">Type</div>
                    <div className="text-sm font-medium text-gray-900">{item.type}</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs">Reminder</div>
                    <span className="text-sm font-medium text-gray-900">{item.date_of_followup}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-between items-center bg-gray-100 border-t border-gray-200 rounded-b-xl gap-2 px-4 py-3">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-md"><i class="ki-filled ki-user me-2"></i>{item.name}</p>
                  <p className="text-md"><i class="ki-filled ki-ki-filled ki-sms me-2"></i>{item.email}</p>
                  <p className="text-md"><i class="ki-filled ki-call me-2"></i>+91 98765 54321</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm btn-icon btn-clear btn-light" title="Edit">
                    <KeenIcon icon="notepad-edit" />
                  </button>
                  <button className="btn btn-sm btn-icon btn-clear btn-light" title="Close">
                    <KeenIcon icon="check-circle" />
                  </button>
                  <button className="btn btn-sm btn-icon btn-clear btn-light" title="Remark" >
                    <i className="ki-filled ki-tab-tablet"></i>
                  </button>
                  <button className="btn btn-sm btn-icon btn-clear btn-danger" title="Delete">
                    <KeenIcon icon="trash" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          key={index}
          className="flex items-center justify-between border border-gray-200 rounded-xl gap-2 px-4 py-4 bg-secondary-clarity"
        >
          <div className="flex flex-col">
            <div className="flex flex-row">
              <span className="text-sm font-medium hover:text-primary-active mb-px">
                Status:{item.status}
              </span>
              <span className="text-sm font-medium hover:text-primary-active ms-2 mb-px">
                Type:{item.type}
              </span>
            </div>
            <div className="ms-2 flex flex-row">
              <span className="text-sm font-medium hover:text-primary-active mb-px">
                {item.date_of_followup}
              </span>
            </div>
            <div className="ms-2 flex flex-row">
              <span className="text-sm font-medium hover:text-primary-active mb-px">
                <KeenIcon icon="user" />
                {item.name}
              </span>
              <span className="text-sm font-medium text-gray ms-2 hover:text-primary-active mb-px">
                <KeenIcon icon="call" />
                {item.mobile}
              </span>
            </div>
          </div>
          <div className="flex items-center rounded-circle gap-3.5">
            <img
              src={toAbsoluteUrl(`/media/avatars/${item.logo}`)}
              className="w-10 shrink-0"
              alt=""
            />
            <div className="flex flex-col">
              <a
                href="#"
                className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px"
              >
                {item.name}
              </a>
              <span className="text-2sm text-gray-700">{item.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-5"></div>
          <div className="flex items-center gap-5">
            {item.label && (
              <span className="badge badge-sm badge-success badge-outline">
                Primary
              </span>
            )}
            <div className="flex gap-0.5">
              <div className="btn btn-sm btn-icon btn-clear btn-light">
                <KeenIcon icon="notepad-edit" />
              </div>
              <div className="btn btn-sm btn-icon btn-clear btn-light">
                <KeenIcon icon="check-circle" />
              </div>
              <div className="btn btn-sm btn-icon btn-clear btn-danger">
                <KeenIcon icon="trash" />
              </div>
              <div className="btn btn-sm btn-icon btn-clear btn-info">
                <i className="ki-outline ki-bookmark fs-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Follow-Up" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search follow-up"
                type="text"
              />
            </div>
            <div className="filItems">
              <select className="select pe-7.5">
                <option value="0">Assigned to</option>
                <option value="1">John Doe</option>
                <option value="2">Hen Mark</option>
                <option value="3">Ken Folk</option>
                <option value="4">Jimmy Bar</option>
              </select>
            </div>
            <div className="filItems">
              <select className="select pe-7.5">
                <option value="0">Today</option>
                <option value="1">Yesterday</option>
                <option value="2">This Week</option>
                <option value="3">This Month</option>
                <option value="4">Last Month</option>
                <option value="5">All Time</option>
                <option value="6">Custom</option>
              </select>
            </div>
            <div className="filItems">
              <select className="select pe-7.5">
                <option value="0">All</option>
                <option value="1">Overdue</option>
                <option value="2">Open</option>
                <option value="3">Closed</option>
              </select>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Refresh">
                <i className="ki-filled ki-arrows-circle"></i>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              title="Add Follow-Up"
              onClick={handleModalOpen}
            >
              <i className="ki-filled ki-plus"></i> Add Follow-Up
            </button>
          </div>
        </div>
        <div className="grid gap-5">
          {items.map((item, index) => {
            return renderItem(item, index);
          })}
        </div>
        {/* TableComponent */}
      </Container>
      <AddFollowUp
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editData={editData}
      />
    </Fragment>
  );
};
export { FollowUpListPage };
