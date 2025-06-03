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
      label:
      (
        <>
          <i className="ki-filled ki-chart-line-up"></i>
          Timeline
        </>
      ),
      children: <TimeLineTab />,
    },
    {
      id: "notes",
      label:
      (
        <>
        <i className="ki-filled ki-notepad"></i>
          Notes
        </>
      ),
      children: <NoteTab />,
    },
    {
      id: "followup",
      label:
      (
        <>
        <i className="ki-filled ki-message-text-2"></i>
          Follow Up
        </>
      ),
      children: "Follow Up",
    },
    {
      id: "stage_timeline",
      label:
      (
        <>
        <i className="ki-filled ki-arrow-right-left"></i>
          Stage Timelinep
        </>
      ),
      children: <StageTimeLineTab />,
    },
    {
      id: "emails",
      label:
      (
        <>
        <i className="ki-filled ki-ki-filled ki-sms"></i>
         Emails
        </>
      ),
      children: "Emails",
    },
    {
      id: "products",
      label:
      (
        <>
        <i className="ki-filled ki-bookmark"></i>
         Products
        </>
      ),
      children: "Products",
    },
    {
      id: "Whatsapp",
      label:
      (
        <>
        <i className="ki-filled ki-ki-filled ki-whatsapp"></i>
         Whatsapp
        </>
      ),
      children: "Whatsapp",
    },
    { id: "Quotation",
      label:
      (
        <>
        <i className="ki-filled ki-cheque"></i>
         Quotation
        </>
      ),
      children: "Quotation"
    },
  ];

  return (
    <div className="p-4 lg:p-7 grow">
      <TabComponent tabs={tabs} />
    </div>
  );
};

export { LeadRightComponent };
