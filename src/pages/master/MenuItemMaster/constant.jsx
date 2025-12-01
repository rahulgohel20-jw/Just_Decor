import { Tooltip } from "antd";
import { FormattedMessage } from "react-intl";

export const columns = [
  {
    accessorKey: "sr_no",
    header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="Sr. No." />,
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },

  {
    accessorKey: "name",
    header: <FormattedMessage id="COMMON.NAME" defaultMessage="Name" />,
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "weight",
    header: (
      <FormattedMessage
        id="MASTER.MENU_ITEM_CATEGORY"
        defaultMessage="Weight"
      />
    ),
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "unit",
    header: <FormattedMessage id="COMMON.PRIORITY" defaultMessage="Unit" />,
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "rate",
    header: <FormattedMessage id="COMMON.PRIORITY" defaultMessage="Rate" />,
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Action" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center  gap-1">
          <Tooltip className="cursor-pointer" title="Edit Contact">
            <button className="btn btn-sm btn-icon btn-clear" title="Edit">
              <i className="ki-filled ki-notepad-edit text-primary"></i>
            </button>
          </Tooltip>

          <Tooltip title="Delete">
            <button className="btn btn-sm btn-icon btn-clear" title="Delete">
              <i className="ki-filled ki-trash  text-danger"></i>
            </button>
          </Tooltip>
        </div>
      );
    },
    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },
];

export const defaultData = [
  {
    sr_no: 1,
    name: "Swapnil Ghodeswar",
    weight: "500",
    unit: "Gram",
    rate: "400",
  },
];
