import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant"; 
import useStyle from "./style";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CustomPackageMaster = () => {
  const classes = useStyle();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // static mock data
  const mockData = [
    { sr_no: 1, package_name: "Starter Pack", packageid: 101, isActive: true },
    { sr_no: 2, package_name: "Pro Pack", packageid: 102, isActive: false },
    { sr_no: 3, package_name: "Enterprise Pack", packageid: 103, isActive: true },
  ];

  useEffect(() => {
    setTableData(mockData);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setTableData(mockData);
    } else {
      const filtered = mockData.filter((pkg) =>
        pkg.package_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTableData(filtered);
    }
  }, [searchQuery]);

  const deletePackage = (packageid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This is static demo, item will just be removed from table!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = tableData.filter((pkg) => pkg.packageid !== packageid);
        setTableData(updated);
        Swal.fire({
          title: "Removed!",
          text: "Custom package removed (static).",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleEdit = (pkg) => {
    // Navigate to edit page with query param or id
    navigate(`/master/custom-package/addpackage?id=${pkg.packageid}`);
  };

  const statusHandler = (id, status) => {
    const updated = tableData.map((pkg) =>
      pkg.packageid === id ? { ...pkg, isActive: status === 1 } : pkg
    );
    setTableData(updated);
    Swal.fire("Updated!", "Status updated (static)", "success");
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Custom Package Master" }]} />
        </div>

        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search Package"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/master/custom-package/addpackage")}
              title="Add Package"
            >
              <i className="ki-filled ki-plus"></i> Add Package
            </button>
          </div>
        </div>

        {/* table */}
        <TableComponent
          columns={columns(handleEdit, deletePackage, statusHandler)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export default CustomPackageMaster;
