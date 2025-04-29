import { Fragment } from "react";
import { useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
 import  AddRole  from "@/partials/modals/add-role/AddRole";

const UserRoleList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "User Roles" }]} />
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
            <button
              className="btn btn-primary"
              title="Add Role"
              onClick={handleModalOpen}
            >
              <i className="ki-filled ki-plus"></i> Add Role
            </button>
          </div>
        </div>
        <div className="card min-w-full">
          <div className="card-table">
            <table className="table table-border align-middle text-gray-700 font-medium text-sm">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Access</th>
                  <th>Users</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Manager</td>
                  <td>All leads</td>
                  <td>
                    2{" "}
                    <a href="#" title="View users">
                      <i class="ki-filled ki-eye text-md"></i>
                    </a>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear"
                        title="Edit"
                      >
                        <i class="ki-filled ki-notepad-edit"></i>
                      </a>
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear text-danger"
                        title="Delete"
                      >
                        <i class="ki-filled ki-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Seles Person</td>
                  <td>All leads</td>
                  <td>
                    1{" "}
                    <a href="#" title="View users">
                      <i class="ki-filled ki-eye text-md"></i>
                    </a>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear"
                        title="Edit"
                      >
                        <i class="ki-filled ki-notepad-edit"></i>
                      </a>
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear text-danger"
                        title="Delete"
                      >
                        <i class="ki-filled ki-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Other</td>
                  <td>Only assigned eads</td>
                  <td>0</td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear"
                        title="Edit"
                      >
                        <i className="ki-filled ki-notepad-edit"></i>
                      </a>
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear text-danger"
                        title="Delete"
                      >
                        <i className="ki-filled ki-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Manager</td>
                  <td>Only assigned eads</td>
                  <td>
                    2{" "}
                    <a href="#" title="View users">
                      <i className="ki-filled ki-eye text-md"></i>
                    </a>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear"
                        title="Edit"
                      >
                        <i className="ki-filled ki-notepad-edit"></i>
                      </a>
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear text-danger"
                        title="Delete"
                      >
                        <i className="ki-filled ki-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Seles Person</td>
                  <td>Only assigned eads</td>
                  <td>
                    1{" "}
                    <a href="#" title="View users">
                      <i class="ki-filled ki-eye text-md"></i>
                    </a>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear"
                        title="Edit"
                      >
                        <i class="ki-filled ki-notepad-edit"></i>
                      </a>
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear text-danger"
                        title="Delete"
                      >
                        <i class="ki-filled ki-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Other</td>
                  <td>All leads</td>
                  <td>0</td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear"
                        title="Edit"
                      >
                        <i class="ki-filled ki-notepad-edit"></i>
                      </a>
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear text-danger"
                        title="Delete"
                      >
                        <i class="ki-filled ki-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Container>
      <AddRole isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Fragment>
  );
};
export { UserRoleList };
