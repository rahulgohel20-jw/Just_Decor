export const gasBatlaColumns = ({ onValueChange }) => [
  {
    id: "rawMaterial",
    Header: "Name",
    accessor: "rawMaterial",
  },
  {
    id: "range_0_100",
    Header: "0-100",
    accessor: "range_0_100",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_0_100 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_0_100", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_101_200",
    Header: "101-200",
    accessor: "range_101_200",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_101_200 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_101_200", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_201_300",
    Header: "201-300",
    accessor: "range_201_300",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_201_300 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_201_300", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_301_400",
    Header: "301-400",
    accessor: "range_301_400",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_301_400 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_301_400", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_401_500",
    Header: "401-500",
    accessor: "range_401_500",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_401_500 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_401_500", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_501_600",
    Header: "501-600",
    accessor: "range_501_600",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_501_600 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_501_600", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_601_700",
    Header: "601-700",
    accessor: "range_601_700",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_601_700 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_601_700", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_701_800",
    Header: "701-800",
    accessor: "range_701_800",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_701_800 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_701_800", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_801_900",
    Header: "801-900",
    accessor: "range_801_900",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_801_900 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_801_900", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_901_1000",
    Header: "901-1000",
    accessor: "range_901_1000",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_901_1000 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_901_1000", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_1001_1100",
    Header: "1001-1100",
    accessor: "range_1001_1100",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_1001_1100 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_1001_1100", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_1101_1200",
    Header: "1101-1200",
    accessor: "range_1101_1200",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_1101_1200 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_1101_1200", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_1201_1300",
    Header: "1201-1300",
    accessor: "range_1201_1300",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_1201_1300 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_1201_1300", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_1301_1400",
    Header: "1301-1400",
    accessor: "range_1301_1400",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_1301_1400 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_1301_1400", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_1401_1500",
    Header: "1401-1500",
    accessor: "range_1401_1500",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_1401_1500 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_1401_1500", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_1501_1600",
    Header: "1501-1600",
    accessor: "range_1501_1600",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_1501_1600 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_1501_1600", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_1601_1700",
    Header: "1601-1700",
    accessor: "range_1601_1700",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_1601_1700 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_1601_1700", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_1701_1800",
    Header: "1701-1800",
    accessor: "range_1701_1800",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_1701_1800 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_1701_1800", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_1801_1900",
    Header: "1801-1900",
    accessor: "range_1801_1900",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_1801_1900 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_1801_1900", e.target.value)
        }
      />
    ),
  },
  {
    id: "range_1901_2000",
    Header: "1901-2000",
    accessor: "range_1901_2000",
    Cell: ({ row }) => (
      <input
        className="input"
        value={row.original.range_1901_2000 || ""}
        onChange={(e) =>
          onValueChange(row.original.id, "range_1901_2000", e.target.value)
        }
      />
    ),
  },
];
