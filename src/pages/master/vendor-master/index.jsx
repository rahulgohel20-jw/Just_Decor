import { Fragment, useEffect, useState } from "react"; // removed useStyle
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";

import AddCustomer from "@/partials/modals/add-customer/AddCustomer";
import {
  GetAllCustomer,
  DeleteCustomerApi,
  SearchCustomerApi,
} from "@/services/apiServices";
import ViewCustomer from "../../../partials/modals/view-customer/ViewCustomer";
import Swal from "sweetalert2";
import { FormattedMessage, useIntl } from "react-intl";
import AddVendor from "../../../partials/modals/add-vendor/AddVendor";

const VendorMaster = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isViewMemberModalOpen, setIsViewMemberModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tableData, setTableData] = useState([]);

  const intl = useIntl();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData.id;
  const lang = localStorage.getItem("lang") || "en";

  // Exclude contact type ID 2 (Customer)
  const excludedContactTypeIds = [2];

  const getNameByLang = (cust) => {
    switch (lang) {
      case "hi":
        return cust.nameHindi || cust.nameEnglish || "-";
      case "gu":
        return cust.nameGujarati || cust.nameEnglish || "-";
      default:
        return cust.nameEnglish || "-";
    }
  };

  const getAddressByLang = (cust) => {
    switch (lang) {
      case "hi":
        return cust.addressHindi || cust.addressEnglish || "-";
      case "gu":
        return cust.addressGujarati || cust.addressEnglish || "-";
      default:
        return cust.addressEnglish || "-";
    }
  };

  const getContactTypeByLang = (cust) => {
    if (!cust.contact) return "-";
    switch (lang) {
      case "hi":
        return cust.contact.nameHindi || cust.contact.nameEnglish || "-";
      case "gu":
        return cust.contact.nameGujarati || cust.contact.nameEnglish || "-";
      default:
        return cust.contact.nameEnglish || "-";
    }
  };

  const formatCustomerData = (customers) =>
    customers
      .filter((cust) => {
        const contactTypeId = cust.contact?.contactType?.id;
        return contactTypeId !== 2; // Exclude Customer
      })
      .map((cust, index) => ({
        sr_no: index + 1,
        customerid: cust.id,
        customer: getNameByLang(cust),
        address: getAddressByLang(cust),
        contact_type: getContactTypeByLang(cust),
        email: cust.email || "-",
        mobile: cust.mobileno || "-",
        gst: cust.gst || "-",
        birthdate: cust.birthDate || "-",
        document: cust.document || "-",
        altMobileno: cust.altMobileno || "",
        image: cust.documentImage || "",
        contactCategoryId: cust.contactCategory?.id,
        nameEnglish: cust.nameEnglish,
        nameHindi: cust.nameHindi,
        nameGujarati: cust.nameGujarati,
        addressEnglish: cust.addressEnglish,
        addressHindi: cust.addressHindi,
        addressGujarati: cust.addressGujarati,
      }));

  // ------------------ FETCH CUSTOMER ------------------
  useEffect(() => {
    FetchCustomer();
  }, [lang]);

  const FetchCustomer = () => {
    GetAllCustomer(userId)
      .then(({ data: { data } }) => {
        if (data && data["Party Details"]) {
          const formatted = formatCustomerData(data["Party Details"]);
          setTableData(formatted);
        }
      })
      .catch((error) => console.error("Error fetching customers:", error));
  };

  // ------------------ SEARCH CUSTOMER ------------------
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        FetchCustomer();
        return;
      }

      SearchCustomerApi(searchQuery, userId)
        .then(({ data: { data } }) => {
          if (data && data["Party Details"]) {
            const formatted = formatCustomerData(data["Party Details"]);
            setTableData(formatted);
          } else {
            setTableData([]);
          }
        })
        .catch((error) => console.error("Error searching customer:", error));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, lang]);

  // ------------------ DELETE CUSTOMER ------------------
  const DeleteCustomer = (customerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteCustomerApi(customerId)
          .then((response) => {
            if (
              response &&
              (response.success || response.data.success === true)
            ) {
              FetchCustomer();
              Swal.fire({
                title: "Removed!",
                text: "Customer has been removed successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            }
          })
          .catch((error) => console.error("Error deleting customer:", error));
      }
    });
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsMemberModalOpen(true);
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsViewMemberModalOpen(true);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsMemberModalOpen(true);
  };

  return (
    <Fragment>
      <Container>
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="COMMON.VENDOR_MASTER"
                    defaultMessage="Vendor Master"
                  />
                ),
              },
            ]}
          />
        </div>

        {/* Search + Add */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className={`flex flex-wrap items-center gap-2 `}>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>

              <input
                className="input pl-8"
                placeholder={intl.formatMessage({
                  id: "USER.MASTER.SEARCH_CUSTOMER",
                  defaultMessage: "Search Customer...",
                })}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleAddCustomer}>
            <i className="ki-filled ki-plus"></i>{" "}
            <FormattedMessage
              id="USER.MASTER.ADD_CUSTOMER"
              defaultMessage="Add Vendor"
            />
          </button>
        </div>

        <AddVendor
          isModalOpen={isMemberModalOpen}
          setIsModalOpen={setIsMemberModalOpen}
          selectedCustomer={selectedCustomer}
          refreshData={FetchCustomer}
        />

        <ViewCustomer
          isModalOpen={isViewMemberModalOpen}
          setIsModalOpen={setIsViewMemberModalOpen}
          selectedCustomer={selectedCustomer}
        />

        <TableComponent
          columns={columns(
            handleEditCustomer,
            DeleteCustomer,
            handleViewCustomer
          )}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export default VendorMaster;
