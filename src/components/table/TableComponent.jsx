import { DataGrid } from "@/components";

const TableComponent = ({
  columns,
  data,
  paginationSize,
  defaultSorting,
  toolbar,
  expandable
}) => {
  return (
    <DataGrid
      columns={columns}
      data={data}
      pagination={{ size: paginationSize }}
      sorting={defaultSorting}
      expandable={expandable}
      toolbar={toolbar}
      layout={{ card: true }}
    />
  );
};

export { TableComponent };
