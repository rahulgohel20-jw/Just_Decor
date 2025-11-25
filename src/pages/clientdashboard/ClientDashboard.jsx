"use client";
import { Fragment, useEffect } from "react";
import { useState } from "react";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Container } from "@/components/container";
import Chart from "react-apexcharts";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import { Search, RefreshCcw } from "lucide-react";
import { invoicecolumns, defaultinvoiceData } from "./invoiceconstant";
import { itemcolumns, defaultitemData } from "./itemconstant";
import { Phone, MessageCircle, HelpCircle } from "lucide-react";
import { toAbsoluteUrl } from "@/utils/Assets";
import VideoTutorial from "@/components/videoTutorial/VideoTutorial";
import {
  GetClientwisedashboardata,
  GetClientdashboardsalesdata,
  GetClienteventdata,
  GetAllInvoicedatabyfilter,
} from "@/services/apiServices";

const ClientDashboard = () => {
  const [dashboarddata, setDashboarddata] = useState([]);
  const [salesPiechart, setSalesPiechart] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [eventData, setEventData] = useState([]);
  const [eventDateRange, setEventDateRange] = useState("today");
  const [invoiceDateRange, setInvoiceDateRange] = useState("today");
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const userId = localStorage.getItem("userId");
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    fetchdashboarddata();
    fetchdashboardsalespiechart(selectedPeriod);
    fetchEventData(eventDateRange);
    fetchInvoices(eventDateRange);
  }, [selectedPeriod, eventDateRange]);

  const fetchdashboarddata = async () => {
    try {
      const res = await GetClientwisedashboardata(userId);
      setDashboarddata(res?.data?.data);
      console.log("Dashboard Data:", res?.data?.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchdashboardsalespiechart = async (period) => {
    try {
      const date = "24/11/2025";
      const res = await GetClientdashboardsalesdata(date, userId);
      setSalesPiechart(res?.data?.data);
      console.log("Sales Chart Data:", res?.data?.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const getDateRange = (range) => {
    const today = new Date();
    let startDate, endDate;

    switch (range) {
      case "today":
        startDate = endDate = formatDate(today);
        break;
      case "week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        startDate = formatDate(weekStart);
        endDate = formatDate(today);
        break;
      case "month":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate = formatDate(monthStart);
        endDate = formatDate(today);
        break;
      default:
        startDate = endDate = formatDate(today);
    }

    return { startDate, endDate };
  };

  // Format date to DD-MM-YYYY
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchEventData = async (range) => {
    setIsLoadingEvents(true);
    try {
      const { startDate, endDate } = getDateRange(range);
      const res = await GetClienteventdata(startDate, endDate, userId);
      const data = res?.data?.data;

      const eventdata = data.map((cust, index) => ({
        Invoice: index + 1,
        CustomerName: cust.userFullName,
        Eventname: cust.eventName,
        eventDate: cust.eventStartDateTime,
        Venue: cust.venueName,
        status: cust.status,
      }));
      setEventData(eventdata);
      console.log("Event Data:", res?.data);
    } catch (error) {
      console.error("Error fetching event data:", error);
      setEventData([]);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const fetchInvoices = async (range) => {
    try {
      const { endDate, startDate } = getDateRange(range);
      const response = await GetAllInvoicedatabyfilter(
        endDate,
        startDate,
        userId
      );

      const list = response?.data?.data?.["Event Invoice Details"] || [];

      const invoicedata = list.map((cust, index) => ({
        Invoice: cust.invoiceCode,
        CustomerName: cust.event.party.nameEnglish,
        Eventname: cust.event.eventType.nameEnglish,
        eventDate: cust.event.eventStartDateTime,
        Venue: cust.event.venue.nameEnglish,
        BalanceDue: cust.remainingAmount,
      }));
      console.log(list);

      setOriginalData(invoicedata);
      console.log(originalData);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const [openTutorial, setOpenTutorial] = useState(false);

  const expenseChart = {
    series: salesPiechart?.expenses
      ? [
          salesPiechart.expenses.chefLaborCharge || 0,
          salesPiechart.expenses.outsideAgencyCharge || 0,
          salesPiechart.expenses.laborCharge || 0,
          salesPiechart.expenses.rawmaterialCharge || 0,
          salesPiechart.expenses.extraExpenseCharge || 0,
        ]
      : [0, 0, 0, 0, 0],
    options: {
      chart: { type: "donut" },
      labels: [
        "Chef Labor Charge",
        "Outside Agency Charge",
        "Labor Charge",
        "Rawmaterial Charge",
        "Extra Expense Charge",
      ],
      legend: {
        position: "right",
        fontSize: "13px",
      },
      dataLabels: { enabled: false },
      colors: ["#3B82F6", "#10B981", "#F97316", "#EF4444", "#8B5CF6"],
      stroke: { width: 2 },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: { width: "100%" },
            legend: { position: "bottom" },
          },
        },
      ],
    },
  };

  // Invoice Chart Configuration
  const InvoiceChart = {
    series: salesPiechart?.invoice
      ? [
          salesPiechart.invoice.totalSales || 0,
          salesPiechart.invoice.totalPaid || 0,
          salesPiechart.invoice.totalUnpaid || 0,
        ]
      : [0, 0, 0],
    options: {
      chart: { type: "donut" },
      labels: ["Total Sales", "Total Paid", "Total Unpaid"],
      legend: {
        position: "right",
        fontSize: "13px",
      },
      dataLabels: { enabled: false },
      colors: ["#3B82F6", "#10B981", "#F97316"],
      stroke: { width: 2 },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: { width: "100%" },
            legend: { position: "bottom" },
          },
        },
      ],
    },
  };

  // Quotation Chart Configuration
  const QuotationChart = {
    series: salesPiechart?.quotation
      ? [
          salesPiechart.quotation.totalSales || 0,
          salesPiechart.quotation.totalPaid || 0,
          salesPiechart.quotation.totalUnpaid || 0,
        ]
      : [0, 0, 0],
    options: {
      chart: { type: "donut" },
      labels: ["Total Sales", "Total Paid", "Total Unpaid"],
      legend: {
        position: "right",
        fontSize: "13px",
      },
      dataLabels: { enabled: false },
      colors: ["#3B82F6", "#10B981", "#F97316"],
      stroke: { width: 2 },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: { width: "100%" },
            legend: { position: "bottom" },
          },
        },
      ],
    },
  };

  const handlePeriodChange = (e, chartType) => {
    const period = e.target.value;
    setSelectedPeriod(period);
  };

  const handleEventDateRangeChange = (e) => {
    const range = e.target.value;
    setEventDateRange(range);
  };
  const handleInvoiceDateRangeChange = (e) => {
    const range = e.target.value;
    setInvoiceDateRange(range);
  };

  const handleRefreshEvents = () => {
    fetchEventData(eventDateRange);
  };
  const handleRefreshinvoice = () => {
    fetchInvoices(eventDateRange);
  };

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Dashboard" }]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Events Card */}
          <div className="flex items-center justify-between bg-[#FFF5E6] p-6 rounded-2xl shadow-sm">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Total Events
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
                Generate Invoices
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
                Total Receivable Invoice Amount
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
                Total Receivable Quotation Amount
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="border border-primary bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">
                Sales Chart - Expenses
              </h3>
              <select
                className="border rounded-md px-3 py-1 text-sm text-gray-600"
                onChange={(e) => handlePeriodChange(e, "expense")}
                value={selectedPeriod}
              >
                <option value="today">Today's</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            {salesPiechart ? (
              <Chart
                options={expenseChart.options}
                series={expenseChart.series}
                type="donut"
                height={230}
              />
            ) : (
              <div className="flex items-center justify-center h-[230px]">
                <p className="text-gray-500">Loading chart data...</p>
              </div>
            )}
          </div>

          <div className="border border-primary bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Quotation Chart</h3>
              <select
                className="border rounded-md px-3 py-1 text-sm text-gray-600"
                onChange={(e) => handlePeriodChange(e, "quotation")}
                value={selectedPeriod}
              >
                <option value="today">Today's</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            {salesPiechart ? (
              <Chart
                options={QuotationChart.options}
                series={QuotationChart.series}
                type="donut"
                height={230}
              />
            ) : (
              <div className="flex items-center justify-center h-[230px]">
                <p className="text-gray-500">Loading chart data...</p>
              </div>
            )}
          </div>

          <div className="border border-primary bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Invoice Chart</h3>
              <select
                className="border rounded-md px-3 py-1 text-sm text-gray-600"
                onChange={(e) => handlePeriodChange(e, "invoice")}
                value={selectedPeriod}
              >
                <option value="today">Today's</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            {salesPiechart ? (
              <Chart
                options={InvoiceChart.options}
                series={InvoiceChart.series}
                type="donut"
                height={230}
              />
            ) : (
              <div className="flex items-center justify-center h-[230px]">
                <p className="text-gray-500">Loading chart data...</p>
              </div>
            )}
          </div>
        </div>

        <div className="border border-primary p-3 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            <h2 className="text-base font-semibold text-gray-800">
              Upcoming Events
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 w-full md:w-64 shadow-sm">
                <Search className="text-blue-500 w-4 h-4 mr-2" />
                <input
                  type="text"
                  placeholder="Search here..."
                  className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400"
                />
              </div>
              <select
                className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm cursor-pointer"
                value={eventDateRange}
                onChange={handleEventDateRangeChange}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <button
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 shadow-sm"
                onClick={handleRefreshEvents}
                disabled={isLoadingEvents}
              >
                <RefreshCcw
                  className={`w-4 h-4 text-gray-600 ${isLoadingEvents ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
          {isLoadingEvents ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : (
            <TableComponent
              columns={columns}
              data={eventData}
              paginationSize={10}
            />
          )}
        </div>

        <div className="border border-primary p-3 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            <h2 className="text-base font-semibold text-gray-800">Invoices</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 w-full md:w-64 shadow-sm">
                <Search className="text-blue-500 w-4 h-4 mr-2" />
                <input
                  type="text"
                  placeholder="Search here..."
                  className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400"
                />
              </div>
              <select
                className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm cursor-pointer"
                value={invoiceDateRange}
                onChange={handleInvoiceDateRangeChange}
              >
                <option>Today</option>
                <option>Last Month</option>
                <option>Custom Range</option>
              </select>
              <button
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 shadow-sm"
                onClick={handleRefreshinvoice}
                disabled={isLoadingEvents}
              >
                <RefreshCcw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          <TableComponent
            columns={invoicecolumns}
            data={originalData}
            paginationSize={10}
          />
        </div>

        <div className="flex gap-4">
          <div className="w-[70%] p-3 border border-primary rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
              <h2 className="text-base font-semibold text-gray-800">
                Most Selling Item
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 w-full md:w-64 shadow-sm">
                  <Search className="text-blue-500 w-4 h-4 mr-2" />
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400"
                  />
                </div>
                <select className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm cursor-pointer">
                  <option>Today</option>
                  <option>Last Month</option>
                  <option>Custom Range</option>
                </select>
                <button className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 shadow-sm">
                  <RefreshCcw className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <TableComponent
              columns={itemcolumns}
              data={defaultitemData}
              paginationSize={10}
            />
          </div>
          <div className="w-[30%] bg-white border border-primary rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-[#003366]">
                Quick Help
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
                    Manan Gandhi is Point of Contact (POC). Feel free to connect
                    between 10 AM to 7 PM.
                  </p>
                </div>
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-2 bg-[#E8F8EE] border border-[#25D366] text-[#128C7E] py-2 rounded-md text-sm font-medium hover:bg-[#d6f4e3] transition">
                <img
                  src={toAbsoluteUrl(`/media/brand-logos/whatsapp.png`)}
                  alt="WhatsApp"
                  className="w-5 h-5 object-contain"
                />
                Contact On WhatsApp
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
                    Need Quick Help 24/7 ?
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
