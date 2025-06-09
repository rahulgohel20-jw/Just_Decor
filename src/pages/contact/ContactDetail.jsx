import { Fragment, useState } from "react";
import { KeenIcon } from "@/components";
import { Container } from "@/components/container";
import AddContact from "@/partials/modals/add-contact/AddContact";
import { CommonHexagonBadge } from "@/partials/common";
import ViewContact from "../../partials/modals/add-contact/ViewContact";
import { Navbar, NavbarActions } from "@/partials/navbar";
import { PageMenu } from "@/pages/public-profile";

const ContactDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [searchTag, setSearchTag] = useState("");

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const toggleTag = () => {
    setIsTagOpen((prev) => !prev);
  };

  const items = [
    {
      fullName: "Babubhai Vaghela",
      username: "vaghela",
      created: "3 days ago",
      updated: "3 days ago",
      initials: "MG",
      assign: "Manan Gandhi",
    },
    // more items...
  ];

  const renderItem = (item, index) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-4 bg-white shadow-sm"
      >
        {/* Left Section */}
        <div className="w-1/4">
          <div className="text-sm font-semibold text-gray-800">
            {item.fullName}
          </div>
          <div className="text-xs text-gray-500">{item.username}</div>
        </div>
        <div className="text-sm text-gray-500 w-10 text-center">0</div>
        {/* Center Section */}
        <div className="flex items-center gap-3 w-1/3">
          <div className="text-xs text-gray-500">
            <div>{item.assign}</div>
            <div>Created At: {item.created}</div>
            <div>Updated At: {item.updated}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
            {item.initials}
          </div>
        </div>
        {/* Tag */}
        <div>
          <span className="text-xs font-medium bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
            New Inquiry
          </span>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button type="button">
            <KeenIcon icon="eye" />
          </button>
          <button type="button">
            <KeenIcon icon="dots-horizontal" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Fragment>
        <Container>
          {/* filters */}
          <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* <PageMenu /> */}
              <button
                type="button"
                class="btn btn-sm btn-primary"
                title="All Tasks"
              >
                All Tasks
              </button>
              <button
                type="button"
                class="btn btn-sm btn-primary"
                title="Tasks Templates"
              >
                Tasks Templates
              </button>
              <button
                type="button"
                class="btn btn-sm btn-primary"
                title="Tasks Directory"
              >
                Tasks Directory
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="btn btn-light"
                onClick={handleModalOpen}
                title="Edit Contact"
              >
                <i className="ki-filled ki-notepad-edit text-info"></i> Edit
                Contact
              </button>
              <button
                type="button"
                class="btn btn-light"
                title="Delete Contact"
              >
                <i className="ki-filled ki-trash text-danger"></i> Delete
                Contact
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 border rounded-lg">
            {/* Left - Contact Info */}
            <div className="col-span-1">
              <div className="h-full lg:border-e lg:border-e-border shrink-0 p-4 lg:p-7 bg-muted/15">
                <h6 className="flex items-center justify-between font-bold text-gray-900 mb-4">
                  Contact Details
                  <CommonHexagonBadge
                    stroke="stroke-success-clarity"
                    fill="fill-success-light"
                    size="size-[38px]"
                    badge={
                      <i className="ki-filled ki-book-open text-lg text-success"></i>
                    }
                  />
                </h6>
                <div className="flex flex-col flex-wrap gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-700">First Name:</div>
                    <div className="text-md font-medium text-gray-900">
                      John
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-700">Last Name:</div>
                    <div className="text-md font-medium text-gray-900">
                      Ferki
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-700">Phone No:</div>
                    <div className="text-md font-medium text-gray-900">
                      +91 98765 54321
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-700">Email:</div>
                    <div className="text-md font-medium text-gray-900">
                      example@gmail.com
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-700">Date of Birth:</div>
                    <div className="text-md font-medium text-gray-900">
                      DD/MM/YYYY
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-700">
                      Date of Anniversary:
                    </div>
                    <div className="text-md font-medium text-gray-900">
                      DD/MM/YYYY
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-700">Status:</div>
                    <div className="text-md font-medium text-gray-900">
                      <span className="badge badge-sm badge-success badge-outline">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-t border-gray-200 my-5" />
                <h6 className="flex items-center justify-between font-bold text-gray-900 mb-4">
                  Company Details
                  <CommonHexagonBadge
                    stroke="stroke-success-clarity"
                    fill="fill-success-light"
                    size="size-[38px]"
                    badge={
                      <i className="ki-filled ki-bank text-lg text-success"></i>
                    }
                  />
                </h6>
                <div className="flex flex-col flex-wrap gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-700">Company Name:</div>
                    <div className="text-md font-medium text-gray-900">
                      John Ferki
                    </div>
                  </div>
                </div>

                <hr className="border-t border-gray-200 my-5" />
                <h6 className="flex items-center justify-between font-bold text-gray-900 mb-4">
                  Tags
                  <button
                    onClick={toggleTag}
                    className="btn btn-success w-8 h-8 p-0 inline-flex items-center justify-center rounded-full"
                    title="Add Tag"
                  >
                    <i className="ki-filled ki-plus"></i>
                  </button>
                </h6>
                {isTagOpen && (
                  <div className="flex flex-col my-3">
                    <div className="filItems relative">
                      <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                      <input
                        className="input pl-8"
                        placeholder="Search here"
                        type="text"
                        value={searchTag}
                        onChange={(e) => setSearchTag(e.target.value)}
                      />
                    </div>
                    <div className="text-center text-gray-500 mt-2 text-sm">
                      No Tags
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    className="btn btn-light h-7 rounded-full px-3"
                    title="Lead"
                  >
                    Lead <span class="ki-filled ki-cross text-sm"></span>
                  </button>
                  <button
                    className="btn btn-light h-7 rounded-full px-3"
                    title="Sample"
                  >
                    Sample <span class="ki-filled ki-cross text-sm"></span>
                  </button>
                  <button
                    className="btn btn-light h-7 rounded-full px-3"
                    title="Demo"
                  >
                    Demo <span class="ki-filled ki-cross text-sm"></span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right - Leads Section */}
            <div className="col-span-2 space-y-4">
              <div className="cop-4 lg:p-7 grow">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h4 class="font-semibold text-gray-900">
                    Leads Related to this Contact
                  </h4>
                  <div className="filItems relative">
                    <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                    <input
                      className="input pl-8"
                      placeholder="Search here"
                      type="text"
                    />
                  </div>
                </div>
                <div className="grow">
                  <div className="lg:pb-7.5 space-y-3">
                    {items.map((item, index) => renderItem(item, index))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AddContact
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </Container>
      </Fragment>
    </>
  );
};

export { ContactDetail };
