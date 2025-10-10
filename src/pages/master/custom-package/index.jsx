import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "../custom-package/constant";
import useStyle from "./style";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { GetCustomPackageapi } from "@/services/apiServices";

const CustomPackageMaster = () => {
  const classes = useStyle();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPackages = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) {
        Swal.fire("Error", "User ID not found!", "error");
        return;
      }

      const res = await GetCustomPackageapi(userData.id);

      if (res?.data?.data?.["Package Details"]?.length > 0) {
        const formatted = res.data.data["Package Details"].map((pkg, index) => ({
          sr_no: index + 1,
          packageid: pkg.id,
          package_name: pkg.nameEnglish,
          price: pkg.price,
          total_items: pkg.customPackageDetails?.length || 0,
          sequence: pkg.sequence,
          isActive: pkg.isActive,
          raw: pkg,
        }));
        setTableData(formatted);
      } else {
        setTableData([]);
      }
    } catch (err) {
      console.error("Failed to fetch packages:", err);
      Swal.fire("Error", "Failed to fetch package data.", "error");
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchPackages();
    } else {
      setTableData((prev) =>
        prev.filter((pkg) =>
          pkg.package_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery]);

  const deletePackage = (packageid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this package!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = tableData.filter((pkg) => pkg.packageid !== packageid);
        setTableData(updated);
        Swal.fire({
          title: "Deleted!",
          text: "Custom package removed successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // ✅ FIXED: Receives id (number), not object
  const handleEdit = (id) => {
    console.log("✅ Navigating to edit page with id:", id);
    navigate(`/master/custom-package/addpackage?id=${id}`);
  };

  const statusHandler = (id, status) => {
    const updated = tableData.map((pkg) =>
      pkg.packageid === id ? { ...pkg, isActive: status === 1 } : pkg
    );
    setTableData(updated);
    Swal.fire("Updated!", "Status updated successfully", "success");
  };

  return (
    <Fragment>
      <Container>
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Custom Package Master" }]} />
        </div>

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