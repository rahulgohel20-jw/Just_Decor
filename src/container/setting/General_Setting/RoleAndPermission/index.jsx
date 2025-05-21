import { Fragment } from "react";
import { useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
 import  AddRole  from "@/partials/modals/add-role/AddRole";
 import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";

const RoleAndPermission = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEditClick = (data) => {
    setEditData(data);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const responseFormate = () => {
        const data = defaultData.map((item) => {
          return {
            ...item,
            handleModalOpen: handleModalOpen,
          };
        });
        return data;
      };

  const [tableData, setTableData] = useState(responseFormate());
  return (
    <Fragment>
      <Container>
        
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              title="Add Role"
              onClick={() => {
                setIsEditMode(false);
                setEditData(null);
                handleModalOpen();
              }}
            >
              <i className="ki-filled ki-plus"></i> Add Role
            </button>
          </div>
        </div>
        <TableComponent
          columns={columns}
          data={tableData}
          paginationSize={10}
        />
      </Container>
      <AddRole
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isEditMode={isEditMode}
        editData={editData}
      />
    </Fragment>
  );
};
export { RoleAndPermission };
