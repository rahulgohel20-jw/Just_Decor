import { Fragment } from "react";
import { Container } from "@/components/container";


const Approval = () => {
  const filters = [
    "Today",
    "Yesterday",
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    "Next Week",
    "Next Month",
    "All Time",
    "Custom",
  ];

  const tabs = [
    { value: "all", label: "All", count: 0, icon: "📋" },
    { value: "pending", label: "Pending", count: 0, icon: "⏳" },
    { value: "approved", label: "Approved", count: 0, icon: "✅" },
    { value: "rejected", label: "Rejected", count: 0, icon: "❌" },
  ];

  return (
    <Fragment>
      <Container>
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6 border border-gray-100">
          {/* Top Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((item, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
                  item === "This Month"
                    ? "bg-[#005BA8] text-white border-[#005BA8]"
                    : "bg-white text-[#005BA8] border-[#D0E6FF] hover:bg-[#E6F0FA]"
                }`}
              >
                {item}
              </button>
            ))}
            <select className="ml-auto px-4 py-2 text-sm border border-[#D0E6FF] text-[#005BA8] rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#005BA8]">
              <option value="0">Employee</option>
              <option value="1">Manager</option>
            </select>
          </div>

          {/* Tab Navigation (Leave / Regularization) */}
          <div className="flex border-b border-gray-200">
            <button className="mr-6 pb-2 text-[#005BA8] font-semibold border-b-2 border-[#005BA8]">
              Leave Applications
            </button>
            <button className="pb-2 text-gray-400 hover:text-[#005BA8]">
              Regularization
            </button>
          </div>

          {/* Status Tabs (All / Pending / Approved / Rejected) */}
          <div className="flex flex-wrap gap-3 mt-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  tab.value === "all"
                    ? "bg-[#005BA8] text-white border-[#005BA8]"
                    : "bg-white border-[#D0E6FF] text-[#005BA8] hover:bg-[#F4F9FF]"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="text-xs font-bold">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Optional Tabs or Page Content */}
          <div className="pt-4">
           
            
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Approval;
