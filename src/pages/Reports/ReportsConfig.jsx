"use client";
import { Fragment, useState } from "react";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Container } from "@/components/container";

const ReportsConfig = () => {
  const [reportConfig, setReportConfig] = useState([
    "Custom Menu Report",
    "Simple Menu Report",
    "Exclusive Menu Report",
    "Slogan Menu Report",
    "Premium Image Menu Report",
    "Image Report With Menu",
    "Image And Slogan Menu Report",
    "Image Menu Category Report",
    "Two Language Menu Report",
    "Manager Menu Report",
    "Instruction Menu Report",
  ]);

  const tableHeaders = [
    "Report Header",
    "Logo",
    "Company Name",
    "Company Address",
    "Company Mobile Number",
  ];

  const [selected, setSelected] = useState({});

  const handleCheckboxChange = (report, header) => {
    setSelected((prev) => ({
      ...prev,
      [report]: {
        ...prev[report],
        [header]: !prev[report]?.[header],
      },
    }));
  };

  return (
    <Fragment>
      <Container>
  
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Report Configuration" }]} />
        </div>

<div className=" mb-5">
  <div
    className="tab-scroll flex flex-nowrap overflow-x-auto border-b border-gray-200 text-sm font-medium scroll-smooth"
    style={{
      scrollbarWidth: "none", 
    }}
  >
    {[
      "Menu Preparation",
      "Menu Allocation",
      "Raw Material Allocation Report",
      "Chef Labour Wise Raw Material Allocation Report",
      "Labour & Agency",
      "General Fix and Crockery Allocation",
      "Admin Hub",
      "Order Report",
    ].map((tab, index) => (
      <button
        key={index}
        className={`px-4 py-2 text-sm whitespace-nowrap ${
          index === 0
            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-blue-600"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  <style jsx>{`
    .tab-scroll {
      scrollbar-width: none; /* Firefox */
    }
    .tab-scroll::-webkit-scrollbar {
      height: 6px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .tab-scroll::-webkit-scrollbar-thumb {
      background-color: #3b82f6;
      border-radius: 8px;
    }
    .tab-scroll::-webkit-scrollbar-track {
      background-color: #f3f4f6;
      border-radius: 8px;
    }
    /* Show scrollbar on hover */
    .tab-scroll:hover::-webkit-scrollbar {
      opacity: 1;
    }
  `}</style>
</div>


        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left font-medium text-gray-700 border-b border-gray-200">
                  &nbsp;
                </th>
                {tableHeaders.map((header, idx) => (
                  <th
                    key={idx}
                    className="p-3 text-center font-medium text-gray-700 border-b border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportConfig.map((report, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3 font-medium text-gray-800 whitespace-nowrap">
                    {report}
                  </td>
                  {tableHeaders.map((header, idx) => (
                    <td
                      key={idx}
                      className="p-3 text-center border-t border-gray-200"
                    >
                      <input
                        type="checkbox"
                        checked={!!selected[report]?.[header]}
                        onChange={() => handleCheckboxChange(report, header)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Fragment>
  );
};

export default ReportsConfig;
