import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import {
  GetAllContactCategory,
  DeleteContactCategory,
  SearchContactCategory,
} from "@/services/apiServices";
import useStyle from "./style";

import AddContactCategory from "@/partials/modals/add-contact-category/AddContactCategory";

const ContactCategoryMaster = () => {
  const classes = useStyle();
  const [isconatctModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedconatctCategory, setSelectedconatctCategory] = useState(null);
  const [tableData, setTableData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    FetchConatctCategory();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        FetchConatctCategory();
        return;
      }

      SearchContactCategory(searchQuery, Id)
        .then(({ data: { data } }) => {
          if (data && data["Contact Category Details"]) {
            const formatted = data["Contact Category Details"].map(
              (cust, index) => ({
                sr_no: index + 1,
                contact_name: cust.nameEnglish || "-",
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
  let Id = userData.id;
  const FetchConatctCategory = () => {
    GetAllContactCategory(Id)
      .then((res) => {
        console.log(res);
        const formatted = res.data.data["Contact Category Details"].map(
          (cust, index) => ({
            sr_no: index + 1,
            contact_name: cust.nameEnglish || "-",
            contactid: cust.id,
            sequence: cust.sequence || "-",
            contcatTypeId: cust.contactType.nameEnglish || "-",
          })
        );

        setTableData(formatted);
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };

  const DeleteEventtype = (contactid) => {
    console.log(contactid);

    if (window.confirm("Are you sure you want to delete this Event type?")) {
      DeleteContactCategory(contactid)
        .then(() => {
          FetchConatctCategory();
        })
        .catch((error) => {
          console.error("Error deleting Event type:", error);
        });
    }
  };

  const handleEdit = (event) => {
    setSelectedconatctCategory(event);
    setIsContactModalOpen(true);
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Contact Category Master" }]} />
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
              onClick={() => setIsContactModalOpen(true)}
              title="Add Contact Category"
            >
              <i className="ki-filled ki-plus"></i> Add Contact Category
            </button>
          </div>
        </div>
        <AddContactCategory
          isOpen={isconatctModalOpen}
          onClose={setIsContactModalOpen}
          refreshData={FetchConatctCategory}
          contactCategory={selectedconatctCategory}
        />
        <TableComponent
          columns={columns(handleEdit, DeleteEventtype)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default ContactCategoryMaster;
