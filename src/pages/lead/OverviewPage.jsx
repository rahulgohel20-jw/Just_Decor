import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import SalesPersonDropdown from "@/components/dropdowns/SalesPersonDropdown";
import PipLineDropdown from "@/components/dropdowns/PiplineDropdown";
import CompanyDropdown from "@/components/dropdowns/CompanyDropdown";
import SourceDropdown from "@/components/dropdowns/SourceDropdown";
import TabComponent from "@/components/tab/TabComponent";
import ReportTab from "@/components/LeadOverview/ReportTab";
import LeadReportTab from "@/components/LeadOverview/LeadReportTab";
import FollowUpReportTab from "@/components/LeadOverview/FollowUpReportTab";

const OverviewPage = () => {
  const [activeFollowUpTab, setActiveFollowUpTab] =
    useState("Follow Up Report");

  const salesTabs = [
    {
      label: "Daily",
      value: "daily",
      children: <ReportTab filterType="Daily" />,
    },
    {
      label: "Weekly",
      value: "weekly",
      children: <ReportTab filterType="Weekly" />,
    },
    {
      label: "Monthly",
      value: "monthly",
      children: <ReportTab filterType="Monthly" />,
    },
    {
      label: "Yearly",
      value: "yearly",
      children: <ReportTab filterType="Yearly" />,
    },
  ];
  const leadTabs = [
    {
      label: "Daily Leads",
      value: "daily",
      children: <LeadReportTab filterType="daily" />,
    },
    {
      label: "Monthly Leads",
      value: "monthly",
      children: <LeadReportTab filterType="monthly" />,
    },
    {
      label: "Source Wise",
      value: "source",
      children: <LeadReportTab filterType="source" />,
    },
    {
      label: "Company Wise",
      value: "company",
      children: <LeadReportTab filterType="company" />,
    },
    {
      label: "Pipeline Wise",
      value: "pipeline",
      children: <LeadReportTab filterType="pipeline" />,
    },
    {
      label: "Sales Person Wise",
      value: "sales_person",
      children: <LeadReportTab filterType="sales_person" />,
    },
    {
      label: "Stage Wise",
      value: "stage",
      children: <LeadReportTab filterType="stage" />,
    },
  ];
  const followUpTabs = [
    {
      label: "Follow Up Report",
      value: "follow_up",
      children: <FollowUpReportTab filterType="follow_up" />,
    },
    {
      label: "Activity Report",
      value: "activity",
      children: <FollowUpReportTab filterType="activity" />,
    },
    {
      label: "Open Leads Aging",
      value: "open_lead",
      children: <FollowUpReportTab filterType="open_lead" />,
    },
    {
      label: "Lost Reason Report",
      value: "lost_reason",
      children: <FollowUpReportTab filterType="lost_reason" />,
    },
  ];

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Overview" }]} />
        </div>

        {/* Filters */}
        <div className="filters flex flex-wrap items-center gap-2 mb-3">
          <div className="filItems">
            <PipLineDropdown />
          </div>
          <div className="filItems">
            <SourceDropdown />
          </div>
          <div className="filItems">
            <SalesPersonDropdown />
          </div>
          <div className="filItems">
            <CompanyDropdown />
          </div>
          <div className="filItems">
            <button className="btn btn-light" title="Refresh">
              <i className="ki-filled ki-arrows-circle"></i>
            </button>
          </div>
          <div className="filItems">
            <button className="btn btn-light" title="Custom Report">
              <i className="ki-filled ki-cheque"></i>
              Custom Report
            </button>
          </div>
        </div>

        {/* Sales Report Tabs */}
        <div className="mb-3 w-full">
          <TabComponent tabs={salesTabs} />
        </div>
        {/* Daily Leads Tabs */}
        <div className="mb-3 w-full">
          <TabComponent tabs={leadTabs} />
        </div>

        {/* Follow Up Report Section */}
        <div className="mb-3 w-full">
          <TabComponent tabs={leadTabs} />
        </div>
      </Container>
    </Fragment>
  );
};

export { OverviewPage };
