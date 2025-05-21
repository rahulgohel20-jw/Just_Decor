import {
  Copy,
  CopyPlus,
  Eye,
  ListOrdered,
  Logs,
  Pen,
  Plus,
  Trash,
} from "lucide-react";
import CardList from "@/components/card-list/CardList";
import { useState } from "react";

const ExportLead = () => {
    const [timeRange, setTimeRange] = useState("This Month");
    const [pipeline, setPipeline] = useState("");
    const [assignedTo, setAssignedTo] = useState("");

    const handleExport = () => {
      alert("Leads exported!");
    };

    return (
      <div className="container-fluid bg-white p-6 rounded-lg">
        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Export Leads</h2>
        </div>

        {/* Dropdowns in a single row */}
        <div className="flex space-x-4 mb-6">
          {/* Time Range Dropdown */}
          <div className="flex-1">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full border border-red-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-900 text-gray-700"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>

          {/* Pipeline Dropdown */}
          <div className="flex-1">
            <select
              value={pipeline}
              onChange={(e) => setPipeline(e.target.value)}
              className="w-full border border-red-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-900 text-gray-500"
            >
              <option value="" disabled>Select pipeline</option>
              <option value="Pipeline 1">Pipeline 1</option>
              <option value="Pipeline 2">Pipeline 2</option>
            </select>
          </div>

          {/* Assigned To Dropdown */}
          <div className="flex-1">
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full border border-red-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-900 text-gray-500"
            >
              <option value="" disabled>Assigned to</option>
              <option value="User 1">User 1</option>
              <option value="User 2">User 2</option>
            </select>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-center">
          <button
            onClick={handleExport}
            className="bg-red-800 text-white px-4 py-2 rounded w-50 hover:bg-red-900 transition-colors duration-300"
          >
            Export Leads
          </button>
        </div>
      </div>
    );
  };
export { ExportLead };
