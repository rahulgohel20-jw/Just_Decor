import { Tooltip } from "antd";
import { FormattedMessage } from "react-intl";

export const columns = (onEdit, onDelete) => [
  {
    accessorKey: "sr_no",
    header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="Sr No" />,
    meta: { headerClassName: "w-[5%]", cellClassName: "text-center" },
  },
  {
    accessorKey: "venue_type",
    header: (
      <FormattedMessage
        id="USER.MASTER.VENUE_TYPE"
        defaultMessage="Venue Type"
      />
    ),
    meta: { headerClassName: "w-full" },
  },
  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Actions" />,
    cell: ({ row }) => {
      const venue = row.original;

      return (
        <div className="flex items-center gap-2">
          <Tooltip
            title={<FormattedMessage id="COMMON.EDIT" defaultMessage="Edit" />}
          >
            <button
              className="btn btn-sm btn-icon btn-light btn-hover-primary"
              onClick={() => onEdit(venue)}
            >
              <i className="ki-filled ki-notepad-edit"></i>
            </button>
          </Tooltip>

          <Tooltip
            title={
              <FormattedMessage id="COMMON.DELETE" defaultMessage="Delete" />
            }
          >
            <button
              className="btn btn-sm btn-icon btn-light btn-hover-danger"
              onClick={() => onDelete(row.original)} // ← FIXED: venueid, not eventid
            >
              <i className="ki-filled ki-trash text-danger"></i>
            </button>
          </Tooltip>
        </div>
      );
    },
    meta: {
      headerClassName: "w-[120px] text-center",
      cellClassName: "text-center",
    },
  },
];

// Optional: Keep default data for loading skeleton only
export const defaultData = [{ sr_no: 1, venue_type: "Loading...", venueid: 0 }];
