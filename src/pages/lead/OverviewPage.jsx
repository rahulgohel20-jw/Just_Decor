import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";

import SalesPersonDropdown from "../../components/dropdowns/SalesPersonDropdown";
import PipLineDropdown from "../../components/dropdowns/PiplineDropdown";
import CompanyDropdown from "../../components/dropdowns/CompanyDropdown";
import SourceDropdown from "../../components/dropdowns/SourceDropdown";
import { TableComponent } from "@/components/table/TableComponent";
import {
  followUpTabs,
  followUpColumns,
  followUpData,
} from "./constant-follow"; 

import {
  salesTabs,
  columns as salesColumns,
  salesData,
} from "./constant-sales";
import { leadTabs, leadColumns, leadData } from "./constant-lead";

const OverviewPage = () => {
  const [activeSalesTab, setActiveSalesTab] = useState("Daily");
  const [activeLeadTab, setActiveLeadTab] = useState("Daily Leads");
  const [activeFollowUpTab, setActiveFollowUpTab] =
    useState("Follow Up Report");

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Overview" }]} />
        </div>

        {/* Filters */}
        <div className="filters flex flex-wrap items-center gap-2 mb-3">
          <div className="filItems"><PipLineDropdown /></div>
          <div className="filItems"><SourceDropdown /></div>
          <div className="filItems"><SalesPersonDropdown /></div>
          <div className="filItems"><CompanyDropdown /></div>
          <div className="filItems">
            <button className="btn btn-light" title="Refresh">
              <i className="ki-filled ki-arrows-circle"></i>
            </button>
          </div>
          <div className="filItems">
            <button className="btn btn-light" title="Custom Report">
              Custom Report
            </button>
          </div>
        </div>

        {/* Lead Summary Badges */}
        {/* <div className="w-full mb-4">
          <div className="flex justify-between items-end gap-2 mb-2">
            <div className="flex flex-wrap gap-2"> */}
              {/* Your existing badge elements remain unchanged */}
              {/* ... */}
            {/* </div>
          </div>
        </div> */}

        {/* Sales Report Tabs */}
        <div className="btn-tabs btn-tabs-lg mb-3 w-full">
          {salesTabs.map((tab) => (
            <button
              key={tab}
              className={`btn ${activeSalesTab === tab ? "active" : ""}`}
              onClick={() => setActiveSalesTab(tab)}
              title={tab}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sales Table */}
        <TableComponent
          columns={salesColumns}
          data={salesData[activeSalesTab]}
          paginationSize={10}
        />

        {/* Daily Leads Tabs */}
        <div className="btn-tabs btn-tabs-lg mb-3 w-full mt-6">
          {leadTabs.map((tab) => (
            <button
              key={tab}
              className={`btn ${activeLeadTab === tab ? "active" : ""}`}
              onClick={() => setActiveLeadTab(tab)}
              title={tab}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Daily Leads Table */}
        <TableComponent
          columns={leadColumns}
          data={leadData[activeLeadTab]}
          paginationSize={10}
        />

        {/* Follow Up Report Section */}
        <div className="btn-tabs btn-tabs-lg mb-3 w-full mt-6">
          {followUpTabs.map((tab) => (
            <button
              key={tab}
              className={`btn ${activeFollowUpTab === tab ? "active" : ""}`}
              onClick={() => setActiveFollowUpTab(tab)}
              title={tab}
            >
              {tab}
            </button>
          ))}
        </div>

        <TableComponent
          columns={followUpColumns}
          data={followUpData[activeFollowUpTab]}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export { OverviewPage };
