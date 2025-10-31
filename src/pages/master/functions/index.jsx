import { Fragment, useEffect, useState } from "react";
import { BadgeDollarSign, FileText, Receipt } from "lucide-react";
import { Tooltip } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import useStyle from "./style";
import { Link } from "react-router-dom";
import { underConstruction } from "@/underConstruction";
import AddFunctionType from "@/partials/modals/add-function-type/AddFunctionType";
import {
  GetAllFunctionsByUserId,
  DeleteFunctionType,
  GetFunctionsByFunctionName,
} from "@/services/apiServices";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";


const FunctionsMaster = () => {
  const classes = useStyle();
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ state for search

  const intl = useIntl();

  const formatData = (apiData) =>
    apiData.map((item, index) => ({
      sr_no: index + 1,
      id: item.id,
      function_name: item.nameEnglish,
      start_time: item.startTime,
      end_time: item.endTime,
      proforma_invoice: (
        <Tooltip className="cursor-pointer" title="Proforma Invoice">
          <div
            className="flex justify-center items-center w-full"
            onClick={underConstruction}
          >
            <FileText className="w-5 h-5 text-primary" />
          </div>
        </Tooltip>
      ),
      invoice: (
        <Link to="/invoice-dashboard">
          <Tooltip className="cursor-pointer" title="Invoice">
            <div className="flex justify-center items-center w-full">
              <Receipt className="w-5 h-5 text-success" />
            </div>
          </Tooltip>
        </Link>
      ),
      quotation: (
        <Link to="/quotation">
          <Tooltip className="cursor-pointer" title="Quotation">
            <div className="flex justify-center items-center w-full">
              <BadgeDollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </Tooltip>
        </Link>
      ),
    }));

  const fetchFunctions = (name = "") => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const apiCall = name
      ? GetFunctionsByFunctionName(name)
      : GetAllFunctionsByUserId(userData.id);

    apiCall
      .then((res) => {
        if (res?.data?.data?.["Function Details"]) {
          setTableData(formatData(res.data.data["Function Details"]));
        } else {
          setTableData([]); // if no result
        }
      })
      .catch((err) => console.error("Error fetching functions:", err));
  };

  // ✅ Initial load - fetch all
  useEffect(() => {
    fetchFunctions();
  }, []);

  // ✅ Debounced search (auto search after typing stops)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchFunctions(searchTerm);
    }, 500); // waits 500ms after user stops typing

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);
  const handleModalClose = () => {
    setIsMemberModalOpen(false);
    setSelectedFunction(null); // Clear selected function
  };
  const handleSuccess = () => {
    fetchFunctions(); // Refresh the table data
    handleModalClose(); // Close modal and clear selection
  };

  const handleEdit = (func) => {
    setSelectedFunction(func);
    setIsMemberModalOpen(true);
  };

  const handleDelete = (functionId) => {
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
        DeleteFunctionType(functionId)
          .then((response) => {
            if (response && (response.success || response.status === 200)) {
              fetchFunctions();
              Swal.fire({
                title: "Removed!",
                text: "Function has been removed successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              throw new Error(response?.message || "API call failed");
            }
          })
          .catch((error) => {
            console.error("Error deleting function:", error);
          });
      }
    });
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: <FormattedMessage id="USER.MASTER.FUNCTIONS" defaultMessage="Functions Master" /> }]} />
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
                placeholder={intl.formatMessage({
                  id: "USER.MASTER.SEARCH_FUNCTION",
                  defaultMessage: "Search Function",
                })}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // ✅ triggers auto search
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedFunction(null);
                setIsMemberModalOpen(true);
              }}
              title="Add Function"
            >
              <i className="ki-filled ki-plus"></i><FormattedMessage id="USER.MASTER.ADD_FUNCTION" defaultMessage="Add Function" />
            </button>
          </div>
        </div>

        {/* Modal */}
        <AddFunctionType
          isOpen={isMemberModalOpen}
          selectedFunction={selectedFunction}
          paginationSize={10}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />

        {/* Table */}
        <TableComponent
          columns={columns(handleEdit, handleDelete)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export default FunctionsMaster;
