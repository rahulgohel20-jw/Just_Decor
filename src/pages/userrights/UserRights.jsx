import { Fragment } from "react";
import { useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";

const UserRights = () => {
  const [tableData, setTableData] = useState(defaultData);

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "User Rights" }]} />
        </div>
        <TableComponent columns={columns} data={tableData} />
      </Container>
    </Fragment>
  );
};
export default UserRights;
