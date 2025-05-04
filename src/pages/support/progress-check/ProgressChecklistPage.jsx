import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { toAbsoluteUrl } from "@/utils";

const ProgressChecklistPage = () => {
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Progress Checklist" }]} />
        </div>
        <div className="card min-w-full">
          <div className="card-table">
              <h1 className="text-center p-10">Progress Checklist content here</h1>
          </div>
        </div>




        </Container>
    </Fragment>
  );
};
export { ProgressChecklistPage };
