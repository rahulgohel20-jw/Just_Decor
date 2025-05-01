import { Fragment, useState } from 'react';
import { toAbsoluteUrl } from '@/utils/Assets';
import { KeenIcon } from '@/components';
import { Container } from '@/components/container';
import AddContact from "@/partials/modals/add-contact/AddContact";
import ViewContact from '../../partials/modals/add-contact/ViewContact';

import { Navbar, NavbarActions } from '@/partials/navbar';
import { PageMenu } from '@/pages/public-profile';
const ContactDetail = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    
      const handleModalOpen = () => {
        setIsModalOpen(true);
      };
    

const items = [
  {
    logo: "300-2.png",
    name: "Jason Tatum",
    email: "jasontatum21@gmail.com",
    created: "creted at 8 ago",
    updted: "updated at 8 ago",
    assign: "deep jain",
    label: false,
  },
  {
    logo: "300-2.png",
    name: "Jason Tatum",
    email: "jasontatum21@gmail.com",
    created: "creted at 8 ago",
    updted: "updated at 8 ago",
    assign: "deep jain",
    label: false,
  },
  {
    logo: "300-2.png",
    name: "Jason Tatum",
    email: "jasontatum21@gmail.com",
    created: "creted at 8 ago",
    updted: "updated at 8 ago",
    assign: "deep jain",
    label: false,
  },
];

  const renderItem = (item, index) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between border border-gray-200 rounded-xl gap-2 px-4 py-4 bg-secondary-clarity"
      >
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
          </div>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="#"
            className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px"
          >
            {item.created}
            <br />
            {item.updted}
          </a>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="#"
            className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px"
          >
            {item.assign}
          </a>
        </div>

        <div className="flex items-center gap-5">
          {item.label && (
            <span className="badge badge-sm badge-success badge-outline">
              Primary
            </span>
          )}
          <div className="flex gap-0.5">
            <button type="button" onClick={handleModalOpen}>
              <KeenIcon icon="eye" />
            </button>
            <div className="btn btn-sm btn-icon btn-clear btn-info">
              <KeenIcon icon="notepad-edit" />
            </div>
            <div className="btn btn-sm btn-icon btn-clear btn-danger">
              <KeenIcon icon="trash" />
           
            </div>
          </div>
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
          <div className="col-span-1">
            <h6 className="fw-bold border-end">
              <b>Contact Details</b>
            </h6>
            <div className="mt-5">
              <i className="ki-filled ki-user me-2"></i>
              <b>First Name : </b>
              <span>John Ferki</span>
            </div>
            <div className="mt-5">
              <i className="ki-filled ki-user me-2"></i>
              <b>Last Name : </b>
              <span>John Ferki</span>
            </div>
            <div className="mt-3">
              <i className="ki-filled ki-address-book me-2"></i>
              <b>Phone No </b>
              <span>08871555511</span>
            </div>
            <div className="mt-3">
              <i className="ki-filled ki-address-book me-2"></i>
              <b>Email : </b>
              <span>Abc@gmail.com</span>
            </div>
            <div className="mt-3">
              <i className="ki-filled ki-ship me-2"></i>
              <b>Date of Birth : </b>
              <span>----</span>
            </div>
            <div className="mt-3">
              <i className="ki-filled ki-ship me-2"></i>
              <b>Date of Anniversary : </b>
              <span>----</span>
            </div>
            <div className="mt-3">
              <i className="ki-filled ki-ship me-2"></i>
              <b>status: </b>
              <span>Active</span>
            </div>
          </div>
          <div className="col-span-2 text-center d-flex justify-content-center align-items-center">
            <div>
              <p>Leads Related to this Contact </p>
            </div>
            <div>
              <div className="filItems relative">
                <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                <input
                  className="input input-sm pl-8"
                  placeholder="Search here"
                  type="text"
                />
              </div>
            </div>
            <div>
              <div className="card grow">
                <div className="card-body lg:pb-7.5">
                  <div className="grid gap-5">
                    {items.map((item, index) => {
                      return renderItem(item, index);
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <AddContact isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <ViewContact isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Fragment>
  );
};
export { ContactDetail };