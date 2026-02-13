export const gasBatlaColumns = ({ onValueChange }) => {
  const inputStyle = {
    minWidth: "110px",
    minHeight: "48px",
    fontSize: "15px",
  };

  const inputClassName =
    "w-full px-3 py-3 text-center border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all";

  return [
    {
      id: "rawMaterial",
      header: "Name",
      accessorKey: "rawMaterialNameEnglish",
      minWidth: 200,
      size: 200,
    },
    {
      id: "r_0_to_100",
      header: "0-100",
      accessorKey: "r_0_to_100",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_0_to_100 || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            onValueChange(row.original.id, "r_0_to_100", value);
          }}
          onFocus={(e) => e.target.select()}
        />
      ),
    },
    {
      id: "r_101_to_200",
      header: "101-200",
      accessorKey: "r_101_to_200",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_101_to_200 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_101_to_200", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_201_to_300",
      header: "201-300",
      accessorKey: "r_201_to_300",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_201_to_300 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_201_to_300", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_301_to_400",
      header: "301-400",
      accessorKey: "r_301_to_400",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_301_to_400 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_301_to_400", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_401_to_500",
      header: "401-500",
      accessorKey: "r_401_to_500",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_401_to_500 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_401_to_500", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_501_to_600",
      header: "501-600",
      accessorKey: "r_501_to_600",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_501_to_600 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_501_to_600", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_601_to_700",
      header: "601-700",
      accessorKey: "r_601_to_700",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_601_to_700 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_601_to_700", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_701_to_800",
      header: "701-800",
      accessorKey: "r_701_to_800",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_701_to_800 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_701_to_800", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_801_to_900",
      header: "801-900",
      accessorKey: "r_801_to_900",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_801_to_900 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_801_to_900", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_901_to_1000",
      header: "901-1000",
      accessorKey: "r_901_to_1000",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_901_to_1000 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_901_to_1000", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_1001_to_1100",
      header: "1001-1100",
      accessorKey: "r_1001_to_1100",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_1001_to_1100 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_1001_to_1100", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_1101_to_1200",
      header: "1101-1200",
      accessorKey: "r_1101_to_1200",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_1101_to_1200 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_1101_to_1200", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_1201_to_1300",
      header: "1201-1300",
      accessorKey: "r_1201_to_1300",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_1201_to_1300 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_1201_to_1300", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_1301_to_1400",
      header: "1301-1400",
      accessorKey: "r_1301_to_1400",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_1301_to_1400 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_1301_to_1400", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_1401_to_1500",
      header: "1401-1500",
      accessorKey: "r_1401_to_1500",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_1401_to_1500 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_1401_to_1500", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_1501_to_1600",
      header: "1501-1600",
      accessorKey: "r_1501_to_1600",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_1501_to_1600 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_1501_to_1600", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_1601_to_1700",
      header: "1601-1700",
      accessorKey: "r_1601_to_1700",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_1601_to_1700 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_1601_to_1700", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_1701_to_1800",
      header: "1701-1800",
      accessorKey: "r_1701_to_1800",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_1701_to_1800 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_1701_to_1800", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_1801_to_1900",
      header: "1801-1900",
      accessorKey: "r_1801_to_1900",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_1801_to_1900 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_1801_to_1900", e.target.value)
          }
        />
      ),
    },
    {
      id: "r_1901_to_2000",
      header: "1901-2000",
      accessorKey: "r_1901_to_2000",
      minWidth: 130,
      size: 130,
      cell: ({ row }) => (
        <input
          type="text"
          inputMode="numeric"
          className={inputClassName}
          style={inputStyle}
          value={row.original.r_1901_to_2000 || ""}
          onChange={(e) =>
            onValueChange(row.original.id, "r_1901_to_2000", e.target.value)
          }
        />
      ),
    },
  ];
};
