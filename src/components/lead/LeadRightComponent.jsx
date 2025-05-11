import { useState } from "react";
import TabComponent from "../tab/TabComponent";

const LeadRightComponent = () => {
  const [activeTab, setActiveTab] = useState("tab_1");

  const tabs = [
    {
      id: "timeline",
      label: "Timeline",
      children: "Timeline",
    },
    {
      id: "notes",
      label: "Notes",
      children: "Notes",
    },
    {
      id: "followup",
      label: "Follow Up",
      children: "Follow Up",
    },
    {
      id: "stage_timeline",
      label: "Stage Timeline",
      children: "Stage Timeline",
    },
    {
      id: "emails",
      label: "Emails",
      children: "Emails",
    },
    {
      id: "products",
      label: "Products",
      children: "Products",
    },
    {
      id: "Whatsapp",
      label: "Whatsapp",
      children: "Whatsapp",
    },
    { id: "Quotation", label: "Quotation", children: "Quotation" },
  ];
  const renderTabContent = () => {
    switch (activeTab) {
      case "tab_1":
        return <div id="tab_1" className="tab-content mb-2 active"></div>;
      case "tab_2":
        return <div id="tab_2" className="tab-content mb-2"></div>;
    }
  };
  return (
    <div className="card p-2 lg:p-3 shadow-none">
      <TabComponent tabs={tabs} />
      {renderTabContent()}
    </div>
  );
};

export { LeadRightComponent };
