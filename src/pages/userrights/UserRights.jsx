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

        <div className="w-fit filItems relative mb-4">
          <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
          <input className="input pl-8" type="text" placeholder="Search Role" />
        </div>
        <TableComponent columns={columns} data={tableData} />
      </Container>
    </Fragment>
  );
};
export default UserRights;
