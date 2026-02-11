export const gasBatlaColumns = ({ onValueChange }) => [
  {
    id: "rawMaterial",
    Header: "Name",
    accessor: "rawMaterialNameEnglish",
  },
  {
    id: "r_0_to_100",
    Header: "0-100",
    accessor: "r_0_to_100",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_0_to_100 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_0_to_100", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_101_to_200",
    Header: "101-200",
    accessor: "r_101_to_200",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_101_to_200 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_101_to_200", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_201_to_300",
    Header: "201-300",
    accessor: "r_201_to_300",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_201_to_300 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_201_to_300", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_301_to_400",
    Header: "301-400",
    accessor: "r_301_to_400",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_301_to_400 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_301_to_400", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_401_to_500",
    Header: "401-500",
    accessor: "r_401_to_500",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_401_to_500 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_401_to_500", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_501_to_600",
    Header: "501-600",
    accessor: "r_501_to_600",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_501_to_600 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_501_to_600", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_601_to_700",
    Header: "601-700",
    accessor: "r_601_to_700",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_601_to_700 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_601_to_700", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_701_to_800",
    Header: "701-800",
    accessor: "r_701_to_800",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_701_to_800 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_701_to_800", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_801_to_900",
    Header: "801-900",
    accessor: "r_801_to_900",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_801_to_900 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_801_to_900", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_901_to_1000",
    Header: "901-1000",
    accessor: "r_901_to_1000",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_901_to_1000 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_901_to_1000", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_1001_to_1100",
    Header: "1001-1100",
    accessor: "r_1001_to_1100",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_1001_to_1100 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_1001_to_1100", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_1101_to_1200",
    Header: "1101-1200",
    accessor: "r_1101_to_1200",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_1101_to_1200 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_1101_to_1200", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_1201_to_1300",
    Header: "1201-1300",
    accessor: "r_1201_to_1300",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_1201_to_1300 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_1201_to_1300", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_1301_to_1400",
    Header: "1301-1400",
    accessor: "r_1301_to_1400",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_1301_to_1400 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_1301_to_1400", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_1401_to_1500",
    Header: "1401-1500",
    accessor: "r_1401_to_1500",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_1401_to_1500 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_1401_to_1500", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_1501_to_1600",
    Header: "1501-1600",
    accessor: "r_1501_to_1600",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_1501_to_1600 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_1501_to_1600", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_1601_to_1700",
    Header: "1601-1700",
    accessor: "r_1601_to_1700",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_1601_to_1700 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_1601_to_1700", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_1701_to_1800",
    Header: "1701-1800",
    accessor: "r_1701_to_1800",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_1701_to_1800 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_1701_to_1800", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_1801_to_1900",
    Header: "1801-1900",
    accessor: "r_1801_to_1900",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_1801_to_1900 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_1801_to_1900", e.target.value)
        }
      />
    ),
  },
  {
    id: "r_1901_to_2000",
    Header: "1901-2000",
    accessor: "r_1901_to_2000",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.r_1901_to_2000 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "r_1901_to_2000", e.target.value)
        }
      />
    ),
  },
];
