import React from "react";
import { toAbsoluteUrl } from "@/utils";

const NoData = ({ text = "No data found" }) => (
  <div className="flex flex-col items-center justify-center  text-gray-500">
    {/* Illustration */}
    <img
      src={toAbsoluteUrl("/media/placeholders/placeholder.png")}
      className="max-h-[330px] mb-4 dark:hidden"
      alt="No data"
    />

    {/* Icon (optional – keep or remove) */}

    {/* Text */}
    <p className="text-sm font-medium">{text}</p>
  </div>
);

export default NoData;
