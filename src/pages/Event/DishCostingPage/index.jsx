import { Fragment, useState, useEffect, useCallback } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import useStyles from "./style";
import DishCostingModal from "./CostingSidebar/DishCostingModal";
import TotalAgencySidebar from "./CostingSidebar/TotalAgencySidebar";
import { FormattedMessage, useIntl } from "react-intl";
import MenuReport from "@/partials/modals/menu-report/MenuReport";
import { useParams } from "react-router-dom";
import {
  GetEventMasterById,
  GetDishCostingByEventFunction,
} from "@/services/apiServices";
import SelectMenureport from "../../../partials/modals/menu-report/SelectMenureport";

const DishCostingPage = () => {
  const classes = useStyles();
  const [eventData, setEventData] = useState(null);
  const [selectedFunctionPax, setSelectedFunctionPax] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dishCostingData, setDishCostingData] = useState(null);
  const [selectedFunctionId, setSelectedFunctionId] = useState(null);
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState("Function Wise");
  const [viewType, setViewType] = useState("Function Wise");
  const [functionType, setFunctionType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuReportEventId, setMenuReportEventId] = useState(null);
  const [isMenuReport, setIsMenuReport] = useState(false);
  const [isSelectMenureport, setIsSelectMenuReport] = useState(false);
  const [allFunctionWiseCosting, setAllFunctionWiseCosting] = useState([]);
  const [agencySidebar, setAgencySidebar] = useState(false);

  const handleTotalWiseClick = () => {
    setViewType("Total Wise");

    // 🔥 IMPORTANT: clear function selection
    setSelectedFunctionId(null);
    setFunctionType("");
    setSelectedFunctionPax(0);
  };

  const openMenuReport = (eventId) => {
    setMenuReportEventId(eventId);
    setIsMenuReport(true);
  };

  const openSelectMenureport = useCallback(() => {
    setMenuReportEventId(eventId);
    setIsSelectMenuReport(true);
  }, [eventId]);

  const intl = useIntl();
  const isTotal = viewType === "Total Wise";

  const totalPax = isTotal
    ? allFunctionWiseCosting.reduce((sum, f) => sum + (f.pax || 0), 0)
    : selectedFunctionPax;

  const totalRaw = isTotal
    ? allFunctionWiseCosting.reduce((sum, f) => sum + Number(f.raw || 0), 0)
    : Number(dishCostingData?.rawmaterialcharge || 0);

  const totalAgency = isTotal
    ? allFunctionWiseCosting.reduce((sum, f) => sum + Number(f.agency || 0), 0)
    : Number(dishCostingData?.cheflaborcharge || 0) +
      Number(dishCostingData?.laborcharge || 0) +
      Number(dishCostingData?.outsideagencycharge || 0);

  const totalExtra = isTotal
    ? allFunctionWiseCosting.reduce((sum, f) => sum + Number(f.extra || 0), 0)
    : Number(dishCostingData?.extraexpensecharge || 0);

  const grandTotalComputed = totalRaw + totalAgency + totalExtra;

  const perPersonCost = totalPax
    ? (grandTotalComputed / totalPax).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

  const chargesData = [
    {
      label: (
        <FormattedMessage
          id="COMMON.CHEF_LABOUR_CHARGES"
          defaultMessage="Total Raw Material Charges"
        />
      ),
      value: totalRaw.toLocaleString(),
    },
    {
      label: (
        <FormattedMessage
          id="COMMON.LABOUR_CHARGES"
          defaultMessage="Total Agency Charges"
        />
      ),
      value: totalAgency.toLocaleString(),
    },
    // {
    //   label: (
    //     <FormattedMessage
    //       id="COMMON.EXTRA_EXPENSES_CHARGES"
    //       defaultMessage="Total Extra Expense"
    //     />
    //   ),
    //   value: totalExtra.toLocaleString(),
    // },
  ];

  const handleRawMaterialClick = () => {
    setIsModalOpen(true);
  };

  const handeAgencySidebarCLick = () => {
    setAgencySidebar(true);
  };

  useEffect(() => {
    if (
      viewType === "Function Wise" &&
      eventData?.eventFunctions?.length > 0 &&
      !selectedFunctionId
    ) {
      const firstFunction = eventData.eventFunctions[0];

      setSelectedFunctionId(firstFunction.id);
      setFunctionType(firstFunction.function?.nameEnglish || "");
      setSelectedFunctionPax(firstFunction.pax || 0);
    }
  }, [viewType, eventData, selectedFunctionId]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const res = await GetEventMasterById(eventId);

        if (res?.data?.data?.["Event Details"]?.length > 0) {
          const event = res.data.data["Event Details"][0];
          setEventData(event);

          // Auto-select first function by default
        }
      } catch (error) {
        console.error("❌ Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEventData();
  }, [eventId]);

  // Fetch all function costing data when eventData is available
  useEffect(() => {
    const fetchAllCosting = async () => {
      if (!eventData?.eventFunctions?.length) return;

      const allData = [];

      for (const func of eventData.eventFunctions) {
        try {
          const res = await GetDishCostingByEventFunction(eventId, func.id);
          const data = res.data.data;

          allData.push({
            eventFunctionId: func.id,
            name: func.function?.nameEnglish,
            pax: func.pax,
            raw: Number(data.rawmaterialcharge || 0),
            agency:
              Number(data.cheflaborcharge || 0) +
              Number(data.laborcharge || 0) +
              Number(data.outsideagencycharge || 0),
            extra: Number(data.extraexpensecharge || 0),
          });
        } catch (err) {
          console.error(`Error fetching costing for ${func.id}`, err);
        }
      }

      setAllFunctionWiseCosting(allData);
    };

    fetchAllCosting();
  }, [eventData, eventId]);

  // Fetch dish costing when a function is selected
  useEffect(() => {
    const fetchDishCosting = async () => {
      if (!eventId || !selectedFunctionId) return;

      try {
        const res = await GetDishCostingByEventFunction(
          eventId,
          selectedFunctionId
        );
        setDishCostingData(res.data.data);
      } catch (err) {
        console.error("Error fetching dish costing:", err);
      }
    };

    fetchDishCosting();
  }, [eventId, selectedFunctionId]);

  const renderFunctionDateTime = () => {
    // TOTAL WISE → show all functions
    if (viewType === "Total Wise") {
      return <div className="flex flex-col gap-1">All Function</div>;
    }

    // FUNCTION WISE → selected function only
    return (
      <span className="text-sm font-semibold text-gray-900">
        {dishCostingData?.eventFunction?.functionStartDateTime || "-"}{" "}
      </span>
    );
  };

  return (
    <Fragment>
      <Container>
        {" "}
        {/* Breadcrumbs */}
        <div className=" pb-2 mb-3">
          <h1 className="text-xl text-gray-900">
            <FormattedMessage
              id="COMMON.DISH_COSTING"
              defaultMessage="Dish Costing"
            />
          </h1>
        </div>
        <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-7">
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">
                      <FormattedMessage
                        id="EVENT_MENU_ALLOCATION.PARTY_NAME"
                        defaultMessage="Party Name: "
                      />
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {eventData?.party?.nameEnglish || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-user text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">
                      <FormattedMessage
                        id="EVENT_MENU_ALLOCATION.EVENT_NAME"
                        defaultMessage="Event Name: "
                      />
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {eventData?.eventType?.nameEnglish || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-geolocation-home text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">
                      <FormattedMessage
                        id="EVENT_MENU_ALLOCATION.FUNCTION_NAME"
                        defaultMessage="Function Name: "
                      />
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {eventData?.eventType?.nameEnglish || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">
                      <FormattedMessage
                        id="EVENT_MENU_ALLOCATION.EVENT_VENUE"
                        defaultMessage="Event Venue: "
                      />
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {eventData?.venue?.nameEnglish || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">
                      <FormattedMessage
                        id="EVENT_MENU_ALLOCATION.EVENT_DATE_TIME"
                        defaultMessage="Event Date & Time:"
                      />
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {eventData?.eventStartDateTime || ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-end gap-2">
              {/* Total-wise button */}
              <div className="relative group">
                <button
                  className={`text-sm px-3 py-2 rounded-md transition ${
                    viewType === "Total Wise"
                      ? "bg-[#005BA8] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={handleTotalWiseClick}
                  title="" // prevent default browser tooltip
                >
                  Total Wise
                </button>

                {/* Tooltip */}
                <div
                  className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                  bg-gray-900 text-white text-xs rounded-md px-3 py-2
                  opacity-0 group-hover:opacity-100 transition-opacity
                  pointer-events-none shadow-lg z-50"
                >
                  Sum of all persons and all charges
                </div>
              </div>

              <div className="relative group">
                <button
                  className={`text-sm px-3 py-2 rounded-md transition ${
                    viewType === "Function Wise"
                      ? "bg-[#005BA8] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setViewType("Function Wise")}
                  title=""
                >
                  Function Wise
                </button>

                {/* Tooltip */}
                <div
                  className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
               bg-gray-900 text-white text-xs rounded-md px-3 py-2
               opacity-0 group-hover:opacity-100 transition-opacity
               pointer-events-none shadow-lg z-50"
                >
                  Shows charges and persons for the <br />
                  selected function
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        {viewType === "Function Wise" && (
          <div className="w-[full] flex gap-2 my-5 overflow-x-auto">
            {eventData?.eventFunctions?.length > 0 ? (
              eventData.eventFunctions.map((func, index) => {
                const funcName =
                  func.function?.nameEnglish || `Function ${index + 1}`;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setFunctionType(funcName);
                      setSelectedFunctionPax(func.pax || 0);
                      setSelectedFunctionId(func.id);
                    }}
                    className={`flex-1 max-w-[200px] btn btn-sm p-5 whitespace-nowrap ${
                      functionType === funcName ? "btn-primary" : "btn-light"
                    }`}
                  >
                    {funcName}
                  </button>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm">No functions found</p>
            )}
          </div>
        )}
        {/* Date, Time, and Person Info */}
        <div className="card mb-5">
          <div className="card-body px-6 py-4">
            <div className="flex items-center gap-10 flex-wrap">
              {/* Event Date & Time */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center mt-1">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">
                    <FormattedMessage
                      id="EVENT_MENU_ALLOCATION.FUNCTION_DATE_TIME"
                      defaultMessage="Function Date & Time"
                    />
                  </span>

                  {renderFunctionDateTime()}
                </div>
              </div>

              {/* Person (Pax) – NEXT TO DATE */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <i className="ki-filled ki-users text-primary"></i>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">
                    <FormattedMessage
                      id="COMMON.PERSON"
                      defaultMessage="Person"
                    />
                  </span>
                  <span className="text-sm font-bold text-gray-900 bg-gray-200 rounded-md px-4 py-1">
                    {totalPax || "-"}
                  </span>
                </div>
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
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  <FormattedMessage
                    id="COMMON.CHARGES_BREAKDOWN"
                    defaultMessage="Charges Breakdown"
                  />
                </h2>
                <div className="space-y-3">
                  {chargesData.map((charge, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <span className="text-sm text-gray-700">
                        {charge.label}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ₹ {charge.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Summary Cards */}
          <div className="col-span-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Total Raw Material Charges */}
              <div
                className="bg-white-50 rounded-lg p-5 border border-blue-100 relative cursor-pointer hover:shadow-lg transition-shadow"
                onClick={handleRawMaterialClick}
              >
                <div className="absolute top-4 right-4 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ki-filled ki-cube-2 text-blue-600 text-xl"></i>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <FormattedMessage
                    id="COMMON.TOTAL_RAW_MATERIAL_CHARGES"
                    defaultMessage="Total Raw Material Charges"
                  />
                </div>
                <div className="text-3xl font-bold text-gray-900 border-blue-600 rounded-md px-3 py-1 inline-block">
                  ₹ {totalRaw.toLocaleString()}
                </div>
              </div>

              {/* Total Agency Charges */}
              <div
                onClick={handeAgencySidebarCLick}
                className="bg-white-50 rounded-lg p-5 border border-green-100 relative"
              >
                <div className="absolute top-4 right-4 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ki-filled ki-people text-green-600 text-xl"></i>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <FormattedMessage
                    id="COMMON.TOTAL_AGENCY_CHARGES"
                    defaultMessage="Total Agency Charges"
                  />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  ₹ {totalAgency.toLocaleString()}
                </div>
              </div>

              {/* Total General Fix Charges
              <div className="bg-white-50 rounded-lg p-5 border border-purple-100 relative">
                <div className="absolute top-4 right-4 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ki-filled ki-setting-2 text-purple-600 text-xl"></i>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <FormattedMessage
                    id="COMMON.TOTAL_GENERAL_FIX_CHARGES"
                    defaultMessage="Total Extra Expense"
                  />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  ₹ {totalExtra.toLocaleString()}
                </div>
              </div> */}
            </div>

            {/* Bottom Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Grand Total */}
              <div className="bg-blue-100 border-s-[6px] rounded-lg p-5 border-2 border-blue-500">
                <div className="text-base font-bold text-blue-600 mb-2">
                  <FormattedMessage
                    id="COMMON.GRAND_TOTAL"
                    defaultMessage="Grand Total"
                  />
                </div>
                <div className="text-3xl font-bold text-blue-500">
                  ₹ {grandTotalComputed.toLocaleString()}
                </div>
              </div>

              {/* Dish Costing */}
              <div className="bg-green-100 border-s-[6px] rounded-lg p-5 border-2 border-green-500 relative">
                <div className="text-base font-semibold text-green-600 mb-2">
                  <FormattedMessage
                    id="COMMON.DISH_COSTING"
                    defaultMessage="Dish Costing"
                  />
                </div>
                <div className="text-3xl font-bold text-green-500 border-green-600 rounded-md px-3 py-1 inline-block">
                  ₹ {perPersonCost}
                </div>
              </div>
            </div>
          </div>
        </div>
        <DishCostingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          viewType={viewType}
          eventId={eventId}
          selectedFunctionId={selectedFunctionId}
        />
        <TotalAgencySidebar
          isOpen={agencySidebar}
          onClose={() => setAgencySidebar(false)}
          viewType={viewType}
          eventId={eventId}
          selectedFunctionId={selectedFunctionId}
          eventData={eventData}
        />
        <MenuReport
          isModalOpen={isMenuReport}
          setIsModalOpen={setIsMenuReport}
          eventId={menuReportEventId}
        />
        <SelectMenureport
          isSelectMenureport={isSelectMenureport}
          setIsSelectMenuReport={setIsSelectMenuReport}
          onConfirm={() => {
            setIsSelectMenuReport(false);
            setIsMenuReport(true);
          }}
        />
      </Container>
    </Fragment>
  );
};

export default DishCostingPage;
