import { useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { ReloadOutlined } from "@ant-design/icons";

export default function Log() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Mock data (replace with API)
    const mockLogs = [
      {
        id: 1,
        date: "16/05/2025",
        time: "12:53 PM",
        oldValue: "Yes",
        newValue: "No",
        field: "Active",
        updatedBy: "Admin",
        highlight: false,
      },
      {
        id: 2,
        date: "13/05/2025",
        time: "03:54 PM",
        oldValue: "No",
        newValue: "Yes",
        field: "Active",
        updatedBy: "Admin",
        highlight: false,
      },
      {
        id: 3,
        date: "13/05/2025",
        time: "03:54 PM",
        oldValue: "Yes",
        newValue: "No",
        field: "Active",
        updatedBy: "Admin",
        highlight: false,
      },
      {
        id: 4,
        date: "08/11/2024",
        time: "03:15 PM",
        oldValue: "",
        newValue: "KYC Doc 2",
        field: "",
        updatedBy: "Admin",
        highlight: false,
      },
      {
        id: 5,
        date: "08/11/2024",
        time: "03:15 PM",
        message: "Member Updated and Code is : TBHSIG999",
        updatedBy: "Admin",
        highlight: true,
      },
    ];
    setLogs(mockLogs);
  }, []);

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm">
      <div className="bg-[#005BA8] text-white px-5 py-3 text-lg font-semibold rounded-t-md">
        User Logs
      </div>

      {/* Timeline section */}
      <div className="relative pl-9 py-6">
        {/* Main vertical line */}

        {logs.map((log, index) => (
          <div key={log.id} className="relative flex items-start mb-8">
            {/* Date and time */}
            <div className="w-40 text-sm font-semibold text-gray-700">
              {log.date} <br /> {log.time}
            </div>

            {/* Circle icon */}
            <div
              className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 border-dotted bg-white ${
                log.highlight
                  ? "border-red-500 text-red-500"
                  : "border-[#28375F] text-[#28375F]"
              }`}
            >
              <ReloadOutlined className="text-sm" />
              {index !== logs.length - 1 && (
                <div className="absolute top-7 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-gray-300"></div>
              )}
            </div>

            <div className="ml-6">
              {log.message ? (
                <p className="text-sm text-red-600 font-medium">
                  {log.message}, updated by{" "}
                  <span className="font-semibold text-gray-700">
                    {log.updatedBy}
                  </span>
                </p>
              ) : (
                <p className="text-sm">
                  {log.oldValue !== "" && (
                    <>
                      <span className="font-semibold">Old:</span> {log.oldValue}{" "}
                      <br />
                    </>
                  )}
                  {log.newValue !== "" && (
                    <>
                      <span className="font-semibold">New:</span> {log.newValue}{" "}
                      <br />
                    </>
                  )}
                  {log.field && (
                    <>
                      {log.field} updated by{" "}
                      <span className="font-semibold">{log.updatedBy}</span>
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
