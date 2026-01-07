import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "../custom-package/constant";
import useStyle from "./style";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import {
  GetCustomPackageapi,
  DeleteCustomPackageapi,
  UpdateCustomPackageStatusapi,
} from "@/services/apiServices";

const CustomPackageMaster = () => {
  const classes = useStyle();
  const navigate = useNavigate();
  const intl = useIntl();
  const [tableData, setTableData] = useState([]);
  const [originalData, setOriginalData] = useState([]); // Store raw API data
  const [searchQuery, setSearchQuery] = useState("");

  // --------------------------
  // 🔥 Get translated field
  // --------------------------
  const getTranslatedName = (item) => {
    switch (intl.locale) {
      case "hi":
        return item.nameHindi || item.nameEnglish || "-";
      case "gu":
        return item.nameGujarati || item.nameEnglish || "-";
      default:
        return item.nameEnglish || "-";
    }
  };

  // Helper function to format package data
  const formatPackageData = (packages) => {
    return packages.map((pkg, index) => {
      const totalItemsCount =
        pkg.customPackageDetails?.reduce((sum, menu) => {
          return sum + (menu.customPackageMenuItemDetails?.length || 0);
        }, 0) || 0;

      return {
        sr_no: index + 1,
        packageid: pkg.id,
        package_name: getTranslatedName(pkg), // ← 🔥 Auto Translated
        price: pkg.price,
        total_items: totalItemsCount,
        sequence: pkg.sequence,
        isActive: pkg.isActive,
        raw: pkg,
      };
    });
  };

  const fetchPackages = async () => {
    try {
      const Id = localStorage.getItem("userId");
      if (!Id) {
        Swal.fire("Error", "User ID not found!", "error");
        return;
      }

      const res = await GetCustomPackageapi(Id);
      const allPackages = res?.data?.data?.["Package Details"] || [];

      // Store raw API data
      setOriginalData(allPackages);

      // Format with current language
      const formatted = formatPackageData(allPackages);
      setTableData(formatted);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
      Swal.fire("Error", "Failed to fetch package data.", "error");
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // --------------------------
  // 🔥 Re-translate when language changes
  // --------------------------
  useEffect(() => {
    if (originalData.length > 0) {
      const formatted = formatPackageData(originalData);
      setTableData(formatted);
    }
  }, [intl.locale]);

  // --------------------------
  // Search with Debounce
  // --------------------------
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        // Re-format with current language when clearing search
        const formatted = formatPackageData(originalData);
        setTableData(formatted);
        return;
      }

      const filtered = originalData.filter((pkg) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          (pkg.nameEnglish &&
            pkg.nameEnglish.toLowerCase().includes(searchLower)) ||
          (pkg.nameHindi &&
            pkg.nameHindi.toLowerCase().includes(searchLower)) ||
          (pkg.nameGujarati &&
            pkg.nameGujarati.toLowerCase().includes(searchLower))
        );
      });

      const formatted = formatPackageData(filtered);
      setTableData(formatted);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, originalData, intl.locale]);

  const deletePackage = async (packageid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await DeleteCustomPackageapi(packageid);

          if (
            response?.data?.success === true ||
            response?.success ||
            response?.status === 200
          ) {
            Swal.fire({
              title: "Deleted!",
              text: "Custom package removed successfully.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });

            // Refresh the data
            await fetchPackages();
          } else {
            Swal.fire({
              title: "Delete Failed",
              text: response?.data?.msg || "Failed to delete package.",
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire({
            title: "Error",
            text:
              error?.response?.data?.msg || "An error occurred while deleting.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/master/custom-package/addpackage?id=${id}`);
  };

  const statusHandler = async (packageid, isActive) => {
    try {
      const response = await UpdateCustomPackageStatusapi(packageid, isActive);

      if (response?.data?.success === true) {
        await fetchPackages();
        Swal.fire({
          title: "Updated!",
          text: "Status updated successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(response?.data?.msg || "Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      Swal.fire("Error", error.message || "Failed to update status", "error");

      // Revert toggle on failure
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
        <div className=" pb-2 mb-3">
          <h1 className="text-xl text-gray-900">
            <FormattedMessage
              id="COMMON.CUSTOMSIDEBAR_PACKAGE"
              defaultMessage="Menu Package Master"
            />
          </h1>
        </div>

        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div
            className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}
          >
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={intl.formatMessage({
                  id: "USER.MASTER.SEARCH_PACKAGE",
                  defaultMessage: "Search Package",
                })}
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
              <i className="ki-filled ki-plus"></i>
              <FormattedMessage
                id="USER.MASTER.ADD_CONTACT_CATEGORY"
                defaultMessage="Create New"
              />
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
