import { Popconfirm, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const columns = (onDelete, viewEvent, openMenuReport) => [
  {
    accessorKey: "sr_no",
    header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="#" />,
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "event_id",
    header: (
      <FormattedMessage
        id="USER.EVENT.EVENT_CODE"
        defaultMessage="Event Code"
      />
    ),
    meta: {
      headerClassName: "w-[9%]",
      cellClassName: "w-[9%]",
    },
  },
  {
    accessorKey: "event_type",
    header: (
      <FormattedMessage
        id="USER.EVENT.EVENT_NAME"
        defaultMessage="Event Name"
      />
    ),
    meta: {
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%]",
    },
  },
  {
    accessorKey: "event_date",
    header: (
      <FormattedMessage
        id="USER.EVENT.EVENT_DATE"
        defaultMessage="Event Date & Time"
      />
    ),
    meta: {
      headerClassName: "w-[20%]",
      cellClassName: "w-[20%]",
    },
  },

  {
    accessorKey: "customer",
    header: (
      <FormattedMessage id="USER.EVENT.CUSTOMER" defaultMessage="Customer" />
    ),
    meta: {
      headerClassName: "w-[18%]",
      cellClassName: "w-[18%]",
    },
  },
  {
    accessorKey: "invoice",
    header: (
      <FormattedMessage id="USER.EVENT.INVOICE" defaultMessage="Invoice" />
    ),
    cell: ({ cell }) => cell.getValue(),
    meta: {
      headerClassName: "w-[6%] text-center",
      cellClassName: "w-[6%] text-center",
    },
  },
  {
    accessorKey: "quotation",
    header: (
      <FormattedMessage id="USER.EVENT.QUOTATION" defaultMessage="Quotation" />
    ),
    cell: ({ cell }) => cell.getValue(),
    meta: {
      headerClassName: "w-[6%] text-center",
      cellClassName: "w-[6%] text-center",
    },
  },

  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Action" />,
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <div className="flex items-center justify-center gap-1">
          <Tooltip
            title={
              <FormattedMessage id="COMMON.VIEW" defaultMessage="View Event" />
            }
          >
            <button
              className="btn btn-sm btn-icon btn-clear"
              onClick={() => viewEvent(row.original.eventid)}
            >
              <i className="ki-filled ki-eye text-success"></i>
            </button>
          </Tooltip>

          <Tooltip
            title={
              <FormattedMessage id="COMMON.EDIT" defaultMessage="Edit Event" />
            }
          >
            <Link to={`/edit-event/${row.original.eventid}`}>
              <button className="btn btn-sm btn-icon btn-clear">
                <i className="ki-filled ki-notepad-edit text-primary"></i>
              </button>
            </Link>
          </Tooltip>

          <Popconfirm
            title={
              <FormattedMessage
                id="COMMON.COPY_CONFIRM"
                defaultMessage="Copy this event?"
              />
            }
            onConfirm={() =>
              navigate(`/edit-event/${row.original.eventid}/copy`)
            }
            okText={<FormattedMessage id="COMMON.YES" defaultMessage="Yes" />}
            cancelText={<FormattedMessage id="COMMON.NO" defaultMessage="No" />}
          >
            <button className="btn btn-sm btn-icon btn-clear">
              <i className="ki-filled ki-copy text-success"></i>
            </button>
          </Popconfirm>

          <Tooltip
            title={
              <FormattedMessage
                id="COMMON.DELETE"
                defaultMessage="Delete Event"
              />
            }
          >
            <button
              className="btn btn-sm btn-icon btn-clear"
              onClick={() => onDelete(row.original.eventid)}
            >
              <i className="ki-filled ki-trash text-danger"></i>
            </button>
          </Tooltip>

          <Tooltip
            title={
              <FormattedMessage
                id="USER.EVENT.MENU_PREP"
                defaultMessage="Menu Preparation"
              />
            }
          >
            <Link to={`/menu-preparation/${row.original.eventid}`}>
              <button className="btn btn-sm btn-icon btn-clear">
                <i className="ki-filled ki-notepad text-warning"></i>
              </button>
            </Link>
          </Tooltip>

          <Tooltip
            title={
              <FormattedMessage
                id="USER.EVENT.MENU_ALLOC"
                defaultMessage="Menu Allocation"
              />
            }
          >
            <Link to={`/menu-allocation/${row.original.eventid}`}>
              <button className="btn btn-sm btn-icon btn-clear">
                <i className="ki-filled ki-grid text-info"></i>
              </button>
            </Link>
          </Tooltip>

          <Tooltip
            title={
              <FormattedMessage
                id="USER.EVENT.MENU_REPORT"
                defaultMessage="Menu Report"
              />
            }
          >
            <button
              className="btn btn-sm btn-icon btn-clear"
              onClick={() => openMenuReport(row.original.eventid)}
            >
              <i className="ki-filled ki-notepad text-gray-500"></i>
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
