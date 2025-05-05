import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Badge } from '@/components/ui/badge';
import { toAbsoluteUrl } from "@/utils";
import AddSales from "@/partials/modals/add-sales/AddSales";
import { defaultData } from "./constant";


const SalesTeamList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleModalOpen = () => {
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
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Sales Team" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search member"
                type="text"
              />
            </div>
            <div className="filItems">
              <select className="select pe-7.5">
                <option value="0">Select Roles</option>
                <option value="1">Sels Person</option>
                <option value="2">Manager</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-primary" onClick={handleModalOpen} title="Add Member">
              <i class="ki-filled ki-plus"></i> Add Member
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
                  <th>Leads Assined</th>
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
                            <div div href="#" className="text-sm cursor-pointer font-semibold text-gray-900 hover:text-primary-active">Ragnar Lothbrok</div>
                            <span className="text-2sm font-normal text-gray-500">ragnar.lothbrok@gmail.com</span>
                        </div>
                    </div>
                  </td>
                  <td>+ 91 99887766</td>
                  <td>Esther Howard</td>
                  <td>5</td>
                  <td><Badge className="badge badge-sm badge-pill badge-warning badge-outline text-xs" title="Sels Person">Sels Person</Badge></td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <button className="btn btn-sm btn-icon btn-clear" title="View"><i className="ki-filled ki-eye"></i></button>
                      <button className="btn btn-sm btn-icon btn-clear" title="Edit"><i className="ki-filled ki-notepad-edit"></i></button>
                      <button className="btn btn-sm btn-icon btn-clear text-danger" title="Delete" ><i className="ki-filled ki-trash"></i></button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="flex items-center gap-2.5 py-1">
                        <img className="size-9 rounded-full shrink-0" src={toAbsoluteUrl("/images/user_img.jpg")} alt="" />
                        <div className="flex flex-col">
                            <div href="#" className="text-sm cursor-pointer font-semibold text-gray-900 hover:text-primary-active">Ragnar Lothbrok</div>
                            <span className="text-2sm font-normal text-gray-500">ragnar.lothbrok@gmail.com</span>
                        </div>
                    </div>
                  </td>
                  <td>+ 91 99887766</td>
                  <td>Esther Howard</td>
                  <td>5</td>
                  <td><Badge className="badge badge-sm badge-pill badge-info badge-outline text-xs" title="Manager">Manager</Badge></td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <button className="btn btn-sm btn-icon btn-clear" title="View"><i className="ki-filled ki-eye"></i></button>
                      <button className="btn btn-sm btn-icon btn-clear" title="Edit"><i className="ki-filled ki-notepad-edit"></i></button>
                      <button className="btn btn-sm btn-icon btn-clear text-danger" title="Delete" ><i className="ki-filled ki-trash"></i></button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="flex items-center gap-2.5 py-1">
                        <img className="size-9 rounded-full shrink-0" src={toAbsoluteUrl("/images/user_img.jpg")} alt="" />
                        <div className="flex flex-col">
                            <div href="#" className="text-sm cursor-pointer font-semibold text-gray-900 hover:text-primary-active">Ragnar Lothbrok</div>
                            <span className="text-2sm font-normal text-gray-500">ragnar.lothbrok@gmail.com</span>
                        </div>
                    </div>
                  </td>
                  <td>+ 91 99887766</td>
                  <td>Esther Howard</td>
                  <td>5</td>
                  <td><Badge className="badge badge-sm badge-pill badge-warning badge-outline text-xs" title="Sels Person">Sels Person</Badge></td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <button className="btn btn-sm btn-icon btn-clear" title="View"><i className="ki-filled ki-eye"></i></button>
                      <button className="btn btn-sm btn-icon btn-clear" title="Edit"><i className="ki-filled ki-notepad-edit"></i></button>
                      <button className="btn btn-sm btn-icon btn-clear text-danger" title="Delete" ><i className="ki-filled ki-trash"></i></button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="flex items-center gap-2.5 py-1">
                        <img className="size-9 rounded-full shrink-0" src={toAbsoluteUrl("/images/user_img.jpg")} alt="" />
                        <div className="flex flex-col">
                            <div href="#" className="text-sm cursor-pointer font-semibold text-gray-900 hover:text-primary-active">Ragnar Lothbrok</div>
                            <span className="text-2sm font-normal text-gray-500">ragnar.lothbrok@gmail.com</span>
                        </div>
                    </div>
                  </td>
                  <td>+ 91 99887766</td>
                  <td>Esther Howard</td>
                  <td>5</td>
                  <td><Badge className="badge badge-sm badge-pill badge-info badge-outline text-xs" title="Manager">Manager</Badge></td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <button className="btn btn-sm btn-icon btn-clear" title="View"><i className="ki-filled ki-eye"></i></button>
                      <button className="btn btn-sm btn-icon btn-clear" title="Edit"><i className="ki-filled ki-notepad-edit"></i></button>
                      <button className="btn btn-sm btn-icon btn-clear text-danger" title="Delete" ><i className="ki-filled ki-trash"></i></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Container>
            <AddSales isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

    </Fragment>
  );
};
export { SalesTeamList };
