import { message, Spin, Input } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { getColumns, defaultData } from "./constant";

const Plan = () => {
  const columns = getColumns();

  return (
    <Container>
      <div className="gap-2 pb-2 mb-3">
        <Breadcrumbs items={[{ title: "Plan" }]} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <Input.Search
          placeholder="Search users..."
          allowClear
          style={{ width: 250 }}
        />

        <button className="btn btn-primary flex items-center gap-1">
          <i className="ki-filled ki-plus"></i> Add Plan
        </button>
      </div>

      <TableComponent
        columns={columns}
        data={defaultData}
        paginationSize={10}
      />
    </Container>
  );
};

export default Plan;
