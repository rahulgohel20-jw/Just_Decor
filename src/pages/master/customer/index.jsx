import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import useStyle from "./style";
import AddCustomer from "@/partials/modals/add-customer/AddCustomer";
import {
  GetAllCustomer,
  DeleteCustomerApi,
  SearchCustomerApi,
} from "@/services/apiServices";
import ViewCustomer from "../../../partials/modals/view-customer/ViewCustomer";

const CustomerMaster = () => {
  const classes = useStyle();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isViewMemberModalOpen, setIsViewMemberModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tableData, setTableData] = useState();

  useEffect(() => {
    FetchCustomer();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        FetchCustomer();
        return;
      }

      SearchCustomerApi(searchQuery, Id)
        .then(({ data: { data } }) => {
          if (data && data["Party Details"]) {
            const formatted = data["Party Details"].map((cust, index) => ({
              sr_no: index + 1,
              customerid: cust.id,
              customer: cust.nameEnglish || "-",
              address: cust.addressEnglish || "-",
              contact_type: cust.contact.nameEnglish || "-",
              email: cust.email || "-",
              mobile: cust.mobileno || "-",
              gst: cust.gst || "-",
              birthdate: cust.birthDate || "-",
              document: cust.document || "-",
              nameGujarati: cust.nameGujarati || "",
              nameHindi: cust.nameHindi || "",
              addressGujarati: cust.addressGujarati || "",
              addressHindi: cust.addressHindi || "",
              altMobileno: cust.altMobileno || "",
              contactCategoryId: cust.contact?.id,
              image: cust.documentImage || "",
            }));
            setTableData(formatted);
          } else {
            setTableData([]);
          }
        })
        .catch((error) => {
          console.error("Error searching customer:", error);
        });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;
  const FetchCustomer = () => {
    GetAllCustomer(Id)
      .then(({ data: { data } }) => {
        const formatted = data["Party Details"].map((cust, index) => ({
          sr_no: index + 1,
          customerid: cust.id,
          customer: cust.nameEnglish || "-",
          address: cust.addressEnglish || "-",
          contact_type: cust.contact.nameEnglish || "-",
          email: cust.email || "-",
          mobile: cust.mobileno || "-",
          gst: cust.gst || "-",
          birthdate: cust.birthDate || "-",
          document: cust.document || "-",
          nameGujarati: cust.nameGujarati || "",
          nameHindi: cust.nameHindi || "",
          addressGujarati: cust.addressGujarati || "",
          addressHindi: cust.addressHindi || "",
          altMobileno: cust.altMobileno || "",
          contactCategoryId: cust.contact?.id,
        }));

        setTableData(formatted);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const DeleteCustomer = (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      DeleteCustomerApi(customerId)
        .then(() => {
          FetchCustomer();
        })
        .catch((error) => {
          console.error("Error deleting customer:", error);
        });
    }
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
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Customer Master" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div
            className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}
          >
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search Customer"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={handleAddCustomer}
              title="Add Customer"
            >
              <i className="ki-filled ki-plus"></i> Add Customer
            </button>
          </div>
        </div>
        <AddCustomer
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
export default CustomerMaster;
