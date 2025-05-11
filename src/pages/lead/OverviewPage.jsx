import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import CompanyDropdown from "@/components/dropdowns/CompanyDropdown";

const OverviewPage = () => {
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Overview" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems">
              <select className="select pe-7.5">
                <option value="0">Select Lead</option>
                <option value="1">Lead one</option>
                <option value="2">Lead two</option>
                <option value="3">Lead three</option>
                <option value="4">Lead four</option>
              </select>
            </div>
            <div className="filItems">
              <select className="select pe-7.5">
                <option value="0">Select Lead</option>
                <option value="1">Lead one</option>
                <option value="2">Lead two</option>
                <option value="3">Lead three</option>
                <option value="4">Lead four</option>
              </select>
            </div>
            <div className="filItems">
              <CompanyDropdown />
            </div>
            <div className="filItems">
              <select className="select pe-7.5">
                <option value="0">Select Company</option>
              </select>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Refresh">
                <i className="ki-filled ki-arrows-circle"></i>
              </button>
            </div>
            <div className="filItems">
              <button className="btn btn-light" title="Refresh">
                Custom Report
              </button>
            </div>
          </div>
        </div>

        {/* Lead Cards */}
        <div className="w-full">
          <div className="flex justify-between items-end gap-2 mb-2">
            <div className="flex flex-wrap gap-2">
              <Badge
                className="badge badge-outline badge-success text-xs"
                title="Type one"
              >
                <span className="flex items-center">
                  <i className="ki-filled ki-chart-line-up text-sm me-1"></i>
                  <span className="flex flex-col">
                    <span>
                      Total: <strong>3</strong>
                    </span>
                    <span>
                      Amount: <strong>&#8377;22,000/-</strong>
                    </span>
                  </span>
                </span>
              </Badge>
              <Badge
                className="badge badge-outline badge-dark text-xs"
                title="Type one"
              >
                <span className="flex items-center">
                  <i className="ki-filled ki-chart-line-up text-sm me-1"></i>
                  <span className="flex flex-col">
                    <span>
                      Open: <strong>150</strong>
                    </span>
                    <span>
                      Amount: <strong>&#8377;0/-</strong>
                    </span>
                  </span>
                </span>
              </Badge>
              <Badge
                className="badge badge-outline badge-info text-xs"
                title="Type one"
              >
                <span className="flex items-center">
                  <i className="ki-filled ki-chart-line-up text-sm me-1"></i>
                  <span className="flex flex-col">
                    <span>
                      Won: <strong>1</strong>
                    </span>
                    <span>
                      Amount: <strong>&#8377;22.000/-</strong>
                    </span>
                  </span>
                </span>
              </Badge>
              <Badge
                className="badge badge-outline badge-danger text-xs"
                title="Type one"
              >
                <span className="flex items-center">
                  <i className="ki-filled ki-chart-line-up text-sm me-1"></i>
                  <span className="flex flex-col">
                    <span>
                      Lost: <strong>3</strong>
                    </span>
                    <span>
                      Amount: <strong>&#8377;0/-</strong>
                    </span>
                  </span>
                </span>
              </Badge>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export { OverviewPage };
