import { Fragment } from "react";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import TabComponent from "@/components/tab/TabComponent";

import LeaveBalanceTable from "./leavebalance";
import AllLeaveApplications from "./all-leaveapplication/constant";

const AllLeave = () => {
  const tabs = [
    {
      value: "leave-balance",
      label: <>Leave Balance</>,
      children: <LeaveBalanceTable />,
    },
    {
      value: "all-leaves",
      label: <>All Leave Applications</>,
      children: <AllLeaveApplications />,
    },
  ];

  return (
    <Fragment>
      <div className="px-4 py-6">
        <Breadcrumbs items={[{ title: "All Leaves" }]} />
        <div className="mt-6 flex justify-center">
          <TabComponent tabs={tabs} />
        </div>
      </div>
    </Fragment>
  );
};

export default AllLeave;
