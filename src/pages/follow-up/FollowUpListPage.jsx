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
        <div class="flex flex-col gap-5 lg:gap-7.5">
          <div class="card min-w-full">
            <div class="kt-card p-5">
              <div class="flex flex-wrap justify-between items-center gap-7">
                <div class="flex flex-wrap items-center gap-5">
                  {/* <img alt="" class="rounded-md max-h-20 max-w-full shrink-0" src="/static/metronic/tailwind/dist/assets/media/images/600x400/21.jpg"> */}
                  <div class="grid grid-col gap-1">
                    <a
                      class="text-lg font-semibold text-mono hover:text-primary mb-px"
                      href="#"
                    >
                      Urban Dreams
                    </a>
                    <span class="text-sm font-medium ">
                      Cloud storage and file sharing
                    </span>
                  </div>
                </div>
                <div class="flex flex-wrap items-center gap-5 lg:gap-7.5">
                  <div class="flex items-center gap-1.5">
                    <img
                      src={toAbsoluteUrl(`/media/avatars/${item.logo}`)}
                      className="w-10 shrink-0"
                      alt=""
                    />
                    <a
                      class="text-sm font-medium  hover:text-primary mb-px"
                      href="#"
                    >
                      Cody Fisher
                    </a>
                  </div>
                  <div
                    className="badge badge-sm badge-pill badge-secondary text-xs"
                    title="Stage"
                  >
                    Cold Lead
                  </div>
                  <span className="badge badge-outline shrink-0">
                    79 connections
                  </span>
                  <span class="kt-badge kt-badge-primary kt-badge-outline">
                    In Progress
                  </span>
                  <div class="flex gap-1 items-center w-20 justify-end">
                    <i class="ki-filled ki-heart text-base text-muted-foreground"></i>
                    <span class="text-sm font-medium  py-2">24</span>
                    <span class="text-sm font-medium ">Likes</span>
                  </div>
                  <div class="flex gap-1 items-center w-28 justify-end">
                    <i class="ki-filled ki-messages text-base text-muted-foreground"></i>
                    <span class="text-sm font-medium  py-2">5</span>
                    <span class="text-sm font-medium ">Comments</span>
                  </div>
                  <button class="kt-btn kt-btn-icon kt-btn-ghost kt-btn-sm">
                    <i class="ki-filled ki-dots-vertical text-lg"></i>
                  </button>

                  <div className="flex gap-1">
                    <button
                      className="btn btn-sm btn-icon btn-clear btn-light"
                      title="Edit"
                    >
                      <KeenIcon icon="notepad-edit" />
                    </button>
                    <button
                      className="btn btn-sm btn-icon btn-clear btn-light"
                      title="Close"
                    >
                      <KeenIcon icon="check-circle" />
                    </button>
                    <button
                      className="btn btn-sm btn-icon btn-clear btn-light"
                      title="Remark"
                    >
                      <i class="ki-filled ki-tab-tablet"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-icon btn-clear btn-danger"
                      title="Delete"
                    >
                      <KeenIcon icon="trash" />
                    </button>
                  </div>
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
                <i class="ki-outline ki-bookmark fs-2x"></i>
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
