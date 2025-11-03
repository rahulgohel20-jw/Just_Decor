import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { columns, defaultData } from "./constant";
import { useNavigate } from "react-router-dom";
import { TableComponent } from "@/components/table/TableComponent";

const RenewalCustomer = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState(defaultData);

  return (
    <Fragment>
      <Container>
        <div className="mb-3">
          <Breadcrumbs items={[{ title: "Renewal Plan History" }]} />
        </div>

        <TableComponent columns={columns} data={tableData} />
      </Container>
    </Fragment>
  );
};

export default RenewalCustomer;
