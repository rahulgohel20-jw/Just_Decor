import { Tooltip } from "antd";
import { FormattedMessage } from "react-intl";

export const columns = (onEdit, onDelete) => [
  {
    accessorKey: "sr_no",
    header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="Sr No" />,
    meta: {
      headerClassName: "w-[5%]",
      cellClassName: "w-[5%]",
    },
  },
  {
    accessorKey: "accountHolderName",
    header: (
      <FormattedMessage
        id="BANK.ACCOUNT_HOLDER_NAME"
        defaultMessage="Account Holder Name"
      />
    ),
    meta: {
      headerClassName: "w-[15%]",
      cellClassName: "w-[15%]",
    },
  },
  {
    accessorKey: "accountNo",
    header: (
      <FormattedMessage
        id="BANK.ACCOUNT_NUMBER"
        defaultMessage="Account Number"
      />
    ),
    meta: {
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%]",
    },
  },
  {
    accessorKey: "bankName",
    header: (
      <FormattedMessage id="BANK.BANK_NAME" defaultMessage="Bank Name" />
    ),
    meta: {
      headerClassName: "w-[15%]",
      cellClassName: "w-[15%]",
    },
  },
  {
    accessorKey: "branchName",
    header: (
      <FormattedMessage id="BANK.BRANCH_NAME" defaultMessage="Branch Name" />
    ),
    meta: {
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%]",
    },
  },
  {
    accessorKey: "ifscCode",
    header: (
      <FormattedMessage id="BANK.IFSC_CODE" defaultMessage="IFSC Code" />
    ),
    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },
  {
    accessorKey: "upiId",
    header: <FormattedMessage id="BANK.UPI_ID" defaultMessage="UPI ID" />,
    meta: {
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%]",
    },
  },
  {
  accessorKey: "isPrimary",
  header: (
    <FormattedMessage
      id="BANK.PRIMARY_ACCOUNT"
      defaultMessage="Primary"
    />
  ),
  cell: ({ row }) => {
    return (
      <div className="flex items-center">
        {row.original.isPrimary ? (
          <span className="badge badge-sm badge-success">
            <i className="ki-filled ki-check"></i> Primary
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </div>
    );
  },
  meta: {
    headerClassName: "w-[8%]",
    cellClassName: "w-[8%]",
  },
},
  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Actions" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <Tooltip title="Edit Bank Details">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Edit"
              onClick={() => onEdit(row.original)}
            >
              <i className="ki-filled ki-notepad-edit text-primary"></i>
            </button>
          </Tooltip>

          
        </div>
      );
    },
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
];