// Table columns for AddMenuItem (TanStack Table v8 compatible)
export const columns = [
  {
    id: 'index',
    header: '#',
    accessorFn: (_, idx) => idx + 1, // you can use accessorFn for index
  },
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
  },
  {
    id: 'weight',
    header: 'Weight',
    accessorKey: 'weight',
  },
  {
    id: 'unit',
    header: 'Unit',
    accessorKey: 'unit',
  },
  {
    id: 'rate',
    header: 'Rate',
    accessorKey: 'rate',
  },
  {
    id: 'action',
    header: 'Action',
    accessorKey: 'action',
    cell: ({ row }) => (
      <button onClick={() => console.log('Edit', row.original)}>Edit</button>
    ),
  },
];

// Sample empty/default data for initial load
export const defaultData = [
  // Example row:
  // { name: 'Paneer Tikka', weight: '200', unit: 'gm', rate: 150 }
];
