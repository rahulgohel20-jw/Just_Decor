import { useState, useEffect } from "react";
import { TableComponent } from "@/components/table/TableComponent";
import AddGrossary from "@/partials/modals/event/add-grossary/AddGrossary";
import { table_data, columns, modal_columns } from "./constant";

const GrossaryItems = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tableData, setTableData] = useState();


  const responseFormate = () => {
  return table_data.map((item) => ({
    ...item,
  }));
};



const handleModalOpen = () => {
  setIsModalOpen(true);
};
const expandable = {
  expandedRowRender: (record) => (
    <div style={{ padding: '10px' }}>
      <strong>Row Material:</strong> {record.row_material} <br />
      <strong>Final Qty:</strong> {record.final_qty} {record.unit} <br />
      <strong>Place:</strong> {record.place} <br />
      <strong>Total Price:</strong> ₹{record.total_price}
    </div>
  ),
  rowExpandable: (record) => !!record.row_material, // Optional condition
};

useEffect(() => {
    setTableData(responseFormate());
  }, []);

return (
    <>
    <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
      <div className="flex flex-wrap items-end gap-2">
        <button
          className="btn btn-primary"
          onClick={handleModalOpen}
          title="Agency, Place & Date Allocation"
        >
          <i className="ki-filled ki-plus"></i> Agency, Place & Date Allocation 
        </button>
      </div>
    </div>
      <TableComponent 
        columns={columns} 
        data={tableData}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <strong>Row Material:</strong> {record.row_material}
              <br />
              <strong>Agency:</strong> {record.agency || 'N/A'}
              <br />
              <strong>Total Price:</strong> {record.total_price}
            </div>
          ),
        }}
        paginationSize={10}
      />
      <AddGrossary
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        columns={modal_columns}
        tableData={tableData}
      />
    </>
  );
};

export default GrossaryItems;
