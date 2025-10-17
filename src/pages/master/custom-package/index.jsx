import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "../custom-package/constant";
import useStyle from "./style";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { GetCustomPackageapi, DeleteCustomPackageapi, UpdateCustomPackageStatusapi } from "@/services/apiServices"; // Add delete API

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

    const allPackages = res?.data?.data?.["Package Details"] || [];

    console.log("📦 All package IDs from DB:", allPackages.map(pkg => pkg.id));

    if (allPackages.length > 0) {
     const formatted = allPackages.map((pkg, index) => {
  const totalItemsCount = pkg.customPackageDetails?.reduce((sum, menu) => {
    return sum + (menu.customPackageMenuItemDetails?.length || 0);
  }, 0) || 0;

  return {
    sr_no: index + 1,
    packageid: pkg.id,
    package_name: pkg.nameEnglish,
    price: pkg.price,
    total_items: totalItemsCount, // <- correct total items
    sequence: pkg.sequence,
    isActive: pkg.isActive,
    raw: pkg,
  };
});


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

 const deletePackage = async (packageid) => {
  // Debug: Check what we're trying to delete
  console.log("=== DELETE DEBUG ===");
  console.log("Package ID to delete:", packageid);
  console.log("Type of packageid:", typeof packageid);
  console.log("Current tableData:", tableData);
  
  Swal.fire({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this package!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        console.log("Calling API with ID:", packageid);
        
        // Call the delete API
        const response = await DeleteCustomPackageapi(packageid);
        
        console.log("Full delete response:", response);
        
        if (response?.data?.success) {
          // Remove from local state
          const updated = tableData.filter((pkg) => pkg.packageid !== packageid);
          setTableData(updated);
          
          Swal.fire({
            title: "Deleted!",
            text: response?.data?.msg || "Custom package removed successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          
          // Refresh the data
          await fetchPackages();
        } else {
          // Show the actual error message from API
          Swal.fire({
            title: "Delete Failed",
            text: response?.data?.msg || "Failed to delete package. Please check if the package exists.",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Delete error:", error);
        console.error("Error response:", error?.response);
        Swal.fire({
          title: "Error",
          text: error?.response?.data?.msg || "An error occurred while deleting the package.",
          icon: "error",
        });
      }
    }
  });
};

  const handleEdit = (id) => {
    console.log("✅ Navigating to edit page with id:", id);
    navigate(`/master/custom-package/addpackage?id=${id}`);
  };

  // Move this outside fetchPackages
const statusHandler = async (packageid, isActive) => {
  try {
    const response = await UpdateCustomPackageStatusapi(packageid, isActive);
    console.log("Status update response:", response);

    if (response?.data?.success) {
      // Refetch packages to get the latest data from backend
      await fetchPackages();
      Swal.fire("Updated!", "Status updated successfully", "success");
    } else {
      throw new Error(response?.data?.msg || "Failed to update status");
    }
  } catch (error) {
    console.error("Status update error:", error);
    Swal.fire("Error", error.message || "Failed to update status", "error");

    // Optionally revert toggle on failure
    setTableData((prev) =>
      prev.map((pkg) =>
        pkg.packageid === packageid ? { ...pkg, isActive: !isActive } : pkg
      )
    );
  }
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