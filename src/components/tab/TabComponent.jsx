import React, { useState } from "react";

const TabComponent = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  const currentTab = tabs.find((tab) => tab.id === activeTab);
  return (
    <div>
      <div
        className="btn-tabs btn-tabs-lg flex justify-between mb-5 w-full"
        data-tabs="true"
      >
        {tabs.map((tab) => (
          <a
            key={tab.id}
            className={`btn btn-clear justify-center px-4 whitespace-nowrap w-full ${
              activeTab === tab.id ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content p-3">
        {currentTab?.children ?? (
          <div className="text-center text-gray-400">No content</div>
        )}
      </div>
    </div>
  );
};

export default TabComponent;
