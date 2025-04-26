import { Fragment, useState } from 'react';
import { toAbsoluteUrl } from '@/utils/Assets';
import { KeenIcon } from '@/components';
import { Container } from '@/components/container';
import AddContact from "@/partials/modals/add-company/AddCompany";

import { Navbar, NavbarActions, NavbarDropdown } from '@/partials/navbar';
import { PageMenu } from '@/pages/public-profile';
const CompanyDetails = () => {
  const image = <div className="flex items-center justify-center rounded-full border-2 border-success-clarity size-[100px] shrink-0 bg-light">
      <img src={toAbsoluteUrl('/media/brand-logos/duolingo.svg')} className="size-[50px]" />
    </div>;

    const [isModalOpen, setIsModalOpen] = useState(false);

    
      const handleModalOpen = () => {
        setIsModalOpen(true);
      };
    

const items = [{
    logo: '300-2.png',
    name: 'Jason Tatum',
    email: 'jasontatum21@gmail.com',
    mobile:'9087676588',
    label: false
  }, {
    logo: '300-2.png',
    name: 'Jason Tatum',
    email: 'jasontatum21@gmail.com',
    mobile:'9087676588',
    label: false
  }, {
    logo: '300-2.png',
    name: 'Jason Tatum',
    email: 'jasontatum21@gmail.com',
    mobile:'9087676588',
    label: false
  }];
  const renderItem = (item, index) => {
    return <div key={index} className="flex items-center justify-between border border-gray-200 rounded-xl gap-2 px-4 py-4 bg-secondary-clarity">
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
          <a href="#" className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px">
              {item.mobile}
            </a>
        </div>
        <div className="flex items-center gap-5">
          {item.label && <span className="badge badge-sm badge-success badge-outline">Primary</span>}
          <div className="flex gap-0.5">
            <div className="btn btn-sm btn-icon btn-clear btn-info">
              <KeenIcon icon="notepad-edit" />
            </div>
            <div className="btn btn-sm btn-icon btn-clear btn-danger">
              <KeenIcon icon="trash" />
            </div>
          </div>
        </div>
      </div>;
  };
      
      
  return <Fragment>
      

      <Container>
        <Navbar>
          <PageMenu />
          

          <NavbarActions>
            <button type="button" onClick={handleModalOpen} className="btn btn-sm border border-dark">
                <i className="ki-filled ki-notepad-edit text-info"></i> Edit Company
            </button>
             <button type="button" className="btn btn-sm border border-dark">
              <i className="ki-filled ki-trash text-danger"></i> Delete Company
            </button>
            
            
          </NavbarActions>
          
        </Navbar>
      </Container>

      <Container>
       <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5'>
            <div className='col-span-1'>
                <h6 className='fw-bold border-end'><b>Company Details</b></h6>
                <div className='mt-5'>
                    <i className="ki-filled ki-user me-2"></i><b>Company Name : </b><span>John Ferki</span>
                </div>
                <div className='mt-3'>
                    <i className="ki-filled ki-address-book me-2"></i><b>Loaction : </b><span>Frank,Italy</span>
                </div>
                <div className='mt-3'>
                    <i className="ki-filled ki-address-book me-2"></i><b>Address : </b><span>'ABS', Corps ferli Cab</span>
                </div>
                <div className='mt-3'>
                    <i className="ki-filled ki-ship me-2"></i><b>Shipping Address : </b><span>----</span>
                </div>
            </div>
            <div className='col-span-2 text-center d-flex justify-content-center align-items-center'>
              <div>
                <p>
                  Contact Related to Company
                </p>
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
    </Fragment>;
};
export { CompanyDetails };