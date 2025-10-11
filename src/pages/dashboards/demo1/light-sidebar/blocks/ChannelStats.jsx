import { Fragment } from "react";
import { toAbsoluteUrl } from "@/utils/Assets";

const ChannelStats = () => {
  const items = [
    {
      logo: "liteplan.svg",
      info: "₹ 8k",
      desc: "Lite Plan",
      growth: "2.1%",
      isPositive: true,
    },
    {
      logo: "eliteplan.svg",
      info: "₹ 15k",
      desc: "Elite Plans",
      growth: "2.1%",
      isPositive: true,
    },
    {
      logo: "premiumplan.svg",
      info: "₹ 608",
      desc: "Premium Plan ",
      growth: "2.1%",
      isPositive: true,
    },
    {
      logo: "active.svg",
      info: "₹ 2.5k",
      desc: "Active Users",
      growth: "2.1%",
      isPositive: true,
    },
    {
      logo: "totaluser.svg",
      info: "₹ 2.5k",
      desc: "Total Users",
      growth: "2.1%",
      isPositive: true,
    },
  ];

  const renderItem = (item, index) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[#D6ECFF] dark:border-gray-700 p-3 flex-1 min-w-[220px]"
      >
        <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-1 text-green-600 dark:text-green-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <span className="text-sm font-semibold">{item.growth}</span>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</span>
          </div>
        </div>
        <div></div>
      </div>
    );
  };

  return (
    <Fragment>
      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </Fragment>
  );
};

export { ChannelStats };