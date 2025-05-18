import { Fragment, useState } from "react";
import { KeenIcon } from "@/components";
import { Container } from "@/components/container";
import AddContact from "@/partials/modals/add-contact/AddContact";
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
    <Fragment>
      <Container>
        <Navbar>
          <PageMenu />
          <NavbarActions>
            <button
              type="button"
              onClick={handleModalOpen}
              className="btn btn-sm border border-dark"
            >
              <i className="ki-filled ki-notepad-edit text-info"></i> Edit
              Contact
            </button>
            <button type="button" className="btn btn-sm border border-dark">
              <i className="ki-filled ki-trash text-danger"></i> Delete Contact
            </button>
          </NavbarActions>
        </Navbar>
      </Container>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
          {/* Left - Contact Info */}
          <div className="col-span-1">
            <h6 className="fw-bold border-end">
              <b>Contact Details</b>
            </h6>
            <div className="mt-5">
              <i className="ki-filled ki-user me-2"></i>
              <b>First Name:</b> <span>John</span>
            </div>
            <div className="mt-3">
              <i className="ki-filled ki-user me-2"></i>
              <b>Last Name:</b> <span>Ferki</span>
            </div>
            <div className="mt-3">
              <i className="ki-filled ki-address-book me-2"></i>
              <b>Phone No:</b> <span>08871555511</span>
            </div>
            <div className="mt-3">
              <i className="ki-filled ki-address-book me-2"></i>
              <b>Email:</b> <span>Abc@gmail.com</span>
            </div>
            <div className="mt-3">
              <i className="ki-filled ki-ship me-2"></i>
              <b>Date of Birth:</b> <span>----</span>
            </div>
            <div className="mt-3">
              <i className="ki-filled ki-ship me-2"></i>
              <b>Date of Anniversary:</b> <span>----</span>
            </div>
            <div className="mt-3">
              <i className="ki-filled ki-ship me-2"></i>
              <b>Status:</b> <span>Active</span>
            </div>
          </div>

          {/* Right - Leads Section */}
          <div className="col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">
                Leads Related to this Contact
              </p>
              <div className="filItems relative">
                <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 left-3 -translate-y-1/2"></i>
                <input
                  className="input input-sm pl-8"
                  placeholder="Search here"
                  type="text"
                />
              </div>
            </div>

            <div className="card grow">
              <div className="card-body lg:pb-7.5 space-y-3">
                {items.map((item, index) => renderItem(item, index))}
              </div>
            </div>
          </div>
        </div>
        {/* Company Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5 mt-10">
          <div className="col-span-1">
            <h6 className="fw-bold border-end">
              <b>Company Details</b>
            </h6>
            <div className="mt-5">
              <i className="ki-filled ki-user me-2"></i>
              <b>Company Name:</b> <span>John Ferki</span>
            </div>
            {/* Tag Section */}
            <div className="mt-5">
              <button
                className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"
                onClick={toggleTag}
              >
                <i className="ki-filled ki-plus" />
              </button>
              {isTagOpen && (
                <div className="mt-3">
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm focus:outline-none"
                    placeholder="Search"
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                  />
                  <div className="text-center text-gray-500 mt-2 text-sm">
                    No Tags
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
      <AddContact isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Fragment>
  );
};

export { ContactDetail };
