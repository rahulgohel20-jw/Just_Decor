import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import { GetAllPages } from "@/services/apiServices";
import Swal from "sweetalert2";
import { FormattedMessage, useIntl } from "react-intl";
import AddPage from "../../../../partials/modals/add-pages/AddPage";

const PageMaster = () => {
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const intl = useIntl();

  useEffect(() => {
    FetchPages();
  }, []);

  // SEARCH FUNCTION
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        FetchPages();
        return;
      }

      // Filter tableData based on search query
      GetAllPages()
        .then((res) => {
          // Handle different response structures
          const pages = res?.data?.data?.["UserRightsPages"];

          if (pages && Array.isArray(pages)) {
            const filtered = pages.filter((page) =>
              page.pagename?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const formatted = filtered.map((page, index) => ({
              sr_no: index + 1,
              pagename: page.pagename || "-",
              module_name: page.moduleName || "-",
              pageid: page.id,
              moduleId: page.moduleId,
              isActive: page.isActive,
            }));
            setTableData(formatted);
          } else {
            setTableData([]);
          }
        })
        .catch((error) => {
          console.error("Error searching pages:", error);
          setTableData([]);
        });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // FETCH PAGES
  const FetchPages = () => {
    GetAllPages()
      .then((res) => {
        // Handle different response structures
        const pages = res?.data?.data?.["UserRightsPages"];

        if (pages && Array.isArray(pages)) {
          const formatted = pages.map((page, index) => ({
            sr_no: index + 1,
            pagename: page.pagename || "-",
            module_name: page.moduleName || "-",
            pageid: page.id,
            moduleId: page.moduleId,
            isActive: page.isActive,
          }));

          setTableData(formatted);
        } else {
          setTableData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching pages:", error);
        setTableData([]);
      });
  };

  const DeletePage = (pageid) => {
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
        DeletePageMaster(pageid)
          .then((response) => {
            if (
              response &&
              (response.success || response.data.success === true)
            ) {
              FetchPages();
              Swal.fire({
                title: "Removed!",
                text: "Page removed successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting page:", error);
            Swal.fire({
              title: "Error!",
              text: "Failed to delete page.",
              icon: "error",
            });
          });
      }
    });
  };

  const handleEdit = (event) => {
    setSelectedPage(event);
    setIsPageModalOpen(true);
  };

  const statusPage = (id, status) => {
    updatePageStatus(id, status)
      .then((res) => {
        FetchPages();
        Swal.fire({
          title: "Success!",
          text: "Status updated successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update status.",
          icon: "error",
        });
      });
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="USER.MASTER.PAGE_MASTER"
                    defaultMessage="Page Master"
                  />
                ),
              },
            ]}
          />
        </div>

        {/* Search + Add */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className={`flex flex-wrap items-center gap-2`}>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={intl.formatMessage({
                  id: "USER.MASTER.SEARCH_PAGE",
                  defaultMessage: "Search Page",
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
              onClick={() => {
                setIsPageModalOpen(true);
                setSelectedPage(null);
              }}
            >
              <i className="ki-filled ki-plus"></i>{" "}
              <FormattedMessage
                id="USER.MASTER.ADD_PAGE"
                defaultMessage="Add Page"
              />
            </button>
          </div>
        </div>

        <AddPage
          isOpen={isPageModalOpen}
          onClose={setIsPageModalOpen}
          refreshData={FetchPages}
          page={selectedPage}
        />

        <TableComponent
          columns={columns(handleEdit, DeletePage, statusPage)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export default PageMaster;
