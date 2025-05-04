import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Badge } from '@/components/ui/badge';
import { toAbsoluteUrl } from "@/utils";

const MemberList = () => {
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "All Members" }]} />
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
            <div className="filItems">
              <select className="select pe-7.5">
                <option value="0">Reporting Manager</option>
                <option value="1">Devon Lane</option>
                <option value="2">Kathryn Murphy</option>
                <option value="3">Albert Flores</option>
                <option value="4">Wade Warren</option>
              </select>
            </div>
            <div className="filItems">
              <select className="select pe-7.5">
                <option value="0">All</option>
                <option value="1">Admin</option>
                <option value="2">Manager</option>
                <option value="3">Team Manager</option>
              </select> 
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-primary" title="Add Member">
              <i className="ki-filled ki-plus"></i> Add Member
            </button>
          </div>
        </div>
        <div className="card min-w-full">
          <div className="card-table">
            <table className="table table-border align-middle text-gray-700 font-medium text-sm">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Mobile</th>
                  <th>Reports to</th>
                  <th>Role</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="flex items-center gap-2.5 py-1">
                        <img className="size-9 rounded-full shrink-0" src={toAbsoluteUrl("/images/user_img.jpg")} alt="" />
                        <div className="flex flex-col">
                            <a href="#" className="text-sm font-semibold text-gray-900 hover:text-primary-active">Ragnar Lothbrok</a>
                            <span className="text-2sm font-normal text-gray-500">ragnar.lothbrok@gmail.com</span>
                        </div>
                    </div>
                  </td>
                  <td>+ 91 99887766</td>
                  <td>Esther Howard</td>
                  <td><Badge class="badge badge-sm badge-pill badge-info badge-outline text-xs" title="Team Member">Team Member</Badge></td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="btn btn-sm btn-icon btn-clear text-success"
                        title="Add to Seals team"
                      >
                        <i className="ki-filled ki-plus-squared"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-icon btn-clear"
                        title="Edit"
                      >
                        <i className="ki-filled ki-notepad-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-icon btn-clear text-danger"
                        title="Delete"
                      >
                        <i className="ki-filled ki-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="flex items-center gap-2.5 py-1">
                        <img className="size-9 rounded-full shrink-0" src={toAbsoluteUrl("/images/user_img.jpg")} alt="" />
                        <div className="flex flex-col">
                            <a href="#" className="text-sm font-semibold text-gray-900 hover:text-primary-active">Ragnar Lothbrok</a>
                            <span className="text-2sm font-normal text-gray-500">ragnar.lothbrok@gmail.com</span>
                        </div>
                    </div>
                  </td>
                  <td>+ 91 99887766</td>
                  <td>Esther Howard</td>
                  <td><Badge class="badge badge-sm badge-pill badge-warning badge-outline text-xs" title="Manager">Manager</Badge></td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear text-success"
                        title="Add to Seals team"
                      >
                        <i className="ki-filled ki-plus-squared"></i>
                      </a>
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
                  <td>
                    <div className="flex items-center gap-2.5 py-1">
                        <img className="size-9 rounded-full shrink-0" src={toAbsoluteUrl("/images/user_img.jpg")} alt="" />
                        <div className="flex flex-col">
                            <a href="#" className="text-sm font-semibold text-gray-900 hover:text-primary-active">Ragnar Lothbrok</a>
                            <span className="text-2sm font-normal text-gray-500">ragnar.lothbrok@gmail.com</span>
                        </div>
                    </div>
                  </td>
                  <td>+ 91 99887766</td>
                  <td>Esther Howard</td>
                  <td><Badge class="badge badge-sm badge-pill badge-info badge-outline text-xs" title="Team Member">Team Member</Badge></td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear text-success"
                        title="Add to Seals team"
                      >
                        <i className="ki-filled ki-plus-squared"></i>
                      </a>
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
                  <td>
                    <div className="flex items-center gap-2.5 py-1">
                        <img className="size-9 rounded-full shrink-0" src={toAbsoluteUrl("/images/user_img.jpg")} alt="" />
                        <div className="flex flex-col">
                            <a href="#" className="text-sm font-semibold text-gray-900 hover:text-primary-active">Ragnar Lothbrok</a>
                            <span className="text-2sm font-normal text-gray-500">ragnar.lothbrok@gmail.com</span>
                        </div>
                    </div>
                  </td>
                  <td>+ 91 99887766</td>
                  <td>Esther Howard</td>
                  <td><Badge class="badge badge-sm badge-pill badge-warning badge-outline text-xs" title="Manager">Manager</Badge></td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href="#"
                        className="btn btn-sm btn-icon btn-clear text-success"
                        title="Add to Seals team"
                      >
                        <i className="ki-filled ki-plus-squared"></i>
                      </a>
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
                  <td>
                    <div className="flex items-center gap-2.5 py-1">
                        <img className="size-9 rounded-full shrink-0" src={toAbsoluteUrl("/images/user_img.jpg")} alt="" />
                        <div className="flex flex-col">
                            <a href="#" className="text-sm font-semibold text-gray-900 hover:text-primary-active">Ragnar Lothbrok</a>
                            <span className="text-2sm font-normal text-gray-500">ragnar.lothbrok@gmail.com</span>
                        </div>
                    </div>
                  </td>
                  <td>+ 91 99887766</td>
                  <td>Esther Howard</td>
                  <td><Badge class="badge badge-sm badge-pill badge-success badge-outline text-xs" title="Admin">Admin</Badge></td>
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
                  <td>
                    <div className="flex items-center gap-2.5 py-1">
                        <img className="size-9 rounded-full shrink-0" src={toAbsoluteUrl("/images/user_img.jpg")} alt="" />
                        <div className="flex flex-col">
                            <a href="#" className="text-sm font-semibold text-gray-900 hover:text-primary-active">Ragnar Lothbrok</a>
                            <span className="text-2sm font-normal text-gray-500">ragnar.lothbrok@gmail.com</span>
                        </div>
                    </div>
                  </td>
                  <td>+ 91 99887766</td>
                  <td>Esther Howard</td>
                  <td><Badge class="badge badge-sm badge-pill badge-success badge-outline text-xs" title="Admin">Admin</Badge></td>
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
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export { MemberList };
