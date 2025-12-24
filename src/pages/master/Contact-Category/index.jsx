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
import Swal from "sweetalert2";
import AddContactCategory from "@/partials/modals/add-contact-category/AddContactCategory";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

const ContactCategoryMaster = () => {
  const classes = useStyle();
  const [isconatctModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedconatctCategory, setSelectedconatctCategory] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const intl = useIntl();

  let Id = JSON.parse(localStorage.getItem("userId"));

  // --------------------------
  // 1️⃣ FETCH API DATA (original)
  // --------------------------
  const FetchConatctCategory = () => {
    GetAllContactCategory(Id)
      .then((res) => {
        const list = res.data.data["Contact Category Details"] || [];
        setOriginalData(list); // 🔥 Save original API data
      })
      .catch((error) => console.error("Error fetching:", error));
  };

  useEffect(() => {
    FetchConatctCategory();
  }, []);

  // --------------------------
  // 2️⃣ MAP DATA BASED ON LANGUAGE
  // --------------------------
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";

    const nameField = {
      en: "nameEnglish",
      hi: "nameHindi",
      gu: "nameGujarati",
    }[lang];

    const mapped = originalData.map((cust, index) => ({
      sr_no: index + 1,
      contact_name: cust[nameField] || cust.nameEnglish || "-",
      contactid: cust.id,
      sequence: cust.sequence || "-",
      contcatTypeId:
        cust.contactType?.[
          "name" +
            (lang === "hi" ? "Hindi" : lang === "gu" ? "Gujarati" : "English")
        ] || "-",
    }));

    setTableData(mapped);
  }, [originalData, localStorage.getItem("lang")]);

  // --------------------------
  // 3️⃣ SEARCH FUNCTIONALITY
  // --------------------------
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        FetchConatctCategory();
        return;
      }

      SearchContactCategory(searchQuery, Id)
        .then(({ data: { data } }) => {
          const lang = localStorage.getItem("lang") || "en";
          const nameField = {
            en: "nameEnglish",
            hi: "nameHindi",
            gu: "nameGujarati",
          }[lang];

          if (data && data["Contact Category Details"]) {
            const formatted = data["Contact Category Details"].map(
              (cust, index) => ({
                sr_no: index + 1,
                contact_name: cust[nameField] || cust.nameEnglish || "-",
                contactid: cust.id,
              })
            );
            setTableData(formatted);
          } else {
            setTableData([]);
          }
        })
        .catch((error) => console.error("Error searching:", error));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // --------------------------
  // 4️⃣ DELETE ENTRY
  // --------------------------
  const DeleteEventtype = (contactid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteContactCategory(contactid)
          .then((response) => {
            if (
              response &&
              (response.success || response.data.success === true)
            ) {
              FetchConatctCategory();
              Swal.fire({
                title: "Removed!",
                text: "Contact category deleted successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              throw new Error(response?.message || "API call failed");
            }
          })
          .catch((error) => console.error("Delete error:", error));
      }
    });
  };

  // --------------------------
  // 5️⃣ EDIT HANDLER
  // --------------------------
  const handleEdit = (item) => {
    setSelectedconatctCategory(item);
    setIsContactModalOpen(true);
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className=" pb-2 mb-3">
          <h1 className="test-xl text-gray-900">
            <FormattedMessage
              id="USER.MASTER.CONTACT_CATEGORY_MASTER"
              defaultMessage="Category Master"
            />
          </h1>
        </div>

        {/* Filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div
            className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}
          >
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={intl.formatMessage({
                  id: "USER.MASTER.SEARCH_CONTACT_CATEGORY",
                  defaultMessage: "Search Contact Category",
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
              onClick={() => setIsContactModalOpen(true)}
            >
              <i className="ki-filled ki-plus"></i>{" "}
              <FormattedMessage
                id="USER.MASTER.ADD_CONTACT_CATEGORY"
                defaultMessage="Create New"
              />
            </button>
          </div>
        </div>

        {/* Modal */}
        <AddContactCategory
          isOpen={isconatctModalOpen}
          onClose={setIsContactModalOpen}
          refreshData={FetchConatctCategory}
          contactCategory={selectedconatctCategory}
        />

        {/* Table */}
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
