import { Fragment, useState, useEffect, useCallback } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import useStyles from "./style";
import DishCostingModal from "./CostingSidebar/DishCostingModal";
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
  const [functionType, setFunctionType] = useState("Dinner");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuReportEventId, setMenuReportEventId] = useState(null);
  const [isMenuReport, setIsMenuReport] = useState(false);
  const [isSelectMenureport, setIsSelectMenuReport] = useState(false);

  const openMenuReport = (eventId) => {
    setMenuReportEventId(eventId);
    setIsMenuReport(true);
  };

  const openSelectMenureport = useCallback(() => {
    setMenuReportEventId(eventId);
    setIsSelectMenuReport(true);
  });
  const grandTotal =
    (dishCostingData?.rawmaterialcharge || 0) +
    (dishCostingData?.outsideagencycharge || 0) +
    (dishCostingData?.extraexpensecharge || 0);

  const intl = useIntl();

  const chargesData = [
    {
      label: (
        <FormattedMessage
          id="COMMON.CHEF_LABOUR_CHARGES"
          defaultMessage="Total Raw Material Charges"
        />
      ),
      value: dishCostingData?.rawmaterialcharge
        ? Number(dishCostingData.rawmaterialcharge).toLocaleString()
        : "0.00",
    },
    {
      label: (
        <FormattedMessage
          id="COMMON.LABOUR_CHARGES"
          defaultMessage="Total Agency Charges"
        />
      ),
      value: dishCostingData?.outsideagencycharge
        ? Number(dishCostingData.outsideagencycharge).toLocaleString()
        : "0.00",
    },

    {
      label: (
        <FormattedMessage
          id="COMMON.EXTRA_EXPENSES_CHARGES"
          defaultMessage="Total Extra Expense"
        />
      ),
      value: dishCostingData?.extraexpensecharge
        ? Number(dishCostingData.extraexpensecharge).toLocaleString()
        : "0.00",
    },
  ];

  const handleRawMaterialClick = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const res = await GetEventMasterById(eventId);
        console.log("🔍 API Response:", res.data.data);

        if (res?.data?.data?.["Event Details"]?.length > 0) {
          const event = res.data.data["Event Details"][0];
          setEventData(event);

          const partyName = event?.party?.nameEnglish || "-";
          const eventType = event?.eventType?.nameEnglish || "-";
          const venue = event?.venue || "-";
          const eventDateTime = event?.eventStartDateTime || "-";
          const totalFunctions = event?.eventFunctions?.length || 0;
          const totalPax = event?.eventFunctions?.reduce(
            (sum, func) => sum + (func.pax || 0),
            0
          );

          if (event?.eventFunctions?.length > 0) {
            setActiveTab(event.eventFunctions[0].function?.nameEnglish);
            setSelectedFunctionPax(event.eventFunctions[0].pax || 0);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEventData();
  }, [eventId]);

  useEffect(() => {
    const fetchDishCosting = async () => {
      if (!eventId || !selectedFunctionId) return;

      try {
        const res = await GetDishCostingByEventFunction(
          eventId,
          selectedFunctionId
        );
        console.log("Dish Costing API Response:", res.data);

        // Extract the 'data' object from the API response
        setDishCostingData(res.data.data);
      } catch (err) {
        console.error("Error fetching dish costing:", err);
      }
    };

    fetchDishCosting();
  }, [eventId, selectedFunctionId]);

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
              <button
                className={`text-sm px-3 py-2 rounded-md transition ${
                  viewType === "Total Wise"
                    ? "bg-[#005BA8] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setViewType("Total Wise")}
                title="Total Wise"
              >
                Total Wise
              </button>

              {/* Function-wise button */}
              <button
                className={`text-sm px-3 py-2 rounded-md transition ${
                  viewType === "Function Wise"
                    ? "bg-[#005BA8] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setViewType("Function Wise")}
                title="Function Wise"
              >
                Function Wise
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-[300px] flex gap-2 my-5 overflow-x-auto">
          {eventData?.eventFunctions?.length > 0 ? (
            eventData.eventFunctions.map((func, index) => {
              const funcName =
                func.function?.nameEnglish || `Function ${index + 1}`;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setFunctionType(funcName); // highlight tab
                    setSelectedFunctionPax(func.pax || 0); // set pax
                    setSelectedFunctionId(func.id); // ✅ set function ID for API
                  }}
                  className={`flex-1 btn btn-sm p-5 whitespace-nowrap ${
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

        {/* Date, Time, and Person Info */}
        <div className="card mb-5">
          <div className="card-body p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span>
                  <i className="ki-filled ki-users text-primary"></i>
                </span>
                <span className="text-2sm font-medium text-gray-700">
                  <FormattedMessage
                    id="COMMON.PERSON"
                    defaultMessage="Person"
                  />
                </span>
                <span className="text-sm font-semibold bg-gray-300 rounded-md px-3 py-1">
                  {selectedFunctionPax || "-"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={openSelectMenureport}
                  className="btn btn-light btn-sm"
                >
                  <i className="ki-filled ki-document"></i>{" "}
                  <FormattedMessage
                    id="COMMON.REPORT"
                    defaultMessage="Report"
                  />
                </button>
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
                onClick={handleRawMaterialClick}
                className="bg-white-50 rounded-lg p-5 border border-blue-100 relative cursor-pointer hover:shadow-lg transition-shadow"
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
                  ₹{" "}
                  {Number(
                    dishCostingData?.rawmaterialcharge || 0
                  ).toLocaleString()}
                </div>
              </div>

              {/* Total Agency Charges */}
              <div className="bg-white-50 rounded-lg p-5 border border-green-100 relative">
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
                  ₹{" "}
                  {Number(
                    dishCostingData?.outsideagencycharge || 0
                  ).toLocaleString()}
                </div>
              </div>

              {/* Total General Fix Charges */}
              <div className="bg-white-50 rounded-lg p-5 border border-purple-100 relative">
                <div className="absolute top-4 right-4 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ki-filled ki-setting-2 text-purple-600 text-xl"></i>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <FormattedMessage
                    id="COMMON.TOTAL_GENERAL_FIX_CHARGES"
                    defaultMessage="
                    Total Extra Expense"
                  />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  ₹{" "}
                  {Number(
                    dishCostingData?.extraexpensecharge || 0
                  ).toLocaleString()}
                </div>
              </div>

              {/* Total Crockery Charges */}
              {/* <div className="bg-white-50 rounded-lg p-5 border border-orange-100 relative">
                <div className="absolute top-4 right-4 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="ki-filled ki-coffee text-orange-600 text-xl"></i>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <FormattedMessage
                    id="COMMON.TOTAL_CROCKERY_CHARGES"
                    defaultMessage="Total Crockery Charges"
                  />
                </div>
                <div className="text-3xl font-bold text-gray-900">₹ 0.00</div>
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
                  ₹{" "}
                  {(
                    Number(dishCostingData?.rawmaterialcharge || 0) +
                    Number(dishCostingData?.outsideagencycharge || 0) +
                    Number(dishCostingData?.extraexpensecharge || 0)
                  ).toLocaleString()}
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
                <div className="text-3xl font-bold text-green-500  border-green-600 rounded-md px-3 py-1 inline-block">
                  ₹{" "}
                  {selectedFunctionPax
                    ? (
                        (Number(dishCostingData?.rawmaterialcharge || 0) +
                          Number(dishCostingData?.outsideagencycharge || 0) +
                          Number(dishCostingData?.extraexpensecharge || 0)) /
                        selectedFunctionPax
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
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
        <SelectMenureport
          isSelectMenureport={isSelectMenureport}
          setIsSelectMenuReport={setIsSelectMenuReport}
          onConfirm={() => {
            setIsSelectMenuReport(false);
            setIsMenuReport(true);
            activeFunctionName = { activeFunctionName };
          }}
        />
      </Container>
    </Fragment>
  );
};

export default DishCostingPage;
