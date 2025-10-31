import { Popconfirm, Tooltip } from "antd";
import { FormattedMessage } from "react-intl";

export const columns = (
  handleEditSupplier,
  handleRemoveSupplier,
  handleSetDefaultSupplier
) => [
  {
    accessorKey: "sr_no",
    header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="Sr. No." />,
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "supplier_name",
    header: <FormattedMessage id="COMMON.SUPPLIER_NAME" defaultMessage="Supplier Name" />,
    meta: {
      headerClassName: "w-[16%]",
      cellClassName: "w-[16%]",
    },
  },

  {
    accessorKey: "isActive",
    header: <FormattedMessage id="COMMON.STATUS" defaultMessage="Status" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <label className="switch switch-lg">
            <input
              type="checkbox"
              onChange={() => handleSetDefaultSupplier(row.original.supplierId)}
              checked={row.original.isDefault || true}
              readOnly
            />
          </label>
        </div>
      );
    },
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },

  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Action" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <Tooltip className="cursor-pointer" title="Edit Contact">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Edit"
              onClick={() => handleEditSupplier(row.original)}
            >
              <i className="ki-filled ki-notepad-edit text-primary"></i>
            </button>
          </Tooltip>

          <Tooltip title="Delete">
            {/* <Link to="/menu-allocation"> */}
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Delete"
              onClick={() => handleRemoveSupplier(row.original)}
            >
              <i className="ki-filled ki-trash  text-danger"></i>
            </button>
            {/* </Link> */}
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

export const defaultData = [];
