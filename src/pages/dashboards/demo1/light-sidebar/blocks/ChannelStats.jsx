import { Fragment, useEffect, useState } from "react";
import { toAbsoluteUrl } from "@/utils/Assets";
import { SuperAdminDashboardTotalUserAndPlan } from "../../../../../services/apiServices";

const ChannelStats = ({ data }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!data) return;

    const planIcon = {
      "E-Lite": "eliteplan.svg",
      Lite: "liteplan.svg",
      Elite: "eliteplan.svg",
      Premium: "premiumplan.svg",
    };

    const mapped = [
      ...data.planData.map((p) => ({
        logo: planIcon[p.planName] || "default.svg",
        info: `₹ ${p.totalAmountReceived}`,
        desc: `${p.planName} Plan`,
        growth: "2.1%",
        isPositive: true,
      })),

      {
        logo: "active.svg",
        info: data.totalActiveUser,
        desc: "Active Users",
        growth: "2.1%",
        isPositive: true,
      },

      {
        logo: "totaluser.svg",
        info: data.totalAllUser,
        desc: "Total Users",
        growth: "2.1%",
        isPositive: true,
      },
    ];

    setItems(mapped);
  }, [data]);

  const renderItem = (item, index) => {
    return (
      <div
        key={index}
        className="flex gap-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#D6ECFF] dark:border-gray-700 p-3 flex-1 min-w-[220px]"
      >
        <div className="flex items-center">
          {/* Icon Container */}
          <div className="rounded-lg bg-[#D6ECFF] p-3 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <img
              src={toAbsoluteUrl(`/media/brand-logos/${item.logo}`)}
              className="w-7 h-7"
              alt=""
            />
          </div>
        </div>
        {/* Text Content */}
        <div className="flex flex-col">
          <div className="flex gap-5">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {item.info}
            </span>
            {/* Growth Indicator */}
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {item.desc}
            </span>
          </div>
        </div>
        <div></div>
      </div>
    );
  };

  return (
    <div className="flex justify-between gap-3 w-full">
      {items.map(renderItem)}
    </div>
  );
};

export { ChannelStats };
