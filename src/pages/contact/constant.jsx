import { DataGridColumnHeader } from "@/components";
export const columns = [
  {
    accessorKey: "company_name",
    header: ({ column }) => (
      <DataGridColumnHeader title="Company Name" column={column} />
    ),
  },
  {
    accessorKey: "mobile",
    header: ({ column }) => (
      <DataGridColumnHeader title="Mobile" column={column} />
    ),
  },
  {
    accessorKey: "compony",
    header: ({ column }) => (
      <DataGridColumnHeader title="Compony" column={column} />
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ cell }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <button
            className="btn btn-sm btn-icon btn-clear text-gray-600"
            title="Edit"
            onClick={() => cell.row.original.handleModalOpen()}
          >
            <i className="ki-filled ki-notepad-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-icon btn-clear text-danger"
            title="Delete"
          >
            <i className="ki-filled ki-trash"></i>
          </button>
        </div>
      );
    },
  },
];
export const defaultData = [
  {
    id: 1,
    company_name: "Tiger Nixon",
    mobile: "9865326598",
    compony: "Edinburgh",
  },
  {
    id: 2,
    company_name: "Garrett Winters",
    mobile: "9865326598",
    compony: "Tokyo",
  },
  {
    id: 3,
    company_name: "Ashton Cox",
    mobile: "9865326598",
    compony: "San Francisco",
  },
  {
    id: 4,
    company_name: "Airi Satou",
    mobile: "9865326598",
    compony: "Tokyo",
  },
  {
    id: 5,
    company_name: "Brielle Williamson",
    mobile: "9865326598",
    compony: "New York",
  },
  {
    id: 6,
    company_name: "Herrod Chandler",
    mobile: "9865326598",
    compony: "San Francisco",
  },
  {
    id: 7,
    company_name: "Rhona Davidson",
    mobile: "9865326598",
    compony: "Tokyo",
  },
  {
    id: 8,
    company_name: "Colleen Hurst",
    mobile: "9865326598",
    compony: "San Francisco",
  },
  {
    id: 9,
    company_name: "Sonya Frost",
    mobile: "9865326598",
    compony: "Edinburgh",
  },
  {
    id: 10,
    company_name: "Jena Gaines",
    mobile: "9865326598",
    compony: "London",
  },
  {
    id: 11,
    company_name: "Quinn Flynn",
    mobile: "9865326598",
    compony: "Edinburgh",
  },
  {
    id: 12,
    company_name: "Charde Marshall",
    mobile: "9865326598",
    compony: "San Francisco",
  },
  {
    id: 13,
    company_name: "Haley Kennedy",
    mobile: "9865326598",
    compony: "London",
  },
  {
    id: 14,
    company_name: "Tatyana Fitzpatrick",
    mobile: "9865326598",
    compony: "London",
  },
  {
    id: 15,
    company_name: "Michael Silva",
    mobile: "9865326598",
    compony: "London",
  },
  {
    id: 16,
    company_name: "Paul Byrd",
    mobile: "9865326598",
    compony: "New York",
  },
  {
    id: 17,
    company_name: "Gloria Little",
    mobile: "9865326598",
    compony: "New York",
  },
  {
    id: 18,
    company_name: "Bradley Greer",
    mobile: "9865326598",
    compony: "London",
  },
  {
    id: 19,
    company_name: "Dai Rios",
    mobile: "9865326598",
    compony: "Edinburgh",
  },
  {
    id: 20,
    company_name: "Jenette Caldwell",
    mobile: "9865326598",
    compony: "New York",
  },
  {
    id: 21,
    company_name: "Yuri Berry",
    mobile: "9865326598",
    compony: "New York",
  },
  {
    id: 22,
    company_name: "Caesar Vance",
    mobile: "9865326598",
    compony: "New York",
  },
  {
    id: 23,
    company_name: "Doris Wilder",
    mobile: "9865326598",
    compony: "Sydney",
  },
  {
    id: 24,
    company_name: "Angelica Ramos",
    mobile: "9865326598",
    compony: "London",
  },
  {
    id: 25,
    company_name: "Gavin Joyce",
    mobile: "9865326598",
    compony: "Edinburgh",
  },
  {
    id: 26,
    company_name: "Jennifer Chang",
    mobile: "9865326598",
    compony: "Singapore",
  },
  {
    id: 27,
    company_name: "Brenden Wagner",
    mobile: "9865326598",
    compony: "San Francisco",
  },
  {
    id: 28,
    company_name: "Fiona Green",
    mobile: "9865326598",
    compony: "San Francisco",
  },
  {
    id: 29,
    company_name: "Shou Itou",
    mobile: "9865326598",
    compony: "Tokyo",
  },
  {
    id: 30,
    company_name: "Michelle House",
    mobile: "9865326598",
    compony: "Sidney",
  },

  {
    id: 31,
    company_name: "Suki Burks",
    mobile: "9865326598",
    compony: "London",
  },
  {
    id: 32,
    company_name: "Prescott Bartlett",
    mobile: "9865326598",
    compony: "London",
  },
  {
    id: 33,
    company_name: "Gavin Cortez",
    mobile: "9865326598",
    compony: "San Francisco",
  },
  {
    id: 34,
    company_name: "Martena Mccray",
    mobile: "9865326598",
    compony: "Edinburgh",
  },
  {
    id: 35,
    company_name: "Unity Butler",
    mobile: "9865326598",
    compony: "San Francisco",
  },
];
