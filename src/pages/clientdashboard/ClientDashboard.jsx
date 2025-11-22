"use client";
import { Fragment } from "react";
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
const ClientDashboard = () => {
  const [openTutorial, setOpenTutorial] = useState(false);

  const expenseChart = {
    series: [10376, 10376, 10376, 10376, 10376, 10376],
    options: {
      chart: {
        type: "donut",
      },
      labels: [
        "Total Raw Material Charges",
        "Total Agency Charges",
        "Total General Fix Charges",
        "Total Crockery Charges",
        "Grand Total",
        "Dish Costing",
      ],
      legend: {
        position: "right",
        fontSize: "13px",
      },
      dataLabels: {
        enabled: false,
      },
      colors: [
        "#34D399",
        "#60A5FA",
        "#F59E0B",
        "#A78BFA",
        "#F87171",
        "#FBBF24",
      ],
      stroke: {
        width: 2,
      },
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

  const salesChart = {
    series: [10376, 510376, 110376],
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

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Dashboard" }]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Events Card */}
          <div className="flex items-center justify-between bg-[#FFF5E6] p-6 rounded-2xl shadow-sm">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Total Events
              </p>
              <h2 className="text-3xl font-bold text-gray-900">10,000</h2>
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
              <h2 className="text-3xl font-bold text-gray-900">15000</h2>
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
                Total Receivable Amount
              </p>
              <h2 className="text-3xl font-bold text-gray-900">40000</h2>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="border border-primary bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">
                Pie Chart - Expenses
              </h3>
              <select className="border rounded-md px-3 py-1 text-sm text-gray-600">
                <option>Today's</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <Chart
              options={expenseChart.options}
              series={expenseChart.series}
              type="donut"
              height={230}
            />
          </div>

          <div className="border border-primary bg-white rounded-lg shadow-sm p-6  ">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Pie Chart - Sales</h3>
              <select className="border rounded-md px-3 py-1 text-sm text-gray-600">
                <option>Today's</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <Chart
              options={salesChart.options}
              series={salesChart.series}
              type="donut"
              height={230}
            />
          </div>
        </div>

        <div className="border border-primary p-3 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            {/* Title */}
            <h2 className="text-base font-semibold text-gray-800">
              Upcoming Events
            </h2>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Search Box */}
              <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 w-full md:w-64 shadow-sm">
                <Search className="text-blue-500 w-4 h-4 mr-2" />
                <input
                  type="text"
                  placeholder="Search here..."
                  className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400"
                />
              </div>

              {/* Date Dropdown */}
              <select className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm cursor-pointer">
                <option>Today</option>
                <option>Last Month</option>
                <option>Custom Range</option>
              </select>

              {/* Refresh Button */}
              <button className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 shadow-sm">
                <RefreshCcw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          <TableComponent
            columns={columns}
            data={defaultData}
            paginationSize={10}
          />
        </div>

        <div className="border border-primary p-3 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            {/* Title */}
            <h2 className="text-base font-semibold text-gray-800">Invoices</h2>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Search Box */}
              <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 w-full md:w-64 shadow-sm">
                <Search className="text-blue-500 w-4 h-4 mr-2" />
                <input
                  type="text"
                  placeholder="Search here..."
                  className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400"
                />
              </div>

              {/* Date Dropdown */}
              <select className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm cursor-pointer">
                <option>Today</option>
                <option>Last Month</option>
                <option>Custom Range</option>
              </select>

              {/* Refresh Button */}
              <button className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 shadow-sm">
                <RefreshCcw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          <TableComponent
            columns={invoicecolumns}
            data={defaultinvoiceData}
            paginationSize={10}
          />
        </div>

        <div className="flex gap-4">
          <div className="w-[70%] p-3 border border-primary rounded-lg">
            <div className="flex flex-col  md:flex-row md:items-center md:justify-between mb-4 gap-3">
              {/* Title */}
              <h2 className="text-base font-semibold text-gray-800">
                Most Selling Item
              </h2>

              {/* Right Controls */}
              <div className="flex items-center gap-3">
                {/* Search Box */}
                <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 w-full md:w-64 shadow-sm">
                  <Search className="text-blue-500 w-4 h-4 mr-2" />
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400"
                  />
                </div>

                {/* Date Dropdown */}
                <select className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm cursor-pointer">
                  <option>Today</option>
                  <option>Last Month</option>
                  <option>Custom Range</option>
                </select>

                {/* Refresh Button */}
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
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-[#003366]">
                Quick Help
              </h2>
            </div>

            {/* First Box - WhatsApp Contact */}
            <div className="border border-[#D9E6FF] rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 flex items-center justify-center  rounded-full flex-shrink-0">
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

            {/* Second Box - Phone Support */}
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

        {/* JCX Tutorial Floating Button */}
        <div className="fixed right-0 bottom-6  transform-translate-y-1/2 z-[200]">
          <button
            onClick={() => setOpenTutorial((prev) => !prev)}
            className="bg-[#005AA7] text-white rounded-l-xl shadow-xl 
               w-12 h-40 flex flex-col items-center  gap-5"
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
