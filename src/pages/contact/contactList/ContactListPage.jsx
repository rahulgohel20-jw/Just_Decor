import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { KeenIcon } from "@/components";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { columns, defaultData } from "./constant";

const ContactListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
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
              onClick={handleModalOpen}
            >
              <i className="ki-filled ki-notepad-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-icon btn-clear text-danger"
              title="Delete"
            >
              <i className="ki-filled ki-trash"></i>
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
          {/* <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <span className="px-3 bg-gray-100">
              <KeenIcon icon="magnifier" className="text-gray-700 text-xl" />
            </span>
            <input
              className="px-4 py-2 focus:outline-none"
              placeholder="Example input"
              type="text"
            />
          </div> */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleModalOpen}
            >
              + Add Contacts
            </button>
          </div>
        </div>
        <TableComponent columns={columns} data={tableData} />
      </Container>
      <CustomModal open={isModalOpen} onClose={handleModalClose}>
        <div>
          <div
            className="btn-tabs tabs-lg flex justify-between mb-5 w-full"
            data-tabs="true"
          >
            <a
              className="btn btn-clear w-full flex justify-center active"
              data-tab-toggle="true"
              href="#tab_1"
            >
              Contact Details
            </a>
            <a
              className="btn btn-clear w-full flex justify-center"
              data-tab-toggle="true"
              href="#tab_2"
            >
              Address Details
            </a>
            <a
              className="btn btn-clear w-full flex justify-center"
              data-tab-toggle="true"
              href="#tab_3"
            >
              Social Profile
            </a>
            <a
              className="btn btn-clear w-full flex justify-center"
              data-tab-toggle="true"
              href="#tab_4"
            >
              Custom Fields
            </a>
          </div>
          {/* <div className="" id="tab_1">Contact Details</div>
          <div className="" id="tab_2">Address Details</div>
          <div className="" id="tab_3">Social Profile</div>
          <div className="" id="tab_4">Custom Fields</div> */}
        </div>

        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Contact Details
        </h3>
        <div className="flex flex-col gap-2 mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="form-label text-gray-900 flex justify-between items-end mb-1">
                Company Name
                <button
                  className="w-5 h-5 bg-primary rounded-full text-white"
                  title="Add Company"
                >
                  <i className="ki-filled ki-plus text-2xs"></i>
                </button>
              </label>
              <select className="select">
                <option value="1">Select Company</option>
                <option value="2">Company One</option>
                <option value="2">Company Two</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="form-label text-gray-900 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Email address"
                className="input"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="form-label text-gray-900">
                First Name <span className="text-danger">*</span>
              </label>
              <input type="text" placeholder="First name" className="input" />
            </div>
            <div className="flex flex-col">
              <label className="form-label text-gray-900">Last Name</label>
              <input type="text" placeholder="Last name" className="input" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="form-label text-gray-900">Country</label>
              <select className="select">
                <option value="1">Select Country</option>
                <option value="2">Country One</option>
                <option value="2">Country Two</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="form-label text-gray-900">
                Whatspp Number<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="WhatsApp number"
                className="input"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="form-label text-gray-900">Country</label>
              <select className="select">
                <option value="1">Select Country</option>
                <option value="2">Country One</option>
                <option value="2">Country Two</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="form-label text-gray-900">
                Whatspp Number<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="WhatsApp number"
                className="input"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="form-label text-gray-900">Date of Birth</label>
              <div className="input">
                <input placeholder="DD MM YYYY" type="text" value="" />
                <span>
                  <i className="ki-filled ki-calendar"></i>
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="form-label text-gray-900">
                Date of Anniversary
              </label>
              <div className="input">
                <input placeholder="DD MM YYYY" type="text" value="" />
                <span>
                  <i className="ki-filled ki-calendar"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Address Details
        </h3>
        <div className="flex flex-col gap-2 mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="form-label text-gray-900">
                State
              </label>
              <input type="text" placeholder="state" className="input" />
            </div>
            <div className="flex flex-col">
              <label className="form-label text-gray-900">City</label>
              <input type="text" placeholder="city" className="input" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="form-label text-gray-900">
                Pincode
              </label>
              <input type="text" placeholder="pincode" className="input" />
            </div>
            <div className="flex flex-col">
              <label className="form-label text-gray-900">Address</label>
              <input type="text" placeholder="address" className="input" />
            </div>
          </div>
        </div>

        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Social Profile
        </h3>
        <div className="flex flex-col gap-2 mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="form-label text-gray-900">Linkedin</label>
              <input type="text" placeholder="Enter Linkedin url" className="input" />
            </div>
            <div className="flex flex-col">
              <label className="form-label text-gray-900">Twitter</label>
              <input type="text" placeholder="Enter Twitter url" className="input" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="form-label text-gray-900">YouTube</label>
              <input type="text" placeholder="Enter YouTube url" className="input" />
            </div>
            <div className="flex flex-col">
              <label className="form-label text-gray-900">Facebook</label>
              <input type="text" placeholder="Enter Facebook url" className="input" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="form-label text-gray-900">Instagram</label>
              <input type="text" placeholder="Enter Instagram url" className="input" />
            </div>
          </div>
        </div>

        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Custom Fields
          <button className="w-5 h-5 bg-primary rounded-full text-white ms-1" title="Add Custom Fields"><i className="ki-filled ki-plus text-2xs"></i></button>
        </h3>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
             
            </div>
            <div className="flex flex-col">
            
            </div>
          </div>
        </div>
      </CustomModal>
    </Fragment>
  );
};
export { ContactListPage };
