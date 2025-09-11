import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import {
  GetAllContactType, DeleteContactTypeMaster,updateContactTypeStatus
  
} from "@/services/apiServices";
import useStyle from "./style";
import AddContactType from "@/partials/modals/add-contact-type/AddContactType";



const ContactTypeMaster = () => {
  const classes = useStyle();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedcontactType, setSelectedcontactType] = useState(null);
  const [tableData, setTableData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    FetchContactType();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        FetchContactType();
        return;
      }

      SearchContactCategory(searchQuery, Id)
        .then(({ data: { data } }) => {
          if (data && data["Contact Type Details"]) {
            const formatted = data["Contact Type Details"].map(
              (cust, index) => ({
                sr_no: index + 1,
                contact_type: cust.nameEnglish || "-",
                contactid: cust.id,
              })
            );
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
  console.log("userData",userData);
  let Id = userData.id;
  const FetchContactType = () => {
    GetAllContactType(Id)
      .then((res) => {
        console.log(res);
        const formatted = res.data.data["Contact Type Details"].map(
          (cust, index) => ({
            sr_no: index + 1,
            contact_type: cust.nameEnglish || "-",
            contacttypeid: cust.id,
            isActive: cust.isActive,
           
          })
        );

        setTableData(formatted);
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };

  const DeleteContactType = (contacttypeid) => {
    console.log("contactis",contacttypeid);

    if (window.confirm("Are you sure you want to delete this Contact type?")) {
      DeleteContactTypeMaster(contacttypeid)
        .then(() => {
          FetchContactType();
        })
        .catch((error) => {
          console.error("Error deleting Event type:", error);
        });
    }
  };

  const handleEdit = (event) => {
    console.log("Editing contact type:", event);
    setSelectedcontactType(event);
    setIsContactModalOpen(true);
    
  };

  const statusCategory = (id, status) => {
    updateContactTypeStatus(id, status)
      .then((res) => {
        FetchContactType();
        res.data?.msg && successMsgPopup(res.data.msg);
      })
      .catch((error) => {
        console.error("Error deleting Event type:", error);
      });
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Contact Type Master" }]} />
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
                placeholder="Search Contact"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {setIsContactModalOpen(true);
                                setSelectedcontactType(null);}
              }
              title="Add Contact Category"
            >
              <i className="ki-filled ki-plus"></i> Add Contact Type
            </button>
          </div>
        </div>
        <AddContactType
  isOpen={isContactModalOpen}
  onClose={setIsContactModalOpen}
  refreshData={FetchContactType}
  contactType={selectedcontactType}
/>

        <TableComponent
          columns={columns(handleEdit, DeleteContactType,statusCategory)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default ContactTypeMaster;
