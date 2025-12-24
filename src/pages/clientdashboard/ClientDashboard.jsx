"use client";
import { Fragment, useEffect, useState } from "react";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Container } from "@/components/container";
import Chart from "react-apexcharts";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import { Search, RefreshCcw, Phone } from "lucide-react";
import { invoicecolumns } from "./invoiceconstant";
import { itemcolumns, defaultitemData } from "./itemconstant";
import { toAbsoluteUrl } from "@/utils/Assets";
import VideoTutorial from "@/components/videoTutorial/VideoTutorial";
import { FormattedMessage, useIntl } from "react-intl";
import {
  GetClientwisedashboardata,
  GetClientdashboardpiechart1,
  GetClientdashboardpiechart2,
  GetClientdashboardpiechart3,
  GetClienteventdata,
  GetAllInvoicedatabyfilter,
  Getmostsellingitems,
} from "@/services/apiServices";
import dayjs from "dayjs";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

// debounce function
const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const formatDate = (date) => dayjs(date).format("DD/MM/YYYY");

const ClientDashboard = () => {
  const intl = useIntl();

  const [dashboarddata, setDashboarddata] = useState([]);
  const [salesPiechart, setSalesPiechart] = useState(null);

  // separate periods for each chart
  const [selectedExpensePeriod, setSelectedExpensePeriod] = useState("today");
  const [selectedQuotationPeriod, setSelectedQuotationPeriod] =
    useState("today");
  const [selectedInvoicePeriod, setSelectedInvoicePeriod] = useState("today");

  const [isChartLoading, setIsChartLoading] = useState(false);
  const [customChartDates, setCustomChartDates] = useState({
    expense: null,
    quotation: null,
    invoice: null,
  });

  const [eventData, setEventData] = useState([]);
  const [eventDateRange, setEventDateRange] = useState("today");
  const [customEventDates, setCustomEventDates] = useState(null);
  const [eventSearchInput, setEventSearchInput] = useState("");
  const [eventSearch, setEventSearch] = useState("");

  const [originalData, setOriginalData] = useState([]);
  const [invoiceDateRange, setInvoiceDateRange] = useState("today");
  const [customInvoiceDates, setCustomInvoiceDates] = useState(null);
  const [invoiceSearchInput, setInvoiceSearchInput] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");

  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const userId = localStorage.getItem("userId");
  const [openTutorial, setOpenTutorial] = useState(false);
  const [expensesChartData, setExpensesChartData] = useState(null);
  const [quotationChartData, setQuotationChartData] = useState(null);
  const [invoiceChartData, setInvoiceChartData] = useState(null);

  const [itemData, setItemData] = useState([]);
  const [itemDateRange, setItemDateRange] = useState("today");
  const [customItemDates, setCustomItemDates] = useState(null);
  const [itemSearchInput, setItemSearchInput] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [isItemLoading, setIsItemLoading] = useState(false);

  const getDateRange = (range, custom = null) => {
    const today = dayjs();
    let start, end;

    switch (range) {
      case "today":
        start = end = today;
        break;
      case "week":
        start = today.subtract(7, "day");
        end = today;
        break;
      case "month":
        start = today.startOf("month");
        end = today;
        break;
      case "custom":
        if (!custom || !custom[0] || !custom[1]) {
          const fallback = today;
          start = end = fallback;
        } else {
          start = dayjs(custom[0]);
          end = dayjs(custom[1]);
        }
        break;
      default:
        start = end = today;
    }
    return { startDate: formatDate(start), endDate: formatDate(end) };
  };

  // ---------------- DASHBOARD SUMMARY ----------------
  const fetchdashboarddata = async () => {
    const res = await GetClientwisedashboardata(userId);
    setDashboarddata(res?.data?.data);
  };

  // ---------------- PIE CHART DATA ----------------
  const handlePeriodChange = async (period, type) => {
    setIsChartLoading(true);

    let range;
    if (period === "custom") {
      const selected = customChartDates[type];
      if (!selected || !selected[0] || !selected[1]) {
        setIsChartLoading(false);
        return;
      }
      range = getDateRange("custom", selected);
    } else {
      range = getDateRange(period);
    }

    let res;

    if (type === "expense") {
      res = await GetClientdashboardpiechart1(
        range.startDate,

        userId
      );
      setExpensesChartData(res?.data?.data);
      setSelectedExpensePeriod(period);
    }

    if (type === "quotation") {
      res = await GetClientdashboardpiechart3(
        range.startDate,

        userId
      );
      setQuotationChartData(res?.data?.data);
      setSelectedQuotationPeriod(period);
    }

    if (type === "invoice") {
      res = await GetClientdashboardpiechart2(
        range.startDate,

        userId
      );
      console.log(res?.data?.data);

      setInvoiceChartData(res?.data?.data);
      setSelectedInvoicePeriod(period);
    }

    setIsChartLoading(false);
  };

  // ---------------- EVENTS ----------------
  const fetchEventData = async (range) => {
    setIsLoadingEvents(true);

    const { startDate, endDate } =
      range === "custom"
        ? getDateRange("custom", customEventDates)
        : getDateRange(range);

    const res = await GetClienteventdata(startDate, endDate, userId);
    const list = res?.data?.data || [];

    setEventData(
      list.map((cust, i) => ({
        Invoice: i + 1,
        CustomerName: cust.userFullName,
        Eventname: cust.eventName,
        eventDate: cust.eventStartDateTime,
        Venue: cust.venueName,
        status: cust.status,
      }))
    );
    setIsLoadingEvents(false);
  };

  // ---------------- INVOICES ----------------
  const fetchInvoices = async (range) => {
    const { startDate, endDate } =
      range === "custom"
        ? getDateRange("custom", customInvoiceDates)
        : getDateRange(range);

    const res = await GetAllInvoicedatabyfilter(startDate, endDate, userId);
    const list = res?.data?.data?.["Event Invoice Details"] || [];

    setOriginalData(
      list.map((cust) => ({
        Invoice: cust.invoiceCode,
        CustomerName: cust.event.party.nameEnglish,
        Eventname: cust.event.eventType.nameEnglish,
        eventDate: cust.event.eventStartDateTime,
        Venue: cust.event.venue.nameEnglish,
        BalanceDue: cust.remainingAmount,
      }))
    );
  };

  // ---------------- MOST SELLING ITEMS ----------------
  const fetchMostSelling = async (range) => {
    setIsItemLoading(true);

    const { startDate, endDate } =
      range === "custom"
        ? getDateRange("custom", customItemDates)
        : getDateRange(range);

    try {
      const res = await Getmostsellingitems(endDate, startDate, userId);
      const list = res?.data.data || [];

      setItemData(
        list.map((item, i) => ({
          no: i + 1,
          item: item?.nameEnglish,
          quantity: item?.qtyCurrent,
          selling: item?.statusDirection,
          amount: item?.statusValue,
        }))
      );
      console.log(itemData);
    } catch (error) {
      console.log("Error fetching most selling items:", error);
    }

    setIsItemLoading(false);
  };

  // ---------------- EFFECTS ----------------
  // Initial load
  useEffect(() => {
    fetchdashboarddata();
    // load charts initially with "today"
    handlePeriodChange("today", "expense");
    handlePeriodChange("today", "quotation");
    handlePeriodChange("today", "invoice");
    fetchEventData("today");
    fetchInvoices("today");
    fetchMostSelling("today");
  }, []);

  // debounce search listeners
  useEffect(() => {
    const handler = debounce((v) => setEventSearch(v));
    handler(eventSearchInput);
  }, [eventSearchInput]);

  useEffect(() => {
    const handler = debounce((v) => setInvoiceSearch(v));
    handler(invoiceSearchInput);
  }, [invoiceSearchInput]);

  useEffect(() => {
    const handler = debounce((v) => setItemSearch(v));
    handler(itemSearchInput);
  }, [itemSearchInput]);

  const handleEventCustomApply = () => {
    if (customEventDates) fetchEventData("custom");
  };
  const handleInvoiceCustomApply = () => {
    if (customInvoiceDates) fetchInvoices("custom");
  };

  // 🔥 SEARCH FILTER LOGIC
  const filteredEvents = eventData.filter((d) => {
    const s = eventSearch.toLowerCase();
    return (
      d.CustomerName?.toLowerCase().includes(s) ||
      d.Eventname?.toLowerCase().includes(s)
    );
  });

  const filteredInvoices = originalData.filter((d) => {
    const s = invoiceSearch.toLowerCase();
    return (
      d.CustomerName?.toLowerCase().includes(s) ||
      d.Eventname?.toLowerCase().includes(s)
    );
  });

  // ---------------- CHART CONFIG ----------------
  const expenseChart = {
    series: [
      expensesChartData?.cheflaborcharge || 0,
      expensesChartData?.outsideagencycharge || 0,
      expensesChartData?.laborcharge || 0,
      expensesChartData?.rawmaterialcharge || 0,
      expensesChartData?.extraexpensecharge || 0,
    ],
    options: {
      chart: { type: "donut" },
      plotOptions: {
        pie: {
          donut: { size: "70%" },
        },
      },
      labels: [
        "Chef Labor Charge",
        "Outside Agency Charge",
        "Labor Charge",
        "Rawmaterial Charge",
        "Extra Expense Charge",
      ],
      legend: {
        position: "right",
        horizontalAlign: "center",
        fontSize: "12px",
        markers: { width: 10, height: 10 },
        itemMargin: { horizontal: 10, vertical: 5 },
      },
      dataLabels: { enabled: false },
      colors: ["#3B82F6", "#10B981", "#F97316", "#EF4444", "#8B5CF6"],
      stroke: { width: 2 },
      responsive: [
        {
          breakpoint: 1024,
          options: { chart: { width: "100%" }, legend: { position: "bottom" } },
        },
      ],
    },
  };

  const InvoiceChart = {
    series: [
      invoiceChartData?.totalSales || 0,
      invoiceChartData?.totalSalesPaid || 0,
      invoiceChartData?.totalSalesRemaining || 0,
    ],
    options: {
      chart: { type: "donut", height: 100 },
      labels: ["Total Sales", "Total Paid", "Total Unpaid"],
      legend: { position: "right", fontSize: "13px" },
      dataLabels: { enabled: false },
      colors: ["#3B82F6", "#10B981", "#F97316"],
      stroke: { width: 2 },
      responsive: [
        {
          breakpoint: 1024,
          options: { chart: { width: "100%" }, legend: { position: "bottom" } },
        },
      ],
    },
  };

  const QuotationChart = {
    series: [
      quotationChartData?.totalQuotaion || 0,
      quotationChartData?.totalQuotaionPaid || 0,
      quotationChartData?.totalQuotaionRemaining || 0,
    ],
    options: {
      chart: { type: "donut", height: 100 },
      labels: ["Total Sales", "Total Paid", "Total Unpaid"],
      legend: { position: "right", fontSize: "13px" },
      dataLabels: { enabled: false },
      colors: ["#3B82F6", "#10B981", "#F97316"],
      stroke: { width: 2 },
      responsive: [
        {
          breakpoint: 1024,
          options: { chart: { width: "100%" }, legend: { position: "bottom" } },
        },
      ],
    },
  };

  const ChartLoader = () => (
    <div className="flex items-center justify-center h-[280px] animate-pulse">
      <div className="w-40 h-40 rounded-full bg-gray-200" />
    </div>
  );

  // ---------------- JSX ----------------
  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="COMMON.DASHBOARD"
                    defaultMessage="Dashboard"
                  />
                ),
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Events Card */}
          <div className="flex items-center justify-between bg-[#FFF5E6] p-6 rounded-2xl shadow-sm">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                <FormattedMessage
                  id="DASHBOARD.TOTAL_EVENTS"
                  defaultMessage="Total Events"
                />
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {dashboarddata?.totalEvent || 0}
              </h2>
            </div>
            <div className="w-16 h-16 flex items-center justify-center bg-[#FF947A] rounded-full shadow-md">
              <img
                src={toAbsoluteUrl(`/media/brand-logos/total_events.svg`)}
                alt="Total Events"
                className="w-8 h-8"
              />
            </div>
          </div>

          {/* Generate Invoices Card */}
          <div className="flex items-center justify-between bg-[#E6FFF1] p-6 rounded-2xl shadow-sm">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                <FormattedMessage
                  id="DASHBOARD.GENERATE_INVOICE"
                  defaultMessage="                Generate Invoices
"
                />
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                {dashboarddata?.totalInvoice || 0}
              </h2>
            </div>
            <div className="w-16 h-16 flex items-center justify-center bg-[#4ADE80] rounded-full shadow-md">
              <img
                src={toAbsoluteUrl(`/media/brand-logos/generate_invoice.svg`)}
                alt="Total Events"
                className="w-8 h-8"
              />
            </div>
          </div>

          {/* Total Receivable Amount Card */}
          <div className="flex items-center justify-between bg-[#F3E8FF] p-6 rounded-2xl shadow-sm">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                <FormattedMessage
                  id="DASHBOARD.TOTAL_RECEIVABLE_INVOICE"
                  defaultMessage="                Total Receivable Invoice Amount"
                />
              </p>

              <h2 className="text-3xl font-bold text-gray-900">
                {dashboarddata?.totalInvoiceAmount || 0}
              </h2>
            </div>
            <div className="w-16 h-16 flex items-center justify-center bg-[#A78BFA] rounded-full shadow-md">
              <img
                src={toAbsoluteUrl(
                  `/media/brand-logos/total_receivable_amt.svg`
                )}
                alt="Total Events"
                className="w-8 h-8"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#f3f3f3] p-6 rounded-2xl shadow-sm">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                <FormattedMessage
                  id="DASHBOARD.TOTAL_RECEIVABLE_QUOTATION"
                  defaultMessage="                Total Receivable Quotation Amount
"
                />
              </p>

              <h2 className="text-3xl font-bold text-gray-900">
                {dashboarddata?.totalQuotationAmount || 0}
              </h2>
            </div>
            <div className="w-16 h-16 flex items-center justify-center bg-[#cccccc] rounded-full shadow-md">
              <img
                src={toAbsoluteUrl(
                  `/media/brand-logos/total_receivable_amt.svg`
                )}
                alt="Total Events"
                className="w-8 h-8"
              />
            </div>
          </div>
        </div>

        {/* ---------------- UPGRADED PIE CHARTS ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {[
            {
              title: (
                <FormattedMessage
                  id="CHART.SALES_EXPENSE"
                  defaultMessage="Sales Chart -Expense"
                />
              ),
              data: expenseChart,
              state: selectedExpensePeriod,
              type: "expense",
            },
            {
              title: (
                <FormattedMessage
                  id="CHART.QUOTATION"
                  defaultMessage="Quatation Chart"
                />
              ),
              data: QuotationChart,
              state: selectedQuotationPeriod,
              type: "quotation",
            },
            {
              title: (
                <FormattedMessage
                  id="CHART.INVOICE"
                  defaultMessage="Invoice Chart"
                />
              ),
              data: InvoiceChart,
              state: selectedInvoicePeriod,
              type: "invoice",
            },
          ].map((chart, i) => {
            const hasData = chart.data.series.some((v) => v > 0);

            return (
              <div
                key={i}
                className="border border-primary bg-white rounded-lg shadow-sm p-6 space-y-4 transition-all duration-300 hover:shadow-md no-scrollbar"
                style={{
                  backgroundImage: `url(${toAbsoluteUrl("/media/images/piechartframe.png")})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">
                      {chart.title}
                    </h3>
                    <select
                      className="border rounded-md px-3 py-1 text-sm text-gray-600"
                      value={chart.state}
                      onChange={(e) =>
                        handlePeriodChange(e.target.value, chart.type)
                      }
                    >
                      <option value="today">Today's</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                </div>

                {isChartLoading ? (
                  <ChartLoader />
                ) : !hasData ? (
                  <div className="flex items-center justify-center h-[280px] text-gray-500 text-sm">
                    No Data Available
                  </div>
                ) : (
                  <Chart
                    options={chart.data.options}
                    series={chart.data.series}
                    type="donut"
                    height={120}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* -------------------- EVENTS SECTION -------------------- */}
        <div className="border border-primary p-3 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            <h2 className="text-base font-semibold text-gray-800">
              Upcoming Events
            </h2>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search Client / Event..."
                value={eventSearchInput}
                onChange={(e) => setEventSearchInput(e.target.value)}
                className="border rounded px-3 py-2 text-sm w-full md:w-60"
              />

              <select
                className="border rounded px-3 py-2 text-sm cursor-pointer h-10"
                value={eventDateRange}
                onChange={(e) => setEventDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>

              {eventDateRange === "custom" && (
                <>
                  <RangePicker
                    onChange={(e) => setCustomEventDates(e)}
                    allowClear
                  />
                  <button
                    className="bg-primary text-white px-3 py-2 rounded"
                    onClick={handleEventCustomApply}
                  >
                    Apply
                  </button>
                </>
              )}

              <button
                className="p-2 rounded-lg border bg-white shadow-sm"
                onClick={() =>
                  eventDateRange === "custom"
                    ? fetchEventData("custom")
                    : fetchEventData(eventDateRange)
                }
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isLoadingEvents ? (
            <div className="py-7 text-center text-gray-500">
              Loading Events...
            </div>
          ) : (
            <TableComponent
              columns={columns}
              data={filteredEvents}
              paginationSize={10}
            />
          )}
        </div>

        {/* -------------------- INVOICE SECTION -------------------- */}
        <div className="border border-primary p-3 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            <h2 className="text-base font-semibold text-gray-800">Invoices</h2>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search Client / Event..."
                value={invoiceSearchInput}
                onChange={(e) => setInvoiceSearchInput(e.target.value)}
                className="border rounded px-3 py-2 text-sm w-full md:w-60"
              />

              <select
                className="border rounded px-3 py-2 text-sm cursor-pointer h-10"
                value={invoiceDateRange}
                onChange={(e) => setInvoiceDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>

              {invoiceDateRange === "custom" && (
                <>
                  <RangePicker
                    onChange={(e) => setCustomInvoiceDates(e)}
                    allowClear
                  />
                  <button
                    className="bg-primary text-white px-3 py-2 rounded"
                    onClick={handleInvoiceCustomApply}
                  >
                    Apply
                  </button>
                </>
              )}

              <button
                className="p-2 rounded-lg border bg-white shadow-sm"
                onClick={() =>
                  invoiceDateRange === "custom"
                    ? fetchInvoices("custom")
                    : fetchInvoices(invoiceDateRange)
                }
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <TableComponent
            columns={invoicecolumns}
            data={filteredInvoices}
            paginationSize={10}
          />
        </div>

        <div className="flex gap-4">
          <div className="w-[70%] p-3 border border-primary rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
              <h2 className="text-base font-semibold text-gray-800">
                <FormattedMessage
                  id="DASHBOARD.MOST_SELLING_ITEM"
                  defaultMessage="   Most Selling Item"
                />
              </h2>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 w-full md:w-64 shadow-sm">
                  <Search className="text-blue-500 w-4 h-4 mr-2" />
                  <input
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "COMMON.SEARCH_HERE",
                      defaultMessage: "Serach Here",
                    })}
                    value={itemSearchInput}
                    onChange={(e) => setItemSearchInput(e.target.value)}
                    className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400 h-6"
                  />
                </div>

                <select
                  className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm cursor-pointer"
                  value={itemDateRange}
                  onChange={(e) => setItemDateRange(e.target.value)}
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>

                {itemDateRange === "custom" && (
                  <>
                    <RangePicker
                      onChange={(e) => setCustomItemDates(e)}
                      allowClear
                    />
                    <button
                      className="bg-primary text-white px-3 py-2 rounded"
                      onClick={() => fetchMostSelling("custom")}
                    >
                      Apply
                    </button>
                  </>
                )}

                <button
                  className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 shadow-sm"
                  onClick={() =>
                    itemDateRange === "custom"
                      ? fetchMostSelling("custom")
                      : fetchMostSelling(itemDateRange)
                  }
                >
                  <RefreshCcw className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {isItemLoading ? (
              <div className="py-7 text-center text-gray-500">Loading...</div>
            ) : (
              <TableComponent
                columns={itemcolumns}
                data={itemData.filter(
                  (d) =>
                    d.item?.toLowerCase().includes(itemSearch.toLowerCase()) ||
                    d.quantity?.toString().includes(itemSearch)
                )}
                paginationSize={10}
              />
            )}
          </div>

          <div className="w-[30%] bg-white border border-primary rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-[#003366]">
                <FormattedMessage
                  id="HELP.QUICK_HELP"
                  defaultMessage="  Quick Help"
                />
              </h2>
            </div>
            <div className="border border-[#D9E6FF] rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0">
                  <img
                    src={toAbsoluteUrl(`/media/brand-logos/support.png`)}
                    alt="Support"
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Manan Gandhi</p>
                  <p className="text-sm text-gray-600">
                    <FormattedMessage
                      id="HELP.POC_INFO"
                      defaultMessage="   Manan Gandhi is Point of Contact (POC). Feel free to connect
                    between 10 AM to 7 PM."
                    />
                  </p>
                </div>
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-2 bg-[#E8F8EE] border border-[#25D366] text-[#128C7E] py-2 rounded-md text-sm font-medium hover:bg-[#d6f4e3] transition">
                <img
                  src={toAbsoluteUrl(`/media/brand-logos/whatsapp.png`)}
                  alt="WhatsApp"
                  className="w-5 h-5 object-contain"
                />
                <button className="mt-3 w-full flex items-center justify-center gap-2 bg-[#E8F8EE] border border-[#25D366] text-[#128C7E] py-2 rounded-md text-sm font-medium hover:bg-[#d6f4e3] transition">
                  <FormattedMessage
                    id="HELP.CONTACT_WHATSAPP"
                    defaultMessage=" Contact On WhatsApp"
                  />
                </button>
              </button>
            </div>
            <div className="border border-[#D9E6FF] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0">
                  <img
                    src={toAbsoluteUrl(`/media/brand-logos/query.png`)}
                    alt="Query"
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    <FormattedMessage
                      id="HELP.NEED_HELP"
                      defaultMessage=" Need Quick Help 24/7 ?"
                    />
                  </p>
                  <p className="text-sm text-gray-600">
                    Contact us for Support on{" "}
                    <span className="font-medium text-gray-800">
                      8209792623
                    </span>
                  </p>
                </div>
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-2 bg-[#E8F0FF] border border-[#005AA7] text-[#005AA7] py-2 rounded-md text-sm font-medium hover:bg-[#dce8ff] transition">
                <Phone size={18} />
                Request a Call Back
              </button>
            </div>
          </div>
        </div>

        <div className="fixed right-0 bottom-6 transform-translate-y-1/2 z-[200]">
          <button
            onClick={() => setOpenTutorial((prev) => !prev)}
            className="bg-[#005AA7] text-white rounded-l-xl shadow-xl 
               w-12 h-40 flex flex-col items-center gap-5"
          >
            <img
              src={toAbsoluteUrl(`/media/images/cap.png`)}
              alt="tutorial"
              className="w-6 h-6 mt-3"
            />
            <span className="text-lg font-medium rotate-90 whitespace-nowrap mt-6">
              JCX Tutorial
            </span>
          </button>
        </div>

        <VideoTutorial
          open={openTutorial}
          onClose={() => setOpenTutorial(false)}
        />
      </Container>
    </Fragment>
  );
};

export default ClientDashboard;
