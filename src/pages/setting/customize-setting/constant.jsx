import { Popconfirm, Tooltip } from "antd";
import { FormattedMessage } from "react-intl";

export const columns = (onEdit, onDelete) => [
  {
    accessorKey: "sr_no",
    header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="Sr. No." />,
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "type",
    header: <FormattedMessage id="COMMON.TYPE" defaultMessage="Type" />,
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "start_date",
    header: <FormattedMessage id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_START_DATE" defaultMessage="Start Date" />,
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "end_date",
    header: <FormattedMessage id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_DETAILS_FUNCTION_DETAILS_END_DATE" defaultMessage="End Date" />,
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
];

export const defaultData = [];
