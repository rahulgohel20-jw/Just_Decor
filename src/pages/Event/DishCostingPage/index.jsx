import React, { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import useStyles from "./style";
import DishCostingModal from "./CostingSidebar/DishCostingModal";
import { FormattedMessage, useIntl } from "react-intl";
import MenuReport from "@/partials/modals/menu-report/MenuReport";


const DishCostingPage = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState('Function Wise');
  const [viewType, setViewType] = useState('Function Wise');
  const [functionType, setFunctionType] = useState('Dinner');
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [menuReportEventId, setMenuReportEventId] = useState(null);
      const [isMenuReport, setIsMenuReport] = useState(false);

 const openMenuReport = (eventId) => {
    setMenuReportEventId(eventId);
    setIsMenuReport(true);
  };

  const intl = useIntl();

  const chargesData = [
  { 
    label: <FormattedMessage id="COMMON.CHEF_LABOUR_CHARGES" defaultMessage="Chef Labour Charges" />, 
    value: "0.00" 
  },
  { 
    label: <FormattedMessage id="COMMON.LABOUR_CHARGES" defaultMessage="Labour Charges" />, 
    value: "0.00" 
  },
  { 
    label: <FormattedMessage id="COMMON.OUTSIDE_AGENCY_CHARGES" defaultMessage="Outside Agency Charges" />, 
    value: "240.00" 
  },
  { 
    label: <FormattedMessage id="COMMON.EXTRA_EXPENSES_CHARGES" defaultMessage="Extra Expenses Charges" />, 
    value: "0.00" 
  },
  { 
    label: <FormattedMessage id="COMMON.CHEF_LABOUR_CHARGES" defaultMessage="Chef Labour Charges" />, 
    value: "0.00" 
  },
];

   const handleRawMaterialClick = () => {
    setIsModalOpen(true);
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs
  items={[
    {
      title: intl.formatMessage({
        id: "COMMON.DISH_COSTING",
        defaultMessage: "Dish Costing",
      }),
    },
  ]}
/>

        </div>

        {/* Customer Selection and View Type */}
        <div className="card mb-5">
          <div className="card-body">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-2sm font-medium text-gray-700 mb-2">
                  <FormattedMessage id="COMMON.CUSTOMER_NAME" defaultMessage="Customer Name" />

                </label>
                <select className="select w-full">
                  <option>1811 - SHREE BRIJBHOG TEASING DEMO - GET TOGATHER -</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-2sm font-medium text-gray-700 mb-2">
                  <FormattedMessage id="COMMON.VIEW_TYPE" defaultMessage="View Type" />

                </label>
              <div className="mb-5">
  <div className="flex items-center justify-between">
    {/* Tabs */}
    <div className="flex gap-2">
      {['Function Wise', 'Total Wise'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-2 text-sm font-medium transition-colors rounded-lg shadow-sm ${
            activeTab === tab
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Add Button */}
    <button onClick={openMenuReport} 
                className="bg-[#05B723] text-white text-sm px-3 py-2 rounded-md transition"
    >
      Report
    </button>
  </div>
</div>


              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-[500px] flex gap-2 my-5">
                  <button
                    onClick={() => setFunctionType('Dinner')}
                    className={`flex-1 btn btn-sm p-5 ${
                      functionType === 'Dinner'
                        ? 'btn-primary'
                        : 'btn-light'
                    }`}
                  >
                    Dinner
                  </button>
                  <button
                    onClick={() => setFunctionType('Lunch')}
                    className={`flex-1 btn btn-sm p-5 ${
                      functionType === 'Lunch'
                        ? 'btn-primary'
                        : 'btn-light'
                    }`}
                  >
                    Lunch
                  </button>
                  <button
                    onClick={() => setFunctionType('Hi-Tea')}
                    className={`flex-1 btn btn-sm p-5 ${
                      functionType === 'Hi-Tea'
                        ? 'btn-primary'
                        : 'btn-light'
                    }`}
                  >
                    Hi-Tea
                  </button>
                </div>

        {/* Date, Time, and Person Info */}
        <div className="card mb-5">
          <div className="card-body">
            <div className="flex items-center gap-12">
              <div>
                <label className="block text-2sm text-gray-800 font-bold mb-1"><FormattedMessage id="COMMON.DATE_AND_TIME" defaultMessage="Date and Time" />
</label>
                <div className="flex gap-4">
                  <div className="flex gap-1">

                  <span className="text-sm font-bold"><FormattedMessage id="COMMON.FROM" defaultMessage="From" /></span>
                  <span className="text-sm font-medium">02.10.2025 04:00 PM</span>
                  </div>
                  <span className="text-sm font-bold"><FormattedMessage id="COMMON.TO" defaultMessage="To" /></span>
                  <div className="flex gap-1">

                  <span className="text-sm font-medium">29.09.2025 11:00 PM</span>
                  </div>
                  
                </div>
              </div>
              <div className="">
                
                  <label className="block text-2sm text-gray-800 font-bold mb-1"><FormattedMessage id="COMMON.PERSON" defaultMessage="Person" /></label>
                  <span className="text-sm font-medium">450</span>
                  </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-5">
          {/* Charges Breakdown - Left Side */}
          <div className="col-span-4">
            <div className="card">
              <div className="card-body">
                <h2 className="text-lg font-bold text-gray-900 mb-4"><FormattedMessage id="COMMON.CHARGES_BREAKDOWN" defaultMessage="Charges Breakdown" />
</h2>
                <div className="space-y-3">
                  {chargesData.map((charge, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-700">{charge.label}</span>
                      <span className="text-sm font-medium text-gray-900">₹ {charge.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900"><FormattedMessage id="PRICE" defaultMessage="Price" /></span>
                    <span className="text-base font-bold text-gray-900">₹ 240.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Summary Cards */}
          <div className="col-span-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Total Raw Material Charges */}
              <div 
                onClick={handleRawMaterialClick}
                className="bg-white-50 rounded-lg p-5 border border-blue-100 relative cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="absolute top-4 right-4 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ki-filled ki-cube-2 text-blue-600 text-xl"></i>
                </div>
                <div className="text-sm text-gray-600 mb-2"><FormattedMessage
  id="COMMON.TOTAL_RAW_MATERIAL_CHARGES"
  defaultMessage="Total Raw Material Charges"
/>
</div>
                <div className="text-3xl font-bold text-gray-900 border-blue-600 rounded-md px-3 py-1 inline-block">
                  ₹ 2,297,537.00
                </div>
              </div>

              {/* Total Agency Charges */}
              <div className="bg-white-50 rounded-lg p-5 border border-green-100 relative">
                <div className="absolute top-4 right-4 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ki-filled ki-people text-green-600 text-xl"></i>
                </div>
                <div className="text-sm text-gray-600 mb-2"><FormattedMessage
  id="COMMON.TOTAL_AGENCY_CHARGES"
  defaultMessage="Total Agency Charges"
/>
</div>
                <div className="text-3xl font-bold text-gray-900">₹ 240.00</div>
              </div>

              {/* Total General Fix Charges */}
              <div className="bg-white-50 rounded-lg p-5 border border-purple-100 relative">
                <div className="absolute top-4 right-4 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ki-filled ki-setting-2 text-purple-600 text-xl"></i>
                </div>
                <div className="text-sm text-gray-600 mb-2"><FormattedMessage
  id="COMMON.TOTAL_GENERAL_FIX_CHARGES"
  defaultMessage="Total General Fix Charges"
/>
</div>
                <div className="text-3xl font-bold text-gray-900">₹ 1,497.00</div>
              </div>

              {/* Total Crockery Charges */}
              <div className="bg-white-50 rounded-lg p-5 border border-orange-100 relative">
                <div className="absolute top-4 right-4 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="ki-filled ki-coffee text-orange-600 text-xl"></i>
                </div>
                <div className="text-sm text-gray-600 mb-2"><FormattedMessage
  id="COMMON.TOTAL_CROCKERY_CHARGES"
  defaultMessage="Total Crockery Charges"
/>
</div>
                <div className="text-3xl font-bold text-gray-900">₹ 0.00</div>
              </div>
            </div>

            {/* Bottom Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Grand Total */}
              <div className="bg-blue-100 border-s-[6px] rounded-lg p-5 border-2 border-blue-500">
                <div className="text-base font-bold text-blue-600 mb-2"><FormattedMessage id="COMMON.GRAND_TOTAL" defaultMessage="Grand Total" />
</div>
                <div className="text-3xl font-bold text-blue-500">₹ 2,299,274.00</div>
              </div>

              {/* Dish Costing */}
              <div className="bg-green-100 border-s-[6px] rounded-lg p-5 border-2 border-green-500 relative">
                <div className="text-base font-semibold text-green-600 mb-2"><FormattedMessage id="COMMON.DISH_COSTING" defaultMessage="Dish Costing" />
</div>
                <div className="text-3xl font-bold text-green-500  border-green-600 rounded-md px-3 py-1 inline-block">
                  ₹ 11,496.00
                </div>
                
              </div>
            </div>
          </div>
        </div>
        <DishCostingModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  viewType={viewType}
/>
  <MenuReport
                          isModalOpen={isMenuReport}
                          setIsModalOpen={setIsMenuReport}
                          eventId={menuReportEventId}
                        />

      </Container>
    </Fragment>
  );
};

export default DishCostingPage;