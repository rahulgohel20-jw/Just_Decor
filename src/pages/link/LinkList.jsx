import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";

const LinkList = () => {
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Links" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search here"
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-primary" title=" Add Company">
              <i class="ki-filled ki-plus"></i> Add Link
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="btn-tabs btn-tabs-lg mb-5 w-full" data-tabs="true">
          <a className="btn active" title="Sales">
            Sales
          </a>
          <a className="btn" title="Marketing">
            Marketing
          </a>
          <a className="btn" title="Customer Support">
            Customer Support
          </a>
          <a className="btn" title="HR/Admin">
            HR/Admin
          </a>
          <a className="btn" title="General">
            General
          </a>
          <a className="btn" title="Automation">
            Automation
          </a>
          <a className="btn" title="Operation">
            Operation
          </a>
        </div>
        <div className="card min-w-full">
          <div className="card-table">
            <table className="table table-border align-middle text-gray-700 font-medium text-sm">
              <thead>
                <tr>
                  <th>Link name</th>
                  <th>Discription</th>
                  <th>URL</th>
                  <th>Attachment</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sample name</td>
                  <td>Lorem Ipsum is simply dummy text of the printing and typesetting industry</td>
                  <td> <a href="#" title="https://www.google.com">https://www.google.com <i class="ki-filled ki-arrow-up-right ms-1"></i></a></td>
                  <td>sampleimg.jpg</td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                        <a href="#" className="btn btn-sm btn-icon btn-clear" title="View"><i class="ki-filled ki-search-list"></i></a>
                        <a href="#" className="btn btn-sm btn-icon btn-clear" title="Edit"><i class="ki-filled ki-notepad-edit"></i></a>
                        <a href="#" className="btn btn-sm btn-icon btn-clear" title="Make a copy"><i class="ki-filled ki-copy"></i></a>
                        <a href="#" className="btn btn-sm btn-icon btn-clear text-danger" title="Delete"><i class="ki-filled ki-trash"></i></a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Sample name</td>
                  <td>Lorem Ipsum is simply dummy text of the printing and typesetting industry</td>
                  <td> <a href="#" title="https://www.google.com">https://www.google.com <i class="ki-filled ki-arrow-up-right ms-1"></i></a></td>
                  <td>sampleimg.jpg</td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                        <a href="#" className="btn btn-sm btn-icon btn-clear" title="View"><i class="ki-filled ki-search-list"></i></a>
                        <a href="#" className="btn btn-sm btn-icon btn-clear" title="Edit"><i class="ki-filled ki-notepad-edit"></i></a>
                        <a href="#" className="btn btn-sm btn-icon btn-clear" title="Make a copy"><i class="ki-filled ki-copy"></i></a>
                        <a href="#" className="btn btn-sm btn-icon btn-clear text-danger" title="Delete"><i class="ki-filled ki-trash"></i></a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Sample name</td>
                  <td>Lorem Ipsum is simply dummy text of the printing and typesetting industry</td>
                  <td> <a href="#" title="https://www.google.com">https://www.google.com <i class="ki-filled ki-arrow-up-right ms-1"></i></a></td>
                  <td>sampleimg.jpg</td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                        <a href="#" className="btn btn-sm btn-icon btn-clear" title="View"><i class="ki-filled ki-search-list"></i></a>
                        <a href="#" className="btn btn-sm btn-icon btn-clear" title="Edit"><i class="ki-filled ki-notepad-edit"></i></a>
                        <a href="#" className="btn btn-sm btn-icon btn-clear" title="Make a copy"><i class="ki-filled ki-copy"></i></a>
                        <a href="#" className="btn btn-sm btn-icon btn-clear text-danger" title="Delete"><i class="ki-filled ki-trash"></i></a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Sample name</td>
                  <td>Lorem Ipsum is simply dummy text of the printing and typesetting industry</td>
                  <td> <a href="#" title="https://www.google.com">https://www.google.com <i class="ki-filled ki-arrow-up-right ms-1"></i></a></td>
                  <td>sampleimg.jpg</td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                        <a href="#" className="btn btn-sm btn-icon btn-clear" title="View"><i class="ki-filled ki-search-list"></i></a>
                        <a href="#" className="btn btn-sm btn-icon btn-clear" title="Edit"><i class="ki-filled ki-notepad-edit"></i></a>
                        <a href="#" className="btn btn-sm btn-icon btn-clear" title="Make a copy"><i class="ki-filled ki-copy"></i></a>
                        <a href="#" className="btn btn-sm btn-icon btn-clear text-danger" title="Delete"><i class="ki-filled ki-trash"></i></a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export { LinkList };
