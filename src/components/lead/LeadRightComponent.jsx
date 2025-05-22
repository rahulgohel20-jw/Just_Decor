import { useState } from "react";
import TabComponent from "../tab/TabComponent";
import NoteTab from "./NoteTab/NoteTab";
import TimeLineTab from "./TimeLineTab/TimeLineTab";
import StageTimeLineTab from "./StageTimeLineTab/StageTimeLineTab";

const LeadRightComponent = () => {
  const [activeTab, setActiveTab] = useState("tab_1");

  const tabs = [
    {
      id: "timeline",
      label: "Timeline",
      children: <TimeLineTab />,
    },
    {
      id: "notes",
      label: "Notes",
      children: <NoteTab />,
    },
    {
      id: "followup",
      label: "Follow Up",
      children: "Follow Up",
    },
    {
      id: "stage_timeline",
      label: "Stage Timeline",
      children: <StageTimeLineTab />,
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

  return (
    <div className="card p-2 lg:p-3 shadow-none">
      <TabComponent tabs={tabs} />
    </div>
  );
};

export { LeadRightComponent };
