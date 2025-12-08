// MenuItemMaster/components/RawMaterialTable.jsx
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "../constant";

const RawMaterialTable = ({ data, onEditRow, onDeleteRow }) => {
  return (
    <TableComponent
      columns={columns(onEditRow, onDeleteRow)}
      data={data}
      paginationSize={2}
    />
  );
};

export default RawMaterialTable;
