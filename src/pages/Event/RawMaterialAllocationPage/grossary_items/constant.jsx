
export const table_data = [
  { 
    sr_no: 1, 
    row_material: 'GHEE', 
    qty: '4.500 kg', 
    final_qty: '4.500', 
    unit: 'KiloGram',
    agency: '',
    place: 'At Venue',
    total_price: 2295.0,
  },
  { 
    sr_no: 2, 
    row_material: 'TATA SALT ( NAMAK )', 
    qty: '5.500 Kg', 
    final_qty: 5.500, 
    unit: 'KiloGram',
    agency: '',
    place: 'At Venue',
    total_price: 110.0,
  },
  { 
    sr_no: 3, 
    row_material: 'MAIDA', 
    qty: '16.500 Kg', 
    final_qty: 16.500, 
    unit: 'KiloGram',
    agency: 'HARDIK BHAI GAS',
    place: 'At Venue',
    total_price: 462,
  },
  { 
    sr_no: 4, 
    row_material: 'SUGAR (SHAKKAR)', 
    qty: '6 Kg', 
    final_qty: 6, 
    unit: 'KiloGram',
    agency: '',
    place: 'At Venue',
    total_price: 210,
  },
  { 
    sr_no: 5, 
    row_material: 'AJINO MOTO', 
    qty: '750 g', 
    final_qty: 750, 
    unit: 'Gram',
    agency: '',
    place: 'At Venue',
    total_price: 90,
  },
  { 
    sr_no: 6, 
    row_material: 'OIL', 
    qty: '16 L', 
    final_qty: 16, 
    unit: 'Liter',
    agency: 'HARDIK BHAI GAS',
    place: 'At Venue',
    total_price: 3200,
  },
  { 
    sr_no: 7, 
    row_material: 'COCONUT MILK TIN', 
    qty: '10 NOS', 
    final_qty: 10, 
    unit: 'NOS',
    agency: '',
    place: 'At Venue',
    total_price: 690,
  },
];


export const columns = [
  {
    accessorKey: "sr_no",
    header: "#",
  },
  {
    accessorKey: "row_material",
    header: "Row Material",
  },
  {
    accessorKey: "qty",
    header: "Qty",
  },
  {
    accessorKey: "final_qty",
      header: "Final Qty",
      cell: ({ row }) => (
         <div className="input">
        <input
          type="text"
          className=""
          value={row.original.final_qty}
          name="final_qty"
          onChange={(e) => {
            const updated = [...tableData];
            updated[row.index].final_qty = e.target.value;
            setTableData(updated);
          }}
        />
        </div>
      ),
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => (
            <select className="select pe-7.5">
              <option value="1">KiloGram</option>
              <option value="2">Gram</option>
            </select>
      ),
  },
  {
    accessorKey: "agency",
    header: "Agency",
  },
  {
    accessorKey: "place",
    header: "Place",
  },
  {
    accessorKey: "total_price",
    header: "Total Price",
    cell: ({ row }) => (
         <div className="input">
        <input
          type="text"
          className=""
          value={row.original.total_price}
          name="total_price"
          onChange={(e) => {
            const updated = [...tableData];
            updated[row.index].total_price = e.target.value;
            setTableData(updated);
          }}
        />
        </div>
      ),
  },
];

export const modal_columns = [
  {
    accessorKey: "sr_no",
    header: "#",
  },
  {
    accessorKey: "row_material",
    header: "Row Material",
  },
  {
    accessorKey: "agency",
    header: "Agency",
    cell: ({ row }) => (
            <select className="select pe-7.5">
              <option value="">TIRUPATI AGRO</option>
              <option value="">HARDIKBHAI GAS</option>
              <option value="">KANUBHAI GAS</option>
              <option value="">SURBHI DAIRY</option>
            </select>
      ),
  },
  {
    accessorKey: "place",
    header: "Place",
    cell: ({ row }) => (
            <select className="select pe-7.5">
              <option value="">At Venue</option>
              <option value="">Godown</option>
            </select>
      ),
  },
  {
    accessorKey: "date_time",
    header: "Date & Time",
    cell: ({ row }) => (
         <div className="input">
        <input
          type="date"
          className=""
          value={row.original.date_time}
          name="date_time"
          onChange={(e) => {
            const updated = [...tableData];
            updated[row.index].date_time = e.target.value;
            setTableData(updated);
          }}
        />
        </div>
      ),
  },
];
