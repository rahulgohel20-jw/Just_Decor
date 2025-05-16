import React, { useState } from "react";

const TabComponent = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");
  const currentTab = tabs.find((tab) => tab.id === activeTab);
  return (
    <>
      <div
        className="btn-tabs btn-tabs-lg mb-3 w-full"
        data-tabs="true"
      >
        {tabs.map((tab) => (
          <a
            key={tab.id}
            className={`btn btn-clear whitespace-nowrap${
              activeTab === tab.id ? " active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </a>
        ))}
      </div>
      {/* Tab Content */}
      <div className="tab-content">
        {currentTab?.children ?? (
          <div className="text-center text-gray-400">No content</div>
        )}
      </div>
    </>
  );
};

export default TabComponent;
