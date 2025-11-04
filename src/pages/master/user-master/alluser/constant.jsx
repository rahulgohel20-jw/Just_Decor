import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { createElement } from "react";

export const columns = (onEdit, handleApprove) => {
  const ClickableUserCode = ({ value }) => {
    const navigate = useNavigate();
    return (
      <button
        onClick={() => navigate("/Superadmin-member")}
        className="text-blue-600 hover:underline font-medium"
      >
        {value}
      </button>
    );
  };

  return [
    {
      accessorKey: "userCode",
      header: "User Code",
      cell: ({ getValue }) =>
        createElement(ClickableUserCode, { value: getValue() }),
      meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      meta: { headerClassName: "w-[15%]", cellClassName: "w-[15%]" },
    },
    {
      accessorKey: "companyName",
      header: "Company",
      meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
    },
    {
      accessorKey: "contactNo",
      header: "Mobile Number",
      meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
    },
    {
      accessorKey: "email",
      header: "Email",
      meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
    },
    {
      accessorKey: "plan",
      header: "Plan",
      meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
    },
    {
      accessorKey: "database",
      header: "Database",
      meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
    },
    {
      accessorKey: "theme",
      header: "Themes",
      meta: { headerClassName: "w-[15%]", cellClassName: "w-[15%]" },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span
            className={`font-medium ${value ? "text-primary" : "text-danger"}`}
          >
            {value ? "Yes" : "No"}
          </span>
        );
      },
      meta: { headerClassName: "w-[6%]", cellClassName: "w-[6%]" },
    },
    {
      accessorKey: "isApprove",
      header: "Approved",
      cell: ({ row }) => {
        const value = row.original.isApprove;
        const userId = row.original.id;

        if (value) {
          return (
            <span className="font-medium px-4 py-1 rounded text-white bg-green-600">
              Approved
            </span>
          );
        }

        const handleClick = async () => {
          try {
            await handleApprove(userId, true);
          } catch (err) {
            console.error("Approval failed", err);
          }
        };

        return (
          <button
            onClick={handleClick}
            className="font-medium px-4 py-1 rounded text-white bg-blue-600"
          >
            Approve
          </button>
        );
      },
      meta: { headerClassName: "w-[8%]", cellClassName: "w-[8%]" },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const navigate = useNavigate();
        return (
          <div className="flex items-center justify-center gap-1">
            <Tooltip title="Edit User">
              <button
                className="btn btn-sm btn-icon btn-clear"
                onClick={() => navigate("/Superadmin-member-edit")}
              >
                <i className="ki-filled ki-notepad-edit text-primary"></i>
              </button>
            </Tooltip>
            <Tooltip title="User logs">
              <button className="btn btn-sm btn-icon btn-clear">
                <i className="ki-filled ki-user text-success"></i>
              </button>
            </Tooltip>
            <Tooltip title="Letter">
              <button className="btn btn-sm btn-icon btn-clear">
                <i className="ki-filled ki-note-2"></i>
              </button>
            </Tooltip>
          </div>
        );
      },
      meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
    },
  ];
};
