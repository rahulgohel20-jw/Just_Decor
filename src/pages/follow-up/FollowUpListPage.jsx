import { Fragment, useState } from "react";
import { toAbsoluteUrl } from '@/utils/Assets';
import { KeenIcon } from "@/components";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Confirmation } from "@/components/confirmation/confirmation";
import  AddFollowUp from "@/partials/modals/add-follow-up/AddFollowUp";

const FollowUpListPage = () => {
    const image = <div className="flex items-center justify-center rounded-full border-2 border-success-clarity size-[100px] shrink-0 bg-light">
          <img src={toAbsoluteUrl('/media/brand-logos/duolingo.svg')} className="size-[50px]" />
        </div>;
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

  const items = [{
    logo: '300-2.png',
    name: 'Jason Tatum',
    email: 'jasontatum21@gmail.com',
    mobile:'9087676588',
    status:"Open",
    type:"Call",
    date_of_followup:"2023-10-01 05:45 PM",
    assigned_to:"John Doe",
    label: false
  }];
  const renderItem = (item, index) => {
    return <div key={index} className="flex items-center justify-between border border-gray-200 rounded-xl gap-2 px-4 py-4 bg-secondary-clarity">
        
        <div className="flex flex-col">
            <div className="flex flex-row">

            <span  className="text-sm font-medium hover:text-primary-active mb-px">
              Status:{item.status}
            </span>
            <span  className="text-sm font-medium hover:text-primary-active ms-2 mb-px">
              Type:{item.type}
            </span>
            </div>
            <div className="ms-2 flex flex-row">
            <span  className="text-sm font-medium hover:text-primary-active mb-px">
              {item.date_of_followup}
            </span>
            
            </div>
            <div className="ms-2 flex flex-row">
                <span  className="text-sm font-medium hover:text-primary-active mb-px">
                <KeenIcon icon="user" />{item.name}
                </span>
                <span  className="text-sm font-medium text-gray ms-2 hover:text-primary-active mb-px">
                <KeenIcon icon="call" />{item.mobile}
            </span>
            
            </div>
          </div>
        <div className="flex items-center rounded-circle gap-3.5">
          <img src={toAbsoluteUrl(`/media/avatars/${item.logo}`)} className="w-10 shrink-0" alt="" />

          <div className="flex flex-col">
            <a href="#" className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px">
              {item.name}
            </a>
            <span className="text-2sm text-gray-700">{item.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          
        </div>
        <div className="flex items-center gap-5">
          {item.label && <span className="badge badge-sm badge-success badge-outline">Primary</span>}
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
              <i class="ki-outline ki-bookmark fs-2x">
  
            </i>
            </div>
          </div>
        </div>
      </div>;
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Follow-Up" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-center gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            
            <div className="filItems">
              <select className="select pe-7.5">
                <option value="0">Assigned To</option>
                <option value="1">John Doe</option>
                <option value="2">Hen Mark</option>
                <option value="3">Ken Folk</option>
                <option value="4">Jimmy Bar</option>
              </select>
            </div>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search here"
                type="text"
              />
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Export">
                <i className="ki-filled ki-clear"></i> Clear
              </button>
            </div>
            
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={handleModalOpen}
              title="Add Contact"
            >
              <i className="ki-filled ki-plus"></i> Add Follow-Up
            </button>
          </div>
          </div>
          
        </div>
        <div className="filters flex flex-wrap items-center justify-center gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            
            <div className="filItems">
              <button className="btn btn-light" title="Export">
                 Today
              </button>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Export">
                 Yesterday
              </button>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Export">
                 This Week
              </button>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Export">
                 This Month
              </button>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Export">
                 Last Month
              </button>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Export">
                 All Time
              </button>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Export">
                 Custom
              </button>
            </div>
            
            
          </div>
          
        </div>
        <div className="filters flex flex-wrap items-center justify-center gap-2 my-5 py-5">
          <div className="flex flex-wrap items-center gap-2">
            
            <div className="filItems">
              <button className="btn btn-light" title="Export">
                 All
              </button>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Export">
                 Overdue
              </button>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Export">
                 Open
              </button>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Export">
                 Closed
              </button>
            </div>
            
            
            
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
