import { useState } from "react";
import TabComponent from "../tab/TabComponent";
import NoteTab from "./NoteTab";
import TimeLineTab from "./TimeLineTab";
import StageTimeLineTab from "./StageTimeLineTab";
import FollowTab from "./NoteTab";
import EmailTab from "./EmailTab";
import QuotationTab from "./QuotationTab";
import WhatsappTab from "./WhatsappTab";
import ProductsTab from "./ProductsTab";

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
      children: <FollowTab />,
    },
    {
      id: "stage_timeline",
      label: "Stage Timeline",
      children: <StageTimeLineTab />,
    },
    {
      id: "emails",
      label: "Emails",
      children: <EmailTab />,
    },
    {
      id: "products",
      label: "Products",
      children: <ProductsTab />,
    },
    {
      id: "Whatsapp",
      label: "Whatsapp",
      children: <WhatsappTab />,
    },
    { id: "Quotation", label: "Quotation", children: <QuotationTab /> },
  ];

  return (
    <div className="card p-2 lg:p-3 shadow-none">
      <TabComponent tabs={tabs} />
    </div>
  );
};

export { LeadRightComponent };
