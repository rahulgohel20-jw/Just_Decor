import React, { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import useStyles from "./style";
import { DatePicker } from "antd";
import LabourDetailSidebar from "./LabourSidebar/LabourDetailSidebar";

const LabourOtherManagementPage = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState('Dinner');
  const [activeCategory, setActiveCategory] = useState('Labour');
  const [personCount, setPersonCount] = useState(450);
  const [labourRows, setLabourRows] = useState([
    { id: 1, labourType: '', contact: '', shift: '', dateTime: 'Sep 5, 2025', price: '', qty: '', totalPrice: '', place: '' },
    { id: 2, labourType: '', contact: '', shift: '', dateTime: 'Sep 5, 2025', price: '', qty: '', totalPrice: '', place: '' },
    { id: 3, labourType: '', contact: '', shift: '', dateTime: 'Sep 5, 2025', price: '', qty: '', totalPrice: '', place: '' },
    { id: 4, labourType: '', contact: '', shift: '', dateTime: 'Sep 5, 2025', price: '', qty: '', totalPrice: '', place: '' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const LabourDetailView = () => {
    setIsModalOpen(true);
  }

  const addLabourRow = () => {
    const newRow = {
      id: labourRows.length + 1,
      labourType: '',
      contact: '',
      shift: '',
      dateTime: 'Sep 5, 2025',
      price: '',
      qty: '',
      totalPrice: '',
      place: ''
    };
    setLabourRows([...labourRows, newRow]);
  };

  const deleteRow = (id) => {
    setLabourRows(labourRows.filter(row => row.id !== id));
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Labour/Other Management" }]} />
        </div>

        {/* Header Section */}
        <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-7">
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Party Name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      Rahul Gohel
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-user text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Event name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      Opening Ceremony
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-geolocation-home text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Function name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      Lunch
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Event Venue</span>
                    <span className="text-sm font-medium text-gray-900">
                      Ahmedabad
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Event Date & Time</span>
                    <span className="text-sm font-medium text-gray-900">
                      12/12/2025 10:00PM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-end gap-2">
              {/* <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#20c964] text-white shadow hover:brightness-95"
                title="Share on WhatsApp"
                onClick={() => setIsWhatsAppSidebar(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current"
                >
                  <path d="M20.52 3.48A11.92 11.92 0 0 0 12.04 0C5.44.03.16 5.32.16 11.93c0 2.1.55 4.14 1.6 5.95L0 24l6.29-1.73a11.9 11.9 0 0 0 5.75 1.48h.01c6.59 0 11.86-5.28 11.89-11.88a11.87 11.87 0 0 0-3.42-8.39ZM12.05 21.2h-.01a9.27 9.27 0 0 1-4.73-1.29l-.34-.2-3.73 1.03 1-3.64-.22-.37A9.25 9.25 0 0 1 2.78 11.9c0-5.11 4.16-9.28 9.29-9.3 2.48 0 4.81.97 6.56 2.72a9.26 9.26 0 0 1 2.72 6.56c-.02 5.12-4.18 9.3-9.3 9.31Zm5.32-6.93c-.29-.15-1.7-.84-1.96-.94-.26-.09-.45-.15-.65.15-.2.29-.74.94-.91 1.13-.17.19-.34.21-.63.08-.29-.14-1.2-.44-2.29-1.41-.85-.76-1.43-1.7-1.6-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.09-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.24-.58-.48-.5-.65-.5l-.56-.01c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.14.19 2 3.06 4.85 4.29.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.11.55-.08 1.7-.7 1.94-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34Z" />
                </svg>
              </button> */}
              <button className="btn btn-sm btn-danger" title="Delete">
                Delete
              </button>
              <button className="btn btn-sm btn-primary" title="Save">
                Save
              </button>
              
              
            </div>
          </div>
        </div>

        <div className="card mb-5">
          <div className="card-body p-0">
            <div className="flex">
              {['Dinner', 'Lunch', 'Hi-Tea'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

      
        <div className="card mb-5">
          <div className="card-body p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span><i className="ki-filled ki-users text-primary"></i></span>
                <span className="text-2sm font-medium text-gray-700">Person</span>
                <span className="text-sm font-semibold bg-gray-300 rounded-md px-3 py-1">{personCount}</span>
                {/* <input
                  type="text"
                  placeholder="Enter Percentage"
                  className="input input-sm"
                  style={{ width: '180px' }}
                />
                <button className="btn btn-primary btn-sm">
                  Update Count
                </button> */}
              </div>
              <div className="flex items-center gap-3">
                
                <button className="btn btn-light btn-sm">
                  <i className="ki-filled ki-document"></i> Report
                </button>
                <button className="btn btn-light btn-sm">
                  <i className="ki-filled ki-document"></i> 
                  Checklist
                </button>
                <div className="relative ms-5">
                  <input
                    type="text"
                    placeholder="Search items..."
                    className="input input-sm "
                    style={{ width: '300px' }}
                  />
                  
                </div>
              </div>
            </div>
          </div>
        </div>

       
        <div className="card mb-5">
          <div className="card-body p-3">
            <div className="flex gap-2">
              {['Labour', ].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`btn btn-md ${
                    activeCategory === category
                      ? 'btn-primary'
                      : 'btn-light'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

       
        <div className="card">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-auto w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-center px-3 py-3" style={{ width: '50px' }}>#</th>
                    <th className="px-3 py-3" style={{ minWidth: '140px' }}>Labour Type</th>
                    <th className="px-3 py-3" style={{ minWidth: '140px' }}>Contact</th>
                    <th className="px-3 py-3" style={{ minWidth: '140px' }}>Labour Sift</th>
                    <th className="px-3 py-3" style={{ minWidth: '140px' }}>Date & Time</th>
                    <th className="px-3 py-3" style={{ minWidth: '130px' }}>Price</th>
                    <th className="px-3 py-3" style={{ minWidth: '100px' }}>Qty</th>
                    <th className="px-3 py-3" style={{ minWidth: '130px' }}>Total Price</th>
                    <th className="px-3 py-3" style={{ minWidth: '130px' }}>Place</th>
                    <th className="text-center px-3 py-3" style={{ width: '130px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {labourRows.map((row, index) => (
                    <tr key={row.id} className="border-t">
                      <td className="text-center px-3 py-2">{index + 1}.</td>
                      <td className="px-3 py-2">
                        <select className="select select-sm w-full">
                          <option>Input Type</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <select className="select select-sm w-full">
                          <option>Input Type</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <select className="select select-sm w-full">
                          <option>Input Type</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <DatePicker className=" input input-sm" />
                          
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <select className="select select-sm w-full">
                          <option>Input Type</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <select className="select select-sm w-full">
                          <option>Input Type</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <select className="select select-sm w-full">
                          <option>Input Type</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <select className="select select-sm w-full">
                          <option>Input Type</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-1">
                          <button className="btn btn-sm btn-icon btn-clear " onClick={LabourDetailView}>
    <i className="ki-filled ki-eye text-success "></i>
  </button>
  
  <button className="btn btn-sm btn-icon btn-clear ">
    <i className="ki-filled ki-notepad text-primary "></i>
  </button>
  <button className="btn btn-sm btn-icon btn-clear ">
    <i className="ki-filled ki-whatsapp text-green-600 "></i>
  </button>
  <button 
    onClick={() => deleteRow(row.id)}
    className="btn btn-sm btn-icon btn-clear "
  >
    <i className="ki-filled ki-trash text-danger "></i>
  </button>
</div>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Button */}
            <div className="p-4 border-t">
              <button
                onClick={addLabourRow}
                className="btn btn-primary btn-sm"
              >
                <i className="ki-filled ki-plus"></i>
                Add Another Labour Type
              </button>
            </div>
          </div>
        </div>
        <LabourDetailSidebar
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          
        />
      </Container>
    </Fragment>
  );
};

export default LabourOtherManagementPage;