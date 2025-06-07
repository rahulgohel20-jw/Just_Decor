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
      label: (
        <>
          <i className="ki-filled ki-chart-line-up"></i>
          Timeline
        </>
      ),
      children: <TimeLineTab />,
    },
    {
      id: "notes",
      label: (
        <>
          <i className="ki-filled ki-notepad"></i>
          Notes
        </>
      ),
      children: <NoteTab />,
    },
    {
      id: "followup",
      label: (
        <>
          <i className="ki-filled ki-message-text-2"></i>
          Follow Up
        </>
      ),
      children: <FollowTab />,
    },
    {
      id: "stage_timeline",
      label: (
        <>
          <i className="ki-filled ki-arrow-right-left"></i>
          Stage Timelinep
        </>
      ),
      children: <StageTimeLineTab />,
    },
    {
      id: "emails",
      label: (
        <>
          <i className="ki-filled ki-ki-filled ki-sms"></i>
          Emails
        </>
      ),
      children: <EmailTab />,
    },
    {
      id: "products",
      label: (
        <>
          <i className="ki-filled ki-bookmark"></i>
          Products
        </>
      ),
      children: <ProductsTab />,
    },
    {
      id: "Whatsapp",
      label: (
        <>
          <i className="ki-filled ki-ki-filled ki-whatsapp"></i>
          Whatsapp
        </>
      ),
      children: <WhatsappTab />,
    },
    {
      id: "Quotation",
      label: (
        <>
          <i className="ki-filled ki-cheque"></i>
          Quotation
        </>
      ),
      children: <QuotationTab />,
    },
  ];

  return (
    <div className="p-4 lg:p-7 grow">
      <TabComponent tabs={tabs} />
    </div>
  );
};

export { LeadRightComponent };
